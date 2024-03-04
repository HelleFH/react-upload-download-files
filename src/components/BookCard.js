import React from 'react';

function BookCard({ book }) {
  return (
    <div className='card mb-3'>
      <img
        src={`http://localhost:3030/${book.file_path}`}
        alt={`Book cover for ${book.title}`}
        className='card-img-top'
        style={{ width: '100%', minHeight:'200px', maxHeight:'350px', objectFit:'cover' }}
      />
      <div className='card-body'>
        <h5 className='card-title'>{book.title}</h5>
        <p className='card-description'>{book.description}</p>
        <p className='card-location'>{book.location}</p>

      </div>
    </div>
  );
}

export default BookCard;
