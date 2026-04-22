const cron = require('node-cron');
const Service = require('../model/ServiceRequests');
const Profile = require('../model/Profile');

const initPayoutCron = () => {
    // Run every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Running payout check cron job...');
        const now = new Date();

        try {
            // Find services where:
            // 1. payoutStatus is 'held'
            // 2. paymentReleaseDate is in the past (or present)
            // 3. complaintFiled is false
            const eligibleServices = await Service.find({
                payoutStatus: 'held',
                paymentReleaseDate: { $lte: now },
                complaintFiled: false
            });

            for (const service of eligibleServices) {
                console.log(`Releasing payment for service ${service._id} to caretaker ${service.caretaker}`);

                // In a real application, you would call a payout API here.
                // For now, we simulate this by updating the payoutStatus.

                service.payoutStatus = 'released';
                service.status = 'completed';
                await service.save();

                // Update caretaker's profile earnings
                await Profile.findByIdAndUpdate(
                    service.caretaker,
                    { $inc: { totalEarnings: service.caretakerEarnings } }
                );

                // Optional: Send notification to caretaker about payment release
            }

            if (eligibleServices.length > 0) {
                console.log(`Successfully processed ${eligibleServices.length} payouts.`);
            }
        } catch (error) {
            console.error('Error in payout cron job:', error);
        }
    });
};

module.exports = initPayoutCron;
