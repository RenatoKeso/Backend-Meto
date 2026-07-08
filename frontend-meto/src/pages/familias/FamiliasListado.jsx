import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { familiaApi } from '../../api/familiaApi';

/**
 * Listado de familias beneficiadas.
 * Central y Jefe de cuadrilla pueden verlo, registrar y editar; solo Central puede eliminar.
 */
const FamiliasListado = () => {
  const { role } = useAuth();
  const [familias, setFamilias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await familiaApi.listar();
      setFamilias(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleEliminar = async (id, nombreCompleto) => {
    if (!window.confirm(`¿Eliminar a la familia de ${nombreCompleto}? Podrás recuperarla más adelante si es necesario.`)) return;

    try {
      await familiaApi.eliminar(id);
      cargar();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Familias beneficiadas</h1>
        {(role === 'central' || role === 'jefe_cuadrilla') && (
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
              {(role === 'central' || role === 'jefe_cuadrilla') && <th></th>}
            </tr>
          </thead>
          <tbody>
            {familias.map((f) => (
              <tr key={f.id_familia}>
                <td>{f.nombre_representante} {f.apellido_representante}</td>
                <td>{f.rut_representante}</td>
                <td>{f.contacto}</td>
                <td>{f.comuna}</td>
                <td>{f.region}</td>
                <td>{f.tipo_ayuda}</td>
                <td>{f.integrantes?.length ?? 0}</td>
                {(role === 'central' || role === 'jefe_cuadrilla') && (
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/familias/${f.id_familia}/editar`}>
                      <button type="button">Editar</button>
                    </Link>
                    {role === 'central' && (
                      <button
                        type="button"
                        onClick={() => handleEliminar(f.id_familia, `${f.nombre_representante} ${f.apellido_representante}`)}
                        style={{ background: '#d92626' }}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FamiliasListado;
