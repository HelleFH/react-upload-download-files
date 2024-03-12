import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ImageUpload from '../components/imageUpload';
import { fetchListingInfo, updateListingInfo } from '../store/appStore';

function UpdateListingInfo() {
  const dropRef = useRef();
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');

  const [listing, setListing] = useState({
    title: '',
    description: '',
    location: '',
    cloudinaryUrl: '',
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListingInfo(id, setListing, setPreviewSrc);
  }, [id]);

  const onDrop = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    setFile(currentFile);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setPreviewSrc(reader.result);
    });

    reader.readAsDataURL(currentFile);
  };

  const onChange = (e) => {
    setListing({ ...listing, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    updateListingInfo(id, listing, file, navigate, setFile);
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
              isPreviewAvailable={true}
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
            <div className='form-group'>
              <label htmlFor='location'>Location</label>
              <input
                type='text'
                name='location'
                className='form-control'
                value={listing.location}
                onChange={onChange}
              />
            </div>
            <button
              type='submit'
              className='btn button button--orange btn-lg btn-block float right'
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
