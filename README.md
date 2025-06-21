# L'Atelier - Sistema de Gestión

## ¿Cómo correr el backend?

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Configura las variables de entorno (ver sección abajo).
3. Inicia el servidor:
   ```bash
   npm start
   ```
   o en desarrollo:
   ```bash
   npm run dev
   ```

## ¿Cómo correr el frontend?

1. Ve a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm start
   ```

> Puedes cambiar estos datos en la base de datos después del primer inicio.

## Dependencias necesarias

- **Node.js** (v14 o superior recomendado)
- **npm** (v6 o superior)
- **MongoDB** (local o Atlas)

## Variables de entorno

Crea un archivo `.env` en la raíz del backend con los siguientes datos:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/latelier
JWT_SECRET=tu_clave_secreta
```

Ajusta los valores según tu entorno.

## Estructura del sistema

```
Back_LAtelier/
│
├── controllers/      # Lógica de negocio (ej: dishController.js)
├── models/           # Modelos de datos (ej: Dish.js, User.js)
├── routes/           # Rutas de la API (ej: dishRoutes.js)
├── services/         # Servicios (ej: dishService.js)
├── uploads/          # Imágenes subidas
├── frontend/         # Aplicación frontend (React, Angular, etc.)
├── .env              # Variables de entorno
├── package.json
└── README.md
```

---

## Auditoría de acciones de usuario

El sistema cuenta con una funcionalidad de auditoría que registra automáticamente las acciones relevantes realizadas por los usuarios (por ejemplo: creación, modificación o eliminación de platos, usuarios, etc.).

- Cada vez que un usuario realiza una acción importante, se genera un registro de auditoría.
- Los registros de auditoría incluyen información como: usuario, acción realizada, fecha y hora, y detalles adicionales.
- Estos registros se almacenan en la base de datos (colección `audits` o similar).
- Puedes consultar estos registros para monitorear la actividad del sistema y cumplir con requisitos de trazabilidad.

---
