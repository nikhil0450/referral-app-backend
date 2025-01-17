// routes/candidateRoutes.js

const express = require("express");
const { addCandidate, getAllCandidates, updateCandidateStatus, deleteCandidate} = require("../controllers/candidateController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("resume"), addCandidate);
router.get("/", protect, getAllCandidates);
router.put("/:id/status", protect, updateCandidateStatus);
router.delete("/:id", protect, deleteCandidate);

router.get('/candidates', async (req, res) => {
    const { page = 1, limit = 6 } = req.query; // Default to 6 candidates per page
    const skip = (page - 1) * limit; // Calculate the number of candidates to skip
    
    try {
      const candidates = await Candidate.find()
        .skip(Number(skip))
        .limit(Number(limit))
        .exec();
        
      const totalCandidates = await Candidate.countDocuments();
      const totalPages = Math.ceil(totalCandidates / limit);
      
      res.json({
        candidates,
        pagination: {
          totalCandidates,
          totalPages,
          currentPage: Number(page),
        },
      });
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ message: "Error fetching candidates" });
    }
  });
  

module.exports = router;
