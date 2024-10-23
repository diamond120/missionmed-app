import React from 'react'

interface UserInitalStateType {
  id: number
  name: string
  email: string
  role: string
}

interface UserContextType {
  user: UserInitalStateType
  dispatch: React.Dispatch<{ type: 'set'; payload: UserInitalStateType }>
}

const initialUser: UserInitalStateType = {
  id: 0,
  name: '',
  email: '',
  role: ''
}

export const UserContext = React.createContext<UserContextType>({ user: initialUser, dispatch: () => {} })

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, dispatch] = React.useReducer(UserReducer, initialUser as UserInitalStateType)

  return <UserContext.Provider value={{ user, dispatch }}>{children}</UserContext.Provider>
}

function UserReducer(user: UserInitalStateType, action: { type: 'set'; payload: UserInitalStateType }) {
  const { type, payload } = action
  switch (type) {
    case 'set': {
      return {
        ...user,
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role?.toString().toLowerCase()
      }
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}
