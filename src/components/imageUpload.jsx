import React from 'react';

const ImageUpload = ({ onDrop, file, previewSrc, isPreviewAvailable }) => {
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    onDrop([selectedFile]);
  };

  return (
    <div className="upload-section">
      <div className='upload-zone' style={{ cursor: 'pointer' }}>
        <div className='bg-light text-dark mt-2 mb-2 w-50 pl-1'>
          <input  type="file" className='text-dark ml-1' onChange={handleFileChange} accept="image/*" />

        
        </div>
      </div>

      {previewSrc ? (
        isPreviewAvailable ? (
          <div className="image-preview">
            <img className="preview-image" src={previewSrc} alt="Preview" />
          </div>
        ) : (
          <div className="preview-message">
            <p>No preview available for this file</p>
          </div>
        )
      ) : (
        <div className="preview-message">
        </div>
      )}
    </div>
  );
};

export default ImageUpload;