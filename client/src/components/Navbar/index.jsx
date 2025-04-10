import React, {useState} from 'react';
import { FiSearch } from "react-icons/fi";
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchQuery, clearSearchQuery } from '../../redux/SearchSlice';

export const Navbar = () => {
  const navigate = useNavigate();  
  const dispatch = useDispatch(); 
  
    // Handling changes in the search input
    const handleSearchChange = (e) => {
      dispatch(setSearchQuery(e.target.value));  // Dispatch action to update search query
    };
    
    // Function to log out the user
    const logout = () => {
        localStorage.clear('users');  
        navigate("/sign-in");  
    }

    // Fetching user details from local storage
    const user = JSON.parse(localStorage.getItem('user:detail')); 
    
  return (
    <>
         <nav className="navbar border-0 w-100 px-3 " style={{backgroundColor:"var(--secondary-color)", position:"sticky"}}>
         <Link className="navbar-brand fw-bold fs-2 mx-3 text-info" to="/" onClick={() => dispatch(clearSearchQuery())}>TaskPilot</Link>
      <form className="d-flex my-2 my-lg-0 mx-2">
      <div className="input-group rounded-pill border px-3 py-2 bg-white">
      <span className="input-group-text bg-transparent border-0 p-0 pe-2">
        <FiSearch className="text-muted" size={18} />
      </span>
      <input
        type="text"
        className="form-control border-0 shadow-none p-0"
        placeholder="Search..." onChange={handleSearchChange}

      />
      <span className="input-group-text bg-transparent border-0 p-0 ps-2">
      </span>
    </div>
      </form>
      <div className="dropdown me-3 border rounded" style={{cursor:"pointer"}}>
        <button className="btn  dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {user?.name}
        </button>
        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <Link to="/profile" className="dropdown-item">Profile</Link>
            <a className="dropdown-item" href="#" onClick={logout} >Logout</a>
        </div>
        </div>

    </nav>
    </>
  );
}