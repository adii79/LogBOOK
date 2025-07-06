import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import Modal from '../Common/Modal'

const NotesList = ({ projectId }) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    fetchNotes()
  }, [projectId])

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/api/notes/${projectId}`)
      setNotes(response.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNote = async () => {
    try {
      if (editingNote) {
        const response = await api.put(`/api/notes/${editingNote._id}`, formData)
        setNotes(notes.map(note => 
          note._id === editingNote._id ? response.data : note
        ))
      } else {
        const response = await api.post('/api/notes', {
          ...formData,
          projectId
        })
        setNotes([...notes, response.data])
      }
      
      setShowModal(false)
      setEditingNote(null)
      setFormData({ title: '', content: '' })
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content
    })
    setShowModal(true)
  }

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/api/notes/${noteId}`)
        setNotes(notes.filter(note => note._id !== noteId))
      } catch (error) {
        console.error('Error deleting note:', error)
      }
    }
  }

  if (loading) return <div>Loading notes...</div>

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Notes</h4>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
        >
          Add Note
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="text-muted">No notes yet. Create your first note!</p>
      ) : (
        <div className="row">
          {notes.map(note => (
            <div key={note._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">{note.title}</h6>
                  <p className="card-text small text-muted">
                    {note.content.substring(0, 100)}
                    {note.content.length > 100 && '...'}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </small>
                  </p>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEditNote(note)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        show={showModal}
        onHide={() => {
          setShowModal(false)
          setEditingNote(null)
          setFormData({ title: '', content: '' })
        }}
        title={editingNote ? 'Edit Note' : 'Create New Note'}
        onSave={handleSaveNote}
        saveLabel={editingNote ? 'Update Note' : 'Create Note'}
      >
        <div className="mb-3">
          <label className="form-label">Note Title</label>
          <input
            type="text"
            className="form-control"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Enter note title"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows="6"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="Enter note content"
          />
        </div>
      </Modal>
    </div>
  )
}

export default NotesList