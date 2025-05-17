const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

// Función para generar el token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// 👉 Registro
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await userService.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await userService.createUser({ name, email, password });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

module.exports = {
  registerUser
};
