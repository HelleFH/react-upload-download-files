import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { API_URL } from "../utils/constants";


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
      <h1 className='text-center display-1' style={{fontFamily:'Cormonrant'}}>Listings</h1>
      <p className='text-center'>Feel free to create, edit or delete listings</p>
      <div className='col-md-12'>
        <Link to='/create-listing'>
          <button  className='mt-3 mb-3  float-right button button--blue'>
          + Add New Listing
          </button>
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
