const mongoose = require("mongoose");

const PublicacionSchema = new mongoose.Schema({
  imagenUrl: { type: String, required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  usuario: { type: String, required: true } // puedes guardar el usuario que publica
});

module.exports = mongoose.model("Publicacion", PublicacionSchema);
