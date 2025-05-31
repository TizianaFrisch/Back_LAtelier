const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const bcrypt = require('bcryptjs');


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};


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

  console.log("Login recibido:", email); 

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      console.log(" Usuario no encontrado"); 
      return res.status(401).json({ message: 'El usuario no existe' });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      console.log(" Contraseña incorrecta"); 
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log(" Login exitoso:", user.email); 

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(" Error inesperado en login:", error); 
    return res.status(500).json({ message: 'Error interno al iniciar sesión' });
  }
};

const getProfile = async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id);
    const user = await userService.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
   
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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = { ...req.body };
    delete updates.email;
    delete updates.password;

    const updatedUser = await userService.updateUser(id, updates);

    if (!updatedUser || updatedUser.isDeleted) {
      return res.status(404).json({ message: 'Usuario no encontrado o eliminado' });
    }

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await userService.deleteUser(id, req.user.id);

    if (!deleted || deleted.isDeleted !== true) {
      return res.status(404).json({ message: 'Usuario no encontrado o ya eliminado' });
    }

    res.json({ message: 'Usuario eliminado lógicamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

const getUsers = async (req, res) => {
  try {
    const filters = {};
    if (req.query.name) filters.name = { $regex: req.query.name, $options: 'i' };
    if (req.query.role) filters.role = req.query.role;

    const users = await userService.getUsers(filters);
    res.json(users);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ message: 'Error al listar usuarios' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateUser,
  deleteUser,   
  getUsers      
};


