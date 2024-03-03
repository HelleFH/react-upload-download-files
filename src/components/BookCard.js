import React from 'react';

function BookCard({ book }) {
  return (
    <div className='card-container'>
      <img
        src={`http://localhost:3030/${book.file_path}`}
        alt={`Book cover for ${book.title}`}
        style={{ maxWidth: '100px', maxHeight: '100px' }}
      />
      <div className='desc'>
        <h2>{book.title}</h2>
        <p>{book.description}</p>
      </div>
    </div>
  );
}

export default BookCard;
