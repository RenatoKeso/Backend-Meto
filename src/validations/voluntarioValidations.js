/**
 * Validaciones para Voluntarios
 */

const Joi = require('joi');

const rutRule = Joi.string()
  .pattern(/^\d{7,8}-[kK\d]$/)
  .messages({
    'string.base': 'El RUT debe ser texto',
    'string.empty': 'El RUT no puede estar vacio',
    'string.pattern.base': 'El RUT debe tener el formato XXXXXXXX-X'
  });

const passwordRule = Joi.string()
  .min(8)
  .max(72)
  .messages({
    'string.base': 'La password debe ser texto',
    'string.empty': 'La password no puede estar vacia',
    'string.min': 'La password debe tener al menos 8 caracteres',
    'string.max': 'La password no puede exceder 72 caracteres'
  });

const nameRule = Joi.string()
  .trim()
  .pattern(/^[A-Za-zÀ-ÿ' -]+$/)
  .min(2)
  .max(100)
  .messages({
    'string.base': 'Debe ser texto',
    'string.empty': 'No puede estar vacio',
    'string.pattern.base': 'Solo puede contener letras, espacios, apostrofes y guiones',
    'string.min': 'Debe tener al menos 2 caracteres',
    'string.max': 'No puede exceder 100 caracteres'
  });

const emailRule = Joi.string()
  .trim()
  .email()
  .max(150)
  .messages({
    'string.base': 'El email debe ser texto',
    'string.empty': 'El email no puede estar vacio',
    'string.email': 'Debes ingresar un email valido',
    'string.max': 'El email no puede exceder 150 caracteres'
  });

const edadRule = Joi.number()
  .integer()
  .min(18)
  .max(120)
  .messages({
    'number.base': 'La edad debe ser un numero',
    'number.integer': 'La edad debe ser un numero entero',
    'number.min': 'La edad minima permitida es 18',
    'number.max': 'La edad maxima permitida es 120'
  });

const contactoRule = Joi.string()
  .trim()
  .pattern(/^\+?\d{7,15}$/)
  .max(15)
  .messages({
    'string.base': 'El contacto debe ser texto',
    'string.empty': 'El contacto no puede estar vacio',
    'string.pattern.base': 'El contacto debe contener solo numeros y opcionalmente + al inicio',
    'string.max': 'El contacto no puede exceder 15 caracteres'
  });

const clasificacionRule = Joi.string()
  .trim()
  .max(15)
  .messages({
    'string.base': 'La clasificacion debe ser texto',
    'string.empty': 'La clasificacion no puede estar vacia',
    'string.max': 'La clasificacion no puede exceder 15 caracteres'
  });

const createVoluntarioSchema = Joi.object({
  rut: rutRule.required(),
  password: passwordRule.required(),
  nombre: nameRule.required().messages({
    'any.required': 'El nombre es obligatorio'
  }),
  apellido: nameRule.required().messages({
    'any.required': 'El apellido es obligatorio'
  }),
  email: emailRule.required(),
  edad: edadRule.required(),
  contacto: contactoRule.required(),
  activo: Joi.boolean().required().messages({
    'boolean.base': 'Activo debe ser verdadero o falso',
    'any.required': 'Activo es obligatorio'
  }),
  clasificacion: clasificacionRule.required().messages({
    'any.required': 'La clasificacion es obligatoria'
  }),
  contacto_emergencia: contactoRule.required().messages({
    'any.required': 'El contacto de emergencia es obligatorio'
  }),
  rol_id: Joi.string().trim().max(12).required().messages({
    'string.base': 'El rol_id debe ser texto',
    'string.empty': 'El rol_id no puede estar vacio',
    'string.max': 'El rol_id no puede exceder 12 caracteres',
    'any.required': 'El rol_id es obligatorio'
  }),
  id_datos_medicos: Joi.number().integer().positive().optional().messages({
    'number.base': 'id_datos_medicos debe ser numerico',
    'number.integer': 'id_datos_medicos debe ser un entero',
    'number.positive': 'id_datos_medicos debe ser positivo'
  }),
  passwd_hash: Joi.forbidden().messages({
    'any.unknown': 'No debes enviar passwd_hash; se genera desde password'
  }),
  created_at: Joi.forbidden().messages({
    'any.unknown': 'No debes enviar created_at; se genera automaticamente'
  })
});

const updateVoluntarioSchema = Joi.object({
  password: passwordRule.optional(),
  nombre: nameRule.optional(),
  apellido: nameRule.optional(),
  email: emailRule.optional(),
  edad: edadRule.optional(),
  contacto: contactoRule.optional(),
  activo: Joi.boolean().optional().messages({
    'boolean.base': 'Activo debe ser verdadero o falso'
  }),
  clasificacion: clasificacionRule.optional(),
  contacto_emergencia: contactoRule.optional(),
  rol_id: Joi.string().trim().max(12).optional().messages({
    'string.base': 'El rol_id debe ser texto',
    'string.max': 'El rol_id no puede exceder 12 caracteres'
  }),
  id_datos_medicos: Joi.number().integer().positive().optional(),
  rut: Joi.forbidden().messages({
    'any.unknown': 'No puedes modificar el RUT'
  }),
  passwd_hash: Joi.forbidden().messages({
    'any.unknown': 'No debes enviar passwd_hash; se genera desde password'
  }),
  created_at: Joi.forbidden().messages({
    'any.unknown': 'No puedes modificar created_at'
  })
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar'
});

module.exports = {
  createVoluntarioSchema,
  updateVoluntarioSchema
};
