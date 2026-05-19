const express = require('express');
const authRoutes = require('./routes/authRoutes'); // <-- 1. Importamos las rutas

const app = express();

app.use(express.json());

// <-- 2. Le decimos a Express que use estas rutas bajo el prefijo /api/auth
app.use('/api/auth', authRoutes); 

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend funcionando'
  });
});

module.exports = app;