import { useEffect, useState } from 'react';
import { donacionApi } from '../../api/donacionApi';

const ESTADO_LABEL = {
pendiente: 'Pendiente',
validada: 'Validada',
rechazada: 'Rechazada'
};

const ESTADO_COLOR = {
pendiente: '#b45309',
validada: '#1a7f37',
rechazada: '#d92626'
};

/**
 * Historial de donaciones. Solo Central puede verlo y cambiar el estado
 * de cada donación (pendiente -> validada / rechazada), revisando el comprobante adjunto.
 */
const HistorialDonaciones = () => {
const [donaciones, setDonaciones] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState('');

const cargar = async () => {
    setCargando(true);
    setError('');
    try {
    const data = await donacionApi.listar();
    setDonaciones(data.data || []);
    } catch (err) {
    setError(err.message);
    } finally {
    setCargando(false);
    }
};

  useEffect(() => {
    cargar();
}, []);

const cambiarEstado = async (id, estado) => {
    try {
    await donacionApi.actualizarEstado(id, estado);
    await cargar();
    } catch (err) {
        alert(err.message);
    }
};

const verComprobante = async (id) => {
    try {
    const url = await donacionApi.verComprobante(id);
    window.open(url, '_blank');
    } catch (err) {
        alert(err.message);
    }
};



const totalValidado = donaciones
    .filter((d) => d.estado === 'validada')
    .reduce((sum, d) => sum + Number(d.monto), 0);

return (
    <div className="page">
    <h1>Historial de donaciones</h1>

    {cargando && <p>Cargando...</p>}
    {error && <p className="form-error">{error}</p>}

    {!cargando && (
        <p style={{ fontWeight: 600 }}>
        Total validado: ${totalValidado.toLocaleString('es-CL')}
        </p>
    )}

    {!cargando && donaciones.length === 0 && <p>No hay donaciones registradas todavía.</p>}

    {donaciones.length > 0 && (
        <table className="table">
        <thead>
            <tr>
            <th>Fecha</th>
            <th>Donante</th>
            <th>Monto</th>
            <th>Comprobante</th>
            <th>Estado</th>
            <th>Acción</th>
            </tr>
        </thead>
        <tbody>
            {donaciones.map((d) => (
            <tr key={d.id_donacion}>
                <td>{new Date(d.createdAt).toLocaleDateString('es-CL')}</td>
                <td>{d.es_anonimo ? 'Anónimo' : `${d.nombre} ${d.apellido}`}</td>
                <td>${Number(d.monto).toLocaleString('es-CL')}</td>
                <td>
                {d.comprobante_url ? (
                    <button type="button" onClick={() => verComprobante(d.id_donacion)}>
                    Ver
                    </button>
                ) : (
                    '—'
                )}
                </td>
                <td style={{ color: ESTADO_COLOR[d.estado], fontWeight: 600 }}>
                {ESTADO_LABEL[d.estado] || d.estado}
                </td>
                <td>
                {d.estado === 'pendiente' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => cambiarEstado(d.id_donacion, 'validada')}>Validar</button>
                    <button onClick={() => cambiarEstado(d.id_donacion, 'rechazada')} style={{ background: '#d92626' }}>
                        Rechazar
                    </button>
                    </div>
                )}
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    )}
    </div>
);
};

export default HistorialDonaciones;