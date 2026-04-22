require("dotenv").config();
const mongoose = require("mongoose");
const Service = require("./model/ServiceRequests");

const updateServices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const result = await Service.updateMany(
            { "khaltiData.amountInRs": { $lt: 10 }, status: "requested" },
            { $set: { "khaltiData.amountInRs": 10 } }
        );

        console.log(`Updated ${result.modifiedCount} pending service requests to have a minimum amount of 10 Rs.`);
        process.exit(0);
    } catch (error) {
        console.error("Error updating services:", error);
        process.exit(1);
    }
};

updateServices();
