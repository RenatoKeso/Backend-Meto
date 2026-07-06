import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';

/**
 * Pantalla exclusiva de "central": permite revisar los voluntarios postulantes
 * (activo = false) y activarlos asignándoles un rol_id.
 */
const Postulantes = () => {
  const [voluntarios, setVoluntarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [rolSeleccionado, setRolSeleccionado] = useState({});

  const cargarVoluntarios = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiClient.get('/api/voluntarios?incluirInactivos=true');
      setVoluntarios(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVoluntarios();
  }, []);

  const activar = async (rut) => {
    const rol_id = rolSeleccionado[rut];
    if (!rol_id) {
      alert('Selecciona un rol antes de activar');
      return;
    }

    try {
      await apiClient.patch(`/api/voluntarios/${rut}/activar`, { rol_id });
      await cargarVoluntarios();
    } catch (err) {
      alert(err.message);
    }
  };

  const postulantesInactivos = voluntarios.filter((v) => !v.activo);

  return (
    <div className="page">
      <h1>Postulantes por activar</h1>

      {cargando && <p>Cargando...</p>}
      {error && <p className="form-error">{error}</p>}

      {!cargando && postulantesInactivos.length === 0 && (
        <p>No hay postulantes pendientes de activación.</p>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol a asignar</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {postulantesInactivos.map((v) => (
            <tr key={v.rut}>
              <td>{v.rut}</td>
              <td>{v.nombre} {v.apellido}</td>
              <td>{v.email}</td>
              <td>
                <select
                  value={rolSeleccionado[v.rut] || ''}
                  onChange={(e) =>
                    setRolSeleccionado((prev) => ({ ...prev, [v.rut]: e.target.value }))
                  }
                >
                  <option value="">Seleccionar rol...</option>
                  <option value="ROL_GEN">Coordinador General</option>
                  <option value="ROL_ZON">Coordinador Zonal</option>
                  <option value="ROL_JEF">Jefe de Cuadrilla</option>
                  <option value="ROL_CAP">Capataz</option>
                  <option value="ROL_OTR">Otros</option>
                </select>
              </td>
              <td>
                <button onClick={() => activar(v.rut)}>Activar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Postulantes;
