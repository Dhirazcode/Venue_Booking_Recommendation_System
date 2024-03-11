const express = require("express");
const cors = require("cors");
const { registerUser, loginUser, getLogout, getProfile, getVenue, getVenuelist, getbookvenuelistuser } = require("../controllers/authcontrollers");
const Venue = require("../models/Venue");
const Photo = require("../models/Photo")
const BookedVenue = require('../models/Bookedvenue');
const Review = require('../models/Review')
const router = express.Router();
router.use(
    cors({
        credentials: true,
        origin: ["http://localhost:5173", "http://localhost:5174"]
    })
)

router.post("/register", registerUser)

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", getProfile)
router.get("/logout", getLogout)
router.get("/get_venuefuser", getVenue)
router.get("/get_venuelist", getVenuelist)
router.get('/bookvenuelistuser', getbookvenuelistuser)

router.get('/search', async (req, res) => {
    try {
        const { destination, startDate, endDate, adult, children, eventType } = req.query;
        const dest = destination;
        const guest = parseInt(adult) + parseInt(children);
        let searchResults = await Venue.find({
            address: { $regex: new RegExp(dest, "i") }
        });
        
        searchResults = searchResults.filter(venue => venue.capacity >= guest);
        const venueIds = searchResults.map(venue => venue.venue_id);
        let images = [];
        for (const venueId of venueIds) {
            const venueImages = await Photo.find({ venue_id: venueId });
            images = images.concat(venueImages);
        }
        res.status(200).json(images);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get_feature', async (req, res) => {
    try {
        let images = await Photo.find().sort({ stars: -1 }).limit(4);
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get_recommend', async (req, res) => {
    try {
        const venueData = JSON.parse(req.query.venueData);
        let images = [];
        for (const venueId of venueData) {
            const photos = await Photo.find({ venue_id: venueId }); 
            images.push(...photos);
        }
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.post('/confirm', async (req, res) => {
    try {
        const { user_id, bookvenueId, startDate, endDate, adult, children, eventType } = req.body;
        const review = new BookedVenue({
            user_id,
            bookvenueId,
            startDate,
            endDate,
            adult,
            children,
            eventType
        });
        await review.save();
        res.status(200).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/submitRating', async (req, res) => {
    try {
        const { rating, bookId } = req.body;
        const booked = await BookedVenue.findOne({ _id: bookId });
        console.log(bookId)
        
        const generateReviewId = () => {
            const numbers = "0123456789";
            const letters = "abcdefghijklmnopqrstuvwxyz";
            let userId = "";
            for (let i = 0; i < 5; i++) {
              userId += numbers.charAt(Math.floor(Math.random() * numbers.length));
            }
            for (let i = 0; i < 5; i++) {
              userId += letters.charAt(Math.floor(Math.random() * letters.length));
            }
            return userId;
          };
       const  reviewId= generateReviewId();
       const currentDate = new Date();
       const currentYear = currentDate.getFullYear();
        if (!booked) {
            return res.status(404).json({ error: 'Booked item not found' });
        }
        const review = new Review({
            review_id: reviewId,
            user_id: booked.user_id,
            venue_id: booked.bookvenueId,
            stars: rating,
            year: currentYear
        });
        await review.save();

        const dlt = await BookedVenue.deleteOne({ _id: bookId });
        res.status(201).json({ message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/cancelbooked', async (req, res) => {
    try {
        const { bookId } = req.body;
        const booked = await BookedVenue.findOne({ _id: bookId });
        
       if (!booked) {
            return res.status(404).json({ error: 'Booked item not found' });
        }
        const dlt = await BookedVenue.deleteOne({ _id: bookId });
        res.status(201).json({ message: 'Booked Canceled successfully' });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router