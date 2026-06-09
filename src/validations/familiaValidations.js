const Joi = require('joi');

// ─────────────────────────────────────────────
// Schema de un integrante (reutilizado en create y update)
// ─────────────────────────────────────────────
const miembroSchema = Joi.object({
  nombre: Joi.string().max(100).required().messages({
    'string.max': 'El nombre del integrante no puede superar los 100 caracteres',
    'any.required': 'El nombre del integrante es obligatorio'
  }),
  apellido: Joi.string().max(100).required().messages({
    'string.max': 'El apellido del integrante no puede superar los 100 caracteres',
    'any.required': 'El apellido del integrante es obligatorio'
  }),
  edad: Joi.number().integer().min(0).max(120).required().messages({
    'number.min': 'La edad del integrante no puede ser negativa',
    'number.max': 'La edad del integrante no puede superar los 120 años',
    'any.required': 'La edad del integrante es obligatoria'
  }),
  parentesco: Joi.string().max(50).required().messages({
    'string.max': 'El parentesco no puede superar los 50 caracteres',
    'any.required': 'El parentesco del integrante es obligatorio'
  })
});

// ─────────────────────────────────────────────
// Schema para CREAR una familia
// ─────────────────────────────────────────────
const createFamiliaSchema = Joi.object({
  nombre_representante: Joi.string().max(100).required().messages({
    'any.required': 'El nombre del representante es obligatorio'
  }),
  apellido_representante: Joi.string().max(100).required().messages({
    'any.required': 'El apellido del representante es obligatorio'
  }),
  rut_representante: Joi.string()
    .pattern(/^\d{7,8}-[kK\d]$/)
    .required()
    .messages({
      'string.pattern.base': 'El RUT debe tener el formato XXXXXXXX-X',
      'any.required': 'El RUT del representante es obligatorio'
    }),
  contacto: Joi.string().max(15).required().messages({
    'any.required': 'El contacto es obligatorio'
  }),
  calle: Joi.string().max(150).required().messages({
    'any.required': 'La calle es obligatoria'
  }),
  numero: Joi.string().max(10).optional().allow('', null),
  villa_poblacion: Joi.string().max(150).optional().allow('', null),
  comuna: Joi.string().max(100).required().messages({
    'any.required': 'La comuna es obligatoria'
  }),
  region: Joi.string().max(100).required().messages({
    'any.required': 'La región es obligatoria'
  }),
  tipo_ayuda: Joi.string().max(200).required().messages({
    'any.required': 'El tipo de ayuda es obligatorio'
  }),
  // Los integrantes son opcionales al crear (puede ser solo el representante)
  integrantes: Joi.array().items(miembroSchema).optional()
});

// ─────────────────────────────────────────────
// Schema para ACTUALIZAR una familia
// (todos los campos son opcionales, pero al menos uno requerido)
// ─────────────────────────────────────────────
const updateFamiliaSchema = Joi.object({
  nombre_representante: Joi.string().max(100).optional(),
  apellido_representante: Joi.string().max(100).optional(),
  rut_representante: Joi.string()
    .pattern(/^\d{7,8}-[kK\d]$/)
    .optional()
    .messages({
      'string.pattern.base': 'El RUT debe tener el formato XXXXXXXX-X'
    }),
  contacto: Joi.string().max(15).optional(),
  calle: Joi.string().max(150).optional(),
  numero: Joi.string().max(10).optional().allow('', null),
  villa_poblacion: Joi.string().max(150).optional().allow('', null),
  comuna: Joi.string().max(100).optional(),
  region: Joi.string().max(100).optional(),
  tipo_ayuda: Joi.string().max(200).optional(),
  integrantes: Joi.array().items(miembroSchema).optional()
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar'
});

module.exports = {
  createFamiliaSchema,
  updateFamiliaSchema
};
