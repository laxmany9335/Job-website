import mongoose from 'mongoose';

const createProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    Portfolio: {
       type: String,
    },
    bio: {
        type: String,
    }
});

export default mongoose.model('Profile', createProfileSchema);