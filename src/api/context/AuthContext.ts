import { createContext, useContext, Dispatch, SetStateAction } from 'react'

interface AuthContext {
  authenticated: boolean
  setAuthenticated: Dispatch<SetStateAction<boolean>>
}
const AuthContext = createContext<AuthContext>({
  authenticated: false,
  setAuthenticated: () => {}
})

export function useAuthContext() {
  return useContext(AuthContext)
}

export default AuthContext
