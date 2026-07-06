import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { actividadApi } from '../../api/actividadApi';
import { cuadrillaApi } from '../../api/cuadrillaApi';

const actividadInicial = {
  nombre: '',
  descripcion: '',
  fecha: '',
  hora: '',
  estado: 'pendiente',
  id_cuadrilla: '',
  edad_minima: '',
  edad_maxima: '',
  movilidad_requerida: '',
  resistencia_requerida: '',
  capacidad_carga_requerida: ''
};

const NIVELES = ['', 'baja', 'media', 'alta'];
const ESTADOS = ['pendiente', 'en_progreso', 'completada', 'cancelada'];

/**
 * Crea o edita una actividad. Solo Central / Jefe de cuadrilla.
 * Si viene :id en la ruta, se carga esa actividad y se edita (PUT); si no, se crea (POST).
 */
const RegistrarActividad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState(actividadInicial);
  const [cuadrillas, setCuadrillas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(esEdicion);

  useEffect(() => {
    const cargarCuadrillas = async () => {
      try {
        const data = await cuadrillaApi.listar();
        setCuadrillas(data.data || []);
      } catch (err) {
        setErrores((prev) => prev.concat(`No se pudieron cargar las cuadrillas: ${err.message}`));
      }
    };

    cargarCuadrillas();
  }, []);

  useEffect(() => {
    if (!esEdicion) return;

    const cargar = async () => {
      try {
        const data = await actividadApi.obtenerPorId(id);
        const actividad = data.data || data;
        setForm({
          nombre: actividad.nombre || '',
          descripcion: actividad.descripcion || '',
          fecha: actividad.fecha || '',
          hora: actividad.hora || '',
          estado: actividad.estado || 'pendiente',
          id_cuadrilla: actividad.id_cuadrilla ?? '',
          edad_minima: actividad.edad_minima ?? '',
          edad_maxima: actividad.edad_maxima ?? '',
          movilidad_requerida: actividad.movilidad_requerida || '',
          resistencia_requerida: actividad.resistencia_requerida || '',
          capacidad_carga_requerida: actividad.capacidad_carga_requerida || ''
        });
      } catch (err) {
        setErrores([err.message]);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarVacios = (obj) => {
    const limpio = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== '') limpio[key] = value;
    });
    return limpio;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrores([]);
    setEnviando(true);

    const payload = limpiarVacios({
      ...form,
      id_cuadrilla: form.id_cuadrilla === '' ? '' : Number(form.id_cuadrilla),
      edad_minima: form.edad_minima === '' ? '' : Number(form.edad_minima),
      edad_maxima: form.edad_maxima === '' ? '' : Number(form.edad_maxima)
    });

    try {
      if (esEdicion) {
        await actividadApi.actualizar(id, payload);
        setMensaje('Actividad actualizada correctamente.');
      } else {
        await actividadApi.crear(payload);
        setMensaje('Actividad creada correctamente.');
        setForm(actividadInicial);
      }
      setTimeout(() => navigate('/actividades'), 800);
    } catch (err) {
      setErrores(err.data?.error ? [].concat(err.data.error) : [err.message]);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <div className="page"><p>Cargando...</p></div>;

  return (
    <div className="page">
      <h1>{esEdicion ? 'Editar actividad' : 'Registrar actividad'}</h1>

      {mensaje && <p className="form-success">{mensaje}</p>}
      {errores.length > 0 && (
        <ul className="form-error">
          {errores.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} maxLength={150} required />

        <label>Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} />

        <label>Fecha</label>
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />

        <label>Hora</label>
        <input type="time" name="hora" value={form.hora} onChange={handleChange} required />

        <label>Estado</label>
        <select name="estado" value={form.estado} onChange={handleChange}>
          {ESTADOS.map((op) => <option key={op} value={op}>{op}</option>)}
        </select>

        <label>Cuadrilla</label>
        <select name="id_cuadrilla" value={form.id_cuadrilla} onChange={handleChange} required>
          <option value="">Selecciona una cuadrilla</option>
          {cuadrillas.map((c) => (
            <option key={c.id_cuadrilla} value={c.id_cuadrilla}>
              {c.nombre || `Cuadrilla #${c.id_cuadrilla}`}
            </option>
          ))}
        </select>
        {cuadrillas.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            No hay cuadrillas creadas todavía. Ve a la sección Cuadrillas para crear una primero.
          </p>
        )}

        <hr style={{ margin: '1rem 0' }} />
        <h3>Requisitos para voluntarios (opcional)</h3>

        <label>Edad mínima</label>
        <input type="number" min={0} max={120} name="edad_minima" value={form.edad_minima} onChange={handleChange} />

        <label>Edad máxima</label>
        <input type="number" min={0} max={120} name="edad_maxima" value={form.edad_maxima} onChange={handleChange} />

        <label>Movilidad requerida</label>
        <select name="movilidad_requerida" value={form.movilidad_requerida} onChange={handleChange}>
          {NIVELES.map((op) => <option key={op} value={op}>{op || '(sin requisito)'}</option>)}
        </select>

        <label>Resistencia requerida</label>
        <select name="resistencia_requerida" value={form.resistencia_requerida} onChange={handleChange}>
          {NIVELES.map((op) => <option key={op} value={op}>{op || '(sin requisito)'}</option>)}
        </select>

        <label>Capacidad de carga requerida</label>
        <select name="capacidad_carga_requerida" value={form.capacidad_carga_requerida} onChange={handleChange}>
          {NIVELES.map((op) => <option key={op} value={op}>{op || '(sin requisito)'}</option>)}
        </select>

        <button type="submit" disabled={enviando} style={{ marginTop: '1rem' }}>
          {enviando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Registrar actividad'}
        </button>
      </form>
    </div>
  );
};

export default RegistrarActividad;
