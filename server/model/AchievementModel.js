import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  achievementTitle: {
    type: String,
    required: true,
    trim: true,
  },
  organization: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Academic', 'Professional', 'Leadership', 'Innovation', 'Other']
  },
  dateAchieved: {
    type: Date,
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
  relatedSkills: [
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
