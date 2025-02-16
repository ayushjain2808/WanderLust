const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressErrors.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {reviewSchema} = require("../schema.js");
const {validateReview} = require("../middleware.js");
const {isLoggedIn,isReviewAuthor}= require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

//CREATE REVIEW ROUTE
router.post("/",validateReview,isLoggedIn, wrapAsync(reviewController.createReview));
  
//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));
  
module.exports = router;