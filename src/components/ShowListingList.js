import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListingCard from './ListingCard';

function ShowListingList() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3030/listings');
      setListings(response.data);
    } catch (error) {
      console.log('Error from ShowListingList:', error);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const response = await axios.delete(`http://localhost:3030/listings/${listingId}`);
      if (response.status === 200) {
        // Update the state to remove the deleted listing
        setListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));
        console.log('Listing deleted successfully:', response.data);
      } else {
        console.error('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const listingList =
    listings.length === 0 ? (
      <div className='alert alert-info'>There is no listing record!</div>
    ) : (
      <div className='grid'>
        {listings.map((listing) => (
          <div key={listing._id}>
            <ListingCard listing={listing} onDelete={handleDeleteListing} />
          </div>
        ))}
      </div>
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
