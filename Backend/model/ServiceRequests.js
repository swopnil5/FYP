const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    careseeker: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Sender not found"],
    },
    caretaker: {
      type: mongoose.Types.ObjectId,
      ref: "Profile",
      required: [true, "Caretaker not found"],
    },
    requestorName: {
      type: String,
      required: [true, "Name not found"],
    },
    serviceType: {
      type: String,
    },
    serviceOf: {
      type: String,
      enum: ["dog", "cat", "fish"],
    },
    pickUpDate: {
      type: String,
    },
    dropOffDate: {
      type: String,
    },
    status: {
      type: String,
      enum: ["requested", "payment-confirmed", "accepted", "rejected", "completed", "cancelled"],
      default: "requested",
    },

    khaltiData: {
      payment_url: String,
      return_url: String,
      pidx: String,
      amountInRs: Number,
      website_url: String,
      payment_url_expiry: Date,
    },
    payoutStatus: {
      type: String,
      enum: ["pending", "held", "released", "refunded"],
      default: "pending",
    },
    paymentReleaseDate: {
      type: Date,
    },
    complaintFiled: {
      type: Boolean,
      default: false,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    caretakerEarnings: {
      type: Number,
      default: 0,
    },
    review: {
      type: mongoose.Types.ObjectId,
      ref: "Rating",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
