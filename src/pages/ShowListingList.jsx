import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { API_URL } from '../utils/constants';
import { truncateDescription, handleDeleteListing } from '../store/appStore';

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

        // Load localListings synchronously
        const localListings = require('../data/localListings.json');

        // Combine MongoDB and local listings
        setCombinedListings([...mongodbListings, ...localListings]);

        setError(null);
      } catch (error) {
        console.log('Error fetching listings:', error);
        setError('Error fetching listings. Please try again.');
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure it runs only once

  const renderError = () => (
    <div className='alert alert-danger'>{error || 'An unexpected error occurred.'}</div>
  );
<<<<<<< HEAD
  const handleDeleteListing = async (listingId, cloudinaryPublicId) => {
    try {
      // Delete the listing on the server
      const response = await axios.delete(`${API_URL}/listings/${listingId}`);
  
      if (response.status === 200) {
        // Update the state to remove the deleted listing
        setCombinedListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));
  
        // Delete the Cloudinary image if a public ID is available
        if (cloudinaryPublicId) {
          console.log('Cloudinary public_id:', cloudinaryPublicId);
  
          try {
            // Make sure to adjust the API endpoint for Cloudinary image deletion
            const cloudinaryResponse = await axios.delete(`${API_URL}/delete-image/${cloudinaryPublicId}`);
            console.log('Cloudinary image deletion response:', cloudinaryResponse.data);
          } catch (cloudinaryError) {
            console.error('Error deleting image from Cloudinary:', cloudinaryError);
          }
        }
  
        console.log('Listing deleted successfully:', response.data);
        setShowDeleteModal(false); // Close the modal after successful deletion
      } else {
        console.error('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };
  
=======

>>>>>>> 5e7d41e258ed5dfc79c07ef140268d3eb7918e5a
  const openDeleteModal = (listingId) => {
    setSelectedListingId(listingId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedListingId(null);
    setShowDeleteModal(false);
  };

  const renderCards = () => {
    return combinedListings.map((listing, index) => (
      <div key={listing.cloudinaryUrl ? `listing-${listing._id}` : `local-listing-${index}`} className='listing-card-container'>
        {listing.cloudinaryUrl ? (
          <ListingCard listing={{
            ...listing, description: truncateDescription(listing.description, 20),
          }} onDelete={() => openDeleteModal(listing._id)} />
        ) : (
          <div />
        )}
      </div>
    ));
  };

  return (
    <div className='ShowListingList'>
      <h1 className='text-center display-1' style={{ fontFamily: 'Cormonrant' }}>Listings</h1>
      <p className='text-center'>Feel free to create, edit or delete listings</p>
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
          handleDeleteListing(selectedListingId, setCombinedListings, setShowDeleteModal);
          closeDeleteModal();
        }}
      />
    </div>
  );
}

export default ShowListingList;
