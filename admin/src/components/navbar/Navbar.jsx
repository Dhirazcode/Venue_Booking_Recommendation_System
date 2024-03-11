import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AdminContext } from "../../context/adminAuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Navbar = () => {
  const { admin } = useContext(AdminContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      const response = await axios.get("/logout_admin");
      toast.success("logout Sucessfully!")
      navigate("/")
    } catch (error) {
      if (error.response.data.error) {
        toast.error(error.response.data.error)
      }
    }
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">VenueNow Admin Dash</span>
        </Link>
        {admin ? (
          <>
            <button className="navButton" onClick={() => setShowDropdown(!showDropdown)}>
              Account
              <i className={`fas ${showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </button>
            {showDropdown && (
              <div className="dropdownMenu">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <button className="dropdownItem">Dashboard</button>
                </Link>
                <Link to="/add_venue" style={{ textDecoration: "none" }}>
                  <button className="dropdownItem">Add Venue</button>
                </Link>
                <button className="dropdownItem" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </>

        ) : (
          <div className="navItems">
            <Link to="/signup_admin" style={{ textDecoration: "none" }}>
              <button className="navButton">Sign Up?</button>
            </Link>
            <Link to="/login_admin" style={{ textDecoration: "none" }}>
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
