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

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Delete any existing OTPs for this email to prevent spam
        await OTP.deleteMany({ email });

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

        // Save OTP to DB with expiration
        const otpBody = await OTP.create({ 
            email, 
            otp: otpCode,
            createdAt: new Date()
        });
        console.log("OTP Created:", otpBody._id);

        // Send OTP via email
        try {
            // Uncomment when you have email service configured
            // await mailSender(
            //     email, 
            //     "Your OTP Code", 
            //     `Your OTP for account verification is: ${otpCode}. This OTP will expire in 10 minutes.`
            // );
            console.log(`OTP for ${email}: ${otpCode}`); // Remove in production
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // Delete the OTP if email fails
            await OTP.deleteOne({ _id: otpBody._id });
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email. Please try again.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email",
            // Don't send OTP in production
            ...(process.env.NODE_ENV === "development" && { otp: otpCode }),
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "There was a problem sending the OTP. Please try again.",
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
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({  email  });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? 
                    "User with this email already exists" : 
                    "User with this phone number already exists",
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

        // Check OTP expiry (10 minutes)
        const otpAge = Date.now() - latestOtpRecord.createdAt.getTime();
        if (otpAge > 10 * 60 * 1000) {
            // Delete expired OTP
            await OTP.deleteOne({ _id: latestOtpRecord._id });
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Set approval flag
        const approved = accountType === "Instructor" ? false : true;
        const finalAccountType = accountType || "Student";

        // Validate account type
        const validAccountTypes = ["Student", "Instructor", "Admin"];
        if (!validAccountTypes.includes(finalAccountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type",
            });
        }

        // Create user
        const user = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            mobileNumber: phone,
            email: email.toLowerCase(),
            gender,
            password: hashedPassword,
            accountType: finalAccountType,
            approved,
        });

        // Remove used OTP
        await OTP.deleteOne({ _id: latestOtpRecord._id });

        // Send welcome email
        try {
            // Uncomment when email service is configured
            // await mailSender(
            //     email,
            //     "Welcome to Our Platform",
            //     `Hello ${firstName},\n\nWelcome to our platform! Your account has been created successfully.`
            // );
        } catch (emailError) {
            console.error("Error sending welcome email:", emailError);
            // Don't fail signup if welcome email fails
        }

        // Remove password from response
        const { password: _, ...userResponse } = user.toObject();

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse,
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

        // Validate input
        if (!mobileOrEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email/phone and password",
            });
        }

        // Normalize input
        const normalizedInput = mobileOrEmail.toLowerCase().trim();

        // Find user by email or mobile number
        const user = await User.findOne({ 
            $or: [
                { email: normalizedInput }, 
                { mobileNumber: normalizedInput }
            ] 
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please sign up first",
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

        // Check if JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not found in environment variables");
            return res.status(500).json({
                success: false,
                message: "Server configuration error",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // Remove password from user object
        const { password: _, ...userData } = user.toObject();

        // Set cookie options
        const cookieOptions = {
            httpOnly: false,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        };

        return res.status(200)
            .cookie("token", token, cookieOptions)
            .json({
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
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        console.log(`User ${userId} logging out`);

        // Clear the cookie with same options as when it was set
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
        };

        res.clearCookie("token", cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Logout failed. Please try again.",
        });
    }
};

// ===================== CHANGE PASSWORD =====================
const changePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Check if user is authenticated
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

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

        // Validate new password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
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

        if (!updatedUserDetails) {
            return res.status(404).json({
                success: false,
                message: "Failed to update password",
            });
        }

        // Send notification email
        try {
            // Uncomment when email service is configured
            // await mailSender(
            //     updatedUserDetails.email,
            //     "Password Updated Successfully",
            //     `Hello ${updatedUserDetails.firstName} ${updatedUserDetails.lastName},\n\nYour password has been updated successfully.\n\nIf you did not make this change, please contact support immediately.`
            // );
            console.log("Password change notification email sent successfully");
        } catch (emailError) {
            console.error("Error sending password change email:", emailError);
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
            message: "Error occurred while updating password. Please try again.",
        });
    }
};

export { sendotp, signup, login, logout, changePassword };