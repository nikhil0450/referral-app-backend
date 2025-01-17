// middlewares/authMiddleware.js:

const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.startsWith("Bearer")
            ? req.headers.authorization.split(" ")[1] 
            : req.headers.authorization; 
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, invalid token" });
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }
        next();
    };
};
