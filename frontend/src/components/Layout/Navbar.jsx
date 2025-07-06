import React from 'react'
import { authService } from '../../services/auth'

const Navbar = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await authService.signOut()
      onLogout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          CollabProject
        </a>
        <div className="navbar-nav ms-auto">
          <span className="navbar-text me-3">
            {user?.email}
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar