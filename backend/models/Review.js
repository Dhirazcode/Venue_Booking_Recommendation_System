const mongoose = require("mongoose")
const ReviewSchema = new mongoose.Schema(
  {
    review_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
        type: String,
        required: true
    },
    venue_id: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
  }
);

const ReviewModel = mongoose.model("Review", ReviewSchema);
module.exports = ReviewModel;
