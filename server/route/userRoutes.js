import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth.js';
import {
  login,
  signup,
  sendotp,
  changePassword,
  logout
} from "../controller/Auth.js";

import {
  resetPasswordToken,
  resetPassword,
} from "../controller/ResetPassword.js"

// Routes
router.post("/sendotp", sendotp);
router.post("/login", login);
router.post("/signup", signup);
router.post("/changepassword", auth, changePassword)
router.post("/logout", auth, logout);

router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)


export default router;
