const express = require('express');
const router = express.Router();
const Audit = require('../models/Audit');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auditoría
 *   description: Endpoints para gestionar y consultar logs de auditoría
 */

/**
 * @swagger
 * /api/audit:
 *   get:
 *     summary: Obtener logs de auditoría del sistema
 *     tags: [Auditoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de acción (ej. "Crear plato", "Actualizar plato")
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Filtrar por ID de usuario
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar (formato YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar (formato YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de logs de auditoría obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID único del log de auditoría
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       nombre:
 *                         type: string
 *                   action:
 *                     type: string
 *                     description: Acción realizada
 *                     example: "Crear plato"
 *                   details:
 *                     type: object
 *                     description: Detalles específicos de la acción
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha y hora del evento
 *       401:
 *         description: Token no válido o no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
// Log para verificar si entra a la ruta
router.get('/', authMiddleware, async (req, res) => {
  console.log('🟢 Ruta /api/audit llamada por:', req.user?.email || 'desconocido');

  try {
    const audits = await Audit.find().populate('user', 'email nombre');
    console.log(`🔍 Se encontraron ${audits.length} logs de auditoría.`);
    res.json(audits);
  } catch (err) {
    console.error('❌ Error al obtener auditorías:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

