import React, { useState } from 'react'
import Modal from '../Common/Modal'

const CreateProject = ({ show, onHide, onSave }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSave = () => {
    if (title.trim() && description.trim()) {
      onSave({ title, description })
      setTitle('')
      setDescription('')
    }
  }

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      title="Create New Project"
      onSave={handleSave}
      saveLabel="Create Project"
    >
      <div className="mb-3">
        <label className="form-label">Project Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter project title"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter project description"
        />
      </div>
    </Modal>
  )
}

export default CreateProject