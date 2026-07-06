import { useState } from 'react';
import { donacionApi } from '../api/donacionApi';

/**
 * Formulario público de donación. Cualquiera puede donar sin iniciar sesión.
 * - Anónima: solo se pide el monto.
 * - Registrada: se piden además RUT, nombre, apellido y correo.
 * En ambos casos se puede adjuntar un comprobante (imagen o PDF).
 */
const Donacion = () => {
const [esAnonimo, setEsAnonimo] = useState(false);
const [monto, setMonto] = useState('');
const [rut, setRut] = useState('');
const [nombre, setNombre] = useState('');
const [apellido, setApellido] = useState('');
const [correo, setCorreo] = useState('');
const [comprobante, setComprobante] = useState(null);

const [enviando, setEnviando] = useState(false);
const [mensaje, setMensaje] = useState('');
const [errores, setErrores] = useState([]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrores([]);

    if (!monto || Number(monto) <= 0) {
    setErrores(['El monto debe ser mayor a cero']);
    return;
    }

    if (!esAnonimo && (!rut || !nombre || !apellido || !correo)) {
    setErrores(['Debes completar RUT, nombre, apellido y correo, o marcar la donación como anónima']);
    return;
    }

    setEnviando(true);

    const formData = new FormData();
    formData.append('monto', monto);
    formData.append('es_anonimo', esAnonimo);

    if (!esAnonimo) {
    formData.append('rut', rut);
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('correo', correo);
    }

    if (comprobante) {
        formData.append('comprobante', comprobante);
    }

    try {
    await donacionApi.crear(formData);
    setMensaje('¡Gracias por tu donación! Quedó registrada correctamente.');
    setMonto('');
    setRut('');
    setNombre('');
    setApellido('');
    setCorreo('');
    setComprobante(null);
    } catch (err) {
        setErrores(err.data?.error ? [].concat(err.data.error) : [err.message]);
    } finally {
        setEnviando(false);
    }
};

return (
    <div className="page">
    <h1>Hacer una donación</h1>
    <p>Cada aporte ayuda a que más familias tengan un techo. Gracias por tu ayuda.</p>

    {mensaje && <p className="form-success">{mensaje}</p>}
    {errores.length > 0 && (
        <ul className="form-error">
            {errores.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
    )}

    <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <label>
            <input
            type="checkbox"
            checked={esAnonimo}
            onChange={(e) => setEsAnonimo(e.target.checked)}
            style={{ marginRight: '0.5rem' }}
        />
        Donar de forma anónima
        </label>

        <label style={{ marginTop: '0.75rem' }}>Monto (CLP)</label>
        <input
        type="number"
        min="1"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        required
        />

        {/* El campo de archivo ahora va SIEMPRE en la misma posición del árbol,
            antes de los campos condicionales, para que React no lo desmonte
            (y pierda el archivo seleccionado) al marcar/desmarcar "anónimo". */}
        <label>Comprobante de transferencia (opcional, JPG/PNG/PDF)</label>
        <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e) => setComprobante(e.target.files[0])}
        />
        {comprobante && (
        <p style={{ fontSize: '0.85rem', color: '#1a7f37', margin: '0.25rem 0 0.75rem' }}>
            Archivo seleccionado: {comprobante.name}
        </p>
        )}

        {!esAnonimo && (
        <>
            <label>RUT (formato 12345678-9)</label>
            <input value={rut} onChange={(e) => setRut(e.target.value)} required={!esAnonimo} />

            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} required={!esAnonimo} />

            <label>Apellido</label>
            <input value={apellido} onChange={(e) => setApellido(e.target.value)} required={!esAnonimo} />

            <label>Correo electrónico</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required={!esAnonimo} />
        </>
        )}

        <button type="submit" disabled={enviando} style={{ marginTop: '1rem' }}>
        {enviando ? 'Enviando...' : 'Confirmar donación'}
        </button>
    </form>
    </div>
    );
};

export default Donacion;