import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  organization: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Academic', 'Professional','Leadership','Technical','Sports','Volunteer','Creative','Research','Awards','Certifications','Other']
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  impact: {
    type: String,
    trim: true,
  },
  skills: [
    {
      type: String,
      trim: true,
    }
  ],
  certificateUrl: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true
});

const Achievement = mongoose.model("Achievement", achievementSchema);
export default Achievement;
