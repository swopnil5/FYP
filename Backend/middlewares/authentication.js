const jwt = require("jsonwebtoken");
const User = require("../model/User");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({ message: "You are not authorized. Login First" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); 
    const user = await User.findById(payload.userId).lean();
    if (!user) {
      return res.status(401).json({ message: "You are not authorized. Login First" });
    }
    // if (!user.emailVerified) {
    //   return res.status(401).json({ message: "Please verify your email" });
    // }
    console.log("AUTHENTICATED:::User", user);
    req.user = {...user};
    next();
  } catch (e) {
    res.status(401).json({ message: "Authentication Failed" });
  }
};
module.exports = auth;
