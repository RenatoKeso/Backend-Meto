import { useEffect, useState } from 'react';
import { voluntarioApi } from '../api/voluntarioApi';

const Voluntarios = () => {
  const [voluntarios, setVoluntarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await voluntarioApi.listar();
        setVoluntarios(data.data || []);
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Voluntarios;
