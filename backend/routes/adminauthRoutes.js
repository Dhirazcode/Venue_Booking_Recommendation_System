const express = require("express");
const Venue = require("../models/Venue");
const Photo = require("../models/Photo");
const cors = require("cors");
const { registerAdmin, loginAdmin, getLogout_admin, getProfile_admin, getbookvenuelistadmin } = require("../controllers/adminauthcontrollers");
const { registerVenue, getVenue } = require("../controllers/addvenuecontrollers");


const router = express.Router();
router.use(
    cors({
        credentials: true,
        origin: ["http://localhost:5174", "http://localhost:5173","http://localhost:8888"]
    })
)

router.post("/register_admin", registerAdmin)
router.post("/register_venue", registerVenue)
router.post("/login_admin", loginAdmin)
router.get("/profile_admin", getProfile_admin)
router.get("/logout_admin", getLogout_admin)
router.get("/get_venue", getVenue)
router.get('/bookvenuelistadmin', getbookvenuelistadmin)

const multer = require("multer")
const path = require("path")
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public/images")
    },
    filename: (req, file, cb) =>{
        cb(null,file.fieldname + "_"+Date.now()+path.extname(file.originalname))
    }
})
const upload = multer({
    storage:storage
})
router.post("/upload", upload.single("file"), async (req,res) =>{
    const id = req.query.param;
    const venue = await Venue.findOne({admin_id:id});
    console.log(venue)
    const venue_id = venue.venue_id;
    try {
        await Photo.create({
            img: req.file.filename,
            venue_id: venue_id
        })
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router