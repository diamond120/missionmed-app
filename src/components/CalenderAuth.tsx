// CalendarAuth.js
import { gapi } from 'gapi-script';
import { message, Form } from "antd";
import React, { useEffect, useState } from 'react';
import { getToken } from '../common/common';
import CommonService from "../api/services/Common";
import {REACT_APP_CLIENT_ID, SCOPES, REACT_APP_API_KEY} from "../config/app-config";

const CalendarAuth = () => {
  console.log(REACT_APP_CLIENT_ID, 'REACT_APP_CLIENT_ID, SCOPES, REACT_APP_API_KEY')
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
      const userProfile = authInstance.currentUser.get().getBasicProfile();
      const userEmail = userProfile.getEmail();
      setFullName(userEmail); // Set fullName after sign-in
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
    .then((authResult) => {
      if (authResult.code) {
        sendAccessTokenToBackend(authResult.code);
        message.success("Google calender connected Successfully!");
      } else {
        console.error("Login failed");
      }
    })
    .catch((error) => {
      console.error("Error during login", error);
    });
  };

  const sendAccessTokenToBackend = async(authorizeCode) => {
    const auth2 = await gapi.auth2.getAuthInstance();
    const currentUser = await auth2.currentUser.get()
    const userProfile = await currentUser.getBasicProfile();
    const email = await userProfile.getEmail()
    const fullName = await userProfile.getName();
    const data = {
      authorizeCode: authorizeCode,
      email: email
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
    removeTokenToBackend(userEmail);
    gapi.auth2.getAuthInstance().signOut();
    message.success("Google calender disconected Successfully!");
  };

  return (
      <Form className={"specializations-form"}>
        <Form.Item>
          <div className={"specializations-form-item"}>

              <div className={"specializations-checkboxes"}  >
              {isSignedIn ? (
        <>
          <p>You are connected with <b>{fullName ? `${fullName}` : ''}</b></p>
          <button className="ant-btn ant-btn-default form-button" onClick={handleSignOutClick}>Disconnect</button>
        </>
      ) : (
        <>
        <p>Sync your google calendar events</p>
        <button className="ant-btn ant-btn-default form-button" onClick={handleAuthClick}>Connect</button>
        </>
      )}
        </div>
          
          </div>
        </Form.Item>
        </Form>
     
  );
};

export default CalendarAuth;
