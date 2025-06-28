const dishService = require('../services/dishService');
const { registerAudit } = require('../services/auditService');

// Crear plato
const createDish = async (req, res) => {
  try {
    const { name, description, price, category, ingredientes, alergenos, subcategory } = req.body;
    const image = req.file?.filename;

    if (isNaN(parseFloat(price))) {
      return res.status(400).json({ message: "Precio inválido" });
    }

  const dish = await dishService.createDish({
  name,
  description,
  price: parseFloat(price), // ¡acordate esto también!
  category,
  ingredientes,
  alergenos,
  subcategory,
  image,
  createdBy: req.user ? req.user._id : null // 👈 CAMBIO CLAVE
});


    await registerAudit({
      user: req.user ? req.user._id : null,
      action: 'Crear plato',
      details: {
        dishId: dish._id,
        name: dish.name,
        createdBy: req.user ? req.user.email : 'desconocido'
      }
    });

    res.status(201).json(dish);
  } catch (error) {
    console.error("Error en createDish:", error); // 👈 agregalo para ver el stack
    res.status(500).json({ message: 'Error al crear el plato' });
  }
};



// Listar platos
const getDishes = async (req, res) => {
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

// Obtener plato por ID
const getDishById = async (req, res) => {
  try {
    const dish = await dishService.getDishById(req.params.id);
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el plato' });
  }
};

// Modificar plato
const updateDish = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Si no se subió una nueva imagen y tampoco se pasó una imagen, no borrar la existente
    if (req.file) {
      updates.image = req.file.filename;
    } else if (req.body.image) {
      updates.image = req.body.image; // puede ser una URL o el filename anterior
    }

    const updated = await dishService.updateDish(req.params.id, updates);
    if (!updated) return res.status(404).json({ message: 'Plato no encontrado' });

    await registerAudit({
      user: req.user ? req.user._id : null,
      action: 'Actualizar plato',
      details: {
        dishId: updated._id,
        name: updated.name,
        updatedBy: req.user ? req.user.email : 'desconocido'
      }
    });

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

    await registerAudit({
      user: req.user ? req.user._id : null,
      action: 'Eliminar plato',
      details: {
        dishId: deleted._id,
        name: deleted.name,
        deletedBy: req.user ? req.user.email : 'desconocido'
      }
    });

    res.json({ message: 'Plato eliminado lógicamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar plato' });
  }
};

module.exports = {
  createDish,
  getDishes,
  updateDish,
  deleteDish,
  getDishById
};
