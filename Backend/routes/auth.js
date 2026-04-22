const express = require("express");
const router = express.Router();

const { register, login, resendVerificationOtpEmail, verifyEmail, forgotPassword, resetPassword } = require("../controllers/auth.js");

router.post("/register", register);
router.post("/login", login);
router.post("/resentEmailVerification", resendVerificationOtpEmail);
router.get("/verifyEmail", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
