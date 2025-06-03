import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    image: {
      type: String,
    },
    token: {
			type: String,
		},
    resetPasswordExpires: {
			type: Date,
		},
    accountType: {
      type: String,
      enum: ["Student", "Instructor"],
      default: "Student",
    },
    approved: {
      type: Boolean,
      default: true, // true for students, false for instructors until admin approval
    },
    // You can add profile image, bio, or other optional fields later
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

export default mongoose.model("User", userSchema);
