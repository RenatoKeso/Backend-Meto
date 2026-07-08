import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cuadrillaApi } from '../../api/cuadrillaApi';
import { voluntarioApi } from '../../api/voluntarioApi';

/**
 * Detalle de una cuadrilla: muestra el jefe (campo rut de Cuadrilla) y sus miembros
 * (voluntarios cuyo id_cuadrilla apunta a esta cuadrilla). Permite asignar un voluntario
 * disponible y quitar a un miembro existente. Solo Central puede acceder.
 */
const CuadrillaDetalle = () => {
  const { id } = useParams();

  const [cuadrilla, setCuadrilla] = useState(null);
  const [voluntarios, setVoluntarios] = useState([]);
  const [rutSeleccionado, setRutSeleccionado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [cuadrillaData, voluntariosData] = await Promise.all([
        cuadrillaApi.obtenerPorId(id),
        voluntarioApi.listar()
      ]);
      setCuadrilla(cuadrillaData.data || cuadrillaData);
      setVoluntarios(voluntariosData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [id]);

  const handleAsignar = async (e) => {
    e.preventDefault();
    if (!rutSeleccionado) return;
    setMensaje('');
    setEnviando(true);

    try {
      await cuadrillaApi.asignarVoluntario(id, rutSeleccionado);
      setMensaje('Voluntario asignado correctamente.');
      setRutSeleccionado('');
      cargar();
    } catch (err) {
      alert(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const handleQuitar = async (rut, nombreCompleto) => {
    if (!window.confirm(`¿Quitar a ${nombreCompleto} de esta cuadrilla?`)) return;

    try {
      await cuadrillaApi.quitarVoluntario(id, rut);
      cargar();
    } catch (err) {
      alert(err.message);
    }
  };

  if (cargando) return <div className="page"><p>Cargando...</p></div>;
  if (error) return <div className="page"><p className="form-error">{error}</p></div>;
  if (!cuadrilla) return null;

  const miembrosRuts = new Set((cuadrilla.miembros || []).map((m) => m.rut));
  const disponibles = voluntarios.filter((v) => !miembrosRuts.has(v.rut));

  return (
    <div className="page">
      <Link to="/cuadrillas">← Volver al listado</Link>
      <h1 style={{ marginTop: '0.5rem' }}>{cuadrilla.nombre || `Cuadrilla #${cuadrilla.id_cuadrilla}`}</h1>
      <p style={{ color: 'var(--ink-soft)' }}>Jefe de cuadrilla (RUT): {cuadrilla.rut || 'Sin asignar'}</p>

      {mensaje && <p className="form-success">{mensaje}</p>}

      <div className="card" style={{ maxWidth: 460, marginBottom: '1.5rem' }}>
        <h3>Asignar voluntario</h3>
        <form onSubmit={handleAsignar} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label>Voluntario</label>
            <select value={rutSeleccionado} onChange={(e) => setRutSeleccionado(e.target.value)}>
              <option value="">Seleccionar...</option>
              {disponibles.map((v) => (
                <option key={v.rut} value={v.rut}>
                  {v.nombre} {v.apellido} — {v.rut}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={enviando || !rutSeleccionado}>
            {enviando ? 'Asignando...' : 'Asignar'}
          </button>
        </form>
        {disponibles.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
            No hay voluntarios disponibles para asignar.
          </p>
        )}
      </div>

      <h3>Miembros</h3>

      {(!cuadrilla.miembros || cuadrilla.miembros.length === 0) && (
        <p>Esta cuadrilla no tiene miembros todavía.</p>
      )}

      {cuadrilla.miembros && cuadrilla.miembros.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Clasificación</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cuadrilla.miembros.map((m) => (
              <tr key={m.rut}>
                <td>{m.rut}</td>
                <td>{m.nombre} {m.apellido}</td>
                <td>{m.email}</td>
                <td>{m.clasificacion || '—'}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleQuitar(m.rut, `${m.nombre} ${m.apellido}`)}
                    style={{ background: '#d92626' }}
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CuadrillaDetalle;
