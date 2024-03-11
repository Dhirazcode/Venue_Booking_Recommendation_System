import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
import './GiveStar.css';

const GiveStar = ({ bookId }) => {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/submitRating', { rating, bookId });
      setRating(0);
      toast.success("Review submitted Sucessfully!")
      navigate("/")
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <label key={value}>
          <input
            type="radio"
            name="rating"
            value={value}
            onClick={() => handleStarClick(value)}
          />
          <span className="star-number">{value}</span>
        </label>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default GiveStar;
