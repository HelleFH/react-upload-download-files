import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ShowBookList from './ShowBookList'; // Import the ShowBookList component

const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/list" component={FileList} />
          <Route path="/books" component={ShowBookList} /> {/* Add this line */}
        </Switch>
      </div>
    </Router>
  );
};

export default App;
