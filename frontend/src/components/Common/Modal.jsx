import React from 'react'

const Modal = ({ show, onHide, title, children, onSave, saveLabel = 'Save' }) => {
  if (!show) return null

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Cancel
            </button>
            {onSave && (
              <button type="button" className="btn btn-primary" onClick={onSave}>
                {saveLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal