// BookCard.js
import React from 'react';

function BookCard({ book }) {
  return (
    <div className='card-container'>
      <img
      
        src={`http://localhost:3030/books/image/${book._id}`} // Adjust the API endpoint accordingly
        alt='book'
        className='card-image'
      />
      <div className='desc'>
        <h2>{book.title}</h2>
        <p>{book.description}</p>
      </div>
    </div>
  );
}

export default BookCard;
