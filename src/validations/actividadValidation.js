const Joi = require("joi");

const nombreRule = Joi.string().trim().max(150).messages({
  "string.base": "El nombre debe ser texto",
  "string.empty": "El nombre no puede estar vacío",
  "string.max": "El nombre no puede superar los 150 caracteres",
});

const fechaRule = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .messages({
    "string.base": "La fecha debe ser texto",
    "string.empty": "La fecha no puede estar vacía",
    "string.pattern.base": "La fecha debe tener el formato YYYY-MM-DD",
  });

const horaRule = Joi.string()
  .pattern(/^\d{2}:\d{2}$/)
  .messages({
    "string.base": "La hora debe ser texto",
    "string.empty": "La hora no puede estar vacía",
    "string.pattern.base": "La hora debe tener el formato HH:MM",
  });

const estadoRule = Joi.string()
  .valid("pendiente", "en_progreso", "completada", "cancelada")
  .messages({
    "any.only":
      "El estado debe ser: pendiente, en_progreso, completada o cancelada",
  });

const nivelRequeridoRule = Joi.string()
  .valid("baja", "media", "alta")
  .messages({
    "any.only": "El nivel requerido debe ser: baja, media o alta",
  });

const edadRequeridaRule = Joi.number().integer().min(0).max(120).messages({
  "number.base": "La edad debe ser un numero",
  "number.integer": "La edad debe ser un numero entero",
  "number.min": "La edad no puede ser negativa",
  "number.max": "La edad no puede superar 120",
});

const idCuadrillaRule = Joi.number().integer().positive().messages({
  "number.base": "El id_cuadrilla debe ser un número",
  "number.integer": "El id_cuadrilla debe ser un número entero",
  "number.positive": "El id_cuadrilla debe ser positivo",
});

const validarRangoEdad = (value, helpers) => {
  if (
    value.edad_minima !== undefined &&
    value.edad_minima !== null &&
    value.edad_maxima !== undefined &&
    value.edad_maxima !== null &&
    value.edad_minima > value.edad_maxima
  ) {
    return helpers.message(
      "La edad_minima no puede ser mayor que la edad_maxima",
    );
  }
  return value;
};

const createActividadSchema = Joi.object({
  nombre: nombreRule.required().messages({
    "any.required": "El nombre de la actividad es obligatorio",
  }),
  descripcion: Joi.string().trim().optional().allow("", null),
  fecha: fechaRule.required().messages({
    "any.required": "La fecha es obligatoria",
  }),
  hora: horaRule.required().messages({
    "any.required": "La hora es obligatoria",
  }),
  estado: estadoRule.optional().default("pendiente"),
  id_cuadrilla: idCuadrillaRule.required().messages({
    "any.required": "La cuadrilla es obligatoria",
  }),
  edad_minima: edadRequeridaRule.optional(),
  edad_maxima: edadRequeridaRule.optional(),
  movilidad_requerida: nivelRequeridoRule.optional(),
  resistencia_requerida: nivelRequeridoRule.optional(),
  capacidad_carga_requerida: nivelRequeridoRule.optional(),
}).custom(validarRangoEdad);

const updateActividadSchema = Joi.object({
  nombre: nombreRule.optional(),
  descripcion: Joi.string().trim().optional().allow("", null),
  fecha: fechaRule.optional(),
  hora: horaRule.optional(),
  estado: estadoRule.optional(),
  id_cuadrilla: idCuadrillaRule.optional(),
  edad_minima: edadRequeridaRule.optional().allow(null),
  edad_maxima: edadRequeridaRule.optional().allow(null),
  movilidad_requerida: nivelRequeridoRule.optional().allow(null),
  resistencia_requerida: nivelRequeridoRule.optional().allow(null),
  capacidad_carga_requerida: nivelRequeridoRule.optional().allow(null),
})
  .min(1)
  .custom(validarRangoEdad)
  .messages({
    "object.min": "Debe enviar al menos un campo para actualizar",
  });

module.exports = {
  createActividadSchema,
  updateActividadSchema,
};