import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // recruiter or admin who created the job
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Freelance", "Contract"],
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  responsibilities: [
    {
      type: String,
    }
  ],
  requirements: [
    {
      type: String,
    }
  ],
  skillsRequired: [
    {
      type: String,
    }
  ],
  salaryRange: {
    min: { type: Number },
    max: { type: Number },
  },
  applicationDeadline: {
    type: Date,
  },
  applyUrl: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Open", "Closed"],
    default: "Open",
  },
}, {
  timestamps: true
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
