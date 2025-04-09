import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Form = ({ isSignInPage = true }) => {
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // State to hold form data (email, password, and name for sign-up page)
  const [data, setData] = useState({
    ...(isSignInPage ? {} : { name: "" }),  
    email: "",
    password: "",
  });

  const navigate = useNavigate();  
  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle form input changes and update corresponding state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (login or registration)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send request to either 'login' or 'register' endpoint based on page type
      const res = await fetch(
        `${apiUrl}/${isSignInPage ? "login" : "register"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const resData = await res.json();  


      if (res.status === 400) {
        toast.error("Invalid Credentials");  
      } else {
        if (resData.token && isSignInPage) {

          // If login successful, store token and user details in localStorage
          localStorage.setItem("user:token", resData.token);
          localStorage.setItem("user:detail", JSON.stringify(resData.user));
          navigate("/");  
        } else if (!isSignInPage && res.status === 200) {
          toast.success("Registered successfully. Please sign in!"); 
          navigate("/sign-in");  
        } else {
          toast.error(resData.message || "Error processing request"); 
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");  
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{ overflow: "hidden" }}
    >
      <div className="row">
        {/* Image section for larger screens */}
        <div className="col-lg-7 mt-5 d-none d-lg-flex align-items-center justify-content-center">
          <img
            src="/image/form_image.png"
            alt="Sign In Visual"
            className="img-fluid"
            style={{ height: "500px" }}
          />
        </div>

        {/* Form section */}
        <div className="col-12 col-md-12 col-lg-4 d-flex flex-column justify-content-center align-items-center p-4 animate__animated custom-slide-in animate__faster">
          <div className="container border rounded shadow p-5 m-5 bg-light">
            <div className=" text-center mb-3 ">
              <h3 className="font-weight-bold">
                Welcome {isSignInPage && "Back"} to{" "}
                <span className="text-info">TaskPilot</span>
              </h3>
              <p className="text-muted">
                {isSignInPage
                  ? "Sign in to get explored"
                  : "Sign up now to get started"}
              </p>
            </div>
            
            <form
              className="w-100 px-3 d-flex flex-column align-items-center justify-content-center"
              onSubmit={handleSubmit}
            >
              
              {!isSignInPage && (
                <div className="position-relative w-100 mb-4">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your Name"
                    className="form-control pe-5"
                    value={data.name}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="position-relative w-100 mb-4">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    className="form-control pe-5"
                    value={data.email}
                    onChange={handleInputChange}
                  />
                </div>


              <div className="position-relative w-100 mb-4">
                <label className="form-label">Password</label>
                <input
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Enter your password"
                  className="form-control pe-5"
                  value={data.password}
                  onChange={handleInputChange}
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3 mt-3 text-muted"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)} 
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>

              {/* Submit button */}
              <button
                className="w-100 mb-3 me-2 cursor-pointer btn btn-info text-white" type="submit">
                  {isSignInPage ? "Sign In" : "Sign Up"}  {/* Display button text based on page */}
              </button>

              <div className="text-center font-weight-light">
                {isSignInPage
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <span
                  className="text-decoration-underline cursor-pointer text-info"
                  onClick={() =>
                    navigate(`/${isSignInPage ? "sign-up" : "sign-in"}`)  // Navigate to the other page
                  }
                  style={{ cursor: "pointer" }}
                >
                  {isSignInPage ? "Sign Up" : "Sign In"}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" 
        autoClose={1200} 
        hideProgressBar={true}  
        newestOnTop={false}
        closeOnClick                     
        closeButton={true}             
        toastClassName="custom-toast"/>
    </div>
  );
};
