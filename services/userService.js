const User = require('../models/User');

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteUser = async (id, deletedById) => {
  return await User.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedBy: deletedById,
      deletedAt: new Date()
    },
    { new: true }
  );
};
const getUsers = async (filters) => {
  return await User.find({ ...filters, isDeleted: false }).select('-password');
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsers
};
