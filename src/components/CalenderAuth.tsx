// CalendarAuth.js
import { gapi } from 'gapi-script';
import { message, Form } from "antd";
import React, { useEffect, useState } from 'react';
import { getToken } from '../common/common';
import CommonService from "../api/services/Common";
import {REACT_APP_CLIENT_ID, SCOPES, REACT_APP_API_KEY} from "../config/app-config";
import google from '../assets/images/google.png';
const CalendarAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [fullName, setFullName] = useState('');
  const [tokenData, setAccessToken] = useState('');
  useEffect(() => {
    getAccessToken();
    const initClient = () => {
      gapi.client
        .init({
          apiKey: REACT_APP_API_KEY,
          clientId: REACT_APP_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          authInstance.isSignedIn.listen(updateSigninStatus);
          updateSigninStatus(authInstance.isSignedIn.get());
        })
        .catch((error) => {
          console.error("Error initializing Google API client:", error);
        });
    };

    gapi.load("client:auth2", initClient);
  }, []);

  const getAccessToken = async() => {   
    try {
      const response = await CommonService.getAPI("/tutor/access-token");
      if (response.data.success) {
        setAccessToken(response.data.data); 
        console.log('success get access token', response.data.data);
      }
    } catch (error) {
       throw new Error(error.message);
    }
  }

  const updateSigninStatus = (isSignedIn) => {
    setIsSignedIn(isSignedIn);
    if (isSignedIn) {
      const authInstance = gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      if (currentUser) {
        const userProfile = currentUser.getBasicProfile();
        const email = userProfile ? userProfile.getEmail() : '';
        setFullName(email); // Update email when signed in
      }
    } else {
      setFullName(''); // Clear fullName if signed out
    }
  };

  const handleAuthClick = () => {
    const auth2 = gapi.auth2.getAuthInstance();

    // Configure OfflineAccessOptions to request offline access (refresh token)
    const options = {
      access_type: 'offline',
    };
    auth2.grantOfflineAccess(options)
    .then(async (authResult) => {
      if (authResult.code) {
        await sendAccessTokenToBackend(authResult.code);
        getAccessToken();
        message.success("Google calendar connected successfully!");
      } else {
        console.error("Login failed");
      }
    })
    .catch((error) => {
      console.error("Error during login", error);
    });
  };

  const sendAccessTokenToBackend = async(authorizeCode) => {
    const data = {
      authorizeCode: authorizeCode,
    };
    const response = await CommonService.postAPI("/tutor/google-callback-signin", data);
    if (response.data.success) {
      console.log('success');
    } else {
      throw new Error(response.data.message);
    }
  };

  const removeTokenToBackend = async() => {
    const response = await CommonService.postAPI("/tutor/google-callback-signout");
    if (response.data.success) {
      console.log('success');
    } else {
      throw new Error(response.data.message);
    }
  };


  const handleSignOutClick = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    // Remove token from backend
    removeTokenToBackend();
    
    // Sign out the user and clear the session
    authInstance.signOut().then(() => {
      setAccessToken('');
      message.success("Google calendar disconnected successfully!");
      authInstance.disconnect(); // This ensures the session is fully cleared
    });
  };

  return (
      <Form className={"specializations-form"}>
        <Form.Item>
          <div className={"specializations-form-item"}>

              <div className={"specializations-checkboxes"}  >
              {tokenData?.access_token ? ( // Check if access token exists
              <>
                <p>You are connected with <b>{tokenData?.autheticate_user_email}</b></p>
                <button className="ant-btn ant-btn-default form-button google-auth" onClick={handleSignOutClick}>
                  <img className="offer-img" src={google} style={{ width: '30px', height: '30px', marginRight: '8px' }} alt="Google logo" />
                  Sign out with Google
                </button>
              </>
            ) : (
              <>
                <p>Sync your Google calendar events</p>
                <button className="ant-btn ant-btn-default form-button google-auth" onClick={handleAuthClick}>
                  <img className="offer-img" src={google} style={{ width: '30px', height: '30px', marginRight: '8px' }} alt="Google logo" />
                  Sign in with Google
                </button>
              </>
            )}
        </div>
          
          </div>
        </Form.Item>
        </Form>
     
  );
};

export default CalendarAuth;
