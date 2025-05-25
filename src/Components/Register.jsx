import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Replace with your actual backend register URL
      const response = await axios.post("https://social-media-app-backend-zenq.onrender.com/register", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 201 || response.status === 200) {
        // Registration successful, redirect to login page
        navigate("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}

export default Register;
