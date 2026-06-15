import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 tracking-tight">
        Clases y Horarios
      </h2>

      {mensaje && <AlertMsg msg={mensaje} type="success" />}
      {error && <AlertMsg msg={error} type="error" />}

      {/* Clases section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Catálogo de Clases</h3>
        <button onClick={() => { setEditingClase(null); setFormClase({ nombre: '', descripcion: '', capacidadMaxima: 20, duracionMinutos: 60, nivel: 'principiante' }); setModalClase(true); }}
          className="px-5 py-2.5 font-bold rounded-2xl transition-all active:scale-[0.98] bg-[#111111] text-white hover:bg-zinc-800 shadow-md text-sm">
          + Nueva Clase
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {clases.map(c => (
          <div key={c.id} className="p-6 md:p-8 rounded-3xl bg-slate-50 flex flex-col hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-bold text-gray-900">{c.nombre}</h4>
              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#111111] text-white flex-shrink-0">{c.nivel}</span>
            </div>
            {c.descripcion && <p className="text-sm mb-4 text-gray-500 leading-relaxed">{c.descripcion}</p>}
            
            <div className="flex-grow"></div>
            
            <div className="flex flex-col gap-1 mb-6 text-sm">
                <p className="font-medium text-gray-700">Capacidad: <span className="text-gray-900">{c.capacidadMaxima}</span></p>
                <p className="font-medium text-gray-700">Duración: <span className="text-gray-900">{c.duracionMinutos} min</span></p>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => { setEditingClase(c); setFormClase({ nombre: c.nombre, descripcion: c.descripcion || '', capacidadMaxima: c.capacidadMaxima, duracionMinutos: c.duracionMinutos, nivel: c.nivel }); setModalClase(true); }}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition-all active:scale-[0.98]">
                  Editar
              </button>
              <button onClick={() => handleDeleteClase(c.id)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-[0.98]">
                  Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Horario semanal */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Horario Semanal</h3>
          <button onClick={() => setModalHorario(true)}
            className="px-5 py-2.5 font-bold rounded-2xl transition-all active:scale-[0.98] bg-slate-100 text-[#111111] hover:bg-slate-200 text-sm">
            + Nuevo Horario
          </button>
        </div>

        <div className="overflow-x-auto pb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Hora'].concat(DIAS_SEMANA.map(d => d.charAt(0).toUpperCase() + d.slice(1, 4))).map((h, i) => (
                  <th key={i} className="p-4 text-center font-bold text-gray-400 uppercase tracking-wider text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {generateScheduleRows(schedule, handleDeleteHorario)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Clase */}
      {modalClase && (
        <Modal onClose={() => { setModalClase(false); setEditingClase(null); }}>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">{editingClase ? 'Editar Clase' : 'Nueva Clase'}</h3>
          <form onSubmit={handleSaveClase} className="space-y-6">
            <Input label="Nombre" name="nombre" value={formClase.nombre} onChange={e => setFormClase({...formClase, nombre: e.target.value})} required />
            <TextareaInput label="Descripción" name="descripcion" value={formClase.descripcion} onChange={e => setFormClase({...formClase, descripcion: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Capacidad" name="capacidadMaxima" value={formClase.capacidadMaxima} onChange={e => setFormClase({...formClase, capacidadMaxima: parseInt(e.target.value)})} type="number" />
              <Input label="Duración (min)" name="duracionMinutos" value={formClase.duracionMinutos} onChange={e => setFormClase({...formClase, duracionMinutos: parseInt(e.target.value)})} type="number" />
            </div>
            <SelectInput label="Nivel" name="nivel" value={formClase.nivel} onChange={e => setFormClase({...formClase, nivel: e.target.value})}
              options={[{value:'principiante',label:'Principiante'},{value:'intermedio',label:'Intermedio'},{value:'avanzado',label:'Avanzado'}]} />
            
            <div className="flex flex-col gap-3 pt-6">
              <button type="submit" className="w-full py-4 rounded-2xl font-bold text-white bg-[#111111] hover:bg-zinc-800 active:scale-[0.98] transition-all"> {editingClase ? 'Actualizar Clase' : 'Crear Clase'} </button>
              <button type="button" onClick={() => { setModalClase(false); setEditingClase(null); }} className="w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition-all">Cancelar</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Horario */}
      {modalHorario && (
        <Modal onClose={() => setModalHorario(false)}>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">Nuevo Horario</h3>
          <form onSubmit={handleSaveHorario} className="space-y-6">
            <SelectInput label="Clase" name="classId" value={formHorario.classId} onChange={e => setFormHorario({...formHorario, classId: e.target.value})} required
              options={clases.map(c => ({value: c.id, label: c.nombre}))} />
            <SelectInput label="Entrenador" name="trainerId" value={formHorario.trainerId} onChange={e => setFormHorario({...formHorario, trainerId: e.target.value})} required
              options={trainers.map(t => ({value: t.id, label: t.name}))} />
            <SelectInput label="Día" name="diaSemana" value={formHorario.diaSemana} onChange={e => setFormHorario({...formHorario, diaSemana: e.target.value})}
              options={DIAS_SEMANA.map(d => ({value: d, label: d.charAt(0).toUpperCase() + d.slice(1)}))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Hora Inicio" name="horaInicio" value={formHorario.horaInicio} onChange={e => setFormHorario({...formHorario, horaInicio: e.target.value})} type="time" required />
              <Input label="Hora Fin" name="horaFin" value={formHorario.horaFin} onChange={e => setFormHorario({...formHorario, horaFin: e.target.value})} type="time" required />
            </div>
            <Input label="Sala" name="sala" value={formHorario.sala} onChange={e => setFormHorario({...formHorario, sala: e.target.value})} placeholder="Ej: Sala A" />
            
            <div className="flex flex-col gap-3 pt-6">
              <button type="submit" className="w-full py-4 rounded-2xl font-bold text-white bg-[#111111] hover:bg-zinc-800 active:scale-[0.98] transition-all">Crear Horario</button>
              <button type="button" onClick={() => setModalHorario(false)} className="w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition-all">Cancelar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

const AlertMsg = ({ msg, type }) => (
  <div className={`mb-6 p-4 rounded-2xl text-sm font-semibold ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
    <span>{msg}</span>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
    <div className="p-8 md:p-10 rounded-[32px] bg-white shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const Input = ({ label, name, value, onChange, type = 'text', required, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="w-full p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all" />
  </div>
);

const TextareaInput = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">{label}</label>
    <textarea name={name} value={value} onChange={onChange} rows={2}
      className="w-full p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all resize-none" />
  </div>
);

const SelectInput = ({ label, name, value, onChange, options, required }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">{label}</label>
    <select name={name} value={value} onChange={onChange} required={required}
      className="w-full p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all appearance-none cursor-pointer">
      <option value="">Seleccionar...</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
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
        <td colSpan={8} className="p-8 text-center text-gray-500 font-medium">No hay horarios configurados</td>
      </tr>
    );
  }

  return sortedSlots.map((hora, index) => (
    <tr key={hora} className={`${index !== 0 ? 'border-t border-gray-50' : ''}`}>
      <td className="p-4 text-center font-bold text-gray-900">{hora}</td>
      {DIAS_SEMANA.map(dia => {
        const items = schedule[dia] || [];
        const matching = items.filter(i => i.horaInicio === hora);
        return (
          <td key={dia} className="p-2 text-center align-top min-w-[120px]">
            {matching.length > 0 ? matching.map(item => (
              <div key={item.id} className="text-xs p-3 rounded-2xl mb-2 bg-slate-50 border border-transparent hover:border-gray-200 transition-colors group relative">
                <div className="font-bold text-gray-900 mb-1">{item.gymClass?.nombre || 'Clase'}</div>
                <div className="text-gray-600 font-medium">{item.trainer?.name || ''}</div>
                <div className="text-gray-400 mt-1">{item.sala || ''}</div>
                <button onClick={() => handleDeleteHorario(item.id)} className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )) : <span className="text-gray-300">-</span>}
          </td>
        );
      })}
    </tr>
  ));
};

export default ClasesSection;
