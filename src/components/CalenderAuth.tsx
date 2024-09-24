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
  useEffect(() => {
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

  const removeTokenToBackend = async(email) => {
    const data = {
      email: email
    };
    const response = await CommonService.postAPI("/tutor/google-callback-signout", data);
    if (response.data.success) {
      console.log('success');
    } else {
      throw new Error(response.data.message);
    }
  };


  const handleSignOutClick = () => {
    const authInstance = gapi.auth2.getAuthInstance();

    // Get the current signed-in user's data
    const user = authInstance.currentUser.get();
    
    // Get user's basic profile (e.g., email)
    const profile = user.getBasicProfile();
    const userEmail = profile.getEmail();
    
    // Remove token from backend
    removeTokenToBackend(userEmail);
    
    // Sign out the user and clear the session
    authInstance.signOut().then(() => {
      authInstance.disconnect(); // This ensures the session is fully cleared
      setFullName('');
      message.success("Google calendar disconnected successfully!");
    });
  };

  return (
      <Form className={"specializations-form"}>
        <Form.Item>
          <div className={"specializations-form-item"}>

              <div className={"specializations-checkboxes"}  >
              {isSignedIn ? (
        <>
          <p>You are connected with <b>{fullName ? `${fullName}` : ''}</b></p>
          <button className="ant-btn ant-btn-default form-button google-auth" onClick={handleSignOutClick}>
            <img className="offer-img" src={google} style={{ width: '30px', height: '30px', marginRight: '8px' }} alt="Google logo" />
            Sign out with Google
          </button>
        </>
      ) : (
        <>
        <p>Sync your google calendar events</p>
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
