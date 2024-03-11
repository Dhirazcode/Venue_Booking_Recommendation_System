import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Add_venue.css"; // Import the CSS file for styling
import { toast } from "react-hot-toast";
import Navbar from "../../components/navbar/Navbar";
import { AdminContext } from "../../context/adminAuthContext";
import { useContext } from "react";

const AddVenue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cuisines: [],
    capacity: "",
    price_per_person: "",
    stars: ""
  });
  const { admin } = useContext(AdminContext);

  const generateVenueId = () => {
    const numbers = "0123456789";
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let venueId = "";
    for (let i = 0; i < 5; i++) {
      venueId += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    for (let i = 0; i < 4; i++) {
      venueId += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return venueId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const venue_id = generateVenueId();
    const admin_id = admin.admin_id;
    const { name, address, cuisines, capacity, price_per_person, stars } = formData;
    try {
      const response = await axios.post("/register_venue", {
        admin_id,
        venue_id,
        name,
        address,
        cuisines,
        capacity,
        price_per_person,
        stars
      });
      setFormData({});
      toast.success("Venue Registered Successfully!");
      navigate("/");
    } catch (error) {
      if (error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "cuisines") {
      const selectedCuisines = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: selectedCuisines
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="addvenue-container">
        <h2>Add Venue</h2>
        <form onSubmit={handleSubmit} className="addvenue-form">
          <label>
            Venue Name:
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
            Cuisines:
            <select
              name="cuisines"
              value={formData.cuisines}
              onChange={handleChange}
              multiple={true}
              required
            >
              <option value="Italian">Italian Cuisine</option>
              <option value="Indian">Indian Cuisine</option>
              <option value="Chinese">Chinese Cuisine</option>
              <option value="Mexican">Mexican Cuisine</option>
              <option value="Nepali">Nepali Cuisine</option>
              <option value="International">International Cuisine</option>
              <option value="Continental">Continental Cuisine</option>
              <option value="Western">Western Fast Food</option>
              <option value="Fusion">International Fusion</option>
            </select>
          </label>
          <br />
          <label>
            Capacity:
            <input
              type="text"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Price Per Person:
            <input
              type="text"
              name="price_per_person"
              value={formData.price_per_person}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Stars:
            <input
              type="text"
              name="stars"
              value={formData.stars}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <button type="submit">Add Venue</button>
        </form>
      </div>
    </div>
  );
};

export default AddVenue;
