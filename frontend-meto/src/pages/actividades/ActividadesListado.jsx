import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../../context/AuthContext';
import { actividadApi } from '../../api/actividadApi';

const ESTADO_LABEL = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
  cancelada: 'Cancelada'
};

const localizador = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { es }
});

const mensajesCalendario = {
  next: 'Siguiente',
  previous: 'Anterior',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  noEventsInRange: 'No hay actividades en este rango.'
};

const ActividadesListado = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const puedeGestionar = role === 'central' || role === 'jefe_cuadrilla';

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await actividadApi.listar();
        setActividades(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  const eventos = useMemo(
    () =>
      actividades.map((a) => {
        const inicio = new Date(`${a.fecha}T${a.hora}`);
        return {
          id_actividad: a.id_actividad,
          title: `${a.nombre} (${ESTADO_LABEL[a.estado] || a.estado})`,
          start: inicio,
          end: inicio
        };
      }),
    [actividades]
  );

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Actividades</h1>
        {puedeGestionar && (
          <Link to="/actividades/nueva">
            <button type="button">+ Nueva actividad</button>
          </Link>
        )}
      </div>

      {cargando && <p>Cargando...</p>}
      {error && <p className="form-error">{error}</p>}

      {!cargando && actividades.length === 0 && <p>No hay actividades registradas todavía.</p>}

      {actividades.length > 0 && (
        <div className="card" style={{ height: 650, marginTop: '1rem' }}>
          <Calendar
            localizer={localizador}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            culture="es"
            messages={mensajesCalendario}
            onSelectEvent={(evento) => navigate(`/actividades/${evento.id_actividad}`)}
          />
        </div>
      )}
    </div>
  );
};

export default ActividadesListado;