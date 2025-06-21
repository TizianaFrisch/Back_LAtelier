const express = require('express');
const router = express.Router();
const Audit = require('../models/Audit');
const authMiddleware = require('../middleware/authMiddleware');


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
