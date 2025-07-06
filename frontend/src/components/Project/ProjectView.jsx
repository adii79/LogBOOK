import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import TaskList from './TaskList'
import NotesList from './NotesList'
import Loading from '../Common/Loading'

const ProjectView = ({ projectId, onBack }) => {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('tasks')

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await api.get(`/api/projects/${projectId}`)
      setProject(response.data)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  if (!project) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Project not found or you don't have access to it.
        </div>
        <button className="btn btn-primary" onClick={onBack}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{project.title}</h2>
          <p className="text-muted">{project.description}</p>
        </div>
        <button className="btn btn-outline-primary" onClick={onBack}>
          Back to Dashboard
        </button>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </li>
      </ul>

      {activeTab === 'tasks' && <TaskList projectId={projectId} />}
      {activeTab === 'notes' && <NotesList projectId={projectId} />}
    </div>
  )
}

export default ProjectView