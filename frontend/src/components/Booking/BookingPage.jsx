import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faCalendarDays, faPerson } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { UserContext } from "../../context/AuthContext";
import axios from "axios";
import "../header/Header";
import { toast } from "react-hot-toast";
import "./BookingPage.css";

const BookingPage = ({ setOpen, bookvenueId }) => {
  const [openDate, setOpenDate] = useState(false);
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleBook = async () => {
    const data = {
      user_id: user.user_id,
      bookvenueId: bookvenueId,
      startDate: dates[0].startDate.toISOString().split('T')[0],
      endDate: dates[0].endDate.toISOString().split('T')[0],
      adult: options.adult,
      children: options.children,
      eventType: eventType
    };
    try {
      await axios.post('/confirm', data);
      setDates([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
      setOptions({
        adult: 1,
        children: 0,
      });
      setEventType('');
      toast.success("Venue Booked Successfully!");
      handleClose();
    } catch (error) {
      if (error.response.data.error) {
        toast.error(error.response.data.error)
      }
    }
  };

  return (
    <div>
      <div>
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <h2>Booking Page</h2>
      <div className="date-wrapper">
        <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
        <span
          onClick={() => setOpenDate(!openDate)}
          className="headerSearchText"
        >
          {`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
            dates[0].endDate,
            "MM/dd/yyyy"
          )}`}
        </span>
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
        <div>
          <button onClick={handleBook}>
            Confirm
          </button>
        </div>
        {eventType && (
          <span className="headerSearchText">{eventType}</span>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
