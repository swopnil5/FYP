const Profile = require("../model/Profile");
const User = require("../model/User");
const Service = require("../model/ServiceRequests");
const Rating = require("../model/Rating");

/**
 * Get recommended caretakers for a careseeker
 * Uses collaborative filtering and user preferences to generate recommendations
 */
const getRecommendations = async (req, res) => {
  try {
    // Get the authenticated user
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "careseeker") {
      return res.status(403).json({ message: "Only careseekers can get recommendations" });
    }

    // Get user's pet type preference
    const petType = user.petType || "dog"; // Default to dog if not specified

    // Step 1: Get all caretakers with matching specialty (pet type)
    const caretakersWithMatchingSpecialty = await Profile.find({
      speciality: petType,
      verificationStatus: "verified", // Prioritize verified caretakers
    }).select("_id name username profileImageUrl rate speciality location averateRating totalRatings");

    // Step 2: Get caretakers this user has previously booked
    const userPastServices = await Service.find({
      careseeker: userId,
      status: { $in: ["accepted", "payment-confirmed"] } // Only consider completed bookings
    }).select("caretaker");

    const userPastCaretakerIds = userPastServices.map(service => service.caretaker.toString());
    
    // Step 3: Get ratings this user has given
    const userRatings = await Rating.find({
      reviewedBy: userId
    }).populate("caretaker", "_id").select("caretaker stars");
    
    // Create a map of caretaker ID to rating
    const userRatingMap = {};
    userRatings.forEach(rating => {
      userRatingMap[rating?.caretaker?._id.toString()] = rating.stars;
    });

    // Step 4: Find similar users based on rating patterns
    // Get all ratings for caretakers this user has rated
    const caretakerIdsUserHasRated = userRatings.map(rating => rating?.caretaker?._id);
    
    // Find ratings by other users for these same caretakers
    const similarUsersRatings = await Rating.find({
      caretaker: { $in: caretakerIdsUserHasRated },
      reviewedBy: { $ne: userId } // Exclude the current user
    }).populate("reviewedBy", "_id").select("reviewedBy caretaker stars");
    
    // Calculate similarity scores between users
    const userSimilarityScores = {};
    similarUsersRatings.forEach(rating => {
      const otherUserId = rating?.reviewedBy?._id?.toString();
      const caretakerId = rating?.caretaker?.toString();
      
      if (userRatingMap[caretakerId]) {
        // Calculate rating difference (simpler version of similarity)
        const ratingDifference = Math.abs(userRatingMap[caretakerId] - rating?.stars);
        const similarity = 5 - ratingDifference; // Higher value means more similar
        
        if (!userSimilarityScores[otherUserId]) {
          userSimilarityScores[otherUserId] = { 
            totalSimilarity: 0, 
            count: 0 
          };
        }
        
        userSimilarityScores[otherUserId].totalSimilarity += similarity;
        userSimilarityScores[otherUserId].count += 1;
      }
    });
    
    // Calculate average similarity and sort users by similarity
    const similarUsers = Object.keys(userSimilarityScores)
      .map(userId => ({
        userId,
        similarity: userSimilarityScores[userId].totalSimilarity / userSimilarityScores[userId].count
      }))
      .filter(user => user.similarity > 3) // Only consider users with good similarity
      .sort((a, b) => b.similarity - a.similarity);
      
    // Step 5: Get caretakers liked by similar users that this user hasn't tried yet
    const similarUserIds = similarUsers.map(user => user.userId);
    
    let recommendedByPeers = [];
    if (similarUserIds.length > 0) {
      // Find highly rated caretakers by similar users
      const peerRatings = await Rating.find({
        reviewedBy: { $in: similarUserIds },
        stars: { $gte: 4 } // Only consider high ratings (4 or 5 stars)
      }).populate("caretaker", "_id name username profileImageUrl rate speciality location averateRating totalRatings");
      
      // Filter out caretakers the user has already booked
      recommendedByPeers = peerRatings
        .filter(rating => !userPastCaretakerIds.includes(rating.caretaker._id.toString()))
        .map(rating => rating.caretaker);
    }
    
    // Step 6: Get top-rated caretakers as fallback recommendations
    const topRatedCaretakers = await Profile.find({
      speciality: petType,
      _id: { $nin: userPastCaretakerIds } // Exclude already booked caretakers
    })
    .sort({ averateRating: -1, totalRatings: -1 })
    .limit(10)
    .select("_id name username profileImageUrl rate speciality location averateRating totalRatings bio contact");
    
    // Step 7: Combine recommendations and remove duplicates
    let allRecommendations = [...recommendedByPeers];
    
    // Add top rated caretakers that aren't already in the recommendations
    topRatedCaretakers.forEach(caretaker => {
      const isAlreadyRecommended = allRecommendations.some(
        rec => rec._id.toString() === caretaker._id.toString()
      );
      
      if (!isAlreadyRecommended) {
        allRecommendations.push(caretaker);
      }
    });
    
    // Step 8: Sort final recommendations by rating and relevance
    const finalRecommendations = allRecommendations
      .sort((a, b) => {
        // First by peer recommendation (peer recommendations come first)
        const aPeerRec = recommendedByPeers.some(rec => rec._id.toString() === a._id.toString());
        const bPeerRec = recommendedByPeers.some(rec => rec._id.toString() === b._id.toString());
        
        if (aPeerRec && !bPeerRec) return -1;
        if (!aPeerRec && bPeerRec) return 1;
        
        // Then by rating
        if (a.averateRating !== b.averateRating) {
          return b.averateRating - a.averateRating;
        }
        
        // Then by number of ratings
        return b.totalRatings - a.totalRatings;
      })
      .slice(0, 10); // Limit to top 10 recommendations
    
    // Return recommendations
    return res.status(200).json({
      success: true,
      count: finalRecommendations.length,
      data: finalRecommendations
    });
    
  } catch (error) {
    console.error("Error in recommendation system:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error generating recommendations",
      error: error.message
    });
  }
};

/**
 * Get recommendations based on location proximity
 * This is a simpler recommendation system that recommends caretakers near the user
 */
const getNearbyRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "careseeker") {
      return res.status(403).json({ message: "Only careseekers can get recommendations" });
    }

    // Get user's pet type and location from query or user profile
    const petType = user.petType || req.query.petType || "dog";
    const location = req.query.location;

    if (!location) {
      return res.status(400).json({ 
        message: "Location is required for nearby recommendations" 
      });
    }

    // Get caretakers with matching specialty in the same location
    // Note: In a real application, you'd use geospatial queries for true proximity
    const nearbyCaretakers = await Profile.find({
      speciality: petType,
      location: { $regex: new RegExp(location, "i") }, // Case-insensitive location match
      verificationStatus: "verified"
    })
    .sort({ averateRating: -1 })
    .limit(10)
    .select("_id name username profileImageUrl rate speciality location averateRating totalRatings");

    return res.status(200).json({
      success: true,
      count: nearbyCaretakers.length,
      data: nearbyCaretakers
    });
    
  } catch (error) {
    console.error("Error in nearby recommendation system:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error generating nearby recommendations",
      error: error.message
    });
  }
};



module.exports = {
  getRecommendations,
  getNearbyRecommendations,
};