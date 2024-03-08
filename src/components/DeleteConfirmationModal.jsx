import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  
  return (
    <div>
      {isOpen && (
        <div className='modal-backdrop show'></div>
      )}
      {isOpen && (
        <div className='modal' tabIndex='-1' role='dialog' style={{ display: 'block' }}>
          <div className='modal-dialog' role='document'>
            <div className='modal-content text-dark'>
              <div className='modal-header'>
                <h5 className='modal-title' id='deleteModalLabel'>
                  Confirm Deletion
                </h5>
                <button
                  type='button'
                  className='close bg-body float-right'
                  data-dismiss='modal'
                  aria-label='Close'
                  onClick={onCancel}
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                Are you sure you want to delete this listing?
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className=' -secondary'
                  data-dismiss='modal'
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className=' -danger'
                  onClick={onConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteConfirmationModal;
