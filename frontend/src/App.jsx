import React, { useState, useEffect } from 'react'
import { authService } from './services/auth'
import { supabase } from './services/supabase'
import Navbar from './components/Layout/Navbar'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './components/Dashboard/Dashboard'
import ProjectView from './components/Project/ProjectView'
import Loading from './components/Common/Loading'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authMode, setAuthMode] = useState('login')
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const session = await authService.getSession()
        if (session) {
          setUser(session.user)
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setSelectedProject(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = (user) => {
    setUser(user)
  }

  const handleLogout = () => {
    setUser(null)
    setSelectedProject(null)
  }

  const handleSelectProject = (projectId) => {
    setSelectedProject(projectId)
  }

  const handleBackToDashboard = () => {
    setSelectedProject(null)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loading />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              {authMode === 'login' ? (
                <Login 
                  onLogin={handleLogin}
                  onToggleMode={() => setAuthMode('register')}
                />
              ) : (
                <Register 
                  onRegister={handleLogin}
                  onToggleMode={() => setAuthMode('login')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar user={user} onLogout={handleLogout} />
      
      {selectedProject ? (
        <ProjectView 
          projectId={selectedProject}
          onBack={handleBackToDashboard}
        />
      ) : (
        <Dashboard onSelectProject={handleSelectProject} />
      )}
    </div>
  )
}

export default App