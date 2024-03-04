import React, { useState, useRef } from 'react';
import { Form } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';



const CreateBookWithFileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const dropRef = useRef();

  const [book, setBook] = useState({
    title: '',
    description: '',
    location: ''

  });

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);
    dropRef.current.style.border = '2px dashed #e9ebeb';

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
  };

  const updateBorder = (dragState) => {
    if (dragState === 'over') {
      dropRef.current.style.border = '2px solid #000';
    } else if (dragState === 'leave') {
      dropRef.current.style.border = '2px dashed #e9ebeb';
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!file) {
        setErrorMsg('Please select a file to add.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', book.title);
      formData.append('description', book.description);
      formData.append('location', book.location);


      await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFile(null);
      setPreviewSrc('');
      setIsPreviewAvailable(false);

      // Redirect using history
    } catch (error) {
      console.error('Error in form submission:', error);
      setErrorMsg('Error submitting the form. Please try again.');
    }
  };

  const handleInputChange = (event) => {
    setBook({
      ...book,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <React.Fragment>
      <Form className="search-form" onSubmit={handleBookSubmit}>
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <div className="upload-section">
          <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
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
        <div className='form-container'>
        {/* Book form inputs */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Title of the Book"
            name="title"
            className="form-control"
            value={book.title}
            onChange={handleInputChange}
          />
</div>
<div className="form-group">

                 <textarea
            type="text"
            placeholder="Description of the Book"
            name="description"
            className="form-control"
            value={book.description}
            onChange={handleInputChange}
            style={{ height: '150px', verticalAlign: 'top' }}

          />
</div>
<div className="form-group">

                 <input
            type="text"
            placeholder="Location of the Book"
            name="location"
            className="form-control"
            value={book.location}
            onChange={handleInputChange}
          />
        </div>
        </div>
        <button className="btn btn-outline-warning btn-block mt-4 mb-4 w-100"  type="submit">
          Submit
        </button>
      </Form>
    </React.Fragment>
  );
};

export default CreateBookWithFileUpload;
