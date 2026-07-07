/**
 * Validaciones para Donaciones
 * Se valida aca porque el modelo permite rut/nombre/correo en null
 * (los anonimos no los mandan), pero si es_anonimo = false SI son obligatorios.
 */

const Joi = require("joi");

const rutRule = Joi.string()
  .trim()
  .pattern(/^\d{7,8}-[kK\d]$/)
  .messages({
    "string.empty": "El RUT no puede estar vacio",
    "string.pattern.base": "El RUT debe tener el formato XXXXXXXX-X",
  });

const nombreRule = Joi.string().trim().min(2).max(100).messages({
  "string.empty": "No puede estar vacio",
  "string.min": "Debe tener al menos 2 caracteres",
  "string.max": "No puede exceder 100 caracteres",
});

const correoRule = Joi.string().trim().email().max(150).messages({
  "string.empty": "El correo no puede estar vacio",
  "string.email": "Debes ingresar un correo valido",
  "string.max": "El correo no puede exceder 150 caracteres",
});

const crearDonacionSchema = Joi.object({
  monto: Joi.number().integer().min(1000).required().messages({
    "number.base": "El monto debe ser un numero",
    "number.integer": "El monto debe ser un numero entero",
    "number.min": "El monto minimo para donar es $1.000",
    "any.required": "El monto es obligatorio",
  }),

  es_anonimo: Joi.boolean().default(false).messages({
    "boolean.base": "es_anonimo debe ser verdadero o falso",
  }),

  // Estos 4 solo se piden si la donacion NO es anonima
  rut: rutRule.when("es_anonimo", {
    is: false,
    then: Joi.required().messages({
      "any.required": "El RUT es obligatorio cuando la donacion no es anonima",
    }),
    otherwise: Joi.optional().allow("", null),
  }),

  nombre: nombreRule.when("es_anonimo", {
    is: false,
    then: Joi.required().messages({
      "any.required": "El nombre es obligatorio cuando la donacion no es anonima",
    }),
    otherwise: Joi.optional().allow("", null),
  }),

  apellido: nombreRule.when("es_anonimo", {
    is: false,
    then: Joi.required().messages({
      "any.required": "El apellido es obligatorio cuando la donacion no es anonima",
    }),
    otherwise: Joi.optional().allow("", null),
  }),

  correo: correoRule.when("es_anonimo", {
    is: false,
    then: Joi.required().messages({
      "any.required": "El correo es obligatorio cuando la donacion no es anonima",
    }),
    otherwise: Joi.optional().allow("", null),
  }),
});

module.exports = { crearDonacionSchema };