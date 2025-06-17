const express = require('express');
const app = express();
require('dotenv').config();

const votantesRoutes = require('./routes/votantes.routes.js');

app.use(express.json());
app.use('/api/votantes', votantesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
