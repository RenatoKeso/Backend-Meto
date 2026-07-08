import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { actividadApi } from '../../api/actividadApi';
import { voluntarioApi } from '../../api/voluntarioApi';

const ESTADO_LABEL = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
  cancelada: 'Cancelada'
};

/**
 * Detalle de una actividad.
 * - Central / Jefe de cuadrilla: ven voluntarios elegibles, postulantes, pueden asignar, editar y eliminar.
 * - Voluntario: puede postularse con un click (el sistema lo identifica por su sesión, no hace falta escribir el RUT).
 */
const ActividadDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const puedeGestionar = role === 'central' || role === 'jefe_cuadrilla';

  const [actividad, setActividad] = useState(null);
  const [elegibles, setElegibles] = useState([]);
  const [postulantes, setPostulantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [mensajeAccion, setMensajeAccion] = useState('');
  const [errorAccion, setErrorAccion] = useState('');

  const cargarTodo = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await actividadApi.obtenerPorId(id);
      setActividad(data.data || data);

      if (puedeGestionar) {
        const [elegiblesData, postulantesData] = await Promise.all([
          actividadApi.obtenerVoluntariosElegibles(id),
          actividadApi.obtenerPostulantes(id)
        ]);
        setElegibles(elegiblesData.data || []);
        setPostulantes(postulantesData.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePostular = async () => {
    setMensajeAccion('');
    setErrorAccion('');

    try {
      const disponibles = await voluntarioApi.actividadesDisponibles(user.rut);
      const esElegible = (disponibles.data || []).some((a) => String(a.id_actividad) === String(id));

      if (!esElegible) {
        setErrorAccion('No cumples los requisitos para postular a esta actividad, o ya te postulaste antes.');
        return;
      }

      await actividadApi.postular(id);
      setMensajeAccion('Postulación enviada correctamente.');
    } catch (err) {
      setErrorAccion(err.message);
    }
  };

  const handleAsignar = async (rut) => {
    setMensajeAccion('');
    setErrorAccion('');
    try {
      await actividadApi.asignar(id, rut);
      setMensajeAccion(`Voluntario ${rut} asignado correctamente.`);
      cargarTodo();
    } catch (err) {
      setErrorAccion(err.message);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar esta actividad?')) return;
    try {
      await actividadApi.eliminar(id);
      navigate('/actividades');
    } catch (err) {
      setErrorAccion(err.message);
    }
  };

  if (cargando) return <div className="page"><p>Cargando...</p></div>;
  if (error) return <div className="page"><p className="form-error">{error}</p></div>;
  if (!actividad) return null;

  return (
    <div className="page">
      <Link to="/actividades">← Volver al listado</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <h1>{actividad.nombre}</h1>
        {puedeGestionar && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/actividades/${id}/editar`}>
              <button type="button">Editar</button>
            </Link>
            <button type="button" onClick={handleEliminar} style={{ background: '#d92626' }}>
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        <p><strong>Descripción:</strong> {actividad.descripcion || '—'}</p>
        <p><strong>Fecha:</strong> {actividad.fecha} · <strong>Hora:</strong> {actividad.hora}</p>
        <p><strong>Estado:</strong> {ESTADO_LABEL[actividad.estado] || actividad.estado}</p>
        <p><strong>Rango de edad:</strong> {actividad.edad_minima ?? '—'} a {actividad.edad_maxima ?? '—'}</p>
        <p><strong>Movilidad:</strong> {actividad.movilidad_requerida || '—'} · <strong>Resistencia:</strong> {actividad.resistencia_requerida || '—'} · <strong>Carga:</strong> {actividad.capacidad_carga_requerida || '—'}</p>
      </div>

      {mensajeAccion && <p className="form-success">{mensajeAccion}</p>}
      {errorAccion && <p className="form-error">{errorAccion}</p>}

        {!puedeGestionar && (
        <div className="card" style={{ maxWidth: 420, marginTop: '1rem' }}>
          <h3>Postularme a esta actividad</h3>
          <button type="button" onClick={handlePostular} style={{ marginTop: '0.5rem' }}>Postularme</button>
        </div>
      )}

      {puedeGestionar && (
        <>
          <h3 style={{ marginTop: '1.5rem' }}>Voluntarios elegibles</h3>
          {elegibles.length === 0 && <p>No hay voluntarios elegibles para esta actividad.</p>}
          {elegibles.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>RUT</th>
                  <th>Nombre</th>
                  <th>Clasificación</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {elegibles.map((v) => (
                  <tr key={v.rut}>
                    <td>{v.rut}</td>
                    <td>{v.nombre} {v.apellido}</td>
                    <td>{v.clasificacion}</td>
                    <td>
                      <button type="button" onClick={() => handleAsignar(v.rut)}>Asignar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 style={{ marginTop: '1.5rem' }}>Postulantes</h3>
          {postulantes.length === 0 && <p>Todavía no hay postulantes.</p>}
          {postulantes.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>RUT</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {postulantes.map((p) => (
                  <tr key={p.rut}>
                    <td>{p.rut}</td>
                    <td>{p.nombre} {p.apellido}</td>
                    <td>{p.estado || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default ActividadDetalle;
