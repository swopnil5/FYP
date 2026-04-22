const User = require("../model/User");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
const crypto = require("crypto");
const register = async (req, res) => {
  try {
    const email = req.body.email;
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(409).json({
        message: "The email is already registered. Please login",
      });
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    req.body.emailOtp = otp;
    const user = await User.create({ ...req.body });
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    let verificationEmailTemplate = fs.readFileSync(
      path.join(__dirname, "../public/verifyEmail.html"),
      "utf-8"
    );

    let verificationLink = process.env.BACKEND_URL + "/api/v1/auth/verifyEmail";
    verificationLink += `?email=${user.email}&otp=${otp}`;

    verificationEmailTemplate = verificationEmailTemplate.replace(
      "{{name}}",
      user.name
    );
    verificationEmailTemplate = verificationEmailTemplate.replaceAll(
      "{{verification_link}}",
      verificationLink
    );


    let mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: user.email,
      subject: "Email Verification",
      html: verificationEmailTemplate,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent :" + info.response);
      }
    });
    const token = user.createJWT();
    res.status(200).json({
      user: { name: user.name, _id: user.id, role: user.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

const login = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(200).json({ message: "Please provide email and password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  // if (!user.emailVerified) {
  //   return res.status(400).json({ message: "Please verify your email" });
  // }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }


  const token = user.createJWT();
  res.status(200).json({
    userdetails: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.query;
    const user = await User.findOne({
      email,
      emailOtp: otp,
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { emailVerified: true, emailOtp: "" },
      { new: true }
    );


    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta http-equiv="refresh" content="2;url=${process.env.FRONTEND_URL}/myservices" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verified</title>
      <style>
        body {
        font-family: Arial, sans-serif;
        text-align: center;
        margin-top: 50px;
        }
        .message {
        color: green;
        font-size: 24px;
        }
        .loader {
        margin: 20px auto;
        border: 5px solid #f3f3f3;
        border-radius: 50%;
        border-top: 5px solid green;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        }
        @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
        }
      </style>
      </head>
      <body>
      <div class="message">Email verified successfully. Redirecting to login...</div>
      <div class="loader"></div>
      <script>
        setTimeout(() => {
        window.location.href = "http://localhost:5173/login";
        }, 2000);
      </script>
      </body>
      </html>
    `);
  }
  catch (error) {
    console.error(error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error</title>
      <style>
      body {
      font-family: Arial, sans-serif;
      text-align: center;
      margin-top: 50px;
      }
      .message {
      color: red;
      font-size: 24px;
      }
      .loader {
      margin: 20px auto;
      border: 5px solid #f3f3f3;
      border-radius: 50%;
      border-top: 5px solid red;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      }
      @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
      }
      </style>
      </head>
      <body>
      <div class="message">Error verifying email. Redirecting to login...</div>
      <div class="loader"></div>
      <script>
      setTimeout(() => {
        window.location.href = "http://localhost:5173/login";
      }, 3000);
      </script>
      </body>
      </html>
    `);
  }
};

const resendVerificationOtpEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const updated = await User.findByIdAndUpdate(
      user._id,
      { emailOtp: otp },
      { new: true }
    );

    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const verificationEmailTemplate = fs.readFileSync(
      path.join(__dirname, "../public/verifyEmail.html"),
      "utf-8"
    );

    let verificationLink = process.env.BACKEND_URL + "/api/v1/auth/verifyEmail";
    verificationLink += `?email=${user.email}&otp=${otp}`;

    verificationEmailTemplate = verificationEmailTemplate.replace(
      "{{name}}",
      user.name
    );
    verificationEmailTemplate = verificationEmailTemplate.replace(
      "{{verification_link}}",
      verificationLink
    );

    let mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: user.email,
      subject: "Email Verification",
      html: verificationEmailTemplate,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent :" + info.response);
      }
    });

    return res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error sending email" });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset Request</h3>
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Reset email sent :" + info.response);
      }
    });

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending reset link" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error resetting password" });
  }
};

module.exports = { register, login, verifyEmail, resendVerificationOtpEmail, forgotPassword, resetPassword };
