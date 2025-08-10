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
      enum: ["Student", "Recruiter"],
      default: "Student",
    },
    approved: {
      type: Boolean,
      default: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    education: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Education",
      }
    ],
    JobExperience: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobExperience",
      }
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      }
    ],
    skillSet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillSet",
    },
    socialLinks: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SocialLinks",
    },
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      }
    ],
    certifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certification",
      }
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
