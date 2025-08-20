import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  certificationName: {
    type: String,
    required: true,
    trim: true,
  },
  issuingOrganization: {
    type: String,
    required: true,
    trim: true,
  },
  credentialId: {
    type: String,
    trim: true,
  },
  level: {
    type: String,
    required: true,
    trim: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  doesNotExpire: {
    type: Boolean,
    default: false,
  },
  credentialUrl: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  skillsValidated: [
    {
      type: String,
      trim: true,
    }
  ],
  cost: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

const Certification = mongoose.model("Certification", certificationSchema);
export default Certification;
