import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShowBookList from './ShowBookList'; // Import the ShowBookList component

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/list" component={FileList} />
          <Route path="/books" component={ShowBookList} /> {/* Add this line */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
