import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Techo · Backend-Meto</div>

      <div className="navbar-links">
        <Link to="/perfil">Mi perfil</Link>

        {role === 'central' && (
          <>
            <Link to="/central/postulantes">Postulantes</Link>
            <Link to="/central/usuarios">Usuarios y roles</Link>
            <Link to="/voluntarios">Voluntarios</Link>
            <Link to="/familias">Familias</Link>
            <Link to="/cuadrillas">Cuadrillas</Link>
            <Link to="/actividades">Actividades</Link>
            <Link to="/donaciones/historial">Donaciones</Link>
          </>
        )}

        {role === 'jefe_cuadrilla' && (
          <>
            <Link to="/voluntarios">Mi equipo</Link>
            <Link to="/familias">Familias</Link>
            <Link to="/actividades">Actividades</Link>
          </>
        )}

        {role === 'voluntario' && (
          <>
            <Link to="/actividades">Actividades</Link>
          </>
        )}
      </div>

      <div className="navbar-user">
        <span>{user?.name} · {role}</span>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;
