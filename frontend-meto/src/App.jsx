import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Perfil from './pages/Perfil';
import NoAutorizado from './pages/NoAutorizado';
import Postulantes from './pages/central/Postulantes';
import GestionUsuarios from './pages/central/GestionUsuarios';
import Postulacion from './pages/Postulacion';
import Voluntarios from './pages/Voluntarios';
import EditarVoluntario from './pages/EditarVoluntario';
import FamiliasListado from './pages/familias/FamiliasListado';
import RegistrarFamilia from './pages/familias/RegistrarFamilia';
import EditarFamilia from './pages/familias/EditarFamilia';
import ActividadesListado from './pages/actividades/ActividadesListado';
import RegistrarActividad from './pages/actividades/RegistrarActividad';
import ActividadDetalle from './pages/actividades/ActividadDetalle';
import CuadrillasListado from './pages/cuadrillas/CuadrillasListado';
import CuadrillaDetalle from './pages/cuadrillas/CuadrillaDetalle';
import Donacion from './pages/Donacion';
import HistorialDonaciones from './pages/central/HistorialDonaciones';

import './App.css';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);

const RedirectHome = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/perfil' : '/login'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/postular" element={<Postulacion />} />
          <Route path="/donar" element={<Donacion />} />
          <Route path="/no-autorizado" element={<NoAutorizado />} />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Layout><Perfil /></Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/voluntarios"
            element={
              <ProtectedRoute roles={['central', 'jefe_cuadrilla']}>
                <Layout><Voluntarios /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/voluntarios/:rut/editar"
            element={
              <ProtectedRoute roles={['central', 'jefe_cuadrilla']}>
                <Layout><EditarVoluntario /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Rutas exclusivas de Central: gestión de roles */}
          <Route
            path="/central/postulantes"
            element={
              <ProtectedRoute roles={['central']}>
                <Layout><Postulantes /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/central/usuarios"
            element={
              <ProtectedRoute roles={['central']}>
                <Layout><GestionUsuarios /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Fase 4: Familias */}
          <Route
            path="/familias"
            element={
              <ProtectedRoute roles={['central', 'jefe_cuadrilla']}>
                <Layout><FamiliasListado /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/familias/nueva"
            element={
              <ProtectedRoute roles={['central', 'jefe_cuadrilla']}>
                <Layout><RegistrarFamilia /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/familias/:id/editar"
            element={
              <ProtectedRoute roles={['central', 'jefe_cuadrilla']}>
                <Layout><EditarFamilia /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Fase 5: Cuadrillas (necesarias para crear actividades) */}
          <Route
            path="/cuadrillas"
            element={
              <ProtectedRoute roles={['central']}>
                <Layout><CuadrillasListado /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cuadrillas/:id"
            element={
              <ProtectedRoute roles={['central']}>
                <Layout><CuadrillaDetalle /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Fase 5: Actividades — CRUD + postulación + asignación */}
          <Route
            path="/actividades"
            element={
              <ProtectedRoute>
                <Layout><ActividadesListado /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/actividades/nueva"
            element={
              <ProtectedRoute roles={['central', 'jefe_cuadrilla']}>
                <Layout><RegistrarActividad /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/actividades/:id/editar"
            element={
              <ProtectedRoute roles={['central', 'jefe_cuadrilla']}>
                <Layout><RegistrarActividad /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/actividades/:id"
            element={
              <ProtectedRoute>
                <Layout><ActividadDetalle /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Fase 6: Donaciones */}
          <Route
            path="/donaciones/historial"
            element={
              <ProtectedRoute roles={['central']}>
                <Layout><HistorialDonaciones /></Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
