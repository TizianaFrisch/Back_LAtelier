const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const bcrypt = require('bcryptjs');

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
    return res.status(401).json({ message: 'El usuario no existe' });
  } 
  
  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
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


const getProfile = async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id);
    const user = await userService.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    // Devolver toda la información del usuario excepto la contraseña
    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.json(userInfo);
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile
};
