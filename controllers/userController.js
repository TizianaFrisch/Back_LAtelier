const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const bcrypt = require('bcryptjs');
const { registerAudit } = require('../services/auditService');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await userService.findUserByEmail(email);
    if (userExists && !userExists.isDeleted) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await userService.createUser({ name, email, password, role });

    // Auditoría
    await registerAudit({
      user: user._id,
      action: 'Registro de usuario',
      details: { email: user.email, name: user.name }
    });

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

    if (!user || user.isDeleted) {
      console.log(" Usuario no encontrado o eliminado"); 
      return res.status(401).json({ message: 'El usuario no existe o fue eliminado' });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      console.log(" Contraseña incorrecta"); 
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log(" Login exitoso:", user.email); 

    // Auditoría
    await registerAudit({
      user: user._id,
      action: 'Login de usuario',
      details: { email: user.email }
    });

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
    delete updates.email; // Opcional: no permitir cambiar email

    // Si se envía una nueva contraseña, hashearla
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await userService.updateUser(id, updates);

    if (!updatedUser || updatedUser.isDeleted) {
      return res.status(404).json({ message: 'Usuario no encontrado o eliminado' });
    }

    await registerAudit({
      user: req.user ? req.user._id : null,
      action: 'Actualizar usuario',
      details: { updatedUserId: updatedUser._id, updates: { ...updates, password: updates.password ? '***' : undefined } }
    });

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

    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado o ya eliminado' });
    }

 
    await registerAudit({
      user: req.user ? req.user._id : null,
      action: 'Eliminar usuario',
      details: { deletedUserId: deleted._id }
    });

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

const createUser = async (req, res) => {
  try {
    console.log("Crear usuario recibido:", req.body);
    const user = await userService.createUser(req.body);

    // Auditoría
    await registerAudit({
      user: req.user ? req.user._id : null,
      action: 'Crear usuario (admin)',
      details: { createdUserId: user._id, email: user.email }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });  
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.findUserById(id);

    
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'Usuario no encontrado o eliminado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ message: 'Error al obtener usuario por ID' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateUser,
  deleteUser,   
  getUsers,
  createUser,
  getUserById 
};

