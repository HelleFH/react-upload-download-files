import React from 'react';
import { Link } from 'react-router-dom';

function ListingCard({ listing, onDelete }) {
  const handleDelete = () => {
    onDelete(listing._id);
  };

  return (
    <Link to={`/listing/${listing._id}`} className="card-link">
      <div className='card mb-3'>
        {/* Use the Cloudinary URL for the image */}
        <img
          src={listing.cloudinaryUrl}
          alt={`Listing cover for ${listing.title}`}
          className='card-img-top'
        />
        <div className='card-body'>
          <h5 className='card-title'>{listing.title}</h5>
          <p className='card-location mt-2 mb-2 text-strong'>{listing.location}</p>

          <p className='card-description mb-3'>{listing.description}</p>
          <button
            onClick={handleDelete}
            className='delete-listing-button btn '
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
    </Link>
  );
}

export default ListingCard;
