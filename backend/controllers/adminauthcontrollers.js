const Owner = require("../models/Owner");
const Venue = require("../models/Venue")
const BookedVenue = require('../models/Bookedvenue');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerAdmin = async (req, res) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const Name = req.body.name;
      const hasSpace = /\s/.test(Name);
      if(!Name){
        return res.status(400).json({
          error: "name is required!"
        })
      }
      if(!hasSpace){
        return res.status(400).json({
          error: "Invalid Name! Fill as: Firstname Surname"
        })
      }
      
      const Email = req.body.email;
      const exist = await Owner.findOne({email:Email});
      if(exist){
        return res.status(400).json({
          error: "email is already registered!"
        })
      }
      Password = req.body.password;
      if(!Password || Password.length <8){
        return res.status(400).json({
          error: "password must be at least 6 characters long!"
        })
      }
      const newowner = await Owner.create({
        ...req.body,
        password: hash,
      });
      return res.json(newowner);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

const loginAdmin = async (req, res) =>{
  try {
    const { email, password} = req.body;
    const admin = await Owner.findOne({email:email});
    if(!admin){
      return res.status(400).json({
        error: "Invalid email or password!"
      })
    }
    const match = await bcrypt.compare(password, admin.password)
    if(match){
      jwt.sign({email:admin.email, admin_id: admin.admin_id, name:admin.name}, process.env.JWT_SECERT, {}, (err, token) =>{
       if(err) throw err;
       res.cookie("token", token).json(admin);
      } )
    }
    if(!match){
      return res.status(400).json({
        error: "Invalid eamil or password!"
      })
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
  };
const getProfile_admin = (req, res) =>{
const {token} = req.cookies
if(token){
  jwt.verify(token, process.env.JWT_SECERT, {}, (err, admin) =>{
    if(err) throw err;
    res.json(admin)
  })
} else {
  res.json(null)
}
}

const getLogout_admin = (req, res) =>{
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    res.status(201).json({
      message: "Logout sucessfully",
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: "Error Occured",
      success: false,
    })
  }
}

const getbookvenuelistadmin = async (req, res) => {
  const id = req.query.param;
  try {
    const id = req.query.param;
    const venues = await Venue.find({ admin_id: id });
    const venueIds = venues.map(venue => venue.venue_id);
    const book = await BookedVenue.find({ bookvenueId: { $in: venueIds } })
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
    registerAdmin,
    loginAdmin,
    getProfile_admin,
    getLogout_admin,
    getbookvenuelistadmin 
}