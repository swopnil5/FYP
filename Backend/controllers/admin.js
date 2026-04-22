const User = require("../model/User");
const Profile = require("../model/Profile");
const Admin = require("../model/Admin");
const Adoption = require("../model/Adoptions");
const createAdmin = async (req, res) => {
  /* const ID = req.user.userId;
  const userFound = await Admin.findOne({ userID: ID });
  console.log(userFound);
  if (!userFound) {
    return res.status(404).json({ message: `You are not an admin` });
  }
 */
  const adminUserId = req.body.userID;

  const userExists = await User.find({ _id: adminUserId });

  if (!userExists) {
    return res.status(400).json("The user doesn't exist");
  }

  if (userExists.role !== "caretaker") {
    return res.status(400).json("Only a caretaker can be promoted to admin");
  }
  const adminExists = await Admin.find({ userID: adminUserId });

  if (adminExists == null || adminExists.length == "0") {
    const admin = await Admin.create(req.body);
    return res
      .status(200)
      .json({ message: `Admin created successfully. Details: ${admin}` });
  } else {
    return res.status(400).json("The user is already an admin");
  }
};

const getAdmins = async (req, res) => {
  /* const ID = req.user.userId;
  const userFound = await Admin.findOne({ userID: ID });
  console.log(userFound);
  if (!userFound) {
    return res.status(404).json({ message: `fafwdadwaYou are not an admin` });
  }
 */
  const admins = await Admin.find({});
  return res.status(200).json({ admins });
};

const deleteUser = async (req, res) => {
  const update = { isDeleted: true };
  const identifiedUser = req.params.id;
  const userExists = await User.findOneAndUpdate(
    { _id: identifiedUser },
    update,
    { new: true, runValidators: true }
  );
  if (!userExists) {
    return res.status(404).json({ message: "The user doesn't exist." });
  }
  return res
    .status(200)
    .json({ message: `user ${identifiedUser} deleted successfully` });
};

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.status(404).json({ message: "Error no users found" });
  }
  return res.status(200).json({ users });
};

const findUser = async (req, res) => {
  const id = req.body.userId;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res
      .status(404)
      .json({ message: "Error: User not found of given id" });
  }
  return res.status(200).json({ user });
};

const getAllProfiles = async (req, res) => {
  const profiles = await Profile.find();
  if (!profiles) {
    return res.status(404).json({ message: "Error no profiles found" });
  }
  return res.status(200).json({ profiles });
};

const findProfile = async (req, res) => {
  const id = req.body.profileId;
  const profile = await Profile.findOne({ _id: id });
  if (!profile) {
    return res
      .status(404)
      .json({ message: "Error: profile not found of given id" });
  }
  return res.status(200).json({ profile });
};

const verifyProfile = async (req, res) => {
  const profileId = req.params.id;
  const userProfile = await Profile.findOne({ _id: profileId });

  if (!userProfile) {
    return res.status(400).json({ message: "The profile doesn't exist" });
  }
  if (userProfile.verificationStatus === "verified") {
    return res.status(400).json({ message: "The profile is already verified" });
  }
  const update = { verificationStatus: "verified" };
  const updatedProfile = await Profile.findOneAndUpdate(
    { _id: profileId },
    update,
    {
      new: true,
      runValidators: true,
    }
  );
  return res.status(200).json({ updatedProfile });
};

const deleteProfile = async (req, res) => {
  const update = { isDeleted: true };
  const identifiedProfile = req.params.id;
  const profileExists = await Profile.findOneAndUpdate(
    {
      _id: identifiedProfile,
    },
    { update },
    { new: true, runValidators: true }
  );
  if (!profileExists) {
    return res.status(404).json({ message: "The user doesn't exist." });
  }
  return res
    .status(200)
    .json({ message: `Profile ${identifiedProfile} deleted successfully` });
};

const deleteAdoption = async (req, res) => {
  const update = { isDeleted: true };

  const identifiedAdoption = req.params.id;
  const postExists = await Adoption.findOneAndUpdate(
    { _id: identifiedAdoption },
    { update },
    { new: true, runValidators: true }
  );
  if (!postExists) {
    return res.status(404).json({ message: "The user doesn't exist." });
  }
  return res.status(200).json({
    message: `ADoption post ${identifiedAdoption} deleted successfully`,
  });
};
const getUsersCount = async (req, res) => {
  const counts = await User.aggregate([
    // User is the model of userSchema
    {
      $group: {
        _id: { $month: "$createdAt" }, // group by the month *number*, mongodb doesn't have a way to format date as month names
        numberofdocuments: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: false, // remove _id
        month: {
          // set the field month as the month name representing the month number
          $arrayElemAt: [
            [
              "", // month number starts at 1, so the 0th element can be anything
              "january",
              "february",
              "march",
              "april",
              "may",
              "june",
              "july",
              "august",
              "september",
              "october",
              "november",
              "december",
            ],
            "$_id",
          ],
        },
        numberofdocuments: true, // keep the count
      },
    },
  ]);
  res.status(200).json({ counts });
};

const getEarningsStats = async (req, res) => {
  const Service = require("../model/ServiceRequests");

  const stats = await Service.aggregate([
    {
      $match: { status: { $in: ["payment-confirmed", "completed"] } }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        collectedFees: {
          $sum: {
            $cond: [{ $eq: ["$payoutStatus", "released"] }, "$commission", 0]
          }
        },
        pendingFees: {
          $sum: {
            $cond: [{ $eq: ["$payoutStatus", "held"] }, "$commission", 0]
          }
        },
        pendingPayouts: {
          $sum: {
            $cond: [{ $eq: ["$payoutStatus", "held"] }, "$caretakerEarnings", 0]
          }
        }
      }
    }
  ]);

  const result = stats.length > 0 ? stats[0] : {
    totalRevenue: 0,
    collectedFees: 0,
    pendingFees: 0,
    pendingPayouts: 0
  };

  return res.status(200).json({
    success: true,
    data: result
  });
};

const getCaretakerEarningsBreakdown = async (req, res) => {
  const Service = require("../model/ServiceRequests");

  const breakdown = await Service.aggregate([
    {
      $match: { status: { $in: ["payment-confirmed", "completed"] } }
    },
    {
      $group: {
        _id: "$caretaker",
        paidAmount: {
          $sum: {
            $cond: [{ $eq: ["$payoutStatus", "released"] }, "$caretakerEarnings", 0]
          }
        },
        pendingAmount: {
          $sum: {
            $cond: [{ $eq: ["$payoutStatus", "held"] }, "$caretakerEarnings", 0]
          }
        }
      }
    },
    {
      $lookup: {
        from: "profiles",
        localField: "_id",
        foreignField: "_id",
        as: "caretakerInfo"
      }
    },
    {
      $unwind: "$caretakerInfo"
    },
    {
      $project: {
        _id: 1,
        paidAmount: 1,
        pendingAmount: 1,
        caretakerName: "$caretakerInfo.name",
        caretakerEmail: "$caretakerInfo.email"
      }
    }
  ]);

  return res.status(200).json({
    success: true,
    data: breakdown
  });
};

module.exports = {
  createAdmin,
  getAdmins,
  deleteUser,
  deleteProfile,
  deleteAdoption,
  getAllUsers,
  findUser,
  getAllProfiles,
  findProfile,
  verifyProfile,
  getUsersCount,
  getEarningsStats,
  getCaretakerEarningsBreakdown,
};
