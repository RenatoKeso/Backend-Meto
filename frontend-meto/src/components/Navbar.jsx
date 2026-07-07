import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROL_LABEL = {
  central: 'Central',
  jefe_cuadrilla: 'Jefe de cuadrilla',
  voluntario: 'Voluntario'
};

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
      <div className="navbar-brand">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '2px' }}>
          <path d="M3 11L12 4L21 11" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.5 9.5V19.5C5.5 19.7761 5.72386 20 6 20H18C18.2761 20 18.5 19.7761 18.5 19.5V9.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 20V14.5C10 14.2239 10.2239 14 10.5 14H13.5C13.7761 14 14 14.2239 14 14.5V20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Techo <span>Un techo para Chile</span>
      </div>

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
        <span>{user?.name} · {ROL_LABEL[role] || role}</span>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;
