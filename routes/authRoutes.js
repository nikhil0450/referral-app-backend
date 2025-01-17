// routes/authRoutes.js

const express = require("express");
const { loginUser, registerUser } = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;