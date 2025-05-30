import express from 'express';
const router = express.Router();

import {
  login,
  signup,
  sendotp,
  forgetPassword,
  logout
} from "../controller/Auth.js";

// Routes
router.post("/sendotp", sendotp);
router.post("/login", login);
router.post("/signup", signup);
router.post("/forget-password", forgetPassword);

router.post("/logout", logout);


export default router;
