import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { voluntarioApi } from '../api/voluntarioApi';

const Voluntarios = () => {
  const [voluntarios, setVoluntarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await voluntarioApi.listar();
      setVoluntarios(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleEliminar = async (rut, nombre) => {
    if (!window.confirm(`¿Desactivar a ${nombre}? Podrás reactivarlo más adelante si es necesario.`)) return;

    try {
      await voluntarioApi.eliminar(rut);
      cargar();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page">
      <h1>Voluntarios activos</h1>

      {cargando && <p>Cargando...</p>}
      {error && <p className="form-error">{error}</p>}

      {!cargando && voluntarios.length === 0 && <p>No hay voluntarios activos todavía.</p>}

      {voluntarios.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Edad</th>
              <th>Contacto</th>
              <th>Clasificación</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {voluntarios.map((v) => (
              <tr key={v.rut}>
                <td>{v.rut}</td>
                <td>{v.nombre} {v.apellido}</td>
                <td>{v.email}</td>
                <td>{v.edad}</td>
                <td>{v.contacto}</td>
                <td>{v.clasificacion}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/voluntarios/${v.rut}/editar`}>
                    <button type="button">Editar</button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleEliminar(v.rut, `${v.nombre} ${v.apellido}`)}
                    style={{ background: '#d92626' }}
                  >
                    Desactivar
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

export default Voluntarios;