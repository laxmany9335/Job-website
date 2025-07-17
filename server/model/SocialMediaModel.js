import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  linkedIn: {
    type: String,
    trim: true,
  },
  github: {
    type: String,
    trim: true,
  },
  twitter: {
    type: String,
    trim: true,
  },
  instagram: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true
});

const SocialLinks = mongoose.model("SocialLinks", socialLinksSchema);
export default SocialLinks;
