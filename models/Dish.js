const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: {
  type: String,
  enum: ['entrada', 'principal', 'postre', 'bebida', 'ensalada', 'bebida_alcoholica'],
  required: true
},
  subcategory: {
    type: String 
  },
  ingredientes: {
    type: String 
  },
  alergenos: {
    type: String 
  },
  image: String,
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Dish', dishSchema);
