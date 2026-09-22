# Módulo de Pacientes y Turnos — Propuesta Conceptual (Mockup)

Este documento define la propuesta técnica para el nuevo módulo de **Pacientes** y **Turnos** dentro de TurnosMed, siguiendo los principios de Clean Architecture ya aplicados en el resto del proyecto (rutas delgadas → controllers con la lógica de negocio).

## a) Modelado de datos

### Paciente

Un paciente es la persona que solicita un turno médico. Los datos mínimos necesarios para identificarlo y contactarlo son:

```typescript
export interface Paciente {
  codigoPaciente: number;
  nombreCompleto: string;
  documento: string;
  fechaNacimiento: string; // formato ISO: "YYYY-MM-DD"
  email: string;
  telefono: string;
  coberturaSalud: string;
}
```

Justificación de cada campo:
- **`documento`**: identificador único de la persona en el mundo real, necesario para evitar registrar el mismo paciente dos veces.
- **`fechaNacimiento`**: permite calcular la edad, útil para validaciones futuras (por ejemplo, algunas especialidades como Pediatría o Geriatría).
- **`email` / `telefono`**: datos de contacto indispensables para confirmar o recordar el turno asignado.
- **`coberturaSalud`**: dato relevante del sistema de salud argentino, necesario para facturación y para saber si el centro atiende esa obra social/prepaga.

### Turno

Un turno vincula a un paciente con un profesional, en una especialidad, fecha y hora determinadas:

```typescript
export interface Turno {
  codigoTurno: number;
  fecha: string;    // formato ISO: "YYYY-MM-DD"
  hora: string;      // formato "HH:mm", dentro del rango de configuracionAgenda
  especialidad: string;
  profesional: string;
  nombrePaciente: string;
  estadoTurno: string;
}
```

Justificación de cada campo:
- **`especialidad` / `profesional` / `nombrePaciente`**: se guardan como referencia legible (nombre) en vez de un id numérico, para simplificar la lectura del mockup — en una implementación real, conviene validar estos valores contra los catálogos existentes (`especialidades.json`, `profesionales.json`) antes de crear el turno.
- **`fecha` / `hora`**: deben validarse contra `configuracionAgenda` (definida en `resources.ts`), respetando `horaMinima`, `horaMaxima` y `fechaMaxima`.
- **`estadoTurno`**: no es un booleano simple de soft delete, sino un estado con más granularidad (Pendiente, Confirmado, Cancelado, Completado), definido en un catálogo aparte:

```typescript
export interface EstadoTurno {
  estadoId: number;
  nombreEstado: string;
  activo: boolean;
}
```

## b) Definición de endpoints RESTful

Siguiendo el mismo criterio aplicado a Especialidades y Profesionales, cada nuevo recurso expone lectura (listado y por código) y creación:

### Pacientes

#### 1. GET /pacientes

**Qué hace:** Obtiene el listado completo de pacientes registrados.

**Qué recibe:** Nada (sin body, sin parámetros).

**Qué debería devolver:**
- `200 OK` con el array completo de pacientes.

#### 2. GET /pacientes/:codigoPaciente

**Qué hace:** Busca y retorna un paciente específico según su `codigoPaciente`.

**Qué recibe:** El `codigoPaciente` como parámetro en la URL (ej. `/pacientes/1`).

**Qué debería devolver:**
- `200 OK` con los datos del paciente encontrado.
- `400 Bad Request` si el código no es un número válido.
- `404 Not Found` si no existe ningún paciente con ese código.

#### 3. POST /pacientes

**Qué hace:** Registra un nuevo paciente en el sistema.

**Qué recibe (body JSON):**
```json
{
  "nombreCompleto": "Lucía Gómez",
  "documento": "40123456",
  "fechaNacimiento": "1995-04-12",
  "email": "lucia.gomez@mail.com",
  "telefono": "+54 9 11 5555-1234",
  "coberturaSalud": "OSDE"
}
```

**Qué debería devolver:**
- `201 Created` con el paciente recién creado (incluyendo su `codigoPaciente` autogenerado), si los datos son válidos.
- `400 Bad Request` si falta algún dato obligatorio (nombre completo, documento o fecha de nacimiento).

### Turnos

#### 4. GET /turnos

**Qué hace:** Obtiene el listado completo de turnos asignados.

**Qué recibe:** Nada (sin body, sin parámetros).

**Qué debería devolver:**
- `200 OK` con el array completo de turnos.

#### 5. GET /turnos/:codigoTurno

**Qué hace:** Busca y retorna un turno específico según su `codigoTurno`.

**Qué recibe:** El `codigoTurno` como parámetro en la URL (ej. `/turnos/1`).

**Qué debería devolver:**
- `200 OK` con los datos del turno encontrado.
- `400 Bad Request` si el código no es un número válido.
- `404 Not Found` si no existe ningún turno con ese código.

#### 6. POST /turnos

**Qué hace:** Asigna un nuevo turno médico, vinculando un paciente existente con un profesional, especialidad, fecha y hora.

**Qué recibe (body JSON):**
```json
{
  "fecha": "2026-10-05",
  "hora": "09:00",
  "especialidad": "Cardiología",
  "profesional": "Dr. Martín Alvarez",
  "nombrePaciente": "Lucía Gómez"
}
```

**Qué debería devolver:**
- `201 Created` con el turno recién creado (incluyendo su `codigoTurno` autogenerado y `estadoTurno: "Pendiente"`), si los datos son válidos.
- `400 Bad Request` si falta algún dato obligatorio, si la especialidad o el profesional indicados no existen/están inactivos, o si la hora solicitada está fuera del rango de atención configurado (`horaMinima`/`horaMaxima`).