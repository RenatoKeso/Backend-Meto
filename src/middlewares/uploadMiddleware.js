const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const nombre = Date.now() + path.extname(file.originalname);
    cb(null, nombre);
  }
});

// solo dejamos pasar comprobantes en imagen o pdf, como pide el requisito
const tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf'];

const filtrarArchivo = (req, file, cb) => {
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('El comprobante debe ser JPG, PNG o PDF'));
  }
};

const upload = multer({
  storage,
  fileFilter: filtrarArchivo,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB, para que no suban un video de comprobante
});

module.exports = upload;