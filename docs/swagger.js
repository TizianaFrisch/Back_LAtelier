const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Carta de Restaurante',
      version: '1.0.0',
      description: 'Documentación de la API del TPO - Backend de platos y usuarios'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor local'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
