import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/constants";
import localListings from '../data/localListings.json';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const IndividualPage = () => {
  const [combinedListings, setCombinedListings] = useState([]);
  const [singleListing, setSingleListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
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
    setSelectedListingId(null);
    setShowDeleteModal(false);
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await axios.delete(`${API_URL}/listings/${listingId}`);
      // Update the state to remove the deleted listing
      setCombinedListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));
      console.log('Listing deleted successfully!');
      setShowDeleteModal(false); // Close the modal after successful deletion
      navigate('/'); // Navigate back to the home page using useNavigate
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
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : singleListing ? (
            <div className="card mx-auto" style={{ maxWidth: "800px", background: "#fff" }}>
              <img
                src={singleListing.cloudinaryUrl}
                className="card-img-top img-fluid"
                alt=""
              />
              <div className="card-body">
                <h2 className="card-title text-center mb-3">{singleListing.title}</h2>
                <p className="card-text text-center text-muted">{singleListing.description}</p>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setSelectedListingId(singleListing._id);
                      setShowDeleteModal(true);
                    }}
                    className='delete-listing-button btn btn-danger'
                    style={{ marginRight: '10px' }}
                  >
                    Delete Listing
                  </button>
                  <Link
                    to={`/edit-listing/${singleListing._id}`}
                    className='edit-listing-button btn btn-warning'
                  >
                    Edit Listing
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">No Items Found</div>
          )}
        </div>
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
};

export default IndividualPage;
