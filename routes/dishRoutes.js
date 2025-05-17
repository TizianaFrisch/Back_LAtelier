const express = require('express');
const router = express.Router();
const {
  createDish,
  getDishes,
  updateDish,
  deleteDish
} = require('../controllers/dishController');

/**
 * @swagger
 * tags:
 *   name: Platos
 *   description: Endpoints para gestionar platos del restaurante
 */

/**
 * @swagger
 * /api/dishes:
 *   get:
 *     summary: Obtener lista de platos
 *     tags: [Platos]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Buscar por nombre (texto parcial)
 *     responses:
 *       200:
 *         description: Lista de platos obtenida exitosamente
 */
router.get('/', getDishes);

/**
 * @swagger
 * /api/dishes:
 *   post:
 *     summary: Crear un nuevo plato
 *     tags: [Platos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [entrada, principal, postre, bebida]
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Plato creado correctamente
 */
router.post('/', createDish);

/**
 * @swagger
 * /api/dishes/{id}:
 *   put:
 *     summary: Actualizar un plato
 *     tags: [Platos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del plato a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plato actualizado
 */
router.put('/:id', updateDish);

/**
 * @swagger
 * /api/dishes/{id}:
 *   delete:
 *     summary: Eliminar lógicamente un plato
 *     tags: [Platos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del plato a eliminar
 *     responses:
 *       200:
 *         description: Plato eliminado lógicamente
 */
router.delete('/:id', deleteDish);

module.exports = router;
