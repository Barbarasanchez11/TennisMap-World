import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: [true, 'Firebase UID is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        maxlength: [100, 'Email cannot be longer than 100 characters'],
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        maxlength: [200, 'Password cannot be longer than 200 characters']
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot be longer than 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot be longer than 50 characters']
    },
    displayName: {
        type: String,
        trim: true,
        maxlength: [120, 'Display name cannot be longer than 120 characters']
    },
    photoUrl: {
        type: String,
        trim: true,
        maxlength: [500, 'Photo URL cannot be longer than 500 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
})

userSchema.index({ firebaseUid: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

export default mongoose.model('User', userSchema);