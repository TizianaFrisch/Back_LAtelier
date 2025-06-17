const express = require('express');
const dotenv = require('dotenv');
const { connectDB, createDefaultAdmin } = require('./config/db'); 
const cors = require('cors');

const dishRoutes = require('./routes/dishRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

connectDB().then(() => {
  createDefaultAdmin(); 
});

const app = express();

app.use(cors({
  origin: ['https://latelier-system-front.vercel.app', 'http://localhost:5173'],
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