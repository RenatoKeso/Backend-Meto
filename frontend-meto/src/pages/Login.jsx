import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const user = await login(email, password);

      // Redirige según el rol del usuario autenticado
      if (user.role === 'central') {
        navigate('/central/postulantes');
      } else if (user.role === 'jefe_cuadrilla') {
        navigate('/actividades');
      } else {
        navigate('/perfil');
      }
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-centered">
          <svg width="72" height="72" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#1E88E5" />
            <path
              d="M50 22 L82 50 L68 50 L68 78 C68 79.1 67.1 80 66 80 L34 80 C32.9 80 32 79.1 32 78 L32 50 L18 50 Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="login-logo-text-centered">
          <p>Techo</p>
          <span>Sistema de gestión</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Bienvenido de vuelta</h1>
          <p>Ingresa tus credenciales para continuar</p>

          {error && <p className="form-error">{error}</p>}

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
