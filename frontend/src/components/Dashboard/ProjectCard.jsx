import React from 'react'

const ProjectCard = ({ project, onClick }) => {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{project.title}</h5>
        <p className="card-text text-muted">{project.description}</p>
        <p className="card-text">
          <small className="text-muted">
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </small>
        </p>
        <button className="btn btn-primary" onClick={() => onClick(project._id)}>
          Open Project
        </button>
      </div>
    </div>
  )
}

export default ProjectCard