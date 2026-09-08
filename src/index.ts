import { configuracionAgenda, arrayProfesionales, arrayEspecialidades } from "./resources.js"; 
import express, {type Request, type Response} from "express";
import type { Especialidad, Profesional} from "./resources.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());

//endpoints
app.get("/", (req: Request, res: Response) => {
  res.status(200)
  .json({success: true, message: "Bienvenido a la API de Turnos Médicos"});

});

app.get("/especialidades", (req, res) => {
  try {
    res.status(200)
    .json(arrayEspecialidades);
  } catch (error) {
    res.status(400)
    .json({success: false, message: "Error al obtener las especialidades"}); 
  }
});

// b) Buscar y retornar una especialidad específica según su especialidadId
app.get("/especialidades/:id", (req, res) => {
  try {
    const especialidadId = Number(req.params.id);

    if (isNaN(especialidadId)) {
      res.status(400)
        .json({ success: false, message: "El id debe ser un número válido" });
      return;
    }

    const especialidadSolicitada = arrayEspecialidades.find(
      (especialidad: Especialidad) => especialidad.especialidadId === especialidadId
    );

    if (!especialidadSolicitada) {
      res.status(404)
        .json({ success: false, message: "Especialidad no encontrada" });
      return;
    }

    console.clear();
    console.table(especialidadSolicitada);
    res.status(200)
      .json(especialidadSolicitada);
  } catch (error) {
    res.status(500)
      .json({ success: false, message: "Error al obtener la especialidad" });
  }
});

// c) Crear e integrar una nueva especialidad al listado
app.post("/especialidades", (req, res) => {
  try {
    const { nombreEspecialidad } = req.body;

    if (!nombreEspecialidad) {
      res.status(400)
        .json({ success: false, message: "El nombre de la especialidad es obligatorio" });
      return;
    }

    const nuevaEspecialidad: Especialidad = {
      especialidadId: Math.max(...arrayEspecialidades.map((e: Especialidad) => e.especialidadId), 0) + 1,
      nombreEspecialidad,
      activa: true,
    };

    arrayEspecialidades.push(nuevaEspecialidad);

    console.clear();
    console.table(arrayEspecialidades);
    res.status(201)
      .json(nuevaEspecialidad);
  } catch (error) {
    res.status(500)
      .json({ success: false, errorMensaje: (error as Error).message || "Error al crear la especialidad" });
  }
});

// d) Aplicar borrado lógico (soft delete) cambiando activa a false
app.delete("/especialidades/:id", (req, res) => {
  try {
    const especialidadId = Number(req.params.id);

    if (isNaN(especialidadId)) {
      res.status(400)
        .json({ success: false, message: "El id debe ser un número válido" });
      return;
    }

    const indice = arrayEspecialidades.findIndex(
      (esp: Especialidad) => esp.especialidadId === especialidadId
    );

    if (indice === -1) {
      res.status(404)
        .json({ success: false, message: "Especialidad no encontrada" });
      return;
    }

    arrayEspecialidades[indice].activa = false;

    console.clear();
    console.table(arrayEspecialidades);
    res.status(200)
      .json({ success: true, message: "Especialidad dada de baja", especialidad: arrayEspecialidades[indice] });
  } catch (error) {
    res.status(500)
      .json({ success: false, errorMensaje: (error as Error).message || "Error al eliminar la especialidad" });
  }
});

// ===== PROFESIONALES MÉDICOS =====

// a) Obtener el listado completo de profesionales
app.get("/profesionales", (req, res) => {
  try {
        const profesionalesFiltrados :[] = arrayProfesionales.filter((prof:any) => prof.activo === true);
        res.status(200)
        .json(profesionalesFiltrados);
  } catch (error) {
        res.status(400)
        .json({status: false, message: "Verifica el codigo de especialidad enviado"});    
  }
});

// b) Buscar y retornar un médico específico según su medicoId
app.get('/profesionales/:id', (req, res) => {
  try {
    const profesionalId = Number(req.params.id);

    if (isNaN(profesionalId)) {
      res.status(400)
        .json({ success: false, message: "El id debe ser un número válido" });
      return;
    }

    const profesionalSeleccionado = arrayProfesionales.find(
      (prof: Profesional) => prof.medicoId === profesionalId
    );

    if (!profesionalSeleccionado) {
      res.status(404)
        .json({ success: false, message: "Profesional no encontrado" });
      return;
    }

    console.clear();
    console.table(profesionalSeleccionado);
    res.status(200)
      .json(profesionalSeleccionado);
  } catch (error) {
    res.status(500)
      .json({ success: false, errorMensaje: (error as Error).message || "Error al buscar el profesional" });
  }
});


