import React from 'react'

const Sidebar = ({ activeView, onViewChange, projects = [] }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'projects', label: 'My Projects', icon: '📁' },
    { id: 'tasks', label: 'All Tasks', icon: '✅' },
    { id: 'notes', label: 'All Notes', icon: '📝' },
  ]

  return (
    <div className="sidebar bg-light border-end" style={{ minHeight: '100vh', width: '250px' }}>
      <div className="p-3">
        <h5 className="mb-3">Navigation</h5>
        
        {/* Main Menu */}
        <ul className="nav flex-column">
          {menuItems.map(item => (
            <li key={item.id} className="nav-item mb-2">
              <button
                className={`nav-link w-100 text-start border-0 bg-transparent ${
                  activeView === item.id ? 'active bg-primary text-white' : 'text-dark'
                }`}
                onClick={() => onViewChange(item.id)}
                style={{ borderRadius: '0.375rem' }}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <div className="mt-4">
            <h6 className="mb-3 text-muted">Recent Projects</h6>
            <ul className="nav flex-column">
              {projects.slice(0, 5).map(project => (
                <li key={project._id} className="nav-item mb-1">
                  <button
                    className="nav-link w-100 text-start border-0 bg-transparent text-dark small"
                    onClick={() => onViewChange('project', project._id)}
                    style={{ borderRadius: '0.375rem', padding: '0.25rem 0.5rem' }}
                  >
                    📄 {project.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar