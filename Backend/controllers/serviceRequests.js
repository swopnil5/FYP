const axios = require("axios");
require("dotenv").config();
const nodemailer = require("nodemailer");
const Profile = require("../model/Profile");
const User = require("../model/User");
const Service = require("../model/ServiceRequests");
const { initiateKhaltiPayment } = require("./khaltiService");

const requestService = async (req, res) => {
  const requestor = req.user._id;
  const requestedFrom = req.params.id;

  const validCaretaker = await Profile.find({ _id: requestedFrom });
  if (!validCaretaker || validCaretaker.length === 0) {
    return res.status(404).json({ message: "Such caretaker doesn't exist" });
  }

  const validRequestor = await User.findOne({ _id: requestor });
  if (!validRequestor || validRequestor.length === 0) {
    return res
      .status(404)
      .json({ message: "Something is wrong. Most likely Login Error" });
  }
  if (validRequestor.role !== "careseeker") {
    return res.status(400).json({ message: "Please login as a careseeker" });
  }

  if (!req.body.pickUpDate || !req.body.dropOffDate) {
    return res.status(400).json({ message: "Please provide pick up and drop off date" });
  }

  const requestorName = validRequestor.name;
  const serviceDetails = new Service({
    careseeker: requestor,
    requestorName: requestorName,
    caretaker: requestedFrom,
    serviceType: req.body.serviceType,
    serviceOf: req.body.serviceOf,
    pickUpDate: req.body.pickUpDate,
    dropOffDate: req.body.dropOffDate,
  });

  let khaltiResponse;
  const browserBaseUrl = req.headers?.origin;

  let backendBaseUrl = process.env.BACKEND_URL;

  const pickUpDate = new Date(req.body.pickUpDate);
  const dropOffDate = new Date(req.body.dropOffDate);
  let dateDifferenceInDays = Math.ceil((dropOffDate - pickUpDate) / (1000 * 60 * 60 * 24));

  // Ensure at least 1 day if same day or dates are provided
  if (dateDifferenceInDays <= 0) dateDifferenceInDays = 1;

  let totalAmount = dateDifferenceInDays * validCaretaker[0].rate;

  // Khalti minimum amount is 10 Rupees (1000 paisa)
  if (totalAmount < 10) {
    totalAmount = 10;
  }

  let khaltiPayload = {
    return_url: backendBaseUrl + "/api/v1/khaltiverify",
    website_url: browserBaseUrl,
    amountInRs: totalAmount,
    purchase_order_id: serviceDetails._id,
    purchase_order_name: `${serviceDetails.serviceType} service from ${requestorName}`,
    customer_info: {
      name: requestorName,
      email: validRequestor.email,
    }
  };
  try {
    khaltiResponse = await initiateKhaltiPayment(khaltiPayload);
    console.log("KHALLTI RESPONSE::", khaltiResponse);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error in initiating khalti payment" });
  }



  serviceDetails.khaltiData = {
    return_url: khaltiPayload.return_url,
    website_url: khaltiPayload.website_url,
    amountInRs: khaltiPayload.amountInRs,
    pidx: khaltiResponse?.pidx,
    payment_url: khaltiResponse?.payment_url,
    payment_url_expiry: new Date(khaltiResponse?.expires_at),
  };

  await serviceDetails.save();

  return res.status(200).json({ serviceDetails, khaltiResponse });
};

//for caretakers to view the requests they received
const myRequests = async (req, res) => {
  if (req.user?.role === "careseeker") {
    // return the requests made by the careseeker
    const userId = req.user._id;
    const requests = await Service.find({ careseeker: userId })
      .populate("review")
      .populate("caretaker", "username email contact");
    return res.status(200).json(requests);

  }
  const userId = req.user._id;

  const userProfile = await Profile.findOne({
    $or: [
      { profileOf: userId },
      { email: req.user?.email }
    ]
  });

  const requests = await Service.find({
    caretaker: userProfile._id,
  })
    .populate("review")
    .populate("caretaker", "username email contact");
  return res.status(200).json(requests);
};

