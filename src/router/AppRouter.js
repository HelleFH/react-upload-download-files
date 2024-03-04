import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../components/app';
import ShowBookList from '../components/ShowBookList'; // Import the ShowBookList component

const AppRouter = () => (
  <Router>
<div className="container">
      <div className="main-content">
        <Routes>
          <Route element={<App />} path="/" exact />
          <Route path="/books" element={<ShowBookList />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default AppRouter;
