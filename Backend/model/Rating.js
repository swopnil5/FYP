const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    caretaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    stars: {
        type: Number,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", RatingSchema);
