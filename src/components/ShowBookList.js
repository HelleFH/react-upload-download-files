import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BookCard from './BookCard';

function ShowBookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3030/books')
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.log('Error from ShowBookList');
      });
  }, []);

  const bookList =
    books.length === 0 ? (
      'There is no book record!'
    ) : (
      books.map((book, k) => (
        <div key={k}>
          <BookCard book={book} />
          {book.file && (
            <img
              src={`http://localhost:3030/files/${book.file.file_path}`}
              alt={`Book cover for ${book.title}`}
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
          )}
        </div>
      ))
    );

  return (
    <div className='ShowBookList'>
      <div className='container'>
        {/* ... (your existing code) */}
        <div className='list'>{bookList}</div>
      </div>
    </div>
  );
}

export default ShowBookList;