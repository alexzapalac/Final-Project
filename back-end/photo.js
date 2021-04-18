const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 50000000
  }
});

//Import User Model
const users = require("./users.js");
const User = users.model;
const validUser = users.valid;


//------------------------------------------------
//Define Photo Schema and Model

const photoSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    path: String,
    make: String,
    model: String,
    color: String,
    year: String,
    created: {
      type: Date,
      default: Date.now
    },
});
  
const Photo = mongoose.model('Photo', photoSchema);

// upload photo
router.post("/", validUser, upload.single('photo'), async (req, res) => {
  console.log("Here");
    // check parameters
    if (!req.file)
      return res.status(400).send({
        message: "Must upload a file."
      });
  
    const photo = new Photo({
      user: req.user,
      path: "/images/" + req.file.filename,
      make: req.body.make,
      model: req.body.model,
      color: req.body.color,
      year: req.body.year,
    });
    try {
      await photo.save();
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: "Photo"
  },
  text: String,
  created: {
    type: Date,
    default: Date.now
  },
});

const Comment = mongoose.model('Comment', commentSchema);

// get my photos
router.get("/", validUser, async (req, res) => {
    // return photos
    try {
      let photos = await Photo.find({
        user: req.user
      }).sort({
        created: -1
      }).populate('user');
      return res.send(photos);
    } catch (error) {
      //console.log(error);
      //return res.sendStatus(500);
    }
});


// get all photos
router.get("/all", async (req, res) => {
    try {
      let photos = await Photo.find().sort({
        created: -1
      }).populate('user');
      return res.send(photos);
    } catch (error) {
      //console.log(error);
      //return res.sendStatus(500);
    }
});


//Get a photo
router.get('/:photoID', async(req,res) => {
  try {
    let photo = await Photo.findOne({_id:req.params.photoID})
    if (!photo) {
      res.sendStatus(404);
      return;
    }
    res.send(photo);
  } catch(error) {
    //console.log(error);
    //res.sendStatus(500);
  }
});  

//add comment to photo
router.post("/:id", validUser, async (req, res) => {
  try {
    let photo = await Photo.findOne({_id: req.params.id
    }).sort({
      created: -1
    }).populate('user');
    let comment = new Comment({
      text: req.body.text,
      user: req.user,
      photo: photo,
    });
    await comment.save();
    return res.sendStatus(200);
  } catch(error){
    //console.log(error);
    //return res.sendStatus(500);
  }
});

//get Comments for specific photo
router.get("/:id/comments", async (req, res) => {
  try {
    let photo = await Photo.findOne({
      _id: req.params.id
    }).sort({
      created: -1
    }).populate('user');
    let comments = await Comment.find({
      photo: photo,
    }).sort({
      created: -1
    }).populate('user');
    return res.send(comments);
  } catch(error) {
    //console.log(error);
    //return res.sendStatus(500);
  }
});


module.exports = {
    model: Photo,
    model: Comment,
    routes: router,
}
