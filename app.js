const express = require('express');
const dotenv = require('dotenv');
const { connectDB, createDefaultAdmin } = require('./config/db'); // <-- Agregás esto
const cors = require('cors');

const dishRoutes = require('./routes/dishRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

// Conectás a la DB y luego creás el admin
connectDB().then(() => {
  createDefaultAdmin(); // <-- Acá se crea si no existe
});

const app = express();

// Configuración de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/dishes', dishRoutes);
app.use('/api/users', userRoutes);

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});