require("dotenv").config();
const mongoose = require("mongoose");
const Profile = require("./model/Profile");

const updateRates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const result = await Profile.updateMany(
            { rate: { $lt: 10 } },
            { $set: { rate: 10 } }
        );

        console.log(`Updated ${result.modifiedCount} profiles to have a minimum rate of 10 Rs.`);
        process.exit(0);
    } catch (error) {
        console.error("Error updating rates:", error);
        process.exit(1);
    }
};

updateRates();
