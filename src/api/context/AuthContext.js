import { createContext, useContext } from "react";

const AuthContext = createContext({
    authenticated: false,
    setAuthenticated: () => {},
});

export function useAuthContext() {
    return useContext(AuthContext);
}

export default AuthContext;
