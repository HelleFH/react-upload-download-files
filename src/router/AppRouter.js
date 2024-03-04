import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateListingWithFileUpload from '../components/createListing';
import ShowListingList from '../components/ShowListingList'; 
import UpdateListingInfo from '../components/updateListing';


const AppRouter = () => (
  <Router>
<div className="container">
      <div className="main-content">
        <Routes>
          <Route element= {<ShowListingList />} path="/" exact />
          <Route path="/create-listing" element={<CreateListingWithFileUpload />}/>
          <Route path="/edit-listing/:id" element={<UpdateListingInfo />}/>

        </Routes>
      </div>
    </div>
  </Router>
);

export default AppRouter;
