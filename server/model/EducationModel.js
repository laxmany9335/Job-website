import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, 
  },
  degree: {
    type: String,
    required: true,
    trim: true,
  },
  studyField: {
    type: String,
    required: true,
    trim: true,
  },
  instituteName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  startYear: {
    type: String,
    default: null,
  },
  endYear: {
    type: String, 
    default: null,
  },
  currentlyStudying: {
    type: Boolean,
    default: false,
  },
  grade: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true
});

const Education = mongoose.model("Education", educationSchema);
export default Education;