const CareseekerRequests = async (req, res) => {

  const userId = req.user.userId;

  const requests = await Service.find({
    $and: [{ careseeker: userId }, { status: "requested" }],
  })
    .populate("review")
    .populate("caretaker", "username email contact");
  if (!requests || requests.length === 0) {
    return res
      .status(404)
      .json({ message: "You haven't requested any services yet." });
  } else {
    return res.status(200).json(requests);
  }
};

const acceptRequest = async (req, res) => {
  const serviceId = req.params.id;
  const update = { status: "accepted" };
  const validityCheck = await Service.findOne({ _id: serviceId });
  if (!validityCheck || validityCheck === 0) {
    return res
      .status(404)
      .json({ message: "The service request doesn't exist" });
  }
  if (validityCheck.status === "accepted") {
    return res.status(400).json({ message: "The request is already accepted" });
  }

  const caretakerProfile = await Profile.findOne({
    $or: [
      { profileOf: req.user._id },
      { email: req.user?.email }
    ]
  });

  if (!caretakerProfile || caretakerProfile.length === 0) {
    return res.status(404).json({ message: "You don't have a profile" });
  }

  if (caretakerProfile.verificationStatus !== "verified") {
    return res.status(400).json({
      message: "You need to be verified by admin to accept service requests",
    });
  }

  const updateService = await Service.findOneAndUpdate(
    { _id: serviceId },
    update,
    { new: true, runValidators: true }
  );

  const serviceOf = updateService.careseeker;
  const careseeker = await User.find({ _id: serviceOf });

  if (!careseeker) {
    return res.status(400).json({ message: "The careseeker was not found" });
  }
  const careseekerEmail = careseeker[0].email;
  const careseekerName = careseeker[0].name;

  const caretakersId = req.user._id;
  const caretakerEmail = req.user.email;
  const caretaker = await Profile.find({ $or: [{ profileOf: caretakersId }, { email: caretakerEmail }] });
  const caretakerName = caretaker[0]?.name;
  const caretakerNumber = caretaker[0].contact;
  let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: careseekerEmail,
    subject: "About Service Request",
    text: `Dear ${careseekerName} your service request has been accepted by ${caretakerName}. 
    Please contact ${caretakerNumber} for further verification. 
    Thank You.`,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent :" + info.response);
    }
  });
  return res.status(200).json({ updateService });
};

const rejectRequest = async (req, res) => {
  const serviceId = req.params.id;
  const update = { status: "rejected" };
  const validityCheck = await Service.findOne({ _id: serviceId });

  if (!validityCheck || validityCheck === 0) {
    return res
      .status(404)
      .json({ message: "The service request doesn't exist" });
  }
  if (validityCheck.status === "rejected") {
    return res.status(400).json({ message: "The request is already rejected" });
  }
  const caretakerProfile = await Profile.findOne({
    $or: [
      { profileOf: req.user._id },
      { email: req.user?.email }
    ]
  });

  if (!caretakerProfile || caretakerProfile.length === 0) {
    return res.status(404).json({ message: "You don't have a profile" });
  }

  if (caretakerProfile.verificationStatus !== "verified") {
    return res.status(400).json({
      message: "You need to be verified by admin to reject service requests",
    });
  }
  const updateService = await Service.findOneAndUpdate(
    { _id: serviceId },
    update,
    { new: true, runValidators: true }
  );
  const serviceOf = updateService.careseeker;

  const careseeker = await User.find({ _id: serviceOf });

  if (!careseeker) {
    return res.status(400).json({ message: "The careseeker was not found" });
  }
  const careseekerEmail = careseeker[0].email;
  const careseekerName = careseeker[0].name;
  console.log(careseekerEmail);

  const caretakersId = req.user.userId;
  const caretaker = await Profile.find({ profileOf: caretakersId });
  const caretakerName = caretaker[0].name;
  let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: careseekerEmail,
    subject: "About Service Request",
    text: `Dear ${careseekerName} your service request has been rejected by ${caretakerName}. 
    Please make another service request. 
    Sorry for the inconvenicence and
    Thank You for understanding.`,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent :" + info.response);
    }
  });
  return res.status(200).json({ updateService });
};

