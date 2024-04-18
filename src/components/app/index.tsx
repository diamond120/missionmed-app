import { createContext, memo,useContext, type FC, type PropsWithChildren, useState } from "react"
import PageProvider from "../../pages"
import { UserProvider } from "../../api/providers/UserProvider.jsx";
import { StudentProvider } from "../../api/providers/StudentProvider.jsx";
import { TutorProvider } from "../../api/providers/TutorProvider.jsx";
import AuthContext from "../../api/context/AuthContext.js";
import posthog from 'posthog-js';
import {POST_HOG_KEY} from "../../config/app-config";

// type AppProps = {
  //   app: { api: boolean },
  //   user: { authenticated: boolean | null; role: string | null }
  //   setUser:() => {}
  // }
  // const [user, setUser] = useState();
  // const defaultValue: AppProps = {
    //   app: { api: false },
//   user: { authenticated: null, role: null },
//   setUser:() => {}
// }

// const Context = createContext(defaultValue)

// type ContextProviderProps = PropsWithChildren<Partial<AppProps>>

// const ContextProvider: FC<ContextProviderProps> = ({ children, ...props }) => {
  //   return <Context.Provider value={{ ...defaultValue, ...props }}>{children}</Context.Provider>
  //}
  
  const App: FC = memo(() => {

  posthog.init(POST_HOG_KEY);

  const [authenticated, setAuthenticated] = useState(false);
   return ( 
   <AuthContext.Provider value={{authenticated, setAuthenticated}}>
    <UserProvider>
    <StudentProvider>
      <TutorProvider>
        <PageProvider />
      </TutorProvider>
     </StudentProvider>
    </UserProvider>
  </AuthContext.Provider>
  )
})
// const useApp = () => useContext(Context)
// export { ContextProvider, useApp }

export default App





