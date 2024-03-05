import React from 'react';
import { Link } from 'react-router-dom';

function ListingCard({ listing, onDelete }) {
  const handleDelete = () => {
    // You can call onDelete and pass the listing ID for deletion
    onDelete(listing._id);
  };

  return (
    <div className='card mb-3'>
      {/* Use the Cloudinary URL for the image */}
      <img
        src={listing.cloudinaryUrl}
        alt={`Listing cover for ${listing.title}`}
        className='card-img-top'
      />
      <div className='card-body'>
        <h5 className='card-title'>{listing.title}</h5>
        <p className='card-description'>{listing.description}</p>
        <p className='card-location'>{listing.location}</p>
        <button
          onClick={handleDelete}
          className='delete-listing-button btn btn-outline-danger'
          style={{ marginRight: '10px' }}
        >
          Delete Listing
        </button>
        <Link
          to={`/edit-listing/${listing._id}`}
          className='edit-listing-button btn btn-outline-warning'
        >
          Edit Listing
        </Link>
      </div>
    </div>
  );
}

export default ListingCard;
