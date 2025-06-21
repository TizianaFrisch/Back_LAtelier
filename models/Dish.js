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
    type: String // Ej: 'Carnes Rojas', 'Ensaladas', etc.
  },
  ingredientes: {
    type: String // Podés usar array si querés más adelante
  },
  alergenos: {
    type: String // Ej: 'Gluten, lácteos'
  },
  image: String, // Path del archivo en /uploads
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
