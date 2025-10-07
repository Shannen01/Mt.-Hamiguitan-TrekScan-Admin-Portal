import { useState, useEffect, useMemo } from 'react'
import { useViewModel } from './hooks/useViewModel.js'
import AuthViewModel from './viewmodels/AuthViewModel.js'
import ApiClient from './models/ApiClient.js'
import { config } from './config/config.js'
import Login from './views/pages/Login.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Initialize ViewModel (memoized to avoid re-creation on each render)
  const apiClient = useMemo(() => new ApiClient(config.api.baseURL), [])
  const authViewModel = useMemo(() => new AuthViewModel(apiClient), [apiClient])
  
  // Connect ViewModel to React component
  const { auth, loading, isAuthenticated: vmAuthenticated } = useViewModel(authViewModel)

  // Sync local flag with ViewModel-computed value
  useEffect(() => {
    setIsAuthenticated(Boolean(vmAuthenticated))
  }, [vmAuthenticated])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
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
