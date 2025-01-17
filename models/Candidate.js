// models/Candidate.js
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    jobTitle: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Reviewed', 'Hired', 'Rejected'],
        default: 'Pending'
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // UpdatedBy field
    updatedAt: { type: Date, default: Date.now },  // UpdatedAt field
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user who referred
    resume: { type: String },  // URL of the uploaded resume
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);
