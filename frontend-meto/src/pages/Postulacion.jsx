import { useState } from 'react';
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

/**
 * Formulario público de postulación. Cualquier persona puede llenarlo sin iniciar sesión.
 * Se envía activo: false y un rol_id temporal, ya que el backend los exige,
 * pero es Central quien realmente activa la cuenta y asigna el rol definitivo después
 * (ver pantalla Postulantes).
 */
const Postulacion = () => {
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
        rol_id: 'ROL_OTR' // Rol temporal (Otros); Central asigna el rol definitivo al activar la cuenta
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
    <div className="page">
      <h1>Postulación de voluntario</h1>
      <p>Completa tus datos para postular. Nuestro equipo revisará tu solicitud.</p>

      {mensaje && <p className="form-success">{mensaje}</p>}
      {errores.length > 0 && (
        <ul className="form-error">
          {errores.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
        <label>RUT (formato 12345678-9)</label>
        <input name="rut" value={form.rut} onChange={handleChange} required />

        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required />

        <label>Apellido</label>
        <input name="apellido" value={form.apellido} onChange={handleChange} required />

        <label>Correo electrónico</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Contraseña (mínimo 8 caracteres)</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />

        <label>Edad</label>
        <input type="number" name="edad" value={form.edad} onChange={handleChange} min={18} required />

        <label>Teléfono de contacto</label>
        <input name="contacto" value={form.contacto} onChange={handleChange} required />

        <label>Contacto de emergencia</label>
        <input name="contacto_emergencia" value={form.contacto_emergencia} onChange={handleChange} required />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar postulación'}
        </button>
      </form>
    </div>
  );
};

export default Postulacion;
