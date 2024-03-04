import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListingCard from './ListingCard';

function ShowListingList() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3030/listings')
      .then((res) => {
        setListings(res.data);
      })
      .catch((err) => {
        console.log('Error from ShowListingList');
      });
  }, []);

  const listingList =
    listings.length === 0 ? (
      <div className='alert alert-info'>There is no listing record!</div>
    ) : (
      listings.map((listing) => (
        <div className='col-md-4 mb-3' key={listing._id}>
          <ListingCard listing={listing} />
        </div>
      ))
    );

  return (
    <div className='ShowListingList'>
      <div className='container-lg'>
        <div className='row'>
          <div className='col-md-12'>
            <h2 className='display-4 text-center'>Listings List</h2>
          </div>

          <div className='col-md-12'>
            <Link to='/create-listing' className='btn btn-outline-warning float-right'>
              + Add New Listing
            </Link>
          </div>
        </div>

        <div className='row mt-3'>{listingList}</div>
      </div>
    </div>
  );
}

export default ShowListingList;
