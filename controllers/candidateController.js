// controllers/candidateController.js

const Candidate = require("../models/Candidate");
const ActivityLog = require("../models/activityLog");

exports.addCandidate = async (req, res) => {
  try {
    const { name, email, phone, jobTitle } = req.body;

    if (!name || !email || !phone || !jobTitle) {
      return res
        .status(400)
        .json({ message: "All fields except resume are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const allowedMimeTypes = ["application/pdf"];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({ message: "Only PDF files are allowed as resumes" });
    }

    const resumeUrl = req.file.filename.endsWith(".pdf")
      ? `/uploads/${req.file.filename}`
      : null;

    const candidate = await Candidate.create({
      name,
      email,
      phone,
      jobTitle,
      resume: resumeUrl,
      referredBy: req.user.id,
    });

    // Log activity
    await ActivityLog.create({
      action: "Added Candidate",
      details: `Candidate ${name} was added.`,
      user: req.user.id,
    });

    res
      .status(201)
      .json({ message: "Candidate added successfully", candidate });
  } catch (error) {
    console.error("Error adding candidate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const { jobTitle, status, page = 1, limit = 10 } = req.query;

    // Create filter object
    const filter = {};
    if (jobTitle) filter.jobTitle = new RegExp(jobTitle, "i"); // Case-insensitive search
    if (status) filter.status = status;

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch candidates and populate both referredBy and updatedBy fields
    const candidates = await Candidate.find(filter)
      .populate("referredBy", "name email")  // Populate referredBy field with user details
      .populate("updatedBy", "name")  // Populate updatedBy field with the user's name
      .skip(skip)
      .limit(Number(limit));

    const totalCandidates = await Candidate.countDocuments(filter);

    res.status(200).json({
      candidates,
      pagination: {
        total: totalCandidates,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCandidates / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const candidateId = req.params.id;

    // Get the currently logged-in user's ID
    const updatedBy = req.user.id;  // Ensure this is correct

    // Update the candidate's status and track the user who made the update
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { 
        status, 
        updatedBy,  // Store the user ID of the person who updated the status
        updatedAt: new Date()  // Automatically set the updated time
      },
      { new: true }  // Return the updated candidate
    );

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Log the activity
    await ActivityLog.create({
      action: "Updated Candidate Status",
      details: `Candidate ${candidate.name} status updated to ${status}.`,
      user: req.user.id,
    });

    // Return the updated candidate details
    res.status(200).json({ message: "Candidate status updated", candidate });
  } catch (error) {
    console.error("Error updating candidate status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

