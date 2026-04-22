const Profile = require("../model/Profile");
const Adoption = require("../model/Adoptions");

const createPost = async (req, res) => {
  const posterUserId = req.user._id;
  const posterEmail = req.user?.email;
  const posterDetails = await Profile.findOne({
    $or:
      [
        { profileOf: posterUserId },
        { email: posterEmail }
      ]
  });

  if (!posterDetails) {
    return res.status(401).json({ message: "Create your profile first" });
  } else {
    const newPost = await Adoption.create({
      postedBy: posterUserId,
      username: posterDetails.username,
      posterImageUrl: posterDetails.profileImageUrl,
      description: req.body.description,
      number: req.body.phone,
      postImages: req.file.filename,
    });
    console.log(newPost);

    return res.status(200).json({ newPost });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Adoption.find({});
    return res.status(200).json({ posts });
  } catch (e) {
    console.log(e);
  }
};

const getMyAdoptionPosts = async (req, res) => {
  const requestor = req.user.userId;
  const postedPosts = await Adoption.find({ postedBy: requestor });

  if (!postedPosts || postedPosts.length === 0) {
    return res.status(400).json({ message: "You haven't made any posts yet." });
  } else {
    return res.status(200).json({ postedPosts });
  }
};

module.exports = { createPost, getAllPosts, getMyAdoptionPosts };
