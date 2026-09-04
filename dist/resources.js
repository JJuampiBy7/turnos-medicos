import fs from 'fs/promises';
import path from 'path';
const rutaProfesionales = path.resolve('src', 'data', 'profesionales.json');
const rutaEspecialidades = path.resolve('src', 'data', 'especialidades.json');
const dataProfesionales = await fs.readFile(rutaProfesionales, 'utf-8');
const dataEspecialidades = await fs.readFile(rutaEspecialidades, 'utf-8');
export const arrayProfesionales = JSON.parse(dataProfesionales);
export const arrayEspecialidades = JSON.parse(dataEspecialidades);
export const configuracionAgenda = {
    fechaMaxima: '2026-12-30',
    horaMinima: '07:00',
    horaMaxima: '13:00'
};
