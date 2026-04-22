const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//a basic schema of the Database of the employees.

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide Name"],
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["caretaker", "careseeker"],
      default: "careseeker",
    },
    petType: {
      type: String,
      enum: ["cat", "dog", "fish"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailOtp: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, email: this.email, role: this.role },
    process.env.JWT_SECRET
  );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

UserSchema.pre("find", function () {
  this.select(["-isDeleted", "-v"]).where({ isDeleted: { $ne: true } });
});
UserSchema.pre("findOne", function () {
  this.select(["-isDeleted", "-v"]).where({ isDeleted: { $ne: true } });
});

module.exports = mongoose.model("User", UserSchema);
