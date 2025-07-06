import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({ 
  user, 
  onLogout, 
  activeView, 
  onViewChange, 
  projects = [], 
  showSidebar = true,
  children 
}) => {
  return (
    <div className="min-vh-100 bg-light">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="d-flex">
        {showSidebar && (
          <Sidebar 
            activeView={activeView}
            onViewChange={onViewChange}
            projects={projects}
          />
        )}
        
        <div className="flex-grow-1">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout