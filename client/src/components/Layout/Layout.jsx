import React from 'react'
import { Navbar } from '../NavBar'
import { useSelector } from 'react-redux';

// Layout component acts as a wrapper for all pages
export const Layout = ({ children }) => {
  // Get the current search query from the Redux store
  const searchQuery = useSelector((state) => state.search.query);

  return (
    <div className="min-vh-100" style={{ backgroundColor: "var(--secondary-color)", overflow: "hidden" }}>
      <Navbar />
      <div className="main-content py-3">
        {/* Render whatever is passed inside the Layout (child components/pages) */}
        {children}
      </div>
    </div>
  );
}
