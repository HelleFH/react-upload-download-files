import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../utils/constants';

function UpdateListingInfo(props) {
  const dropRef = useRef();
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');

  const [listing, setListing] = useState({
    title: '',
    description: '',
    location: '',
    cloudinaryUrl: '',
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
          location: res.data.location,

          cloudinaryUrl: res.data.cloudinaryUrl,
        });
        setPreviewSrc(`${res.data.cloudinaryUrl}`);
      })
      .catch((err) => {
        console.error('Error fetching listing:', err); // Log the error for debugging
      });
  }, [id]);

  const onChange = (e) => {
    setListing({ ...listing, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Check if a new file is selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
  
        // Include the required fields in the form data
        formData.append('title', listing.title);
        formData.append('description', listing.description);
        formData.append('location', listing.location);
  
        // Upload the new image
        const uploadResponse = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Update the data with the new file path
        const data = {
          title: listing.title,
          description: listing.description,
          location: listing.location,
          cloudinaryUrl: uploadResponse.data.cloudinaryUrl,
        };
  
        console.log('Data being sent for update:', data);
  
        // Update the listing with the new data
        const updateResponse = await axios.put(`http://localhost:3030/listings/${id}`, data);
  
        // Handle the update response as needed
        console.log('Listing updated successfully:', updateResponse.data);
      } else {
        // If no new file is selected, update only title and description
        const data = {
          title: listing.title,
          description: listing.description,
          location: listing.location,
        };
  
        console.log('Data being sent for update:', data);
  
        // Update the listing with the existing data
        const updateResponse = await axios.put(`http://localhost:3030/listings/${id}`, data);
  
        // Handle the update response as needed
        console.log('Listing updated successfully:', updateResponse.data);
      }
  
      // Now delete the listing
      const deleteResponse = await axios.delete(`http://localhost:3030/listings/${id}`);
  
      // Handle the delete response as needed
      console.log('Listing deleted successfully:', deleteResponse.data);
  
      // Redirect or perform any additional actions after deleting
      navigate('/');
    } catch (error) {
      console.error('Error updating or deleting listing:', error);
    }
  };
  
    const onDeleteImage = async () => {
    try {
      console.log('Deleting image...');
      // Send a request to your server to delete the image
      await axios.delete(`http://localhost:3030/listings/${id}/delete-image`);
      console.log('Image deleted successfully');
  
      // Update the state to remove the image and preview
      setFile(null);
      setPreviewSrc('');
    } catch (error) {
      console.error('Error deleting image:', error);
    }
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
{!previewSrc && listing.file_path && (
  <div className="image-preview">
    <img className="preview-image" src={`http://localhost:3030/${listing.cloudinaryUrl}`} alt="Preview" />
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
                  <button type="button" className="btn btn-danger" onClick={onDeleteImage}>
                            Delete Image
                          </button>
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
