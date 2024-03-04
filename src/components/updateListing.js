import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateListingInfo(props) {
  const [listing, setListing] = useState({
    title: '',
    description: ''
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3030/listings/${id}`)
      .then((res) => {
        setListing({
          title: res.data.title,
          description: res.data.description,
        });
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
        navigate(`/show-listing/${id}`);
      })
      .catch((err) => {
        console.log('Error in UpdateListingInfo!', err);
        // Display an error message to the user
      });
  };

  return (
    <div className='UpdateListingInfo'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8 m-auto'>
            <br />
            <Link to='/' className='btn btn-outline-warning float-left'>
              Show BooK List
            </Link>
          </div>
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Edit Listing</h1>
            <p className='lead text-center'>Update Listing's Info</p>
          </div>
        </div>

        <div className='col-md-8 m-auto'>
          <form noValidate onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor='title'>Title</label>
              <input
                type='text'
                placeholder='Title of the Listing'
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