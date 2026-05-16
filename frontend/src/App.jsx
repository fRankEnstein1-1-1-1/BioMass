import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'

function App() {
  const [user, setUser] = useState(null)


  const handleLogin = (userData) => setUser(userData)


  const handleLogout = () => setUser(null)

  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" replace />
              : <LoginPage onLogin={handleLogin} />
          }
        />

        {/* Signup route */}
        <Route
          path="/signup"
          element={
            user
              ? <Navigate to="/" replace />
              : <SignupPage onLogin={handleLogin} />
          }
        />

        {/* Home route — protected */}
        <Route
  path="/"
  element={
    user ? (
      <HomePage user={user} onLogout={handleLogout} />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App