// c) Registrar un nuevo médico, asegurando la asignación de una especialidad existente
app.post("/profesionales", (req, res) => {
  try {
    const { nombre, especialidad } = req.body;

    if (!nombre || !especialidad) {
      res.status(400)
        .json({ success: false, message: "Nombre y especialidad son obligatorios" });
      return;
    }

    const especialidadValida = arrayEspecialidades.find(
      (esp: Especialidad) => esp.nombreEspecialidad === especialidad && esp.activa
    );

    if (!especialidadValida) {
      res.status(400)
        .json({ success: false, message: "La especialidad indicada no existe o no está activa" });
      return;
    }

    const nuevoProfesional: Profesional = {
      medicoId: Math.max(...arrayProfesionales.map((p: Profesional) => p.medicoId), 0) + 1,
      nombre,
      especialidad,
      activo: true,
    };

    arrayProfesionales.push(nuevoProfesional);

    console.clear();
    console.table(arrayProfesionales);
    res.status(201)
      .json(nuevoProfesional);
  } catch (error) {
    res.status(500)
      .json({ success: false, errorMensaje: (error as Error).message || "Error al registrar el profesional" });
  }
});

// d) Modificar de forma completa los datos de un profesional existente
app.put("/profesionales/:id", (req, res) => {
  try {
    const profesionalId = Number(req.params.id);

    if (isNaN(profesionalId)) {
      res.status(400)
        .json({ success: false, message: "El id debe ser un número válido" });
      return;
    }

    const indice = arrayProfesionales.findIndex((prof: Profesional) => prof.medicoId === profesionalId);

    if (indice === -1) {
      res.status(404)
        .json({ success: false, message: "Profesional no encontrado" });
      return;
    }

    const { nombre, especialidad, activo } = req.body;

    if (!nombre || !especialidad || typeof activo !== "boolean") {
      res.status(400)
        .json({ success: false, message: "Nombre, especialidad y activo son obligatorios" });
      return;
    }

    const especialidadValida = arrayEspecialidades.find(
      (esp: Especialidad) => esp.nombreEspecialidad === especialidad && esp.activa
    );

    if (!especialidadValida) {
      res.status(400)
        .json({ success: false, message: "La especialidad indicada no existe o no está activa" });
      return;
    }

    arrayProfesionales[indice].nombre = nombre;
    arrayProfesionales[indice].especialidad = especialidad;
    arrayProfesionales[indice].activo = activo;

    res.status(200)
      .json(arrayProfesionales[indice]);
  } catch (error) {
    res.status(500)
      .json({ success: false, errorMensaje: (error as Error).message || "Error al modificar datos de un profesional" });
  }
});

// e) Aplicar borrado lógico (soft delete) modificando activo a false
app.delete("/profesionales/:id", (req, res) => {
  try {
    const profesionalId = Number(req.params.id);

    if (isNaN(profesionalId)) {
      res.status(400)
        .json({ success: false, message: "El id debe ser un número válido" });
      return;
    }

    const indice = arrayProfesionales.findIndex((prof: Profesional) => prof.medicoId === profesionalId);

    if (indice === -1) {
      res.status(404)
        .json({ success: false, message: "Profesional no encontrado" });
      return;
    }

    arrayProfesionales[indice].activo = false;

    res.status(200)
      .json({ success: true, message: "Profesional dado de baja", profesional: arrayProfesionales[indice] });
  } catch (error) {
    res.status(500)
      .json({ success: false, errorMensaje: (error as Error).message || "Error al intentar realizar la operación" });
  }
});
app.use((req, res) => {
  res.status(404)
    .json({
      success: false,
      message: "Endpoint no encontrado",
      ruta: req.originalUrl,
      metodo: req.method,
    });
});

app.listen(PORT, () => {
  console.log(`Servidor TurnosMed corriendo en http://localhost:${PORT}`);
});