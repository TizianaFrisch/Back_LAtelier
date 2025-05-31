const User = require('../models/User');
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'LAtelier123',
        role: 'admin'
      });

      await admin.save(); 

      console.log('🛠 Usuario admin por defecto creado: admin@example.com / LAtelier123');
    } else {
      console.log(' Admin existente detectado');
    }
  } catch (error) {
    console.error('Error creando admin por defecto:', error);
  }
};

module.exports = {
  connectDB,
  createDefaultAdmin 
};
