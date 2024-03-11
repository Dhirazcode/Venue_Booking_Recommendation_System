import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import {toast} from "react-hot-toast";
import Navbar from "../../components/navbar/Navbar";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    address: "",
    email: "",
    password: ""
  });

  // Function to generate a random user_id
  const generateUserId = () => {
    const numbers = "0123456789";
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let adminId = "";
    for (let i = 0; i < 5; i++) {
      adminId += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    for (let i = 0; i < 4; i++) {
      adminId += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return adminId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Generate user_id
    const admin_id = generateUserId();
    const { name, gender, address, email, password} = formData
    try {
      // Make POST request to your backend API to save the user data
      const response = await axios.post("/register_admin", {
        admin_id,
        name, gender, address, email, password
      });
      setFormData({});
      toast.success("Registered Sucessfully!")
      navigate("/login_admin");
     
    } catch (error) {
      if(error.response.data.error){
        toast.error(error.response.data.error)
      } 
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
    <div className="signup-nav">
    <Navbar />
    </div>
    <div className="signup-form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Owner Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Gender:
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Signup</button>
      </form>
    </div>
  </div>
);
};

export default Signup;
