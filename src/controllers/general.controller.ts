import type { Request, Response } from "express";

// Endpoint de bienvenida (Hello World)
export async function bienvenida(req: Request, res: Response) {
  const status = 200;
  return res.status(status)
    .json({ success: true, message: "Bienvenido a la API de Turnos Médicos" });
}

// Middleware para rutas/métodos no contemplados por la API
export async function rutaNoEncontrada(req: Request, res: Response) {
  const status = 404;
  return res.status(status)
    .json({
      success: false,
      message: "Endpoint no encontrado",
      ruta: req.originalUrl,
      metodo: req.method,
    });
}