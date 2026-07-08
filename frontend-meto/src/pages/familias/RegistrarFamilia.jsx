import { useState } from 'react';
import { familiaApi } from '../../api/familiaApi';

const familiaInicial = {
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
 * Registro de familia beneficiada. Solo Central puede crearlas.
 * Los integrantes del grupo familiar se agregan dinámicamente.
 */
const RegistrarFamilia = () => {
  const [form, setForm] = useState(familiaInicial);
  const [integrantes, setIntegrantes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState([]);
  const [enviando, setEnviando] = useState(false);

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
      await familiaApi.crear(payload);
      setMensaje('Familia registrada correctamente.');
      setForm(familiaInicial);
      setIntegrantes([]);
    } catch (err) {
      setErrores(err.data?.error ? [].concat(err.data.error) : [err.message]);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="page">
      <h1>Registrar familia beneficiada</h1>

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
          <div key={index} className="card" style ={{marginBottom: '1rem',maxWidth: '100%'}}>
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
            <button 
              type="button" 
              onClick={() => quitarIntegrante(index)} 
              style={{ background: '#d92626', marginTop: '0.5rem' }}
              >
              Quitar integrante
            </button>
          </div>
        ))}

        <button type="button" onClick={agregarIntegrante} style={{ background: '#374151', marginBottom: '1rem' }}>
          + Agregar integrante
        </button>

        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Registrar familia'}
        </button>
      </form>
    </div>
  );
};

export default RegistrarFamilia;
