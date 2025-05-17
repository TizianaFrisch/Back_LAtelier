const Dish = require('../models/Dish');

const createDish = async (dishData) => {
  const newDish = new Dish(dishData);
  return await newDish.save();
};

const getDishes = async (filters) => {
  return await Dish.find(filters);
};

const updateDish = async (id, data) => {
  return await Dish.findByIdAndUpdate(id, data, { new: true });
};

const deleteDish = async (id) => {
  return await Dish.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

module.exports = {
  createDish,
  getDishes,
  updateDish,
  deleteDish
};
