import { createContext, useContext, useReducer } from 'react';

const UserContext = createContext(null);

const UserDispatchContext = createContext(null);

const initialUser = {};

export function UserProvider({ children }) {
  const [user, dispatch] = useReducer(
    UserReducer,
    initialUser
  );

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useUserDispatch() {
  return useContext(UserDispatchContext);
}

function UserReducer(user, action) {
    switch (action.type) {
        case 'set': {
          return { 
              id:action.id,
              name:action.name,
              email:action.email,
              role:(action.role).toString().toLowerCase()
          }
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}