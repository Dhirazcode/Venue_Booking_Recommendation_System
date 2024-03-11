import { useState, useEffect, useContext } from "react";
import axios from "axios";
import PropertyCard from "../PropertyCard/propertyCard";
import { UserContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookingPage from "../Booking/BookingPage";
import "./featured.css";


const Featured = () => {
  const [venueData, setVenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openBook, setopenBook] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/get_feature");
        setVenueData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBook = () => {
    if (user) {
      setopenBook(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <div>
        <h1 className="heading">Featured Venues</h1>
      </div>
      <div className="featured">
        {venueData.map((item, index) => (
          <div className="property-card" key={index}>
            <div className="property-image">
              <img src={`http://localhost:8888/images/${item.img}`} alt="Venue" />
            </div>
            <div className="venue-details">
              <PropertyCard venueId={item.venue_id} />
            </div>
            <div className="btn">
              <button onClick={() => handleBook()}>
                Book Now
              </button>
            </div>
            <div className="confirm-page">
              {openBook && (
                <BookingPage setOpen={setopenBook} bookvenueId={item.venue_id} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Featured;
