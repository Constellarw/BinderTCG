const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  iconId: {
    type: String,
    default: null
  },
  cards: [{
    card: {
      type: Object,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
deckSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Deck', deckSchema);
