import React from 'react';
import { Link } from 'react-router-dom';

function ListingCard({ listing, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevents the click event from propagating to the parent link
    onDelete(listing._id);
  };

  return (
    <div className='card mb-3'>
      {/* Use the Cloudinary URL for the image */}
      <Link to={`/listing/${listing._id}`} className="card-link">
        <img
          src={listing.cloudinaryUrl}
          alt={`Listing cover for ${listing.title}`}
          className='card-img-top'
        />
      </Link>
      <div className='card-body'>
        <h5 className='card-title'>{listing.title}</h5>
        <p className='card-location mt-2 mb-2 text-strong'>{listing.location}</p>
        <p className='card-description mb-3'>{listing.description}</p>
        <div className='d-flex justify-content-end width-100'> 
          <button
          onClick={(e) => handleDelete(e)}
          className='delete-listing-button btn'
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
    </div>
  );
}

export default ListingCard;
