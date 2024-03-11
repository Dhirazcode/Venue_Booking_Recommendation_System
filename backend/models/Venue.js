const mongoose = require("mongoose");
const VenueSchema = new mongoose.Schema(
  {
    admin_id: {
      type: String,
      required: true,
    },
    venue_id: {
        type: String,
        required: true,
        unique: true,
      },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    cuisines: {
      type: [String],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    price_per_person: {
        type: Number,
        required: true,
    },
    stars: {
        type: String,
        required: true,
    }
  }
);

const VenueModel = mongoose.model("Venue", VenueSchema);
module.exports = VenueModel;