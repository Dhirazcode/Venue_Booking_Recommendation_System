const User = require("../models/User");
const Venue = require("../models/Venue")
const BookedVenue = require('../models/Bookedvenue');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const Name = req.body.name;
    const hasSpace = /\s/.test(Name);
    if (!Name) {
      return res.status(400).json({
        error: "name is required!"
      })
    }
    if (!hasSpace) {
      return res.status(400).json({
        error: "Invalid Name! Fill as: Firstname Surname"
      })
    }
    const Email = req.body.email;
    const exist = await User.findOne({ email: Email });
    if (exist) {
      return res.status(400).json({
        error: "email is already registered!"
      })
    }
    Password = req.body.password;
    if (!Password || Password.length < 8) {
      return res.status(400).json({
        error: "password must be at least 6 characters long!"
      })
    }

    const newUser = await User.create({
      ...req.body,
      password: hash,
    });
    return res.json(newUser);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password!"
      })
    }
    const match = await bcrypt.compare(password, user.password)
    if (match) {
      jwt.sign({ email: user.email, user_id: user.user_id, name: user.name }, process.env.JWT_SECERT, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json(user);
      })
    }
    if (!match) {
      return res.status(400).json({
        error: "Invalid eamil or password!"
      })
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getProfile = (req, res) => {
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, process.env.JWT_SECERT, {}, (err, user) => {
      if (err) throw err;
      res.json(user)
    })
  } else {
    res.json(null)
  }
}

const getLogout = (req, res) => {
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

const getVenue = async (req, res) => {
  const id = req.query.param;
  try {
    const venues = await Venue.findOne({ venue_id: id });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getVenuelist = async (req, res) => {
  try {
    const venuelist = await Venue.find().select('venue_id');
    res.json(venuelist);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getbookvenuelistuser = async (req, res) => {
  const id = req.query.param;
  try {
    const venues = await BookedVenue.find({ user_id: id });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getLogout,
  getVenue,
  getVenuelist,
  getbookvenuelistuser
}