# TurnosMed - Backend

Backend prototipo desarrollado para la centralización y gestión de turnos médicos en un centro de atención de la salud. Proyecto correspondiente a la **Actividad 1 de Integraciones Web (TecLab)**.

## 📋 Descripción del Proyecto

`TurnosMed` establece las bases del servidor backend para gestionar la agenda médica de la institución. Las reglas operativas fijadas atienden solicitudes de lunes a viernes en el rango horario de **07:00 hs a 13:00 hs**, organizando la atención en turnos de 30 minutos.

En esta primera etapa de desarrollo, el sistema cuenta con:
- Persistencia inicial mock interactuando mediante archivos JSON.
- Definición e implementación de interfaces estrictas en TypeScript para las entidades del dominio y reglas de negocio de la agenda.
- Integración de lectura asíncrona de datos con módulos nativos de Node.js.

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** (Entorno de ejecución / Runtime)
- **TypeScript** (Lenguaje principal para tipado estático)
- **Express.js** (Framework de servidor web)
- **node:fs/promises** (Módulo nativo para lectura/escritura asíncrona de archivos)

---

## 📁 Estructura del Proyecto

```text
turnos-medicos/
├── src/
│   ├── data/
│   │   ├── especialidades.json
│   │   └── profesionales.json
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
