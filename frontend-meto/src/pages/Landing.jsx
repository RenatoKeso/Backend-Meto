import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { voluntarioApi } from '../api/voluntarioApi';

const initialForm = {
  rut: '',
  password: '',
  nombre: '',
  apellido: '',
  email: '',
  edad: '',
  contacto: '',
  contacto_emergencia: '',
  clasificacion: 'general'
};

const Landing = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrores([]);
    setEnviando(true);

    try {
      await voluntarioApi.postular({
        ...form,
        edad: Number(form.edad),
        activo: false,
        rol_id: 'ROL_OTR'
      });

      setMensaje('¡Postulación enviada! Central revisará tu solicitud y activará tu cuenta pronto.');
      setForm(initialForm);
    } catch (err) {
      setMensaje('');
      setErrores(err.data?.error ? [].concat(err.data.error) : [err.message]);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <img src="/imagen-techo.webp" alt="SysGestión logo" className="landing-logo" />
          <p className="landing-kicker">Proyecto</p>
          <h1 className="landing-title">TECHO Chile</h1>
          <p className="landing-desc">Sistema web para Techo Chile</p>
          <div className="landing-meta">
            <span><strong>Asignatura:</strong> Metodología de Desarrollo</span>
            <span><strong>Profesor:</strong> Sebastián Espinoza</span>
          </div>
          <button className="landing-btn" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </div>
      </section>

      <section className="landing-form-section">
        <div className="landing-form-inner">
          <h2 className="landing-form-title">Formulario de postulación</h2>
          <p className="landing-form-subtitle">Completa tus datos para postular al sistema.</p>

          {mensaje && <p className="landing-form-mensaje landing-form-mensaje--exito">{mensaje}</p>}
          {errores.length > 0 && (
            <ul className="landing-form-mensaje landing-form-mensaje--error">
              {errores.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}

          <form className="landing-form" onSubmit={handleSubmit}>
            <label htmlFor="rut">RUT (formato 12345678-9)</label>
            <input id="rut" name="rut" value={form.rut} onChange={handleChange} required />

            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />

            <label htmlFor="apellido">Apellido</label>
            <input id="apellido" name="apellido" value={form.apellido} onChange={handleChange} required />

            <label htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />

            <label htmlFor="password">Contraseña (mínimo 8 caracteres)</label>
            <input id="password" type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />

            <label htmlFor="edad">Edad</label>
            <input id="edad" type="number" name="edad" value={form.edad} onChange={handleChange} min={18} required />

            <label htmlFor="contacto">Teléfono de contacto</label>
            <input id="contacto" name="contacto" value={form.contacto} onChange={handleChange} required />

            <label htmlFor="contacto_emergencia">Contacto de emergencia</label>
            <input id="contacto_emergencia" name="contacto_emergencia" value={form.contacto_emergencia} onChange={handleChange} required />

            <button className="landing-btn" type="submit" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar postulación'}
            </button>
          </form>
        </div>
      </section>

      <footer className="landing-footer">
        <p>Techo Chile</p>
      </footer>
    </div>
  );
};

export default Landing;
