const Joi = require('joi');

const createCuadrillaSchema = Joi.object({
nombre: Joi.string().max(100).optional().allow('', null),
rut: Joi.string()
    .pattern(/^\d{7,8}-[kK\d]$/)
    .optional()
    .allow('', null)
    .messages({
        'string.pattern.base': 'El RUT debe tener el formato XXXXXXXX-X'
    }),
id_proyecto: Joi.number().integer().positive().optional().allow(null)
});

const updateCuadrillaSchema = Joi.object({
nombre: Joi.string().max(100).optional().allow('', null),
rut: Joi.string()
    .pattern(/^\d{7,8}-[kK\d]$/)
    .optional()
    .allow('', null)
    .messages({
        'string.pattern.base': 'El RUT debe tener el formato XXXXXXXX-X'
    }),
id_proyecto: Joi.number().integer().positive().optional().allow(null)
}).min(1).messages({
'object.min': 'Debe enviar al menos un campo para actualizar'
});

const asignarVoluntarioSchema = Joi.object({
rut: Joi.string()
    .pattern(/^\d{7,8}-[kK\d]$/)
    .required()
    .messages({
        'string.pattern.base': 'El RUT debe tener el formato XXXXXXXX-X',
        'any.required': 'El RUT del voluntario es obligatorio'
    })
});

module.exports = { createCuadrillaSchema, updateCuadrillaSchema, asignarVoluntarioSchema };
