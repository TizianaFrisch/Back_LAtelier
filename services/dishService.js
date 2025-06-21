const Dish = require('../models/Dish');

// Crear plato con nuevos campos
const createDish = async ({
  name,
  description,
  price,
  category,
  ingredientes,
  alergenos,
  subcategory,
  image,
  createdBy
}) => {
  const newDish = new Dish({
    name,
    description,
    price,
    category,
    ingredientes,
    alergenos,
    subcategory,
    image,
    createdBy
  });
  return await newDish.save();
};

// Obtener platos
const getDishes = async (filters) => {
  return await Dish.find(filters);
};

// Actualizar plato con nuevos campos
const updateDish = async (id, data) => {
  // Solo permitimos actualizar los campos relevantes
  const {
    name,
    description,
    price,
    category,
    ingredientes,
    alergenos,
    subcategory,
    image
  } = data;

  return await Dish.findByIdAndUpdate(
    id,
    {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(category !== undefined && { category }),
      ...(ingredientes !== undefined && { ingredientes }),
      ...(alergenos !== undefined && { alergenos }),
      ...(subcategory !== undefined && { subcategory }),
      ...(image !== undefined && { image })
    },
    { new: true }
  );
};

const deleteDish = async (id) => {
  return await Dish.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

const getDishById = async (id) => {
  return await Dish.findById(id);
};

module.exports = {
  createDish,
  getDishes,
  updateDish,
  deleteDish,
  getDishById
};
