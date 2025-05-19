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

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  } 
  if (user.password !== password) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
};

module.exports = {
  registerUser,
  loginUser
};
