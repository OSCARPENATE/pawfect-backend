// server.js
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const usuariosRoutes = require("./usuarios.js");

// ✅ Configuración de CORS
const allowedOrigins = [
  "https://repositorio-pawfect.web.app", // 🔸 Tu frontend en Firebase Hosting
  "http://localhost:5500",               // 🔸 Para pruebas locales con Vite/React
  "http://localhost:3000",               // 🔸 O si usas otro puerto local
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Si no hay origin (por ejemplo, Postman) permitirlo
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`❌ CORS bloqueado para origen: ${origin}`);
        return callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true, // Permite enviar cookies o headers de autorización
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(express.static("public"));

// ✅ Rutas
app.use("/api/users", usuariosRoutes);

// ✅ Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado correctamente a MongoDB Atlas'))
  .catch((error) => console.error('❌ Error de conexión a MongoDB:', error));

// ✅ Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando y conectado a MongoDB Atlas');
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
