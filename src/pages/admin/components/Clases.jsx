import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BG_START = '#1a1a1a';
const BG_END = '#0a0a0a';
const WHITE = '#ffffff';
const YELLOW = '#fdcc0d';
const GLOW = '#ffeb3b';
const BORDER = '#333333';
const API_URL = import.meta.env.VITE_API_URL || 'https://newstylegym-back.onrender.com';

const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

const ClasesSection = () => {
  const [clases, setClases] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [modalClase, setModalClase] = useState(false);
  const [modalHorario, setModalHorario] = useState(false);
  const [editingClase, setEditingClase] = useState(null);
  const [formClase, setFormClase] = useState({ nombre: '', descripcion: '', capacidadMaxima: 20, duracionMinutos: 60, nivel: 'principiante' });
  const [formHorario, setFormHorario] = useState({ classId: '', trainerId: '', diaSemana: 'lunes', horaInicio: '09:00', horaFin: '10:00', sala: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchAll();
    loadUsers();
  }, []);

  const fetchAll = async () => {
    try {
      const [clasesRes, schedRes] = await Promise.all([
        axios.get(`${API_URL}/gym/classes`),
        axios.get(`${API_URL}/gym/classes/schedules/weekly`),
      ]);
      setClases(Array.isArray(clasesRes.data) ? clasesRes.data : []);
      setSchedule(schedRes.data || {});
    } catch (e) { console.error(e); }
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/getAllUsers`);
      setAllUsers(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
  };

  const trainers = allUsers.filter(u => u.role === 'trainer' || u.role === 'admin');

  // --- Clase CRUD ---
  const handleSaveClase = async (e) => {
    e.preventDefault();
    try {
      if (editingClase) {
        await axios.put(`${API_URL}/gym/classes/${editingClase.id}`, formClase);
        setMensaje('Clase actualizada');
      } else {
        await axios.post(`${API_URL}/gym/classes`, formClase);
        setMensaje('Clase creada');
      }
      setEditingClase(null);
      setFormClase({ nombre: '', descripcion: '', capacidadMaxima: 20, duracionMinutos: 60, nivel: 'principiante' });
      setModalClase(false);
      fetchAll();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al guardar'); setTimeout(() => setError(''), 3000); }
  };

  const handleDeleteClase = async (id) => {
    if (!confirm('¿Eliminar esta clase?')) return;
    try {
      await axios.delete(`${API_URL}/gym/classes/${id}`);
      setMensaje('Clase eliminada');
      fetchAll();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al eliminar'); setTimeout(() => setError(''), 3000); }
  };

  // --- Horario CRUD ---
  const handleSaveHorario = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/gym/classes/schedules`, {
        ...formHorario,
        classId: parseInt(formHorario.classId),
        trainerId: parseInt(formHorario.trainerId),
      });
      setMensaje('Horario creado');
      setFormHorario({ classId: '', trainerId: '', diaSemana: 'lunes', horaInicio: '09:00', horaFin: '10:00', sala: '' });
      setModalHorario(false);
      fetchAll();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al crear horario'); setTimeout(() => setError(''), 3000); }
  };

  const handleDeleteHorario = async (id) => {
    if (!confirm('¿Eliminar este horario?')) return;
    try {
      await axios.delete(`${API_URL}/gym/classes/schedules/${id}`);
      setMensaje('Horario eliminado');
      fetchAll();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al eliminar'); setTimeout(() => setError(''), 3000); }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6" style={{ color: YELLOW, textShadow: `0 0 5px ${GLOW}` }}>
        Clases y Horarios
      </h2>

      {mensaje && <AlertMsg msg={mensaje} type="success" />}
      {error && <AlertMsg msg={error} type="error" />}

      {/* Clases section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold" style={{ color: WHITE }}>Catalogo de Clases</h3>
        <button onClick={() => { setEditingClase(null); setFormClase({ nombre: '', descripcion: '', capacidadMaxima: 20, duracionMinutos: 60, nivel: 'principiante' }); setModalClase(true); }}
          className="px-5 py-2 font-semibold rounded-lg shadow-md transition hover:scale-105"
          style={{ backgroundColor: YELLOW, color: BG_END }}>
          + Nueva Clase
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {clases.map(c => (
          <div key={c.id} className="p-5 rounded-xl border" style={{ backgroundColor: BG_START, borderColor: BORDER }}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-bold" style={{ color: YELLOW }}>{c.nombre}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${YELLOW}15`, color: YELLOW }}>{c.nivel}</span>
            </div>
            {c.descripcion && <p className="text-sm mb-2" style={{ color: WHITE, opacity: 0.7 }}>{c.descripcion}</p>}
            <p className="text-sm" style={{ color: WHITE }}>Capacidad: {c.capacidadMaxima} | Duracion: {c.duracionMinutos} min</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setEditingClase(c); setFormClase({ nombre: c.nombre, descripcion: c.descripcion || '', capacidadMaxima: c.capacidadMaxima, duracionMinutos: c.duracionMinutos, nivel: c.nivel }); setModalClase(true); }}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: BG_END, color: YELLOW, border: `1px solid ${YELLOW}` }}>Editar</button>
              <button onClick={() => handleDeleteClase(c.id)}
                className="px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: BG_END, color: '#FF4444', border: '1px solid #FF4444' }}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Horario semanal */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold" style={{ color: WHITE }}>Horario Semanal</h3>
        <button onClick={() => setModalHorario(true)}
          className="px-5 py-2 font-semibold rounded-lg shadow-md transition hover:scale-105"
          style={{ backgroundColor: YELLOW, color: BG_END }}>
          + Nuevo Horario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ color: WHITE }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Hora'].concat(DIAS_SEMANA.map(d => d.charAt(0).toUpperCase() + d.slice(1, 4))).map((h, i) => (
                <th key={i} className="p-3 text-center" style={{ color: YELLOW }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {generateScheduleRows(schedule, handleDeleteHorario)}
          </tbody>
        </table>
      </div>

      {/* Modal Clase */}
      {modalClase && (
        <Modal onClose={() => { setModalClase(false); setEditingClase(null); }}>
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: WHITE }}>{editingClase ? 'Editar Clase' : 'Nueva Clase'}</h3>
          <form onSubmit={handleSaveClase}>
            <Input label="Nombre" name="nombre" value={formClase.nombre} onChange={e => setFormClase({...formClase, nombre: e.target.value})} required />
            <TextareaInput label="Descripcion" name="descripcion" value={formClase.descripcion} onChange={e => setFormClase({...formClase, descripcion: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Capacidad" name="capacidadMaxima" value={formClase.capacidadMaxima} onChange={e => setFormClase({...formClase, capacidadMaxima: parseInt(e.target.value)})} type="number" />
              <Input label="Duracion (min)" name="duracionMinutos" value={formClase.duracionMinutos} onChange={e => setFormClase({...formClase, duracionMinutos: parseInt(e.target.value)})} type="number" />
            </div>
            <SelectInput label="Nivel" name="nivel" value={formClase.nivel} onChange={e => setFormClase({...formClase, nivel: e.target.value})}
              options={[{value:'principiante',label:'Principiante'},{value:'intermedio',label:'Intermedio'},{value:'avanzado',label:'Avanzado'}]} />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setModalClase(false); setEditingClase(null); }} className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: BG_END, color: WHITE, border: `1px solid ${BORDER}` }}>Cancelar</button>
              <button type="submit" className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: YELLOW, color: BG_END }}> {editingClase ? 'Actualizar' : 'Crear'} </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Horario */}
      {modalHorario && (
        <Modal onClose={() => setModalHorario(false)}>
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: WHITE }}>Nuevo Horario</h3>
          <form onSubmit={handleSaveHorario}>
            <SelectInput label="Clase" name="classId" value={formHorario.classId} onChange={e => setFormHorario({...formHorario, classId: e.target.value})} required
              options={clases.map(c => ({value: c.id, label: c.nombre}))} />
            <SelectInput label="Entrenador" name="trainerId" value={formHorario.trainerId} onChange={e => setFormHorario({...formHorario, trainerId: e.target.value})} required
              options={trainers.map(t => ({value: t.id, label: t.name}))} />
            <SelectInput label="Dia" name="diaSemana" value={formHorario.diaSemana} onChange={e => setFormHorario({...formHorario, diaSemana: e.target.value})}
              options={DIAS_SEMANA.map(d => ({value: d, label: d.charAt(0).toUpperCase() + d.slice(1)}))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Hora Inicio" name="horaInicio" value={formHorario.horaInicio} onChange={e => setFormHorario({...formHorario, horaInicio: e.target.value})} type="time" required />
              <Input label="Hora Fin" name="horaFin" value={formHorario.horaFin} onChange={e => setFormHorario({...formHorario, horaFin: e.target.value})} type="time" required />
            </div>
            <Input label="Sala" name="sala" value={formHorario.sala} onChange={e => setFormHorario({...formHorario, sala: e.target.value})} placeholder="Ej: Sala A" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModalHorario(false)} className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: BG_END, color: WHITE, border: `1px solid ${BORDER}` }}>Cancelar</button>
              <button type="submit" className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: YELLOW, color: BG_END }}>Crear</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

