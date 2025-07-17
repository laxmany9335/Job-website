import mongoose from "mongoose";

const skillSetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  technicalSkills: [
    {
      name: { type: String, required: true },
      proficiency: { type: Number, min: 0, max: 100, required: true }, // percentage
    }
  ],

  softSkills: [
    {
      type: String,
      trim: true,
    }
  ]
}, {
  timestamps: true
});

const SkillSet = mongoose.model("SkillSet", skillSetSchema);
export default SkillSet;
