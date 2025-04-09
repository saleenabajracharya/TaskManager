import React from "react";
import { Layout } from "../Layout/Layout";
import { FaUserCircle } from "react-icons/fa";

export const Profile = () => {
   // Getting the user details from local storage
  const user = JSON.parse(localStorage.getItem('user:detail'));

  return (
    <Layout>
    <div  style={{backgroundColor:"var(--secondary-color)", height:"100%"}}>
    <div className="container " >


      <h3 className="fw-bold text-center mb-3">User Profile</h3>
      <div className="card shadow-sm">
        <div className="card-body">
            <FaUserCircle className="text-info mx-auto d-block my-3" size={80} />
          <h5 className="card-title text-center">{user.name}</h5>
          <p className="card-text text-center"><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </div>
    </div>
    </Layout>
  );
};
