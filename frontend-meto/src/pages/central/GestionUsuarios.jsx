import { useState } from 'react';
import { apiClient } from '../../api/apiClient';

/**
 * Pantalla exclusiva de "central": permite cambiar el rol de un usuario
 * del sistema de login (tabla users) ingresando su ID.
 */
const GestionUsuarios = () => {
  const [userId, setUserId] = useState('');
  const [nuevoRol, setNuevoRol] = useState('voluntario');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const data = await apiClient.patch(`/api/auth/usuarios/${userId}/rol`, { role: nuevoRol });
      setMensaje(`Rol actualizado: ${data.user.name} ahora es "${data.user.role}"`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h1>Gestión de roles de usuarios</h1>
      <p>Cambia el rol de un usuario del sistema (central, jefe_cuadrilla, voluntario).</p>

      <form className="card" onSubmit={handleSubmit}>
        {mensaje && <p className="form-success">{mensaje}</p>}
        {error && <p className="form-error">{error}</p>}

        <label htmlFor="userId">ID del usuario</label>
        <input
          id="userId"
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <label htmlFor="rol">Nuevo rol</label>
        <select id="rol" value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
          <option value="central">Central</option>
          <option value="jefe_cuadrilla">Jefe de cuadrilla</option>
          <option value="voluntario">Voluntario</option>
        </select>

        <button type="submit">Asignar rol</button>
      </form>
    </div>
  );
};

export default GestionUsuarios;
