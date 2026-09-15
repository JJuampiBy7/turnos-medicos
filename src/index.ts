import express from "express";
import {
  obtenerEspecialidades,
  obtenerEspecialidadPorId,
  crearEspecialidad,
  eliminarEspecialidad,
} from "./controllers/especialidades.controller.js";
import {
  obtenerProfesionales,
  obtenerProfesionalPorId,
  crearProfesional,
  actualizarProfesional,
  eliminarProfesional,
} from "./controllers/profesionales.controller.js";
import { bienvenida, rutaNoEncontrada } from "./controllers/general.controller.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());

// Ruta de bienvenida
app.get("/", bienvenida);

// ===== ESPECIALIDADES =====
app.get("/especialidades", obtenerEspecialidades);
app.get("/especialidades/:id", obtenerEspecialidadPorId);
app.post("/especialidades", crearEspecialidad);
app.delete("/especialidades/:id", eliminarEspecialidad);

// ===== PROFESIONALES MÉDICOS =====
app.get("/profesionales", obtenerProfesionales);
app.get("/profesionales/:id", obtenerProfesionalPorId);
app.post("/profesionales", crearProfesional);
app.put("/profesionales/:id", actualizarProfesional);
app.delete("/profesionales/:id", eliminarProfesional);

// Middleware 404 global — siempre al final, antes de listen
app.use(rutaNoEncontrada);

app.listen(PORT, () => {
  console.log(`Servidor TurnosMed corriendo en http://localhost:${PORT}`);
});