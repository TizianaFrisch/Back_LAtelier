const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createDish,
  getDishes,
  updateDish,
  deleteDish,
  getDishById
} = require('../controllers/dishController');
const authMiddleware = require('../middleware/authMiddleware');

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
 * /api/dishes/{id}:
 *   get:
 *     summary: Obtener un plato por ID
 *     tags: [Platos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del plato
 *     responses:
 *       200:
 *         description: Detalle del plato
 */
router.get('/:id', getDishById);

/**
 * @swagger
 * /api/dishes:
 *   post:
 *     summary: Crear un nuevo plato
 *     tags: [Platos]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *                 format: binary
 *     responses:
 *       201:
 *         description: Plato creado correctamente
 */
router.post('/', authMiddleware, upload.single('image'), createDish);

/**
 * @swagger
 * /api/dishes/{id}:
 *   put:
 *     summary: Actualizar un plato
 *     tags: [Platos]
 *     consumes:
 *       - multipart/form-data
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
 *         multipart/form-data:
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
 *                 format: binary
 *     responses:
 *       200:
 *         description: Plato actualizado
 */
router.put('/:id', authMiddleware, upload.single('image'), updateDish);

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
router.delete('/:id', authMiddleware, deleteDish);

module.exports = router;
