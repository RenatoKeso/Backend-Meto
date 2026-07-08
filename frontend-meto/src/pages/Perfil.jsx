import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { voluntarioApi } from '../api/voluntarioApi';

const ROL_LABEL = {
  central: 'Central',
  jefe_cuadrilla: 'Jefe de cuadrilla',
  voluntario: 'Voluntario'
};

const NIVELES = ['', 'baja', 'media', 'alta'];

const CAPACIDAD_LABEL = {
  movilidad: 'Movilidad',
  resistencia_fisica: 'Resistencia física',
  capacidad_carga: 'Capacidad de carga',
};

const Perfil = () => {
  const { user, loading } = useAuth();

  const [loadingVoluntario, setLoadingVoluntario] = useState(true);

  const [capForm, setCapForm] = useState({
    movilidad: '',
    resistencia_fisica: '',
    capacidad_carga: '',
    otras_habilidades: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const isVoluntario = user?.role === 'voluntario';
  const activo = user?.activo === true;

  useEffect(() => {
    if (!user?.rut) {
      setLoadingVoluntario(false);
      return;
    }

    const cargarVoluntario = async () => {
      try {
        const data = await voluntarioApi.obtenerPorRut(user.rut);
        const v = data.data || data;
        const cap = v.capacidad_fisica || {};
        setCapForm({
          movilidad: cap.movilidad || '',
          resistencia_fisica: cap.resistencia_fisica || '',
          capacidad_carga: cap.capacidad_carga || '',
          otras_habilidades: cap.otras_habilidades || '',
        });
      } catch {
        // Si no existe en usuarios_voluntarios, ignorar
      } finally {
        setLoadingVoluntario(false);
      }
    };

    cargarVoluntario();
  }, [user?.rut]);

  const handleCapChange = (e) => {
    const { name, value } = e.target;
    setCapForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCapSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors([]);
    setSaving(true);

    const payload = {};
    for (const key of ['movilidad', 'resistencia_fisica', 'capacidad_carga']) {
      if (capForm[key]) payload[key] = capForm[key];
    }
    if (capForm.otras_habilidades) {
      payload.otras_habilidades = capForm.otras_habilidades;
    }

    if (Object.keys(payload).length === 0) {
      setErrors(['Debes enviar al menos un campo para actualizar']);
      setSaving(false);
      return;
    }

    try {
      const result = await voluntarioApi.actualizarCapacidades(user.rut, payload);
      const updated = result.data || result;
      const cap = updated.capacidad_fisica || {};
      setCapForm({
        movilidad: cap.movilidad || '',
        resistencia_fisica: cap.resistencia_fisica || '',
        capacidad_carga: cap.capacidad_carga || '',
        otras_habilidades: cap.otras_habilidades || '',
      });
      setMessage('Capacidades actualizadas correctamente.');
    } catch (err) {
      setErrors(err.data?.error ? [].concat(err.data.error) : [err.message]);
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingVoluntario) return <div className="page"><p>Cargando...</p></div>;
  if (!user) return null;

  return (
    <div className="page">
      <h1>Mi perfil</h1>
      <p style={{ color: 'var(--ink-soft)', marginTop: 0, marginBottom: '1.5rem' }}>
        Esta es tu informacion personal dentro del sistema.
      </p>

      <div className="profile-card">
        <div className="profile-banner" />

        <div className="profile-body">
          <p className="profile-name">{user.name}</p>
          <span className={`profile-role-badge role-${user.role}`}>
            {ROL_LABEL[user.role] || user.role}
          </span>

          <div className="profile-field">
            <span>Correo electronico</span>
            <span>{user.email}</span>
          </div>
          <div className="profile-field">
            <span>Rol asignado</span>
            <span>{ROL_LABEL[user.role] || user.role}</span>
          </div>
        </div>
      </div>

      {isVoluntario && !activo && (
        <div className="card" style={{ marginTop: '1.5rem', padding: '1rem', color: 'var(--ink-soft)' }}>
          <p>Tu cuenta está pendiente de activación por Central. Una vez activada, podrás completar tus capacidades físicas aquí.</p>
        </div>
      )}

      {isVoluntario && activo && (
        <form className="card" onSubmit={handleCapSubmit} style={{ marginTop: '1.5rem', maxWidth: 460 }}>
          <h2 style={{ marginTop: 0, marginBottom: '0.25rem' }}>Capacidades físicas</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '0 0 1.25rem' }}>
            Indica tu nivel en cada área para que podamos asignarte actividades compatibles.
          </p>

          {message && <p className="form-success">{message}</p>}
          {errors.length > 0 && (
            <ul className="form-error">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {['movilidad', 'resistencia_fisica', 'capacidad_carga'].map((campo) => (
              <div key={campo}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--ink-soft)',
                  marginBottom: '0.35rem'
                }}>
                  {CAPACIDAD_LABEL[campo]}
                </label>
                <select name={campo} value={capForm[campo]} onChange={handleCapChange}>
                  {NIVELES.filter(Boolean).map((n) => (
                    <option key={n} value={n}>
                      {n.charAt(0).toUpperCase() + n.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--ink-soft)',
              marginBottom: '0.35rem'
            }}>
              Otras habilidades
            </label>
            <textarea
              name="otras_habilidades"
              value={capForm.otras_habilidades}
              onChange={handleCapChange}
              maxLength={500}
              rows={3}
              placeholder="Ej: manejo de herramientas eléctricas, primeros auxilios, etc."
              style={{ marginBottom: 0 }}
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar capacidades'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Perfil;
