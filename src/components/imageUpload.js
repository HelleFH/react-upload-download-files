import React from 'react';
import Dropzone from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

const ImageUpload = ({ onDrop, file, previewSrc, isPreviewAvailable }) => {
  return (
    <div className="upload-section">
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps({ className: 'drop-zone' })}>
            <div className='drop-zone-container'>
              <input {...getInputProps()} />
              <p>Upload Image <FontAwesomeIcon icon={faCloudArrowUp} /></p>

              {file && (
                <div>
                  {file.name}
                </div>
              )}
            </div>
          </div>
        )}
      </Dropzone>
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
