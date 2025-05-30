import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTP from "../model/OTPModel.js";
import User from "../model/userModel.js";
import { Monitor, Phone } from "lucide-react";

// ===================== SEND OTP =====================
const sendotp = async (req, res) => {
    try {
        const { email } = req.body;
         console.log("email..............................", email);
        if (!email) {
            return res.status(401).json({
                success: false,
                message: "Please provide an email address",
            });
        }

        // Generate unique OTP
        let otpCode;
        let existOtp;
        do {
            otpCode = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            existOtp = await OTP.findOne({ otp: otpCode });
        } while (existOtp);

        // Save OTP to DB
        const otpBody = await OTP.create({ email, otp: otpCode });
        console.log("OTP Body", otpBody);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp: otpCode, // ⚠️ Remove this in production
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "There was a problem sending the OTP",
        });
    }
};

// ===================== SIGNUP =====================
const signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            gender,
            password,
            confirmPassword,
            otp,
            accountType,
        } = req.body;
        console.log("signup form data..... ", firstName, lastName, phone, email, gender, password, confirmPassword, otp, accountType);

        // Check required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone||
            !gender ||
            !password ||
            !confirmPassword ||
            !otp
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all details",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered",
            });
        }

        // Get latest OTP and validate
        console.log("email Id : ", email);
        const latestOtpRecord = await OTP.findOne({ email })
            .sort({ createdAt: -1 })
            .limit(1);
        console.log("Latest OTP Record:", latestOtpRecord);
        if (!latestOtpRecord || latestOtpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set approval flag
        const approved = accountType === "Instructor" ? false : true;

        const user = await User.create({
            firstName,
            lastName,
            mobileNumber: phone,
            email,
            gender,
            password: hashedPassword,
            accountType: accountType || "Student",
            approved,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: user._id,
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: "Signup failed. Please try again later.",
        });
    }
};

// ===================== LOGIN =====================
const login = async (req, res) => {
    try {
        const { mobileOrEmail, password } = req.body;
         console.log("login form data..... ", mobileOrEmail, password);
        if (!mobileOrEmail || !password) {
            return res.status(401).json({
                success: false,
                message: "Please fill all details",
            });
        }

        const user = await User.findOne({ $or: [{ email: mobileOrEmail }, { mobileNumber: mobileOrEmail }] });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User is not registered",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

        const token = jwt.sign(
            {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        const { password: _, ...userData } = user.toObject();

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
            success: true,
            token,
            user: userData,
            message: "User login successful",
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "There was a problem logging in",
        });
    }
};

// ===================== LOGOUT =====================
const logout = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Remove token from DB (optional for stateless JWT)
    await User.findByIdAndUpdate(userId, { $set: { token: null } });

    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in prod
      sameSite: "strict", // Prevent CSRF
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// ===================== forgetPassword =====================
const forgetPassword = async (req, res) => {

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User is not registered",
      });
    }

    // Generate new OTP
    let otpCode;
    let existOtp;
    do {
      otpCode = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      existOtp = await OTP.findOne({ otp: otpCode });
    } while (existOtp);

    await OTP.create({ email, otp: otpCode });

    // TODO: Send OTP via email (you can integrate nodemailer here)

    return res.status(200).json({
      success: true,
      message: "OTP sent for password reset",
      otp: otpCode, // ⚠️ Remove this in production
    });

  } catch (error) {
    console.error("Forget password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send password reset OTP",
    });
  }
};



export { sendotp, signup, login, logout, forgetPassword };
 