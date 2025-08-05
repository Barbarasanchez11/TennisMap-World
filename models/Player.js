import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
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
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  
 
  ranking: {
    type: Number,
    min: [0, 'Ranking cannot be negative']
  },
  points: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  dominantHand: {
    type: String,
    enum: ['right', 'left', 'ambidextrous'],
    default: 'right'
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Gender is required']
  },
  
 
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Coordinates are required']
    }
  },
  
  
  isActive: {
    type: Boolean,
    default: true
  },
  currentTournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  

  socialMedia: {
    twitter: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    }
  },
  

  height: {
    type: Number,
    min: [100, 'Height must be at least 100cm'],
    max: [250, 'Height cannot be more than 250cm']
  },
  weight: {
    type: Number,
    min: [30, 'Weight must be at least 30kg'],
    max: [150, 'Weight cannot be more than 150kg']
  },
  
  
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true, 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

playerSchema.index({ coordinates: '2dsphere' });

playerSchema.index({ firstName: 1, lastName: 1 });


playerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

playerSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

export default mongoose.model('Player', playerSchema); 