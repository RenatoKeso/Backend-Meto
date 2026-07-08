const express = require('express');
const router = express.Router();
const donacionController = require('../controllers/donacionController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Multer tira el error de tipo/tamaño antes de llegar al controller,
// asi que lo atajamos aca para que la respuesta sea JSON y no el error feo de express por defecto
const subirComprobante = (req, res, next) => {
  upload.single('comprobante')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, mensaje: err.message });
    }
    next();
  });
};

// publica, no requiere login
router.post('/', subirComprobante, donacionController.crearDonacion);

// solo admin
router.get('/', verifyToken, authorizeRole('central'), donacionController.obtenerDonaciones);

// cambiar estado de una donacion
router.patch('/:id', verifyToken, authorizeRole('central'), donacionController.cambiarEstado);

// total de donaciones validas (ingresos efectivos), solo admin
router.get('/ingresos-efectivos', verifyToken, authorizeRole('central'), donacionController.obtenerIngresosEfectivos);

// ver el comprobante adjunto de una donacion, solo admin
router.get('/:id/comprobante', verifyToken, authorizeRole('central'), donacionController.obtenerComprobante);

module.exports = router;