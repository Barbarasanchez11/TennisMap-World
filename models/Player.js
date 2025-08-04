const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  // Datos básicos
  firstName: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true,
    maxlength: [50, 'El apellido no puede tener más de 50 caracteres']
  },
  nationality: {
    type: String,
    required: [true, 'La nacionalidad es obligatoria'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'La fecha de nacimiento es obligatoria']
  },
  
  // Datos deportivos
  ranking: {
    type: Number,
    min: [0, 'El ranking no puede ser negativo']
  },
  points: {
    type: Number,
    default: 0,
    min: [0, 'Los puntos no pueden ser negativos']
  },
  dominantHand: {
    type: String,
    enum: ['derecha', 'izquierda', 'ambidiestro'],
    default: 'derecha'
  },
  gender: {
    type: String,
    enum: ['masculino', 'femenino'],
    required: [true, 'El género es obligatorio']
  },
  
  // Ubicación
  country: {
    type: String,
    required: [true, 'El país es obligatorio'],
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
      required: [true, 'Las coordenadas son obligatorias']
    }
  },
  
  // Estado
  isActive: {
    type: Boolean,
    default: true
  },
  currentTournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  
  // Redes sociales
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
  
  // Información adicional
  height: {
    type: Number,
    min: [100, 'La altura debe ser al menos 100cm'],
    max: [250, 'La altura no puede ser más de 250cm']
  },
  weight: {
    type: Number,
    min: [30, 'El peso debe ser al menos 30kg'],
    max: [150, 'El peso no puede ser más de 150kg']
  },
  
  // Imagen del jugador
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índice geográfico para búsquedas por ubicación
playerSchema.index({ coordinates: '2dsphere' });

// Índice para búsquedas por nombre
playerSchema.index({ firstName: 1, lastName: 1 });

// Virtual para nombre completo
playerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual para edad
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

module.exports = mongoose.model('Player', playerSchema); 