//accepted requests
const acceptedRequests = async (req, res) => {
  const userId = req.user._id;
  if (req.user?.role === "careseeker") {
    // return the requests made by the careseeker
    const requests = await Service.find({ careseeker: userId, status: "accepted" })
      .populate("review")
      .populate("caretaker", "username email contact");
    return res.status(200).json(requests);
  }
  const userProfile = await Profile.findOne({
    $or: [
      { profileOf: userId },
      { email: req.user?.email }
    ]
  });
  if (!userProfile || userProfile.length === 0) {
    return res.status(404).json({ message: "You don't have a profile" });
  }
  const profileId = userProfile._id;

  const requests = await Service.find({
    caretaker: profileId,
    status: { $in: ["accepted", "payment-confirmed"] },
  })
    .populate("review")
    .populate("caretaker", "username email contact");
  return res.status(200).json(requests);
};

//rejected requests
const rejectedRequests = async (req, res) => {
  const userId = req.user.userId;
  if (req.user?.role === "careseeker") {
    // return the requests made by the careseeker
    const requests = await Service.find({ careseeker: userId, status: "rejected" })
      .populate("review")
      .populate("caretaker", "username email contact");
    return res.status(200).json(requests);
  }
  const userProfile = await Profile.findOne({
    $or: [
      { profileOf: userId },
      { email: req.user?.email }
    ]
  });
  if (!userProfile || userProfile.length === 0) {
    return res.status(404).json({ message: "You don't have a profile" });
  }
  const profileId = userProfile._id;

  const requests = await Service.find({
    $and: [{ caretaker: profileId }, { status: "rejected" }],
  })
    .populate("review")
    .populate("caretaker", "username email contact");
  return res.status(200).json(requests);
};

//make payment via khalti

const khaltipayment = async (req, res) => {
  if (!(req.user?.role === "careseeker")) {
    return res.status(400).json({ message: "This is careseeker feature!" });
  }

  let payment_response;
  try {
    payment_response = await initiateKhaltiPayment(req.body);
    console.log('RESPONSE FROM KHALTI ENDPOINT::', payment_response);
    if (payment_response) {
      return res.json({
        success: true,
        data: payment_response,
      });
    } else {
      return res.json({
        success: false,
        message: "Khalti Payment Failed to initiate. Contact the admin",
      });
    }
  } catch (error) {
    console.error("Khalti payment initiate error:", error.response?.status, error.response?.data || error.message);
    return res.json({
      success: false,
      message: "Khalti Payment Failed to initiate. Contact the admin",
    });
  }

};

const fileComplaint = async (req, res) => {
  const serviceId = req.params.id;
  const userId = req.user._id;

  const service = await Service.findOne({ _id: serviceId, careseeker: userId });

  if (!service) {
    return res.status(404).json({ message: "Service request not found or you're not authorized" });
  }

  if (service.status !== "payment-confirmed") {
    return res.status(400).json({ message: "Can only file complaints for paid services" });
  }

  service.complaintFiled = true;
  service.payoutStatus = "held"; // Stay held for admin review
  await service.save();

  return res.status(200).json({ message: "Complaint filed. Admin will review the case and payout is held.", service });
};

module.exports = {
  requestService,
  myRequests,
  CareseekerRequests,
  acceptRequest,
  rejectRequest,
  acceptedRequests,
  rejectedRequests,
  khaltipayment,
  fileComplaint,
};
