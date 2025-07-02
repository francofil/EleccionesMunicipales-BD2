const express = require('express');
const pool = require('./db/db.js'); // <
const app = express();
const cors = require('cors');
require('dotenv').config();

//use de los gets
app.use(express.json());
//Sacamos problemas de cors, habilitamos llamadas a la api desde otro origen
app.use(cors());


//llamada a routes
const votantesRoutes = require('./routes/votantes.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const circuitoRoutes = require('./routes/circuito.router.js')
const eleccionCircuitoRoutes = require('./routes/eleccionCircuito.router.js')
const votacionRoutes = require('./routes/votacion.routes');

app.use('/votantes', votantesRoutes);
app.use('/auth', authRoutes);
app.use('/circuito', circuitoRoutes);
app.use('/eleccionCircuito',  eleccionCircuitoRoutes);
app.use('/votacion', votacionRoutes);

const PORT = process.env.PORT || 3000;

//prueba conexion bdd
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    process.exit(1); // Corta el backend si la DB no responde
  }
})();

app.get('/ping', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err);
    res.status(500).json({ ok: false, db: 'error', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
