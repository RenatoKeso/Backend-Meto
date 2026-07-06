import { useEffect, useState } from 'react';
import { cuadrillaApi } from '../../api/cuadrillaApi';
import { voluntarioApi } from '../../api/voluntarioApi';

/**
 * Gestión simple de cuadrillas: listado + formulario de creación en una sola pantalla.
 * Solo Central puede crear cuadrillas.
 * El jefe de cuadrilla se selecciona de un desplegable con los voluntarios existentes,
 * ya que "rut" es una llave foránea hacia usuarios_voluntarios y debe existir previamente.
 */
const CuadrillasListado = () => {
  const [cuadrillas, setCuadrillas] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [erroresForm, setErroresForm] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const [cuadrillasData, voluntariosData] = await Promise.all([
        cuadrillaApi.listar(),
        voluntarioApi.listar()
      ]);
      setCuadrillas(cuadrillasData.data || []);
      setVoluntarios(voluntariosData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErroresForm([]);
    setEnviando(true);

    const payload = {};
    if (nombre) payload.nombre = nombre;
    if (rut) payload.rut = rut;

    try {
      await cuadrillaApi.crear(payload);
      setMensaje('Cuadrilla creada correctamente.');
      setNombre('');
      setRut('');
      cargar();
    } catch (err) {
      setErroresForm(err.data?.error ? [].concat(err.data.error) : [err.message]);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="page">
      <h1>Cuadrillas</h1>

      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 420, marginBottom: '1.5rem' }}>
        <h3>Nueva cuadrilla</h3>

        {mensaje && <p className="form-success">{mensaje}</p>}
        {erroresForm.length > 0 && (
          <ul className="form-error">
            {erroresForm.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        )}

        <label>Nombre</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Cuadrilla Norte" />

        <label>Jefe de cuadrilla (opcional)</label>
        <select value={rut} onChange={(e) => setRut(e.target.value)}>
          <option value="">Sin asignar</option>
          {voluntarios.map((v) => (
            <option key={v.rut} value={v.rut}>
              {v.nombre} {v.apellido} — {v.rut}
            </option>
          ))}
        </select>
        {voluntarios.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            No hay voluntarios activos todavía para asignar como jefe.
          </p>
        )}

        <button type="submit" disabled={enviando} style={{ marginTop: '0.5rem' }}>
          {enviando ? 'Guardando...' : 'Crear cuadrilla'}
        </button>
      </form>

      {cargando && <p>Cargando...</p>}
      {error && <p className="form-error">{error}</p>}

      {!cargando && cuadrillas.length === 0 && <p>No hay cuadrillas registradas todavía.</p>}

      {cuadrillas.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>RUT jefe</th>
            </tr>
          </thead>
          <tbody>
            {cuadrillas.map((c) => (
              <tr key={c.id_cuadrilla}>
                <td>{c.id_cuadrilla}</td>
                <td>{c.nombre || '—'}</td>
                <td>{c.rut || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CuadrillasListado;