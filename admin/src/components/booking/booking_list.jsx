import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from "../../context/adminAuthContext";
import './booking_list.css'; // Import CSS file for styling

const BookedList = () => {
    const [bookings, setBookings] = useState([]);
    const { admin } = useContext(AdminContext);
    const param = admin?.admin_id;

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Fetch booked list data from the backend based on the user ID
                const response = await axios.get(`/bookvenuelistadmin?param=${param}`);
                setBookings(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [param]);

    return (
        <div className="booked-list-container">
            <h2>Booked List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Adults</th>
                        <th>Children</th>
                        <th>Event Type</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking._id}>
                            <td>{booking._id}</td>
                            <td>{booking.startDate}</td>
                            <td>{booking.endDate}</td>
                            <td>{booking.adult}</td>
                            <td>{booking.children}</td>
                            <td>{booking.eventType}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookedList;
