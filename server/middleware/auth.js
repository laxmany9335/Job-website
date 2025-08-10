import jwt from "jsonwebtoken";

// Token Authentication Middleware
const auth = (req, res, next) => {
  try {
    const token = req.cookies.token || req.localStronge.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Role-based access generator
const authorizeRole = (role) => (req, res, next) => {
  if (req.user.accountType !== role) {
    return res.status(403).json({ message: `Access denied. ${role}s only.` });
  }
  next();
};

// Role middlewares
export const isStudent = authorizeRole("Student");
export const isRecruiter = authorizeRole("Recruiter");
export const isAdmin = authorizeRole("Admin");

export { auth };
