import type { Request, Response } from "express";
import { arrayEspecialidades } from "../resources.js";
import type { Especialidad } from "../resources.js";

// a) GET /especialidades
export async function obtenerEspecialidades(req: Request, res: Response) {
  let status = 200;
  try {
    return res.status(status).json(arrayEspecialidades);
  } catch (error) {
    status = 500;
    return res.status(status)
      .json({ success: false, message: "Error al obtener las especialidades" });
  }
}

// b) GET /especialidades/:id
export async function obtenerEspecialidadPorId(req: Request, res: Response) {
  let status = 200;
  try {
    const especialidadId = Number(req.params.id);

    if (isNaN(especialidadId)) {
      status = 400;
      throw new Error("El id debe ser un número válido");
    }

    const especialidadSolicitada = arrayEspecialidades.find(
      (especialidad: Especialidad) => especialidad.especialidadId === especialidadId
    );

    if (!especialidadSolicitada) {
      status = 404;
      throw new Error("Especialidad no encontrada");
    }

    console.clear();
    console.table(especialidadSolicitada);
    return res.status(status).json(especialidadSolicitada);
  } catch (error) {
    return res.status(status)
      .json({ success: false, message: (error as Error).message || "Error al obtener la especialidad" });
  }
}

// c) POST /especialidades
export async function crearEspecialidad(req: Request, res: Response) {
  let status = 201;
  try {
    const { nombreEspecialidad } = req.body;

    if (!nombreEspecialidad) {
      status = 400;
      throw new Error("El nombre de la especialidad es obligatorio");
    }

    const nuevaEspecialidad: Especialidad = {
      especialidadId: Math.max(...arrayEspecialidades.map((e: Especialidad) => e.especialidadId), 0) + 1,
      nombreEspecialidad,
      activa: true,
    };

    arrayEspecialidades.push(nuevaEspecialidad);

    console.clear();
    console.table(arrayEspecialidades);
    return res.status(status).json(nuevaEspecialidad);
  } catch (error) {
    status = status === 201 ? 500 : status;
    return res.status(status)
      .json({ success: false, message: (error as Error).message || "Error al crear la especialidad" });
  }
}

// d) DELETE /especialidades/:id
export async function eliminarEspecialidad(req: Request, res: Response) {
  let status = 200;
  try {
    const especialidadId = Number(req.params.id);

    if (isNaN(especialidadId)) {
      status = 400;
      throw new Error("El id debe ser un número válido");
    }

    const indice = arrayEspecialidades.findIndex(
      (esp: Especialidad) => esp.especialidadId === especialidadId
    );

    if (indice === -1) {
      status = 404;
      throw new Error("Especialidad no encontrada");
    }

    const especialidad = arrayEspecialidades[indice];

    if (!especialidad) {
      status = 404;
      throw new Error("Especialidad no encontrada");
    }

    especialidad.activa = false;

    console.clear();
    console.table(arrayEspecialidades);
    return res.status(status)
      .json({ success: true, message: "Especialidad dada de baja", especialidad });
  } catch (error) {
    return res.status(status)
      .json({ success: false, message: (error as Error).message || "Error al eliminar la especialidad" });
  }
}