import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { familiaApi } from '../../api/familiaApi';

const familiaVacia = {
  nombre_representante: '',
  apellido_representante: '',
  rut_representante: '',
  contacto: '',
  calle: '',
  numero: '',
  villa_poblacion: '',
  comuna: '',
  region: '',
  tipo_ayuda: ''
};

const integranteVacio = { nombre: '', apellido: '', edad: '', parentesco: '' };

/**
 * Edición de una familia beneficiada existente, incluyendo sus integrantes.
 * Solo Central puede acceder (misma restricción que registrar/eliminar).
 */
const EditarFamilia = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(familiaVacia);
  const [integrantes, setIntegrantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await familiaApi.obtenerPorId(id);
        const f = data.data || data;
        setForm({
          nombre_representante: f.nombre_representante || '',
          apellido_representante: f.apellido_representante || '',
          rut_representante: f.rut_representante || '',
          contacto: f.contacto || '',
          calle: f.calle || '',
          numero: f.numero || '',
          villa_poblacion: f.villa_poblacion || '',
          comuna: f.comuna || '',
          region: f.region || '',
          tipo_ayuda: f.tipo_ayuda || ''
        });
        setIntegrantes(
          (f.integrantes || []).map((i) => ({
            nombre: i.nombre || '',
            apellido: i.apellido || '',
            edad: i.edad ?? '',
            parentesco: i.parentesco || ''
          }))
        );
      } catch (err) {
        setErrores([err.message]);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const agregarIntegrante = () => {
    setIntegrantes((prev) => [...prev, { ...integranteVacio }]);
  };

  const quitarIntegrante = (index) => {
    setIntegrantes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIntegranteChange = (index, campo, valor) => {
    setIntegrantes((prev) =>
      prev.map((integrante, i) => (i === index ? { ...integrante, [campo]: valor } : integrante))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrores([]);
    setEnviando(true);

    const payload = {
      ...form,
      integrantes: integrantes.map((i) => ({ ...i, edad: Number(i.edad) }))
    };

    try {
      await familiaApi.actualizar(id, payload);
      setMensaje('Familia actualizada correctamente.');
      setTimeout(() => navigate('/familias'), 800);
    } catch (err) {
      setErrores(err.data?.error ? [].concat(err.data.error) : [err.message]);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <div className="page"><p>Cargando...</p></div>;

  return (
    <div className="page">
      <Link to="/familias">← Volver al listado</Link>
      <h1 style={{ marginTop: '0.5rem' }}>Editar familia beneficiada</h1>

      {mensaje && <p className="form-success">{mensaje}</p>}
      {errores.length > 0 && (
        <ul className="form-error">
          {errores.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <label>Nombre del representante</label>
        <input name="nombre_representante" value={form.nombre_representante} onChange={handleChange} required />

        <label>Apellido del representante</label>
        <input name="apellido_representante" value={form.apellido_representante} onChange={handleChange} required />

        <label>RUT del representante (formato 12345678-9)</label>
        <input name="rut_representante" value={form.rut_representante} onChange={handleChange} required />

        <label>Contacto</label>
        <input name="contacto" value={form.contacto} onChange={handleChange} required />

        <label>Calle</label>
        <input name="calle" value={form.calle} onChange={handleChange} required />

        <label>Número</label>
        <input name="numero" value={form.numero} onChange={handleChange} />

        <label>Villa / Población</label>
        <input name="villa_poblacion" value={form.villa_poblacion} onChange={handleChange} />

        <label>Comuna</label>
        <input name="comuna" value={form.comuna} onChange={handleChange} required />

        <label>Región</label>
        <input name="region" value={form.region} onChange={handleChange} required />

        <label>Tipo de ayuda</label>
        <input name="tipo_ayuda" value={form.tipo_ayuda} onChange={handleChange} required />

        <hr style={{ margin: '1rem 0' }} />

        <h3>Integrantes del grupo familiar</h3>

        {integrantes.map((integrante, index) => (
          <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
            <label>Nombre</label>
            <input
              value={integrante.nombre}
              onChange={(e) => handleIntegranteChange(index, 'nombre', e.target.value)}
              required
            />
            <label>Apellido</label>
            <input
              value={integrante.apellido}
              onChange={(e) => handleIntegranteChange(index, 'apellido', e.target.value)}
              required
            />
            <label>Edad</label>
            <input
              type="number"
              min={0}
              max={120}
              value={integrante.edad}
              onChange={(e) => handleIntegranteChange(index, 'edad', e.target.value)}
              required
            />
            <label>Parentesco</label>
            <input
              value={integrante.parentesco}
              onChange={(e) => handleIntegranteChange(index, 'parentesco', e.target.value)}
              required
            />
            <button type="button" onClick={() => quitarIntegrante(index)} style={{ background: '#d92626', marginTop: '0.5rem' }}>
              Quitar integrante
            </button>
          </div>
        ))}

        <button type="button" onClick={agregarIntegrante} style={{ background: '#374151', marginBottom: '1rem' }}>
          + Agregar integrante
        </button>

        <button type="submit" disabled={enviando} style={{ marginTop: '0.5rem' }}>
          {enviando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};

export default EditarFamilia;
