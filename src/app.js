const express = require('express');
const authRoutes = require('./routes/authRoutes');
const voluntarioRoutes = require('./routes/voluntarioRoutes');
const familiaRoutes = require('./routes/familiaRoutes');
const actividadRoutes = require('./routes/actividadRoutes'); 
const { verifyToken } = require('./middlewares/authMiddleware');
const { authorizeRole } = require('./middlewares/roleMiddleware');

const app = express();

app.use(express.json());

// Rutas públicas (no requieren token)
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntarioRoutes);
app.use('/api/voluntario', voluntarioRoutes); // Alias singular
app.use('/api/familias', familiaRoutes);
app.use('/api/actividades', actividadRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando' });
});

// Ruta solo para admin
app.get('/api/admin/dashboard', verifyToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: `Bienvenido admin. Tu ID es: ${req.user.id}` });
});

// Ruta para cualquier usuario autenticado
app.get('/api/user/perfil', verifyToken, authorizeRole('admin', 'user'), (req, res) => {
  res.json({ message: `Hola usuario. Tu rol es: ${req.user.role}` });
});

module.exports = app;