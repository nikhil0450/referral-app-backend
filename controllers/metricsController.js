const Candidate = require('../models/Candidate');
const ActivityLog = require('../models/activityLog');  // Import the ActivityLog model

exports.getMetrics = async (req, res) => {
    try {
        // Total number of candidates
        const totalCandidates = await Candidate.countDocuments();

        // Count of candidates in each status
        const statusCounts = await Candidate.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Count of candidates per user
        const candidatesPerUser = await Candidate.aggregate([
            { $group: { _id: "$referredBy", count: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userInfo' } },
            { $project: { 'userInfo.name': 1, 'userInfo.email': 1, count: 1 } }
        ]);

        // Log the action in the ActivityLog collection
        const activityLog = new ActivityLog({
            action: 'Viewed candidate metrics',
            details: `Admin viewed the candidate metrics dashboard.`,
            user: req.user._id,  
        });

        await activityLog.save();
        res.status(200).json({
            totalCandidates,
            statusCounts,
            candidatesPerUser
        });
    } catch (err) {
        console.error("Error fetching metrics:", err);
        res.status(500).json({ message: "Server error" });
    }
};
