import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "../../context/AuthContext";
import './Bookedlist.css';
import Navbar from "../../components/navbar/Navbar"
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
import GiveStar from '../../components/GiveStar/GiveStar';

const BookedList = () => {
    const [bookings, setBookings] = useState([]);
    const [openBook, setopenBook] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const param = user?.user_id;

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`/bookvenuelistuser?param=${param}`);
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [param]);

    const handleReview = () => {
        if (user) {
            setopenBook(true);
        } else {
            navigate("/login");
        }
    };

    const handleCancel = async (bookId) => {
        try {
            await axios.post('/cancelbooked', { bookId });
            toast.success("Cancelled Sucessfully!")
            navigate("/")
        } catch (error) {
            console.error('Error while Cancelling:', error);
        }
    };

    return (
        <div>
            <Navbar />
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
                                <td>
                                    <button onClick={() => handleCancel(booking._id)}>
                                        Cancel
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleReview()}>
                                        Give Review
                                    </button>
                                </td>
                                {openBook && (
                                    <GiveStar setOpen={setopenBook} bookId={booking._id} />
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookedList;
