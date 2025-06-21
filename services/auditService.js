const Audit = require('../models/Audit');

const registerAudit = async ({ user, action, details }) => {
  await Audit.create({ user, action, details });
};

module.exports = { registerAudit };