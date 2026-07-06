import { useAuth } from '../context/AuthContext';

const Perfil = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page">
      <h1>Mi perfil</h1>
      <div className="card">
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Correo:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
      </div>
    </div>
  );
};

export default Perfil;
