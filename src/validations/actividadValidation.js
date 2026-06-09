const Joi = require('joi');


const nombreRule = Joi.string()
  .trim()
  .max(150)
  .messages({
    'string.base':  'El nombre debe ser texto',
    'string.empty': 'El nombre no puede estar vacío',
    'string.max':   'El nombre no puede superar los 150 caracteres'
  });

const fechaRule = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .messages({
    'string.base':         'La fecha debe ser texto',
    'string.empty':        'La fecha no puede estar vacía',
    'string.pattern.base': 'La fecha debe tener el formato YYYY-MM-DD'
  });

const horaRule = Joi.string()
  .pattern(/^\d{2}:\d{2}$/)
  .messages({
    'string.base':         'La hora debe ser texto',
    'string.empty':        'La hora no puede estar vacía',
    'string.pattern.base': 'La hora debe tener el formato HH:MM'
  });

const estadoRule = Joi.string()
  .valid('pendiente', 'en_progreso', 'completada', 'cancelada')
  .messages({
    'any.only': 'El estado debe ser: pendiente, en_progreso, completada o cancelada'
  });


const createActividadSchema = Joi.object({
  nombre: nombreRule.required().messages({
    'any.required': 'El nombre de la actividad es obligatorio'
  }),
  descripcion: Joi.string().trim().optional().allow('', null),
  fecha: fechaRule.required().messages({
    'any.required': 'La fecha es obligatoria'
  }),
  hora: horaRule.required().messages({
    'any.required': 'La hora es obligatoria'
  }),
  estado: estadoRule.optional().default('pendiente')
});

const updateActividadSchema = Joi.object({
  nombre:      nombreRule.optional(),
  descripcion: Joi.string().trim().optional().allow('', null),
  fecha:       fechaRule.optional(),
  hora:        horaRule.optional(),
  estado:      estadoRule.optional()
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar'
});

module.exports = {
  createActividadSchema,
  updateActividadSchema
};