import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateListingWithFileUpload from '../components/createListing';
import ShowListingList from '../components/ShowListingList'; 
import UpdateListingInfo from '../components/updateListing';
import DetailPage from '../components/IndividualPage';

const AppRouter = () => (
  <Router>
    <div className="container">
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ShowListingList />} />
          <Route path="/create-listing" element={<CreateListingWithFileUpload />} />
          <Route path="/edit-listing/:id" element={<UpdateListingInfo />} />
          <Route path="/listing/:id" element={<DetailPage />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default AppRouter;
