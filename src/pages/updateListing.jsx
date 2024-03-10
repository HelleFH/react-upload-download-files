import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import ImageUpload from '../components/imageUpload'; 
import isPreviewAvailable from '../components/imageUpload'; 

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
        console.error('Error fetching listing:', err); 
      });
  }, [id]);

  const onChange = (e) => {
    setListing({ ...listing, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
  
        formData.append('title', listing.title);
        formData.append('description', listing.description);
        formData.append('location', listing.location);
  
        // Upload the new image
        const uploadResponse = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const data = {
          title: listing.title,
          description: listing.description,
          location: listing.location,
          cloudinaryUrl: uploadResponse.data.cloudinaryUrl,
        };
  
        console.log('Data being sent for update:', data);
  
        // Update the listing with the new data
        const updateResponse = await axios.put(`http://localhost:3030/listings/${id}`, data);
  
        console.log('Listing updated successfully:', updateResponse.data);
        navigate('/');


      } else {
        // If no new file is selected, only update title and description
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
  
      // Delete the old listing
      const deleteResponse = await axios.delete(`http://localhost:3030/listings/${id}`);
  
      console.log('Listing deleted successfully:', deleteResponse.data);
  
      navigate('/');
    } catch (error) {
      console.error('Error updating or deleting listing:', error);
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
           <ImageUpload
  onDrop={onDrop}
  file={file}
  previewSrc={previewSrc}
  isPreviewAvailable={isPreviewAvailable}
/>
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
