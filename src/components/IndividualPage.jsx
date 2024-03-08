import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/constants";
import localListings from '../data/localListings.json';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ListingCard from './ListingCard';

const IndividualPage = () => {
  const [combinedListings, setCombinedListings] = useState([]);
  const [singleListing, setSingleListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const getSingleListing = async () => {
    try {
      const response = await axios.get(`${API_URL}/listings`);
      const mongodbListings = response.data;

      setCombinedListings([...mongodbListings, ...localListings]);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.log('Error fetching listings:', error);
      setError('Error fetching listings. Please try again.');
      setLoading(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await axios.delete(`${API_URL}/listings/${listingId}`);
      setCombinedListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));
      console.log('Listing deleted successfully!');
      setShowDeleteModal(false);
      navigate('/');
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  useEffect(() => {
    if (id) {
      getSingleListing();
    }
  }, [id]);

  useEffect(() => {
    if (combinedListings.length > 0 && id) {
      setSingleListing(combinedListings.find(listing => listing._id === id));
    }
  }, [combinedListings, id]);

  return (
    <div className="container mt-5">
      <Link to='/' className='mt-3 mb-3 btn btn-outline-warning float-right'>
        Back to Listings
      </Link>
      <div className='col-md-12 mx-auto' style={{maxWidth:'800px'}}>
        <div className='container-lg'>
          {loading ? (
            <div className='text-center'>Loading...</div>
          ) : singleListing ? (
            <div>
              {/* Replace the existing HTML with the ListingCard component */}
              <ListingCard listing={singleListing} onDelete={() => setShowDeleteModal(true)} />
              <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onCancel={closeDeleteModal}
                onConfirm={() => {
                  handleDeleteListing(singleListing._id);
                  closeDeleteModal();
                }}
              />
            </div>
          ) : (
            <div className='text-center'>No Items Found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualPage;
