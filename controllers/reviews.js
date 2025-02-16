const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    console.log("Review request for listing ID:", req.params.id);
    console.log("Review data received:", req.body);

    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        console.log("Listing not found!");
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review successfully created:", newReview);
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async (req, res) => {
    console.log("Deleting review:", req.params.reviewId, "from listing:", req.params.id);

    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        console.log("Listing not found!");
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    await Listing.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);

    console.log("Review deleted successfully.");
    req.flash("success", "Review Deleted Successfully!!");
    res.redirect(`/listings/${req.params.id}`);
};
