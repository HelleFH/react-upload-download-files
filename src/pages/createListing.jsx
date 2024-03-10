import  { useState } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import ImageUpload from '../components/imageUpload';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const CreateListingWithFileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const [listing, setListing] = useState({
    title: '',
    description: '',
    location: '',
  });

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
  };

  const handleListingSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!file) {
        setErrorMsg('Please select a file to add.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', listing.title);
      formData.append('description', listing.description);
      formData.append('location', listing.location);

      await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFile(null);
      setPreviewSrc('');
      setIsPreviewAvailable(false);
      navigate('/');

    } catch (error) {
      console.error('Error in form submission:', error);
      setErrorMsg('Error submitting the form. Please try again.');
    }
  };

  const handleInputChange = (event) => {
    setListing({
      ...listing,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <Link to='/' className='mt-3 mb-3 btn btn-outline-warning float-right'>
        Back to Listings
      </Link>
      <Form className="search-form" onSubmit={handleListingSubmit}>
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <ImageUpload
          onDrop={onDrop}
          file={file}
          previewSrc={previewSrc}
          isPreviewAvailable={isPreviewAvailable}
        />
        <div className='form-container'>
          {/* Listing form inputs */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Title"
              name="title"
              className="form-control"
              value={listing.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <textarea
              type="text"
              placeholder="Description"
              name="description"
              className="form-control"
              value={listing.description}
              onChange={handleInputChange}
              style={{ height: '150px', verticalAlign: 'top' }}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Location"
              name="location"
              className="form-control"
              value={listing.location}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='d-flex w-100 float-right justify-content-end gap-2'>
          <Link to="/" className="btn btn-outline-warning btn-block mt-4 mb-4 w-25">
            Cancel
          </Link>
          <button className=" btn btn-outline-warning btn-block mt-4 mb-4 w-25" type="submit">
            Submit
          </button>
        </div>
      </Form>
    </>
  );
};

export default CreateListingWithFileUpload;
