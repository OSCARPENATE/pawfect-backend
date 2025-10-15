const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  correo: { type: String, required: true, unique: true },
  clave: { type: String, required: true },

  // 🔽 Campos adicionales (opcionales pero recomendados)
  telefono: { type: String, default: "" },
  perfil: { type: String, default: "Sin_elegir" },
  pais: { type: String, default: "" },
  ciudad: { type: String, default: "" },

  // 🔽 URLs de imágenes de Firebase Storage
  avatarUrl: { type: String, default: "" },
  portadaUrl: { type: String, default: "" },
}, { collection: "usuarios" });

module.exports = mongoose.model("Usuario", usuarioSchema);
