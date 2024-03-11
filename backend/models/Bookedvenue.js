const mongoose = require('mongoose');

// Define the schema for the Review model
const bookSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    bookvenueId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    adult: { type: Number, required: true },
    children: { type: Number, required: true },
    eventType: { type: String, required: true }
});

// Create the Review model
const Bookedvenue = mongoose.model('BookedVenue', bookSchema);

module.exports = Bookedvenue;
