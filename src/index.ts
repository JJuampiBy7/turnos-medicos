import { configuracionAgenda } from "./resources.ts";
import { arrayProfesionales, arrayEspecialidades } from "./resources.ts"; 

console.clear()
console.log('CONFIGURACION')
console.table(configuracionAgenda)
console.log('PROFESIONALES')
console.table(arrayProfesionales)
console.log('ESPECIALIDADES')
console.table(arrayEspecialidades)
