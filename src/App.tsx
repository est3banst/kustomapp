import Landing from '@/pages/Landing'
import { LanguageProvider } from './context/LanguageContext'
import { UserProvider } from './context/UserContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './pages/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import UserPage from './pages/UserPage'

function App() {

  return (
    <>
    <BrowserRouter>
      <LanguageProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route
              path="/login"
              element={
                <ProtectedRoute guestOnly>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registro"
              element={
                <ProtectedRoute guestOnly>
                  <Register />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user-page"
              element={
                <ProtectedRoute>
                  <UserPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Landing />} />
          </Routes>
        </UserProvider>
      </LanguageProvider>
    </BrowserRouter>
    </>
  )
}

export default App
