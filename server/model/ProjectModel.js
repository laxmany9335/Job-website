import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  projectTitle: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  technologiesUsed: {
    type: [String],
    required: true,
  },
  yourRole: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date, 
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'On Hold'],
    required: true,
  },
  liveUrl: {
    type: String,
    trim: true,
  },
  githubUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
