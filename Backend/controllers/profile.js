require("dotenv").config();
const Profile = require("../model/Profile");
const Admins = require("../model/Admin");
const Adoptions = require("../model/Adoptions");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

//create the profile of a caretaker

const createProfile = async (req, res) => {
  const userEmail = req.user.email;

  if (!req.file) {
    return res.status(400).json({ message: "Please upload a profile image" });
  }

  const userId = req.user._id;
  const role = req.user.role;
  const profileEmail = req.body.email;

  if (role != "caretaker") {
    return res.status(400).json({ message: "You are not a caretaker" });
  }

  console.log(
    "User", req.user.email
  )
  if (userEmail != profileEmail) {
    return res
      .status(400)
      .json({ message: "Please use your registered email" });
  }

  const rate = req.body.rate;
  if (rate < 10) {
    return res.status(400).json({ message: "Minimum rate must be at least 10 Rs" });
  }

  const profileExists = await Profile.find({ profileOf: userId });
  if (!profileExists || profileExists == null || profileExists.length == "0") {
    const profile = await Profile.create({
      profileOf: userId,
      username: req.body.username,
      profileImageUrl: req.file.filename,
      email: req.body.email,
      name: req.body.name,
      bio: req.body.bio,
      speciality: req.body.speciality,
      rate: req.body.rate,
      contact: req.body.contact,
      location: req.body.location,
    });
    return res.status(200).json({ profile });
  } else {
    console.log(profileExists);
    return res.status(400).json({ message: "Your Profile already Exists" });
  }
};

//get all profiles
//this is to view caretakers so it is available to everyone
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({});
    return res.status(200).json({ profiles });
  } catch (e) {
    console.log(e);
  }
};

//to get a spicific id.
//the my profile section
const getMyProfile = async (req, res) => {
  const userId = req.user._id;
  const userEmail = req.user.email;
  const profile = await Profile.findOne({
    $or: [
      { profileOf: userId },
      { email: userEmail }
    ]
  });

  if (!profile) {
    return res
      .status(404)
      .json({ message: "You have not created your Profile" });
  } else {
    // Calculate pending earnings (funds currently held in grace period)
    const Service = require("../model/ServiceRequests");
    const pendingStats = await Service.aggregate([
      {
        $match: {
          caretaker: profile._id,
          payoutStatus: "held",
          status: "payment-confirmed"
        }
      },
      {
        $group: {
          _id: null,
          pendingAmount: { $sum: "$caretakerEarnings" }
        }
      }
    ]);

    const profileData = profile.toObject();
    profileData.pendingEarnings = pendingStats.length > 0 ? pendingStats[0].pendingAmount : 0;

    return res.status(200).json(profileData);
  }
};

//to update the profile
const updateProfile = async (req, res) => {
  const requestor = req.user._id;
  console.log("REQUESTOR::", requestor);
  console.log("REQUEST BODY::", req.body);

  /* const {
    body: {
      username,
      profileImageUrl,
      bio,
      speciality,
      rate,
      contact,
      location,
    },
  } = req; */

  const rate = req.body.rate;
  if (rate < 10) {
    return res.status(400).json({ message: "Minimum rate must be at least 10 Rs" });
  }

  const updatedProfile = await Profile.findOneAndUpdate(
    { $or: [{ _id: requestor }, { profileOf: requestor }] },
    {
      //profileOf: userId,
      username: req.body.username,
      profileImageUrl: req.file ? req.file.filename : req.body.profilePic,
      //email: req.body.email,
      name: req.body.name,
      bio: req.body.bio,
      //speciality: req.body.speciality,
      rate: req.body.rate,
      contact: req.body.contact,
      location: req.body.location,
    },
    { new: true, runValidators: true }
  );
  console.log("Updated Profile::", updatedProfile);
  if (!updatedProfile) {
    return res
      .status(404)
      .json({ message: "Some error occured while updating the data" });
  }
  const updatedUsername = updatedProfile?.username;
  const updatedImage = updatedProfile?.profileImageUrl;
  const updatedAdoptionPosts = await Adoptions.updateMany(
    {
      postedBy: requestor,
    },
    {
      posterImageUrl: updatedImage,
      username: updatedUsername,
    },
    { new: true, runValidators: true }
  );
  console.log(updatedAdoptionPosts);
  res.status(200).json({ updatedProfile });
};

const applyForVerification = async (req, res) => {
  const applier = req.user._id;
  const userProfile = await Profile.findOne({ $or: [{ profileOf: applier }, { _id: applier }] });

  /*   const fileContent = fs.readFileSync(
    path.join(__dirname, "../Profiles/1680242085460-logo.png")
  ); */

  if (!userProfile) {
    return res.status(400).json({ message: "You haven't made a profile yet" });
  }
  if (userProfile.verificationStatus !== "unknown") {
    return res
      .status(400)
      .json({ message: "You have already requested or are verified" });
  }

  adminEmails = [];
  const admins = await Admins.find();
  admins.forEach((admin) => {
    return adminEmails.push(admin.email);
  });

  let text = req.body.text;
  let attachments = [];
  for (let i = 0; i < req.files.length; i++) {
    let fileDetails = {
      filename: req.files[i].filename,
      path: req.files[i].path,
    };
    attachments.push(fileDetails);
  }
  console.log(attachments);

  const update = { verificationStatus: "pending", verificationAttachments: attachments };

  // return res.status(200).json({
  //   attachments,
  //   update,
  // })

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
    to: adminEmails,
    subject: `About Profile Verification of ${applier}`,
    text: text,
    attachments: attachments /* [
      {
        filename: "image.png",
        //content: attachment,
        content: fileContent,
        //encoding: "base64", // this doesn't work.
      },
    ], */,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent :" + info.response);
    }
  });

  const updatedProfile = await Profile.findOneAndUpdate(
    { profileOf: applier },
    update,
    {
      new: true,
      runValidators: true,
    }
  );
  return res.status(200).json({ updatedProfile });
};

module.exports = {
  createProfile,
  getAllProfiles,
  getMyProfile,
  updateProfile,
  applyForVerification,
};
