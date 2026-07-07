import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { voluntarioApi } from '../api/voluntarioApi';

/**
 * Edición de datos de un voluntario existente.
 * Accesible por Central (cualquier voluntario) y por el propio Voluntario (sus datos).
 */
const EditarVoluntario = () => {
  const { rut } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    edad: '',
    contacto: '',
    contacto_emergencia: '',
    clasificacion: '',
    password: ''
  });

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await voluntarioApi.obtenerPorRut(rut);
        const v = data.data || data;
        setForm({
          nombre: v.nombre || '',
          apellido: v.apellido || '',
          email: v.email || '',
          edad: v.edad ?? '',
          contacto: v.contacto || '',
          contacto_emergencia: v.contacto_emergencia || '',
          clasificacion: v.clasificacion || '',
          password: ''
        });
      } catch (err) {
        setErrores([err.message]);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [rut]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrores([]);
    setEnviando(true);

    const payload = {
      ...form,
      edad: Number(form.edad)
    };

    // Solo se envía la contraseña si se escribió algo; si se deja vacía,
    // no se toca la contraseña actual del voluntario.
    if (!payload.password) {
      delete payload.password;
    }

    try {
      await voluntarioApi.actualizar(rut, payload);
      setMensaje('Datos actualizados correctamente.');
      setForm((prev) => ({ ...prev, password: '' }));
      setTimeout(() => navigate('/voluntarios'), 800);
    } catch (err) {
      setErrores(err.data?.error ? [].concat(err.data.error) : [err.message]);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <div className="page"><p>Cargando...</p></div>;

  return (
    <div className="page">
      <Link to="/voluntarios">← Volver al listado</Link>
      <h1 style={{ marginTop: '0.5rem' }}>Editar voluntario</h1>
      <p style={{ color: 'var(--ink-soft)' }}>RUT: {rut}</p>

      {mensaje && <p className="form-success">{mensaje}</p>}
      {errores.length > 0 && (
        <ul className="form-error">
          {errores.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 460 }}>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required />

        <label>Apellido</label>
        <input name="apellido" value={form.apellido} onChange={handleChange} required />

        <label>Correo electrónico</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Edad</label>
        <input type="number" name="edad" value={form.edad} onChange={handleChange} min={18} required />

        <label>Contacto</label>
        <input name="contacto" value={form.contacto} onChange={handleChange} required />

        <label>Contacto de emergencia</label>
        <input name="contacto_emergencia" value={form.contacto_emergencia} onChange={handleChange} />

        <label>Clasificación</label>
        <input name="clasificacion" value={form.clasificacion} onChange={handleChange} />

        <label>Nueva contraseña (opcional)</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Dejar en blanco para no cambiarla"
          minLength={8}
        />

        <button type="submit" disabled={enviando} style={{ marginTop: '0.5rem' }}>
          {enviando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};

export default EditarVoluntario;
