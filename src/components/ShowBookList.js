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
      <div className='alert alert-info'>There is no book record!</div>
    ) : (
      books.map((book) => (
        <div className='col-md-4 mb-3' key={book._id}>
          <BookCard book={book} />
        </div>
      ))
    );

  return (
    <div className='ShowBookList'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <h2 className='display-4 text-center'>Books List</h2>
          </div>

          <div className='col-md-12'>
            <Link to='/create-book' className='btn btn-outline-warning float-right'>
              + Add New Book
            </Link>
          </div>
        </div>

        <div className='row mt-3'>{bookList}</div>
      </div>
    </div>
  );
}

export default ShowBookList;
