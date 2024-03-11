const express = require("express");
const cors = require("cors");
const { registerVenue } = require("../controllers/addvenuecontrollers");

const router = express.Router();
router.use(
    cors({
        credentials: true,
        origin: ["http://localhost:5174"]
    })
)
router.get("/register_venue", registerVenue)

module.exports = router