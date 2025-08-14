import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  description: {
    type: String,
    trim: true
  },
  surface: {
    type: String,
    enum: ['clay', 'grass', 'hard', 'carpet']
  },
  category: {
    type: String,
    enum: ['ATP', 'WTA', 'ITF', 'Challenger', 'Futures', 'Grand Slam']
  },
  prizeMoney: {
    type: Number,
    min: 0
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  country: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  externalId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

tournamentSchema.index({ location: '2dsphere' });
tournamentSchema.index({ startDate: 1, endDate: 1 });
tournamentSchema.index({ category: 1 });
tournamentSchema.index({ surface: 1 });

export default mongoose.model('Tournament', tournamentSchema); 