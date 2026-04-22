const Profile = require("../model/Profile");
const Rating = require("../model/Rating");
const ServiceRequests = require("../model/ServiceRequests");
const User = require("../model/User");

const recalculateCaretakerRating = async (caretakerId) => {
    const ratings = await Rating.find({ caretaker: caretakerId?.toString() }).select("stars");
    if (ratings.length === 0) return 0;

    const totalStars = ratings.reduce((acc, rating) => acc + rating.stars, 0);
    const averageRating = totalStars / ratings.length;
    
    const updated = await Profile.findByIdAndUpdate(caretakerId?.toString(), {
        averateRating: averageRating,
        totalRatings: ratings.length,
    }, { new: true });
    return averageRating;
}

const createRating = async (req, res, next) => {
    const { stars, comment, serviceId } = req.body;
    
    if (!stars || !comment || !serviceId) {
        return res.status(400).json({ message: "star, comments and serviceId are required" });
    }

    const alreadyRated = await Rating.findOne({ serviceId });
    if (alreadyRated) {
        const updatedRating = await Rating.findByIdAndUpdate(alreadyRated._id, {
            stars,
            comment,
        }, { new: true });
        await recalculateCaretakerRating(updatedRating.caretaker);

        return res.status(200).json({
            success: true,
            message: "Rating updated successfully",
            data: updatedRating,
        });
    }


    const service = await ServiceRequests.findById(serviceId).select("caretaker careseeker");

    if (!service) {
        return res.status(400).json({ message: "Service not found" });
    }

    try {
        const rating = await Rating.create({
            caretaker: service.caretaker,
            stars,
            comment,
            serviceId,
            reviewedBy: service.careseeker,
        });

        await recalculateCaretakerRating(service.caretaker);
        await ServiceRequests.findByIdAndUpdate(serviceId, {
            review: rating._id,
        });

        return res.status(201).json({
            success: true,
            message: "Rating created successfully",
            data: rating,
        });
    } catch (error) {
        next(error);
    }
}

const updateRating = async (req, res, next) => {
    const { stars, comment } = req.body;
    const { ratingId } = req.params;

    if (!stars || !comment) {
        return res.status(400).json({ message: "stars and comment are required" });
    }

    let rating = await Rating.findById(ratingId).select("reviewedBy");

    try {
        if (!rating) {
            return res.status(404).json({ message: "Rating/Review not found" });
        }

        if (rating.reviewedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this rating" });
        }

        rating = await Rating.findByIdAndUpdate(ratingId, {
            stars,
            comment,
        }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Rating updated successfully",
            data: rating,
        });
    } catch (error) {
        next(error);
    }
}

const getRatingByServiceId = async (req, res, next) => {
    const { serviceId } = req.params;

    if (!serviceId) {
        return res.status(400).json({ message: "serviceId is required" });
    }

    try {
        const rating = await Rating.findOne({ serviceId })
            .populate("reviewedBy", "name email")
            .populate("caretaker", "name email");

        return res.status(200).json({
            success: true,
            message: "Rating fetched successfully",
            data: rating,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createRating,
    getRatingByServiceId,
    updateRating,
};
