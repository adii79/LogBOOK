import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import ProjectCard from './ProjectCard'
import CreateProject from '../Project/CreateProject'
import Loading from '../Common/Loading'

const Dashboard = ({ onSelectProject }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects')
      setProjects(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (projectData) => {
    try {
      const response = await api.post('/api/projects', projectData)
      setProjects([...projects, response.data])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Projects</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No projects yet</h4>
          <p className="text-muted">Create your first project to get started!</p>
        </div>
      ) : (
        <div className="row">
          {projects.map(project => (
            <div key={project._id} className="col-md-6 col-lg-4 mb-4">
              <ProjectCard 
                project={project} 
                onClick={onSelectProject}
              />
            </div>
          ))}
        </div>
      )}

      <CreateProject 
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSave={handleCreateProject}
      />
    </div>
  )
}

export default Dashboard