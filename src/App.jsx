import { useState, useEffect } from 'react'
import { onAuthStateChange, getCurrentUser, signOutUser } from './services/firebaseAuthService'
import Login from './views/pages/Login.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setIsAuthenticated(!!user)
      setLoading(false)
    })

    // Check current user immediately
    const currentUser = getCurrentUser()
    setIsAuthenticated(!!currentUser)
    setLoading(false)

    return () => unsubscribe()
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      await signOutUser()
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="app">
      {isAuthenticated ? (
        <AppLayout onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  )
}

export default App
