import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  instituteName: {
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

    trim: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  issueDate: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: String,
    default: null,
  },
  neverExpires: {
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
  skills: [
    {
      type: String,
      trim: true,
    }
  ],
}, {
  timestamps: true
});

const Certification = mongoose.model("Certification", certificationSchema);
export default Certification;