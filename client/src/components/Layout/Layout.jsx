import React from 'react'
import { Navbar } from '../NavBar'
import { useSelector } from 'react-redux';

export const Layout = ({children}) => {
  const searchQuery = useSelector((state) => state.search.query);
  return (
    <div style={{backgroundColor:"var(--secondary-color)", overflow: "hidden"}}>
        <Navbar />
        <div className=" main-content py-3" >
            {children}
        </div>
    </div>
  )
}
