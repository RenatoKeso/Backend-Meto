import { useAuth } from '../context/AuthContext';

const ROL_LABEL = {
  central: 'Central',
  jefe_cuadrilla: 'Jefe de cuadrilla',
  voluntario: 'Voluntario'
};

const getIniciales = (nombre = '') => {
  const partes = nombre.trim().split(' ').filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

const Perfil = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page">
      <h1>Mi perfil</h1>
      <p style={{ color: 'var(--ink-soft)', marginTop: 0, marginBottom: '1.5rem' }}>
        Esta es tu informacion personal dentro del sistema.
      </p>

      <div className="profile-card">
        <div className="profile-banner" />
        <div className="profile-avatar">{getIniciales(user.name)}</div>

        <div className="profile-body">
          <p className="profile-name">{user.name}</p>
          <span className={`profile-role-badge role-${user.role}`}>
            {ROL_LABEL[user.role] || user.role}
          </span>

          <div className="profile-field">
            <span>Correo electronico</span>
            <span>{user.email}</span>
          </div>
          <div className="profile-field">
            <span>Rol asignado</span>
            <span>{ROL_LABEL[user.role] || user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
