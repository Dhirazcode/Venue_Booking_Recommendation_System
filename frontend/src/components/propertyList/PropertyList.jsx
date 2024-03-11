import { useState, useEffect, useContext } from "react";
import axios from "axios";
import PropertyCard from "../PropertyCard/propertyCard";
import { UserContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookingPage from "../Booking/BookingPage";
import "./propertyList.css";


const Featured = () => {
  const [venueData, setVenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openBook, setopenBook] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const param = user?.user_id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/get_venue_data/${param}`);
        console.log(response.data);
        const venueResponse = await axios.get("/get_recommend", {
          params: { venueData: JSON.stringify(response.data) }
        });
        setVenueData(venueResponse.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [param]);

  const handleBook = () => {
    if (user) {
      setopenBook(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
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
      )}
    </div>
  );
}

export default Featured;
