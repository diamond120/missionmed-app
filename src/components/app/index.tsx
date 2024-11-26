import { memo, type FC, useState } from 'react'
import PageProvider from '~/pages'
import { UserProvider } from '~/api/providers/UserProvider.jsx'
import { StudentProvider } from '~/api/providers/StudentProvider.jsx'
import { TutorProvider } from '~/api/providers/TutorProvider.jsx'
import AuthContext from '~/api/context/AuthContext'
import posthog from 'posthog-js'
import { POST_HOG_KEY } from '~/config/app-config'

const App: FC = memo(function App() {
  try {
    posthog.init(POST_HOG_KEY)
  } catch (e) {
    console.error(e)
  }

  const [authenticated, setAuthenticated] = useState<boolean>(false)

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
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

export default App
