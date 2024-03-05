import React from 'react';
import { Link } from 'react-router-dom';

function ListingCard({ listing }) {
  return (
    <div className='card mb-3'>
      {/* Use the Cloudinary URL for the image */}
      <img
        src={listing.cloudinaryUrl}
        alt={`Listing cover for ${listing.title}`}
        className='card-img-top'
        style={{ width: '100%', minHeight:'200px', maxHeight:'350px', objectFit:'cover' }}
      />
      <div className='card-body'>
        <h5 className='card-title'>{listing.title}</h5>
        <p className='card-description'>{listing.description}</p>
        <p className='card-location'>{listing.location}</p>
      </div>
      <Link
        to={`/edit-listing/${listing._id}`}
        className='btn btn-outline-info btn-lg btn-block'
      >
        Edit Listing
      </Link>
    </div>
  );
}

export default ListingCard;
