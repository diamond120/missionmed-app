// CalendarAuth.js
import { gapi } from 'gapi-script';
import { message, Form, Spin } from "antd";
import React, { useEffect, useState } from 'react';
import { getToken } from '../common/common';
import CommonService from "../api/services/Common";
import {REACT_APP_CLIENT_ID, SCOPES, REACT_APP_API_KEY} from "../config/app-config";
import google from '../assets/images/google.png';
const CalendarAuth = ({setGoogleVerification}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [fullName, setFullName] = useState('');
  const [tokenData, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false); 
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
  
  const handleAuthClick = async() => {
    await setGoogleVerification(false);
    const auth2 = gapi.auth2.getAuthInstance();

    // Configure OfflineAccessOptions to request offline access (refresh token)
    const options = {
      access_type: 'offline',
    };
    auth2.grantOfflineAccess(options)
    .then(async (authResult) => {
      if (authResult.code) {
        setLoading(true);
        await sendAccessTokenToBackend(authResult.code);
        await getAccessToken();
        setLoading(false);
        setGoogleVerification(true);
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

  const GoogleAuthButton = ({ onClick, label, isLoading }) => (
    <button
      className="ant-btn ant-btn-default form-button google-auth"
      onClick={onClick}
      disabled={isLoading} // Disable the button when loading
    >
      <img
        className="offer-img"
        src={google}
        style={{ width: '30px', height: '30px', marginRight: '8px' }}
        alt="Google logo"
      />
      {label}
    </button>
  );
  
  const GoogleAuthStatus = ({ email }) => (
    <p>
      You are connected with <b>{email}</b>
    </p>
  );
  
  return (
    <Form className="specializations-form">
      <Form.Item>
        <div className="specializations-form-item">
          <div className="specializations-checkboxes">
            {loading ? (
              <>
                <Spin />
                <GoogleAuthButton
                  onClick={handleSignOutClick}
                  label="Sign out with Google"
                  isLoading={loading}
                />
                {tokenData?.access_token && (
                  <GoogleAuthStatus email={tokenData.autheticate_user_email} />
                )}
              </>
            ) : tokenData?.access_token ? (
              <>
                <GoogleAuthStatus email={tokenData.autheticate_user_email} />
                <GoogleAuthButton
                  onClick={handleSignOutClick}
                  label="Sign out with Google"
                  isLoading={loading}
                />
              </>
            ) : (
              <>
                <p>Sync your Google calendar events</p>
                <GoogleAuthButton
                  onClick={handleAuthClick}
                  label="Sign in with Google"
                  isLoading={loading}
                />
              </>
            )}
          </div>
        </div>
      </Form.Item>
    </Form>
  );
  
};

export default CalendarAuth;
