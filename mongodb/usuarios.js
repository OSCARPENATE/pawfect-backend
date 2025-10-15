const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Usuario = require("../Models/ModelUsuario");
const Publicacion = require("../Models/ModelPublicacion");

// ✅ Registro
router.post("/register", async (req, res) => {
  try {
    const { nombre, usuario, correo, clave } = req.body;

    // Verificar si ya existe el usuario o correo
    const usuarioExistente = await Usuario.findOne({ $or: [{ usuario }, { correo }] });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El usuario o correo ya está registrado." });
    }

    // Hashear la contraseña
    const claveEncriptada = await bcrypt.hash(clave, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      usuario,
      correo,
      clave: claveEncriptada
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario registrado correctamente." });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ mensaje: "Error al registrar usuario." });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { usuario, clave } = req.body;

    const user = await Usuario.findOne({ usuario });
    if (!user) {
      return res.status(400).json({ mensaje: "Usuario no encontrado." });
    }

    const claveValida = await bcrypt.compare(clave, user.clave);
    if (!claveValida) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta." });
    }

    // ✅ Responder con los datos del usuario
    res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      usuario: {
        nombre: user.nombre,
        usuario: user.usuario,
        correo: user.correo,
      },
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});

// ✅ Actualizar avatar y portada del usuario
router.post("/update-images", async (req, res) => {
  try {
    const { usuario, avatarUrl, portadaUrl, correo, telefono, perfil, pais, ciudad } = req.body;

    if (!usuario) {
      return res.status(400).json({ mensaje: "Usuario no especificado." });
    }

    // Buscar y actualizar el usuario
    const actualizado = await Usuario.findOneAndUpdate(
      { usuario },
      {
        $set: {
          correo,
          telefono,
          perfil,
          pais,
          ciudad,
          avatarUrl,
          portadaUrl,
        },
      },
      { new: true } // Devuelve el documento actualizado
    );

    if (!actualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    res.json({
      mensaje: "Datos e imágenes actualizados correctamente.",
      usuario: actualizado,
    });

  } catch (error) {
    console.error("Error al actualizar imágenes:", error);
    res.status(500).json({ mensaje: "Error al actualizar imágenes." });
  }
});


// ✅ Obtener datos de un usuario por nombre de usuario
router.get("/get-user/:usuario", async (req, res) => {
  try {
    const { usuario } = req.params;

    // Buscar usuario
    const user = await Usuario.findOne({ usuario }, { clave: 0 }); // solo excluimos clave

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Enviar respuesta
    res.status(200).json({
      mensaje: "Usuario obtenido correctamente.",
      usuario: user,
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener datos del usuario.", error: error.message });
  }
});

// ✅ Crear nueva publicación
router.post("/publicar", async (req, res) => {
  try {
    const { usuario, imagenUrl, titulo, descripcion } = req.body;

    if (!usuario || !imagenUrl || !titulo || !descripcion) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
    }

    const nuevaPublicacion = new Publicacion({
      usuario,
      imagenUrl,
      titulo,
      descripcion
    });

    await nuevaPublicacion.save();

    res.status(201).json({ mensaje: "Publicación creada correctamente.", publicacion: nuevaPublicacion });
  } catch (error) {
    console.error("Error al crear publicación:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});

// ✅ Obtener todas las publicaciones de un usuario
router.get("/publicaciones/:usuario", async (req, res) => {
  try {
    const { usuario } = req.params;

    if (!usuario) {
      return res.status(400).json({ mensaje: "Usuario no especificado." });
    }

    // Buscar publicaciones que pertenezcan al usuario
    const publicaciones = await Publicacion.find({ usuario }).sort({ _id: -1 }); // orden descendente (más recientes primero)

    // Si no hay publicaciones
    if (!publicaciones || publicaciones.length === 0) {
      return res.status(200).json({ mensaje: "No hay publicaciones para este usuario.", publicaciones: [] });
    }

    // Enviar publicaciones
    res.status(200).json({
      mensaje: "Publicaciones obtenidas correctamente.",
      publicaciones
    });

  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ mensaje: "Error al obtener publicaciones del usuario." });
  }
});

// ✅ Obtener todas las publicaciones (de todos los usuarios)
router.get("/publicaciones", async (req, res) => {
  try {
    // Buscar todas las publicaciones ordenadas por más recientes primero
    const publicaciones = await Publicacion.find().sort({ _id: -1 });

    if (!publicaciones || publicaciones.length === 0) {
      return res.status(200).json({ mensaje: "No hay publicaciones disponibles.", publicaciones: [] });
    }

    res.status(200).json({
      mensaje: "Publicaciones obtenidas correctamente.",
      publicaciones
    });

  } catch (error) {
    console.error("Error al obtener todas las publicaciones:", error);
    res.status(500).json({ mensaje: "Error al obtener publicaciones." });
  }
});


module.exports = router;
