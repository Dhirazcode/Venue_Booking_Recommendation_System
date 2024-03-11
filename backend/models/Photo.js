const mongoose = require("mongoose")
const PhotoSchema = new mongoose.Schema({
    img:{
        type: String
    },
    venue_id:{
        type: String
    }
})

const PhotoModel = mongoose.model.Photo || mongoose.model("Photo",PhotoSchema)
module.exports = PhotoModel