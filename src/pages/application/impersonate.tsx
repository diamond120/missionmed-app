import { useContext, useEffect } from 'react'
import Service from '~/api/services/Common'
import { useAuthContext } from '~/api/context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UserContext } from '~/api/providers/UserProvider'

export default function Impersonate() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { dispatch } = useContext(UserContext)
  const { setAuthenticated } = useAuthContext()

  useEffect(() => {
    const init = async () => {
      localStorage.clear()
      const token = params.get('hash')
      if (token) {
        localStorage.setItem('jwt', token)
      }

      const response = await Service.getUserDetails()
      if (response) {
        setAuthenticated(true)
        dispatch({
          type: 'set',
          payload: {
            id: response.data.data.id,
            name: response.data.data.name,
            email: response.data.data.email,
            role: response.data.data.role
          }
        })
      }

      // Because we are impersonating student user only for now.
      // and to avoid multiple redirects.
      navigate('/student_profile')
    }

    init()
  }, [])

  return <>Logging in...</>
}
