import { gapi } from 'gapi-script'
import { message, Form, Spin, Button } from 'antd'
import { useEffect, useState } from 'react'
import CommonService from '../api/services/Common'
import { REACT_APP_CLIENT_ID, SCOPES, REACT_APP_API_KEY } from '../config/app-config'
import google from '../assets/images/google.png'
import { RedoOutlined } from '@ant-design/icons'
import confirm from './confirm'

interface CalendarAuthType {
  setGoogleVerification: (value: boolean) => void
}

export default function CalendarAuth({ setGoogleVerification }: CalendarAuthType) {
  const [tokenData, setAccessToken] = useState<{ id: number; access_token: string; autheticate_user_email: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    const init = async () => {
      await getAccessToken()
      if (!tokenData) {
        // already logged in so hide loader and let google api initialize in background
        setLoading(false)
      }
      gapi.load('client:auth2', initClient)
    }
    init()
  }, [])

  const initClient = () => {
    gapi.client
      .init({
        apiKey: REACT_APP_API_KEY,
        clientId: REACT_APP_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: SCOPES
      })
      .then(() => {
        const authInstance = gapi.auth2.getAuthInstance()
        if (authInstance) {
          authInstance?.isSignedIn?.listen(updateSigninStatus)
          updateSigninStatus(authInstance?.isSignedIn?.get())
        }
        setLoading(false)
      })
      .catch((error: any) => {
        console.error('Error initializing Google API client:', error)
        setLoading(false)
      })
  }

  const getAccessToken = async () => {
    try {
      const response = await CommonService.getAPI('/tutor/access-token')
      if (response.data.success) {
        setAccessToken(response.data.data)
      }
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  const updateSigninStatus = (isSignedIn: boolean) => {
    try {
      if (isSignedIn) {
        const authInstance = gapi.auth2.getAuthInstance()
        const currentUser = authInstance.currentUser.get()
        if (currentUser) {
          // const userProfile = currentUser.getBasicProfile()
          // const email = userProfile ? userProfile.getEmail() : ''
        }
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  const handleAuthClick = async () => {
    setGoogleVerification(false)
    const auth2 = gapi.auth2.getAuthInstance()

    auth2
      .grantOfflineAccess()
      .then(async (authResult: { code: string }) => {
        if (authResult.code) {
          setLoading(true)
          await sendAccessTokenToBackend(authResult.code)
          await getAccessToken()
          setLoading(false)
          setGoogleVerification(true)
          message.success('Google calendar connected successfully!')
        } else {
          console.error('Login failed')
        }
      })
      .catch((error: any) => {
        console.error('Error during login', error)
      })
  }

  const sendAccessTokenToBackend = async (authorizeCode: string) => {
    const data = {
      authorizeCode: authorizeCode
    }
    const response = await CommonService.postAPI('/tutor/google-callback-signin', data)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
  }

  const removeTokenToBackend = async () => {
    const response = await CommonService.postAPI('/tutor/google-callback-signout')
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
  }

  const handleSignOutClick = () => {
    const authInstance = gapi.auth2.getAuthInstance()
    // Remove token from backend
    removeTokenToBackend()

    // Sign out the user and clear the session
    authInstance.signOut().then(() => {
      setAccessToken(null)
      message.success('Google calendar disconnected successfully!')
      authInstance.disconnect() // This ensures the session is fully cleared
    })
  }

  const handleSyncNow = async () => {
    setLoading(true)

    const response = await CommonService.postAPI('/tutor/sync-google-calendar').catch((error) => {
      message.error(
        error?.response?.data?.message ?? error?.response?.message ?? error?.message ?? 'Something went wrong, please try again later.'
      )
      setLoading(false)
    })
    if (response.data?.success) {
      message.success(response.data?.data?.message ?? 'Google Calendar will be synced soon')
    } else {
      message.error(response.data.message ?? 'Error syncing Google Calendar')
    }
    setLoading(false)
  }

  interface GoogleAuthButtonType {
    onClick: () => void
    label: string
    isLoading: boolean
  }

  const GoogleAuthButton = ({ onClick, label, isLoading }: GoogleAuthButtonType) => (
    <button
      className='ant-btn ant-btn-default form-button google-auth'
      onClick={onClick}
      disabled={isLoading} // Disable the button when loading
    >
      <img className='offer-img' src={google} style={{ width: '30px', height: '30px', marginRight: '8px' }} alt='Google logo' />
      {label}
    </button>
  )

  const GoogleAuthStatus = ({ email }: { email: string }) => (
    <p>
      You are connected with <b>{email}</b>
    </p>
  )

  return (
    <Form className='specializations-form'>
      <Form.Item>
        <div className='specializations-form-item'>
          <div className='specializations-checkboxes'>
            {loading ? (
              <>
                <Spin />
                {tokenData?.access_token && <GoogleAuthStatus email={tokenData.autheticate_user_email} />}
                <GoogleAuthButton onClick={handleSignOutClick} label='Sign out with Google' isLoading={loading} />
                <Button className={'secondary-button mt-3 w-max'} style={{ marginTop: '1rem', width: 'max-content' }} disabled>
                  <RedoOutlined /> Sync Now
                </Button>
              </>
            ) : tokenData?.access_token ? (
              <>
                <GoogleAuthStatus email={tokenData.autheticate_user_email} />
                <GoogleAuthButton onClick={handleSignOutClick} label='Sign out with Google' isLoading={loading} />
                <Button
                  className={'secondary-button mt-3 w-max'}
                  onClick={() =>
                    confirm({
                      handleOk: handleSyncNow,
                      title: 'Are you sure?',
                      content: 'You want to sync google calendar now ?'
                    })
                  }
                  style={{
                    marginTop: '1rem',
                    width: 'max-content'
                  }}
                >
                  <RedoOutlined /> Sync Now
                </Button>
              </>
            ) : (
              <>
                <p>Sync your Google calendar events</p>
                <GoogleAuthButton onClick={handleAuthClick} label='Sign in with Google' isLoading={loading} />
              </>
            )}
          </div>
        </div>
      </Form.Item>
    </Form>
  )
}
