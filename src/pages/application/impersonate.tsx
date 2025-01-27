import { useContext, useEffect } from 'react'
import CommonService from '../../api/services/Common'
import { useAuthContext } from '../../api/context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UserContext } from '../../api/providers/UserProvider'

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

      const response = await CommonService.getUserDetails()
      let redirectTo = '/'
      if (response) {
        setAuthenticated(true)
        const role = String(response.data.data.role).toLowerCase()

        dispatch({
          type: 'set',
          payload: {
            id: response.data.data.id,
            name: response.data.data.name,
            email: response.data.data.email,
            role: role,
            isTrail: response.data.data.is_trial
          }
        })

        if (role === 'student' && response.data.data.is_trial) {
          redirectTo = `/student/mock-simulation`
        } else {
          redirectTo = `/${role === 'student' ? 'student' : 'tutor'}_profile`
        }
      }

      navigate(redirectTo)
    }

    init()
  }, [])

  return <>Loging in...</>
}
