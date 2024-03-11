import {
  faBed,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import { useContext, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import PropertyCard from "../PropertyCard/propertyCard";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";
import axios from "axios";

const Header = ({ type }) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const navigate = useNavigate();
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
  });

  const [eventType, setEventType] = useState('');
  const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] = useState(false);
  const { user } = useContext(UserContext);
  const [venueData, setVenueData] = useState([]);
  const [openBook, setopenBook] = useState(false);


  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const handleEventTypeSelect = (selectedEventType) => {
    setEventType(selectedEventType);
    setIsEventTypeDropdownOpen(false);
  };

  const handleSearch = async() => {
    const searchQuery = {
      destination,
      startDate: format(dates[0].startDate, "MM/dd/yyyy"),
      endDate: format(dates[0].endDate, "MM/dd/yyyy"),
      adult: options.adult,
      children: options.children,
      eventType
    };

    const queryParams = new URLSearchParams(searchQuery).toString();
    const response = await axios.get(`/search?${queryParams}`);
    setVenueData(response.data);
  };

  const handleBook = () => {
    if (user) {
      setopenBook(true);
    } else {
      navigate("/login");
    }
  };


  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        {type !== "list" && (
          <>
            <h1 className="headerTitle">
              Unlock unforgettable memories at our stunning venue - book now to secure your dream event!
            </h1>
            {!user && <button className="headerBtn">Book Now</button>}
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="headerSearchInput"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="headerSearchText"
                >{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                  dates[0].endDate,
                  "MM/dd/yyyy"
                )}`}</span>
                {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDates([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dates}
                    className="date"
                    minDate={new Date()}
                  />
                )}
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="headerSearchText"
                >{`${options.adult} adult · ${options.children} children`}</span>
                {openOptions && (
                  <div className="options">
                    <div className="optionItem">
                      <span className="optionText">Adult</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.adult <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.adult}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Children</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.children <= 0}
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.children}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="headerSearchItem">
                <div className="dropdown" onClick={() => setIsEventTypeDropdownOpen(!isEventTypeDropdownOpen)}>
                  <button className="dropbtn">Event Type</button>
                  {isEventTypeDropdownOpen && (
                    <div className="dropdown-content">
                      <span onClick={() => handleEventTypeSelect('Wedding')}>Wedding</span>
                      <span onClick={() => handleEventTypeSelect('Birthday')}>Birthday</span>
                      <span onClick={() => handleEventTypeSelect('Business Meeting')}>Business Meeting</span>
                      <span onClick={() => handleEventTypeSelect('Organization Seminar')}>Organization Seminar</span>
                      <span onClick={() => handleEventTypeSelect('Other Ceremony')}>Other Ceremony</span>
                    </div>
                  )}
                </div>
                {eventType && (
                  <span className="headerSearchText">{eventType}</span>
                )}
              </div>
              <div className="headerSearchItem">
                <button className="headerBtn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </>
        )}
        {venueData.map((item, index) => (
        <div className="property-card" key={index}>
          <div className="property-image">
            <img src={`http://localhost:8888/images/${item.img}`} alt="Venue" />
          </div>
          <div>
            <PropertyCard venueId={item.venue_id} />
          </div>
          <div>
            <button onClick={() => handleBook()}>
              Book Now
            </button>
          </div>
          {openBook && (
            <BookingPage setOpen={setopenBook} bookvenueId={item.venue_id} />
          )}
        </div>
      ))}
      {venueData.map((item, index) => (
        <div className="property-card" key={index}>
          <div className="property-image">
            <img src={`http://localhost:8888/images/${item.img}`} alt="Venue" />
          </div>
          <div>
            <PropertyCard venueId={item.venue_id} />
          </div>
          <div>
            <button onClick={() => handleBook()}>
              Book Now
            </button>
          </div>
          {openBook && (
            <BookingPage setOpen={setopenBook} bookvenueId={item.venue_id} />
          )}
        </div>
      ))}
      </div>
    </div>
  );
};

export default Header;
