const { Cuadrilla, UsuarioVoluntario } = require('../entities');

const crearCuadrilla = async (datos) => {
    return Cuadrilla.create(datos);
};

const obtenerTodasLasCuadrillas = async () => {
    return Cuadrilla.findAll();
};

const obtenerCuadrillaPorId = async (id_cuadrilla) => {
    const cuadrilla = await Cuadrilla.findByPk(id_cuadrilla);

    if (!cuadrilla) {
        const error = new Error('Cuadrilla no encontrada');
        error.statusCode = 404;
        throw error;
    }

    const miembros = await UsuarioVoluntario.findAll({
        where: { id_cuadrilla },
        attributes: ['rut', 'nombre', 'apellido', 'email', 'clasificacion']
    });

    return { ...cuadrilla.toJSON(), miembros };
};

const asignarVoluntario = async (id_cuadrilla, rut) => {
    const cuadrilla = await Cuadrilla.findByPk(id_cuadrilla);
    if (!cuadrilla) {
        const error = new Error('Cuadrilla no encontrada');
        error.statusCode = 404;
        throw error;
    }

    const voluntario = await UsuarioVoluntario.findByPk(rut);
    if (!voluntario) {
        const error = new Error('Voluntario no encontrado');
        error.statusCode = 404;
        throw error;
    }

    voluntario.id_cuadrilla = id_cuadrilla;
    await voluntario.save();
    return voluntario;
};

const quitarVoluntario = async (rut) => {
    const voluntario = await UsuarioVoluntario.findByPk(rut);
    if (!voluntario) {
        const error = new Error('Voluntario no encontrado');
        error.statusCode = 404;
        throw error;
    }

    voluntario.id_cuadrilla = null;
    await voluntario.save();
    return voluntario;
};

module.exports = {
    crearCuadrilla,
    obtenerTodasLasCuadrillas,
    obtenerCuadrillaPorId,
    asignarVoluntario,
    quitarVoluntario
};
