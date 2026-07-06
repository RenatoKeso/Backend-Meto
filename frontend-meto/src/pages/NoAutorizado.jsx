import { Link } from 'react-router-dom';

const NoAutorizado = () => (
  <div className="page">
    <h1>Acceso no autorizado</h1>
    <p>No tienes permiso para ver esta página con tu rol actual.</p>
    <Link to="/perfil">Volver a mi perfil</Link>
  </div>
);

export default NoAutorizado;
