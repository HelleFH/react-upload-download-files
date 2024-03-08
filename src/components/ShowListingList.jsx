import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListingCard from './ListingCard';
import DeleteConfirmationModal from './DeleteConfirmationModal';

import { API_URL } from '../utils/constants';

function ShowListingList() {
  const [combinedListings, setCombinedListings] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/listings`);
        const mongodbListings = response.data;
        const localListings = require('../data/localListings.json');

        setCombinedListings([...mongodbListings, ...localListings]);
        setError(null);
      } catch (error) {
        console.log('Error fetching listings:', error);
        setError('Error fetching listings. Please try again.');
      }
    };

    fetchData();
  }, []);
  const truncateDescription = (description, wordCount) => {
    const words = description.split(' ');
    const truncatedWords = words.slice(0, wordCount);
    return truncatedWords.join(' ') + (words.length > wordCount ? '...' : '');
  };
  const renderError = () => (
    <div className='alert alert-danger'>{error || 'An unexpected error occurred.'}</div>
  );

  const handleDeleteListing = async (listingId) => {
    try {
      const response = await axios.delete(`${API_URL}/listings/${listingId}`);
      if (response.status === 200) {
        // Update the state to remove the deleted listing
        setCombinedListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));
        console.log('Listing deleted successfully:', response.data);
        setShowDeleteModal(false); // Close the modal after successful deletion
      } else {
        console.error('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };


  const openDeleteModal = (listingId) => {
    setSelectedListingId(listingId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedListingId(null);
    setShowDeleteModal(false);
  };


  const renderCards = () => {
    console.log(combinedListings);  // Log the entire array

    return combinedListings.map((listing, index) => (

      <div key={listing.cloudinaryUrl ? `listing-${listing._id}` : `local-listing-${index}`} className='listing-card-container'>
        {listing.cloudinaryUrl ? (

          <ListingCard listing={{
            ...listing, description: truncateDescription(listing.description, 20),
          }} onDelete={() => openDeleteModal(listing._id)} />
        ) : (
          <div

          />
        )}
      </div>
    ));
  };


  return (
    <div className='ShowListingList'>
      <div className='col-md-12'>
        <Link to='/create-listing' className='mt-3 mb-3 btn btn-outline-warning float-right'>
          + Add New Listing
        </Link>
      </div>
      <div className='container-lg grid-container'>
        {error ? (
          renderError()
        ) : (
          <div className='grid'>
            {renderCards()}
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={() => {
          handleDeleteListing(selectedListingId);
          closeDeleteModal();
        }}
      />
    </div>
  );
}

export default ShowListingList;
