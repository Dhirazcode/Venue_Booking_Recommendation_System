import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext, useState} from "react";
import { UserContext } from "../../context/AuthContext";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Navbar = () => {
  const { user } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      // Send a request to the server to clear the token
      const response = await axios.get("/logout");
      toast.success("logout Sucessfully!")
       navigate("/")
    } catch (error) {
      if(error.response.data.error){
        toast.error(error.response.data.error)
      }
    }
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">VenueNow</span>
        </Link>
        {user ? (
            <>
              {/* Display Account button when user is logged in */}
              <button className="navButton" onClick={() => setShowDropdown(!showDropdown)}>
              <FontAwesomeIcon icon={faUser} />
              </button>
              {/* Dropdown menu */}
              {showDropdown && (
                <div className="dropdownMenu">
                  <Link to="/viewbooked" style={{ textDecoration: "none" }}>
                    <button className="dropdownItem">View Booked</button>
                  </Link>
                  <button className="dropdownItem" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </>
          )  : (
          <div className="navItems">
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button className="navButton">Sign Up?</button>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
