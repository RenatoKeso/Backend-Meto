const { Familia, MiembroFamilia } = require('../entities/FamiliaModels');

// ─────────────────────────────────────────────
// Helpers (mismo patrón que voluntarioService)
// ─────────────────────────────────────────────
const buildError = (message, statusCode = 500, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (details) error.details = details;
  return error;
};

// ─────────────────────────────────────────────
// CREATE — Registrar una nueva familia
// ─────────────────────────────────────────────
const createFamilia = async (payload) => {
  // Verificar que no exista otra familia con el mismo RUT representante
  const familiaExistente = await Familia.findOne({
    where: { rut_representante: payload.rut_representante }
  });

  if (familiaExistente) {
    throw buildError('Ya existe una familia registrada con ese RUT de representante', 409);
  }

  // Crear la familia principal
  const nuevaFamilia = await Familia.create({
    nombre_representante: payload.nombre_representante,
    apellido_representante: payload.apellido_representante,
    rut_representante: payload.rut_representante,
    contacto: payload.contacto,
    calle: payload.calle,
    numero: payload.numero,
    villa_poblacion: payload.villa_poblacion,
    comuna: payload.comuna,
    region: payload.region,
    tipo_ayuda: payload.tipo_ayuda,
    activo: true
  });

  // Crear los integrantes del grupo familiar si se enviaron
  if (payload.integrantes && payload.integrantes.length > 0) {
    const integrantesConId = payload.integrantes.map((miembro) => ({
      ...miembro,
      id_familia: nuevaFamilia.id_familia
    }));
    await MiembroFamilia.bulkCreate(integrantesConId);
  }

  // Retornar la familia completa con sus integrantes
  return getFamiliaById(nuevaFamilia.id_familia);
};

// ─────────────────────────────────────────────
// READ ALL — Consultar todas las familias
// ─────────────────────────────────────────────
const getAllFamilias = async ({ incluirInactivas = false } = {}) => {
  const where = incluirInactivas ? {} : { activo: true };

  const familias = await Familia.findAll({
    where,
    include: [{ model: MiembroFamilia, as: 'integrantes' }]
  });

  return familias;
};

// ─────────────────────────────────────────────
// READ ONE — Consultar una familia por ID
// ─────────────────────────────────────────────
const getFamiliaById = async (id_familia) => {
  const familia = await Familia.findOne({
    where: { id_familia },
    include: [{ model: MiembroFamilia, as: 'integrantes' }]
  });

  if (!familia) {
    throw buildError('Familia no encontrada', 404);
  }

  return familia;
};

// ─────────────────────────────────────────────
// UPDATE — Actualizar datos de una familia
// (solo usuarios autorizados llegan aquí, el control es en la ruta)
// ─────────────────────────────────────────────
const updateFamilia = async (id_familia, payload) => {
  const familia = await Familia.findOne({ where: { id_familia } });

  if (!familia) {
    throw buildError('Familia no encontrada', 404);
  }

  // Verificar que el nuevo RUT representante no pertenezca a otra familia
  if (payload.rut_representante && payload.rut_representante !== familia.rut_representante) {
    const otraFamilia = await Familia.findOne({
      where: { rut_representante: payload.rut_representante }
    });
    if (otraFamilia && otraFamilia.id_familia !== Number(id_familia)) {
      throw buildError('Ya existe otra familia con ese RUT de representante', 409);
    }
  }

  // Separar los campos de integrantes del resto del payload
  const { integrantes, ...datosFamilia } = payload;

  // Actualizar datos principales de la familia
  await familia.update(datosFamilia);

  // Si se enviaron integrantes, reemplazarlos completamente
  if (integrantes !== undefined) {
    await MiembroFamilia.destroy({ where: { id_familia } });

    if (integrantes.length > 0) {
      const integrantesConId = integrantes.map((miembro) => ({
        ...miembro,
        id_familia: Number(id_familia)
      }));
      await MiembroFamilia.bulkCreate(integrantesConId);
    }
  }

  return getFamiliaById(id_familia);
};

// ─────────────────────────────────────────────
// DELETE — Borrado lógico (activo = false)
// (mismo patrón que deleteVoluntario)
// ─────────────────────────────────────────────
const deleteFamilia = async (id_familia) => {
  const familia = await Familia.findOne({ where: { id_familia } });

  if (!familia) {
    throw buildError('Familia no encontrada', 404);
  }

  if (familia.activo === false) {
    return { ...familia.toJSON(), yaEstabaInactiva: true };
  }

  await familia.update({ activo: false });
  return { ...familia.toJSON(), yaEstabaInactiva: false };
};

module.exports = {
  createFamilia,
  getAllFamilias,
  getFamiliaById,
  updateFamilia,
  deleteFamilia
};
