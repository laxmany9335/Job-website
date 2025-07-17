import mongoose from 'mongoose';

const jobExperienceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Temporary'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
  currentlyWorking: {
    type: Boolean,
    default: false,
  },
  jobDescription: {
    type: String,
  },
  keyResponsibilities: [
    {
      type: String,
    }
  ],
  keyAchievements: [
    {
      type: String,
    }
  ],
  skillsUsed: [
    {
      type: String,
    }
  ],
}, {
  timestamps: true
});

export default mongoose.model('JobExperience', jobExperienceSchema);
