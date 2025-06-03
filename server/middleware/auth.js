// middleware/auth.js
import jwt from "jsonwebtoken";

const auth = (req, res) => {
  try {
    const token =  req.cookies.token ||
            req.body.token ||
            req.header("Authorization")?.replace("Bearer ", "");
    console.log(token, ".............................................")
    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // should contain: { id, email, accountType, ... }
    return res.status(200).json({
      success: true,
    })
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

const isStudent = (req, res, next) => {
  if (req.user.accountType !== "Student") {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  next();
};

const isInstructor = (req, res, next) => {
  if (req.user.accountType !== "Instructor") {
    return res.status(403).json({ message: "Access denied. Instructors only." });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.accountType !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

export { auth, isStudent, isInstructor, isAdmin };
