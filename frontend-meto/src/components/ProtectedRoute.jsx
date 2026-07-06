import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege una ruta:
 *  - Si no está autenticado, redirige a /login
 *  - Si se especifican roles permitidos y el usuario no tiene uno de esos roles, redirige a /no-autorizado
 *
 * Uso:
 *   <ProtectedRoute roles={['central']}> <PaginaSoloCentral /> </ProtectedRoute>
 *   <ProtectedRoute> <PaginaCualquierAutenticado /> </ProtectedRoute>
 */
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
};

export default ProtectedRoute;