const AlertMsg = ({ msg, type }) => (
  <div className="mb-4 p-3 rounded-lg" style={{ background: type === 'success' ? 'linear-gradient(90deg, #1A472A, #0A3319)' : 'linear-gradient(90deg, #5C1D1D, #3D1212)', border: `1px solid ${type === 'success' ? '#fdcc0d' : '#FF4444'}` }}>
    <span style={{ color: '#ffffff' }}>{msg}</span>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="p-8 rounded-xl shadow-2xl max-w-lg w-full animate-scaleIn" style={{ backgroundColor: BG_START, border: `1px solid ${GLOW}`, boxShadow: `0 0 20px ${GLOW}40` }} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const Input = ({ label, name, value, onChange, type = 'text', required, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1" style={{ color: '#ffffff' }}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
      style={{ backgroundColor: '#0a0a0a', color: '#ffffff', borderColor: '#333333' }} />
  </div>
);

const TextareaInput = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1" style={{ color: '#ffffff' }}>{label}</label>
    <textarea name={name} value={value} onChange={onChange} rows={2}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
      style={{ backgroundColor: '#0a0a0a', color: '#ffffff', borderColor: '#333333' }} />
  </div>
);

const SelectInput = ({ label, name, value, onChange, options, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1" style={{ color: '#ffffff' }}>{label}</label>
    <select name={name} value={value} onChange={onChange} required={required}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
      style={{ backgroundColor: '#0a0a0a', color: '#ffffff', borderColor: '#333333' }}>
      <option value="">Seleccionar...</option>
      {options.map(o => <option key={o.value} value={o.value} style={{ backgroundColor: '#0a0a0a' }}>{o.label}</option>)}
    </select>
  </div>
);

const generateScheduleRows = (schedule, handleDeleteHorario) => {
  const timeSlots = new Set();
  const entries = Object.entries(schedule);

  entries.forEach(([dia, items = []]) => {
    items.forEach(item => {
      timeSlots.add(item.horaInicio);
    });
  });

  const sortedSlots = Array.from(timeSlots).sort();
  if (sortedSlots.length === 0) {
    return (
      <tr>
        <td colSpan={8} className="p-8 text-center" style={{ color: '#888' }}>No hay horarios configurados</td>
      </tr>
    );
  }

  return sortedSlots.map(hora => (
    <tr key={hora} className="border-t" style={{ borderColor: '#333333' }}>
      <td className="p-3 text-center font-semibold" style={{ color: '#fdcc0d' }}>{hora}</td>
      {DIAS_SEMANA.map(dia => {
        const items = schedule[dia] || [];
        const matching = items.filter(i => i.horaInicio === hora);
        return (
          <td key={dia} className="p-2 text-center min-h-[40px]">
            {matching.length > 0 ? matching.map(item => (
              <div key={item.id} className="text-xs p-2 rounded mb-1" style={{ backgroundColor: '#1a1a1a', border: '1px solid #fdcc0d30' }}>
                <div style={{ color: '#fdcc0d' }}>{item.gymClass?.nombre || 'Clase'}</div>
                <div style={{ color: '#ffffff', opacity: 0.7 }}>{item.trainer?.name || ''}</div>
                <div style={{ color: '#ffffff', opacity: 0.5 }}>{item.sala || ''}</div>
              </div>
            )) : '-'}
          </td>
        );
      })}
    </tr>
  ));
};

export default ClasesSection;
