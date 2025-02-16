const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingControlller = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



router.get("/",wrapAsync(listingControlller.index));
  
  
//Create Route
router.get("/new",isLoggedIn,wrapAsync(listingControlller.renderNewForm));
  
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingControlller.createListings));
  
//Show Route
router.get("/:id",wrapAsync(listingControlller.showListings));
  
//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControlller.renderEditForm));
  
router.put("/:id", isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingControlller.editListings))
  
 
//DELETE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingControlller.destroyListings));
  
module.exports = router;