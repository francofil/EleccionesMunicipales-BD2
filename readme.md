
# Sistema de Votación Online - Corte Electoral

Este proyecto es un **sistema de votación electrónica** desarrollado para el curso **Bases de Datos II**. Permite gestionar y ejecutar elecciones en Uruguay, garantizando **análisis estadístico**, **registro seguro**, y una experiencia adaptada a los distintos actores del sistema (votantes, agentes, presidentes de mesa y administradores).

Incluye:

✅ Backend en **Node.js + Express**  
✅ Frontend en **React**  
✅ Base de datos **MySQL vía Docker o Servidor Externo**  
✅ Visualización de resultados con **Chart.js**  
✅ Seguridad con **JWT y roles**  
✅ Contenedores con **Docker + Docker Compose**

---

## Requisitos previos

✅ Docker y Docker Compose (para despliegue con contenedores)  
✅ Node.js 18+  
✅ DataGrip o similar para gestionar MySQL  
✅ Git

---

## Opción A: Despliegue con Docker y Docker Compose

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/EleccionesMunicipales-BD2.git
cd EleccionesMunicipales-BD2
```

### 2️⃣ Ejecutar Docker Compose

```bash
docker-compose up --build
```

Esto levantará 3 contenedores:

- `db`: contenedor de MySQL con la base `eleccionesMunicipales`
- `backend`: API Node.js corriendo en `http://localhost:3000`
- `frontend`: App React corriendo en `http://localhost:5173`

Los scripts de creación (`schema.sql`) e inserción (`insert.sql`) están ubicados en `mysql/init.sql` y se ejecutan automáticamente al crear el contenedor de base de datos.

---

## Opción B: Despliegue manual sin Docker

### 📦 Backend

```bash
cd backend
npm install
npm run dev
```

> El backend correrá en: [http://localhost:3000](http://localhost:3000)

⚠️ Asegurate de tener el archivo `.env` configurado correctamente con tus credenciales de base de datos locales.  

Ejemplo:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=eleccionesMunicipales
PORT=3000
```

### 💻 Frontend

```bash
cd frontend
npm install
npm run dev
```

> El frontend quedará disponible en: [http://localhost:5173](http://localhost:5173)

---

## Conexión a base de datos externa (opcional)

la otra opciond de conexion es de manera remota al servidor de la UCU:

- Host: `****`
- Puerto: `****`
- Usuario: `*****` 
- Base: `*****`
- Contraseña: `****`

---

## Autenticación

El sistema implementa autenticación por roles utilizando JWT:

- `admin`: puede registrar usuarios y manejar datos globales.
- `presidente`: cierra mesas y consulta estadísticas.
- `votante`: accede con su cédula y credencial para emitir su voto.

---

## Funcionalidades del sistema

- ✍️ Registro y login de usuarios
- ✅ Validación del voto
- 🗳️ Emisión de voto por papeleta
- 📈 Visualización de resultados por elección y por circuito
- 📊 Porcentajes por partido, listas y votos en blanco/nulos
- 📋 Generación de constancia de voto

---

## Vista previa

La aplicación puede ser accedida en:  
👉 [http://localhost:5173](http://localhost:5173)

---
