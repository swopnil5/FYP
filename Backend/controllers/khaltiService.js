const axios = require('axios');
const ServiceRequests = require('../model/ServiceRequests');
const User = require('../model/User');
const Message = require('../model/Messages');

const initiateKhaltiPayment = async ({
    return_url,
    website_url,
    amountInRs,
    purchase_order_id,
    purchase_order_name,
    customer_info,
}) => {
    let KHALTI_BASE_URL = process.env.KHALTI_ENDPOINT?.trim();
    if (KHALTI_BASE_URL?.endsWith("/")) {
        KHALTI_BASE_URL = KHALTI_BASE_URL?.slice(0, -1);
    }

    try {
        const response = await axios.post(
            `${KHALTI_BASE_URL}/epayment/initiate/`,
            {
                return_url,
                website_url,
                amount: Math.round(amountInRs * 100),
                purchase_order_id,
                purchase_order_name,
                customer_info,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Khalti initiate API error:",
            error.response?.status,
            error.response?.data || error.message
        );
        throw error;
    }
}


const verifyPayment = async (req, res) => {
    try {
        const {
            purchase_order_id,
            status,
            amount,
            pidx
        } = req.query;

        console.log("Khalti Verify Query:", req.query);

        if (status !== "Completed") {
            return res.send(`
                <html><head><title>Payment Status</title><meta http-equiv="refresh" content="2;url=${process.env.FRONTEND_URL}/myservices" /></head><body><h1 style="color: red;">Payment verification failed! Payment was not complete</h1><h2>Redirecting to the website in 2 secs ...</h1></body></html>
            `);
        }

        if (!purchase_order_id) {
            return res.status(400).send("Purchase Order ID is missing");
        }

        const serviceRequest = await ServiceRequests.findById(purchase_order_id);
        if (!serviceRequest) {
            return res.send(`
                <html><head><title>Payment Status</title><meta http-equiv="refresh" content="2;url=${process.env.FRONTEND_URL}/myservices" /></head><body><h1 style="color: red;">Payment verification failed! Service request not found</h1><h2>Redirecting to the website in 2 secs ...</h1></body></html>
            `);
        }
        const wasAlreadyConfirmed = serviceRequest.status === "payment-confirmed";

        const releaseDate = new Date();
        releaseDate.setDate(releaseDate.getDate() + 3);

        const totalAmount = (amount || serviceRequest.khaltiData?.amountInRs * 100) / 100; // fallback to stored amount if query amount is missing
        const commission = totalAmount * 0.10;
        const caretakerEarnings = totalAmount - commission;

        await ServiceRequests.findByIdAndUpdate(
            serviceRequest._id,
            {
                status: "payment-confirmed",
                payoutStatus: "held",
                paymentReleaseDate: releaseDate,
                totalAmount: totalAmount,
                commission: commission,
                caretakerEarnings: caretakerEarnings
            },
            {
                new: true
            }
        );

        // Send a booking message to caretaker inbox only once on first successful payment.
        if (!wasAlreadyConfirmed) {
            const Profile = require('../model/Profile'); // Ensure Profile is available if not globally imported
            const careseeker = await User.findById(serviceRequest.careseeker).select("email name");
            if (careseeker) {
                await Message.create({
                    from: serviceRequest.careseeker,
                    to: serviceRequest.caretaker,
                    email: careseeker.email,
                    message: `${careseeker.name} booked your ${serviceRequest.serviceType} service and completed payment via Khalti.`,
                });
            }
        }

        return res.send(`
            <html><head><title>Payment Status</title><meta http-equiv="refresh" content="2;url=${process.env.FRONTEND_URL}/myservices" /></head><body><h1 style="color: green;">Payment verification success! Payment was complete</h1><h2>Redirecting to the website in 2 secs ...</h1></body></html>
        `);
    } catch (error) {
        console.error("Khalti Verify Error:", error);
        return res.status(500).send(`
            <html><head><title>Error</title></head><body><h1 style="color: red;">Internal Server Error during verification</h1><p>${error.message}</p></body></html>
        `);
    }
}

module.exports = {
    initiateKhaltiPayment,
    verifyPayment,
};