import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTP from "../model/OTPModel.js";
import User from "../model/userModel.js";

// ===================== SEND OTP =====================
const sendotp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Email for OTP:", email);
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email address",
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
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
        console.log("OTP Created:", otpBody._id);

        // Send OTP via email (implement your email service here)
        // await mailSender(email, "Your OTP Code", `Your OTP is: ${otpCode}`);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            // Don't send OTP in production
            ...(process.env.NODE_ENV === "development" && { otp: otpCode }),
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "There was a problem sending the OTP",
        });
    }
};

// const isExistingUser = async (email, phone) => {
//     try {
//         const user = await User.findOne({
//             $or: [{ email }, { mobileNumber: phone }]
//         });
//         return user !== null;
//     } catch (error) {
//         console.error("Error checking existing user:", error);
//         throw new Error("Database error");
//     }
// };

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
        
        console.log("Signup attempt for:", email);

        // Check required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !gender ||
            !password ||
            !confirmPassword ||
            !otp
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details",
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        // Validate phone number (basic validation)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid 10-digit phone number",
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
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
                message: "User already exists",
            });
        }

        // Get latest OTP and validate
        const latestOtpRecord = await OTP.findOne({ email })
            .sort({ createdAt: -1 })
            .limit(1);
            
        if (!latestOtpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found. Please request a new OTP",
            });
        }

        if (latestOtpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Check OTP expiry (assuming OTP expires after 10 minutes)
        const otpAge = Date.now() - latestOtpRecord.createdAt.getTime();
        if (otpAge > 10 * 60 * 1000) { // 10 minutes in milliseconds
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Set approval flag
        const approved = accountType === "Instructor" ? false : true;

        // Create user
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

        // Remove used OTP
        await OTP.deleteOne({ _id: latestOtpRecord._id });

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
        if (!mobileOrEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email/phone and password",
            });
        }

        // Find user by email or mobile number
        const user = await User.findOne({ 
            $or: [{ email: mobileOrEmail }, { mobileNumber: mobileOrEmail }] 
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please First sign up",
            });
        }

        // Check if account is approved (for instructors)
        if (user.accountType === "Instructor" && !user.approved) {
            return res.status(403).json({
                success: false,
                message: "Your account is pending approval. Please contact support",
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                email: user.email || user.mobileNumber,
                id: user._id,
                accountType: user.accountType,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        // Remove password from user object
        const { password: _, ...userData } = user.toObject();

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            token,
            user: userData,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again later",
        });
    }
};

// ===================== LOGOUT =====================
const logout = async (req, res) => {
    console.log("logout............................................................")
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        // Clear the cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
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

// ===================== CHANGE PASSWORD =====================
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Validate input
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long",
            });
        }

        // Get user details
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Check if new password is different from old password
        const isSamePassword = await bcrypt.compare(newPassword, userDetails.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password",
            });
        }

        // Hash new password
        const encryptedPassword = await bcrypt.hash(newPassword, 12);
        
        // Update password
        const updatedUserDetails = await User.findByIdAndUpdate(
            userId,
            { password: encryptedPassword },
            { new: true }
        );

        // Send notification email
        try {
            await mailSender(
                updatedUserDetails.email,
                "Password Updated Successfully",
                `Hello ${updatedUserDetails.firstName} ${updatedUserDetails.lastName},\n\nYour password has been updated successfully.\n\nIf you did not make this change, please contact support immediately.`
            );
            console.log("Password change notification email sent successfully");
        } catch (error) {
            console.error("Error sending password change email:", error);
            // Don't fail the request if email fails
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
        });
    }
};
export { sendotp, signup, login, logout, changePassword };