import type { Request, Response } from "express";
import { arrayProfesionales, arrayEspecialidades } from "../resources.js";
import type { Profesional, Especialidad } from "../resources.js";

// a) GET /profesionales
export async function obtenerProfesionales(req: Request, res: Response) {
  let status = 200;
  try {
    const profesionalesFiltrados = arrayProfesionales.filter((prof: Profesional) => prof.activo === true);
    return res.status(status).json(profesionalesFiltrados);
  } catch (error) {
    status = 500;
    return res.status(status)
      .json({ success: false, message: "Error al obtener los profesionales" });
  }
}

// b) GET /profesionales/:id
export async function obtenerProfesionalPorId(req: Request, res: Response) {
  let status = 200;
  try {
    const profesionalId = Number(req.params.id);

    if (isNaN(profesionalId)) {
      status = 400;
      throw new Error("El id debe ser un número válido");
    }

    const profesionalSeleccionado = arrayProfesionales.find(
      (prof: Profesional) => prof.medicoId === profesionalId
    );

    if (!profesionalSeleccionado) {
      status = 404;
      throw new Error("Profesional no encontrado");
    }

    console.clear();
    console.table(profesionalSeleccionado);
    return res.status(status).json(profesionalSeleccionado);
  } catch (error) {
    return res.status(status)
      .json({ success: false, message: (error as Error).message || "Error al buscar el profesional" });
  }
}

// c) POST /profesionales
export async function crearProfesional(req: Request, res: Response) {
  let status = 201;
  try {
    const { nombre, especialidad } = req.body;

    if (!nombre || !especialidad) {
      status = 400;
      throw new Error("Nombre y especialidad son obligatorios");
    }

    const especialidadValida = arrayEspecialidades.find(
      (esp: Especialidad) => esp.nombreEspecialidad === especialidad && esp.activa
    );

    if (!especialidadValida) {
      status = 400;
      throw new Error("La especialidad indicada no existe o no está activa");
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
    return res.status(status).json(nuevoProfesional);
  } catch (error) {
    status = status === 201 ? 500 : status;
    return res.status(status)
      .json({ success: false, message: (error as Error).message || "Error al registrar el profesional" });
  }
}

// d) PUT /profesionales/:id
export async function actualizarProfesional(req: Request, res: Response) {
  let status = 200;
  try {
    const profesionalId = Number(req.params.id);

    if (isNaN(profesionalId)) {
      status = 400;
      throw new Error("El id debe ser un número válido");
    }

    const indice = arrayProfesionales.findIndex((prof: Profesional) => prof.medicoId === profesionalId);

    if (indice === -1) {
      status = 404;
      throw new Error("Profesional no encontrado");
    }

    const profesional = arrayProfesionales[indice];

    if (!profesional) {
      status = 404;
      throw new Error("Profesional no encontrado");
    }

    const { nombre, especialidad, activo } = req.body;

    if (!nombre || !especialidad || typeof activo !== "boolean") {
      status = 400;
      throw new Error("Nombre, especialidad y activo son obligatorios");
    }

    const especialidadValida = arrayEspecialidades.find(
      (esp: Especialidad) => esp.nombreEspecialidad === especialidad && esp.activa
    );

    if (!especialidadValida) {
      status = 400;
      throw new Error("La especialidad indicada no existe o no está activa");
    }

    profesional.nombre = nombre;
    profesional.especialidad = especialidad;
    profesional.activo = activo;

    return res.status(status).json(profesional);
  } catch (error) {
    return res.status(status)
      .json({ success: false, message: (error as Error).message || "Error al modificar datos de un profesional" });
  }
}

// e) DELETE /profesionales/:id
export async function eliminarProfesional(req: Request, res: Response) {
  let status = 200;
  try {
    const profesionalId = Number(req.params.id);

    if (isNaN(profesionalId)) {
      status = 400;
      throw new Error("El id debe ser un número válido");
    }

    const indice = arrayProfesionales.findIndex((prof: Profesional) => prof.medicoId === profesionalId);

    if (indice === -1) {
      status = 404;
      throw new Error("Profesional no encontrado");
    }

    const profesional = arrayProfesionales[indice];

    if (!profesional) {
      status = 404;
      throw new Error("Profesional no encontrado");
    }

    profesional.activo = false;

    return res.status(status)
      .json({ success: true, message: "Profesional dado de baja", profesional });
  } catch (error) {
    return res.status(status)
      .json({ success: false, message: (error as Error).message || "Error al intentar realizar la operación" });
  }
}