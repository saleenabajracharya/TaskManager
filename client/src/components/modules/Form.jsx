import { Input } from "../Input";
import { Button } from "../Button";
import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { FaRegEye,  FaRegEyeSlash } from "react-icons/fa";

export const Form = ({ isSignInPage = true }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    ...(isSignInPage ? {} : { name: '' }),
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Data:', data);

    try {
      const res = await fetch(`http://localhost:5000/${isSignInPage ? "login" : "register"}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      console.log('result', resData);
      if (res.status === 400) {
        alert('Invalid Credentials');
      } else {
        if (resData.token && isSignInPage) {
          localStorage.setItem('user:token', resData.token);
          localStorage.setItem('user:detail', JSON.stringify(resData.user));
          navigate('/');
        } else if (!isSignInPage && res.status === 200) {
          alert('Registered successfully. Please sign in.');
          navigate('/sign-in');
        } else {
          alert(resData.message || 'Error processing request');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ overflow: 'hidden' }}>
        <div className="row">
          <div className="col-md-7 mt-5 d-none d-md-flex align-items-center justify-content-center">
            <img
              src="public/image/form_image.png"
              alt="Sign In Visual"
              className="img-fluid"
              style={{ maxHeight: '100%' }}
            />
          </div>

          <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center p-4">
            <div className="container border rounded shadow p-5 m-5 bg-light">
            <div className=" text-center mb-3 ">
              <h3 className="font-weight-bold">Welcome {isSignInPage && "Back"} to <span className="text-info">TaskPilot</span></h3>
              <p className="text-muted">{isSignInPage ? 'Sign in to get explored' : 'Sign up now to get started'}</p>
            </div>
            <form className="w-100 px-3 d-flex flex-column align-items-center justify-content-center" onSubmit={handleSubmit}>
              {!isSignInPage && (
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="mb-3 w-100 me-2"
                  value={data.name}
                  onChange={handleInputChange}
                />
              )}
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="mb-3 w-100 me-2"
                value={data.email}
                onChange={handleInputChange}
              />
              <div className="position-relative w-100 mb-4">
                <label className="form-label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="form-control pe-5" // padding-end for icon space
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

              <Button
                className="w-100 mb-3 me-2 cursor-pointer"
                label={isSignInPage ? "Sign In" : "Sign Up"}
                type="submit"
              />
              <div className="text-center font-weight-light">
                {isSignInPage
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <span
                  className="text-decoration-underline cursor-pointer text-info"
                  onClick={() =>
                    navigate(`/${isSignInPage ? "sign-up" : "sign-in"}`)
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
      </div>
  );
};
