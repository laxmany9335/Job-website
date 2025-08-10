import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true,
    trim: true,
  },
  technologies: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    trim: true,
    default: '',
  },
  startDate: {
    type: Date, 
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'On Hold', 'Cancelled'],
    default: 'In Progress',
  },
  liveUrl: {
    type: String,
    trim: true,
    default: '',
  },
  githubUrl: {
    type: String,
    trim: true,
    default: '',
  },
  currentlyWorking: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

// Add validation to ensure endDate is after startDate when both are provided
projectSchema.pre('save', function(next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

// If currently working, endDate should be null and status should be 'In Progress'
projectSchema.pre('save', function(next) {
  if (this.currentlyWorking) {
    this.endDate = null;
    this.status = 'In Progress';
  }
  next();
});

const Project = mongoose.model("Project", projectSchema);
export default Project;