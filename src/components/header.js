import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ShowListingList from './ShowListingList';  // Adjust the path based on your actual file structure



function BasicExample() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <Nav.Link onClick={() => handleNavigation('ShowListingList')}>View Listings</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function handleNavigation(section) {
  // Your navigation logic here
  if (section === 'home') {
    // Navigate to Home component
  } else if (section === 'link') {
    // Navigate to Link component
  } else if (section === 'viewListings') {
    // Navigate to ViewListingsList component
  }
}

export default BasicExample;
