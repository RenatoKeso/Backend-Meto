import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { actividadApi } from '../../api/actividadApi';

const ESTADO_LABEL = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
  cancelada: 'Cancelada'
};

const ActividadesListado = () => {
  const { role } = useAuth();
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const puedeGestionar = role === 'central' || role === 'jefe_cuadrilla';

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await actividadApi.listar();
        setActividades(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Actividades</h1>
        {puedeGestionar && (
          <Link to="/actividades/nueva">
            <button type="button">+ Nueva actividad</button>
          </Link>
        )}
      </div>

      {cargando && <p>Cargando...</p>}
      {error && <p className="form-error">{error}</p>}

      {!cargando && actividades.length === 0 && <p>No hay actividades registradas todavía.</p>}

      {actividades.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Rango de edad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((a) => (
              <tr key={a.id_actividad}>
                <td>{a.nombre}</td>
                <td>{a.fecha}</td>
                <td>{a.hora}</td>
                <td>{ESTADO_LABEL[a.estado] || a.estado}</td>
                <td>
                  {a.edad_minima ?? '—'} a {a.edad_maxima ?? '—'}
                </td>
                <td>
                  <Link to={`/actividades/${a.id_actividad}`}>Ver detalle</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActividadesListado;