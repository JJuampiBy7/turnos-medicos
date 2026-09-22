## TurnosMed

Backend prototipo desarrollado en **Node.js + TypeScript + Express** para centralizar la gestión de turnos de un centro médico. Permite administrar especialidades y profesionales de la salud mediante una API REST, con persistencia inicial en archivos JSON.

## Tecnologías

- Node.js
- TypeScript
- Express
- Persistencia en archivos JSON (`node:fs/promises`)

## Arquitectura

El proyecto sigue un enfoque de **Clean Architecture**: las rutas (`index.ts`) solo mapean método + path hacia una función de controller, y toda la lógica de negocio (validaciones, manipulación de datos, códigos de estado) vive en controllers dedicados por entidad. Cada controller es una función `async`, valida los datos de entrada antes de operar, lanza errores controlados (`throw new Error(...)`) ante datos inválidos o recursos inexistentes, y responde siempre con `return res.status(status).json(...)` para evitar ejecuciones posteriores no deseadas.

## Estructura del proyecto

```
turnos-medicos/
├── src/
│   ├── data/
│   │   ├── especialidades.json
│   │   └── profesionales.json
│   ├── controllers/
│   │   ├── especialidades.controller.ts
│   │   ├── profesionales.controller.ts
│   │   └── general.controller.ts
│   ├── resources.ts     # Lectura de datos y configuración de agenda
│   └── index.ts         # Servidor Express y mapa de rutas
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

| Método | Ruta                  | Controller                 | Descripción                                  |
|--------|-----------------------|-----------------------------|-----------------------------------------------|
| GET    | `/especialidades`     | `obtenerEspecialidades`    | Lista todas las especialidades                |
| GET    | `/especialidades/:id` | `obtenerEspecialidadPorId` | Busca una especialidad por `especialidadId`   |
| POST   | `/especialidades`     | `crearEspecialidad`        | Crea una nueva especialidad                   |
| DELETE | `/especialidades/:id` | `eliminarEspecialidad`     | Baja lógica (`activa: false`)                 |

### Profesionales médicos

| Método | Ruta                  | Controller               | Descripción                                              |
|--------|-----------------------|----------------------------|-------------------------------------------------------------|
| GET    | `/profesionales`      | `obtenerProfesionales`    | Lista los profesionales activos                              |
| GET    | `/profesionales/:id`  | `obtenerProfesionalPorId` | Busca un profesional por `medicoId`                          |
| POST   | `/profesionales`      | `crearProfesional`        | Registra un profesional (valida especialidad existente)      |
| PUT    | `/profesionales/:id`  | `actualizarProfesional`   | Actualiza completamente los datos de un profesional          |
| DELETE | `/profesionales/:id`  | `eliminarProfesional`     | Baja lógica (`activo: false`)                                |

### General

| Método | Ruta                                  | Controller         | Descripción                          |
|--------|----------------------------------------|----------------------|----------------------------------------|
| GET    | `/`                                     | `bienvenida`        | Endpoint de bienvenida a la API        |
| *      | Cualquier ruta/método no contemplado   | `rutaNoEncontrada`  | Middleware 404 global                  |

## Pruebas

La colección de Postman **TurnosMed API**, con los casos happy path y unhappy path de cada endpoint, se encuentra documentada en el Documento de Evidencias entregado junto con este repositorio.

## Autor

Juan Pablo Miño
