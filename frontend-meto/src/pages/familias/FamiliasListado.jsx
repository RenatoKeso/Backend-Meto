import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { familiaApi } from '../../api/familiaApi';

/**
 * Listado de familias beneficiadas.
 * Central y Jefe de cuadrilla pueden verlo; solo Central puede registrar nuevas.
 */
const FamiliasListado = () => {
  const { role } = useAuth();
  const [familias, setFamilias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await familiaApi.listar();
        setFamilias(data.data || []);
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
        <h1>Familias beneficiadas</h1>
        {role === 'central' && (
          <Link to="/familias/nueva">
            <button type="button">+ Registrar familia</button>
          </Link>
        )}
      </div>

      {cargando && <p>Cargando...</p>}
      {error && <p className="form-error">{error}</p>}

      {!cargando && familias.length === 0 && <p>No hay familias registradas todavía.</p>}

      {familias.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Representante</th>
              <th>RUT</th>
              <th>Contacto</th>
              <th>Comuna</th>
              <th>Región</th>
              <th>Tipo de ayuda</th>
              <th>Integrantes</th>
            </tr>
          </thead>
          <tbody>
            {familias.map((f) => (
              <tr key={f.id}>
                <td>{f.nombre_representante} {f.apellido_representante}</td>
                <td>{f.rut_representante}</td>
                <td>{f.contacto}</td>
                <td>{f.comuna}</td>
                <td>{f.region}</td>
                <td>{f.tipo_ayuda}</td>
                <td>{f.integrantes?.length ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FamiliasListado;
