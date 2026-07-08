const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const voluntarioRoutes = require('./routes/voluntarioRoutes');
const familiaRoutes = require('./routes/familiaRoutes');
const actividadRoutes = require('./routes/actividadRoutes');
const donacionRoutes = require('./routes/donacionRoutes');
const { verifyToken } = require('./middlewares/authMiddleware');
const { authorizeRole } = require('./middlewares/roleMiddleware');
const cuadrillaRoutes = require('./routes/cuadrillaRoutes');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3001' }));
app.use(express.json());

// Rutas públicas (no requieren token)
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntarioRoutes);
app.use('/api/voluntario', voluntarioRoutes);
app.use('/api/familias', familiaRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/donaciones', donacionRoutes);
app.use('/api/cuadrillas', cuadrillaRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando' });
});

// Ruta solo para central
app.get('/api/admin/dashboard', verifyToken, authorizeRole('central'), (req, res) => {
  res.json({ message: `Bienvenido central. Tu ID es: ${req.user.id}` });
});

// Ruta para cualquier usuario autenticado
app.get('/api/user/perfil', verifyToken, authorizeRole('central', 'jefe_cuadrilla', 'voluntario'), (req, res) => {
  res.json({ message: `Hola usuario. Tu rol es: ${req.user.role}` });
});

module.exports = app;