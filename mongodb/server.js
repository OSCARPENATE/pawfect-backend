// server.js
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const usuariosRoutes = require("./usuarios.js");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Rutas
app.use("/api/users", usuariosRoutes);

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado correctamente a MongoDB Atlas'))
  .catch((error) => console.error('Error de conexión a MongoDB:', error));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando y conectado a MongoDB Atlas');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

