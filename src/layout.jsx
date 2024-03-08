// Layout.jsx
import React from 'react';
import Header from './components/header';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      {/* Add other layout elements or components */}
    </div>
  );
};

export default Layout;
