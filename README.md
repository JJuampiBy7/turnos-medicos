# TurnosMed

Backend prototipo desarrollado en **Node.js + TypeScript + Express** para centralizar la gestión de turnos de un centro médico. Permite administrar especialidades y profesionales de la salud mediante una API REST, con persistencia inicial en archivos JSON.

## Tecnologías

- Node.js
- TypeScript
- Express
- Persistencia en archivos JSON (`node:fs/promises`)

## Estructura del proyecto

```
turnos-medicos/
├── src/
│   ├── data/
│   │   ├── especialidades.json
│   │   └── profesionales.json
│   ├── resources.ts     # Lectura de datos y configuración de agenda
│   └── index.ts         # Servidor Express, rutas y middleware
├── package.json
├── tsconfig.json
└── README.md
```

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run build   # Compila TypeScript a dist/
npm start       # Levanta el servidor en http://localhost:3000
```

## Endpoints disponibles

### Especialidades

| Método | Ruta                    | Descripción                                       |
|--------|-------------------------|----------------------------------------------------|
| GET    | `/especialidades`       | Lista todas las especialidades                     |
| GET    | `/especialidades/:id`   | Busca una especialidad por `especialidadId`        |
| POST   | `/especialidades`       | Crea una nueva especialidad                        |
| DELETE | `/especialidades/:id`   | Baja lógica (`activa: false`)                      |

### Profesionales médicos

| Método | Ruta                    | Descripción                                                |
|--------|-------------------------|-------------------------------------------------------------|
| GET    | `/profesionales`        | Lista todos los profesionales                                |
| GET    | `/profesionales/:id`    | Busca un profesional por `medicoId`                          |
| POST   | `/profesionales`        | Registra un profesional (valida especialidad existente)      |
| PUT    | `/profesionales/:id`    | Actualiza completamente los datos de un profesional          |
| DELETE | `/profesionales/:id`    | Baja lógica (`activo: false`)                                |

Cualquier otra ruta o método no contemplado devuelve un `404` con un mensaje JSON explicativo.
