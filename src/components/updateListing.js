import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

function UpdateListingInfo(props) {
  const dropRef = useRef();
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');

  const [listing, setListing] = useState({
    title: '',
    description: '',
    file_path: '',
  });

  const onDrop = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    setFile(currentFile);
  
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setPreviewSrc(reader.result);
    });
  
    reader.readAsDataURL(currentFile);
  };

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3030/listings/${id}`)
      .then((res) => {
        setListing({
          title: res.data.title,
          description: res.data.description,
          file_path: res.data.file_path,
        });
        setPreviewSrc(`http://localhost:3030/${res.data.file_path}`);
      })
      .catch((err) => {
        console.log('Error from UpdateListingInfo');
      });
  }, [id]);

  const onChange = (e) => {
    setListing({ ...listing, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      title: listing.title,
      description: listing.description,
    };

    axios
      .put(`http://localhost:3030/listings/${id}`, data)
      .then((res) => {
        navigate(`/`);
      })
      .catch((err) => {
        console.log('Error in UpdateListingInfo!', err);
      });
  };

  return (
    <div className='UpdateListingInfo'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8 m-auto'>
            <br />
            <Link to='/' className='btn btn-outline-warning float-left'>
              Show Book List
            </Link>
          </div>
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Edit Listing</h1>
            <p className='lead text-center'>Update Listing's Info</p>
          </div>
        </div>

        <div className='col-md-8 m-auto'>
          <form noValidate onSubmit={onSubmit}>
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
              {previewSrc && (
                <div className="image-preview">
                  <img className="preview-image" src={previewSrc} alt="Preview" />
                </div>
              )}
            </div>
            <div className='form-group'>
              <label htmlFor='title'>Title</label>
              <input
                type='text'
                name='title'
                className='form-control'
                value={listing.title}
                onChange={onChange}
              />
            </div>
            <br />
            <div className='form-group'>
              <label htmlFor='description'>Description</label>
              <textarea
                type='text'
                placeholder='Description of the Listing'
                name='description'
                className='form-control'
                value={listing.description}
                onChange={onChange}
              />
            </div>
            <br />
            <button
              type='submit'
              className='btn btn-outline-info btn-lg btn-block'
            >
              Update Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateListingInfo;
