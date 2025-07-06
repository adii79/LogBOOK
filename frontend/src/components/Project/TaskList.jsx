import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { TASK_STATUS, TASK_STATUS_LABELS } from '../../utils/constants'
import Modal from '../Common/Modal'

const TaskList = ({ projectId }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
    assignedTo: ''
  })

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/api/tasks/${projectId}`)
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTask = async () => {
    try {
      if (editingTask) {
        const response = await api.put(`/api/tasks/${editingTask._id}`, formData)
        setTasks(tasks.map(task => 
          task._id === editingTask._id ? response.data : task
        ))
      } else {
        const response = await api.post('/api/tasks', {
          ...formData,
          projectId
        })
        setTasks([...tasks, response.data])
      }
      
      setShowModal(false)
      setEditingTask(null)
      setFormData({
        title: '',
        description: '',
        status: TASK_STATUS.TODO,
        assignedTo: ''
      })
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo || ''
    })
    setShowModal(true)
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/api/tasks/${taskId}`)
        setTasks(tasks.filter(task => task._id !== taskId))
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case TASK_STATUS.TODO:
        return 'bg-secondary'
      case TASK_STATUS.IN_PROGRESS:
        return 'bg-warning'
      case TASK_STATUS.COMPLETED:
        return 'bg-success'
      default:
        return 'bg-secondary'
    }
  }

  if (loading) return <div>Loading tasks...</div>

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Tasks</h4>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
        >
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-muted">No tasks yet. Create your first task!</p>
      ) : (
        <div className="row">
          {tasks.map(task => (
            <div key={task._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title">{task.title}</h6>
                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                      {TASK_STATUS_LABELS[task.status]}
                    </span>
                  </div>
                  <p className="card-text small text-muted">{task.description}</p>
                  {task.assignedTo && (
                    <p className="card-text small">
                      <strong>Assigned to:</strong> {task.assignedTo}
                    </p>
                  )}
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEditTask(task)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteTask(task._id)}
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
          setEditingTask(null)
          setFormData({
            title: '',
            description: '',
            status: TASK_STATUS.TODO,
            assignedTo: ''
          })
        }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        onSave={handleSaveTask}
        saveLabel={editingTask ? 'Update Task' : 'Create Task'}
      >
        <div className="mb-3">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            className="form-control"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Enter task title"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Enter task description"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Assigned To (Email)</label>
          <input
            type="email"
            className="form-control"
            value={formData.assignedTo}
            onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
            placeholder="Enter assignee email"
          />
        </div>
      </Modal>
    </div>
  )
}

export default TaskList