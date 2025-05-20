const dishService = require('../services/dishService');

// Crear plato
const createDish = async (req, res) => {
  try {
    const dish = await dishService.createDish(req.body);
    res.status(201).json(dish);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el plato' });
  }
};

// Listar platos
const getDishes = async (req, res) => {
  console.log('entro aca')
  try {
    const filter = { isDeleted: false };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.name)
      filter.name = { $regex: req.query.name, $options: 'i' };

    const dishes = await dishService.getDishes(filter);
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar platos' });
  }
};

// Modificar
const updateDish = async (req, res) => {
  try {
    const updated = await dishService.updateDish(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Plato no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar plato' });
  }
};

// Eliminar lógico
const deleteDish = async (req, res) => {
  try {
    const deleted = await dishService.deleteDish(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Plato no encontrado' });
    res.json({ message: 'Plato eliminado lógicamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar plato' });
  }
};

module.exports = {
  createDish,
  getDishes,
  updateDish,
  deleteDish
};
