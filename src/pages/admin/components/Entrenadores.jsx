import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://newstylegym-back.onrender.com';

const EntrenadoresSection = ({ allUsers = [] }) => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ trainerId: '', clientId: '', objetivo: '', notas: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/gym/trainer-clients`);
      setAsignaciones(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
  };

  const trainers = allUsers.filter(u => u.role === 'trainer' || u.role === 'admin');
  const clients = allUsers.filter(u => u.role === 'user');

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/gym/trainer-clients`, {
        trainerId: parseInt(form.trainerId),
        clientId: parseInt(form.clientId),
        objetivo: form.objetivo,
        notas: form.notas,
      });
      setMensaje('Entrenador asignado correctamente');
      setForm({ trainerId: '', clientId: '', objetivo: '', notas: '' });
      setModalOpen(false);
      fetchAll();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al asignar'); setTimeout(() => setError(''), 3000); }
  };

  const handleRemove = async (id) => {
    if (!confirm('¿Quitar esta asignación?')) return;
    try {
      await axios.delete(`${API_URL}/gym/trainer-clients/${id}`);
      setMensaje('Asignación eliminada');
      fetchAll();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al eliminar'); setTimeout(() => setError(''), 3000); }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 tracking-tight">
        Entrenadores y Clientes
      </h2>

      {mensaje && <AlertMsg msg={mensaje} type="success" />}
      {error && <AlertMsg msg={error} type="error" />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <p className="text-gray-500 font-medium text-sm">Asigna entrenadores a clientes con objetivos específicos</p>
        <button onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 font-bold rounded-2xl transition-all active:scale-[0.98] bg-[#111111] text-white hover:bg-zinc-800 shadow-md text-sm">
          + Nueva Asignación
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {asignaciones.length > 0 ? asignaciones.map(a => (
          <div key={a.id} className="p-6 md:p-8 rounded-3xl bg-slate-50 flex flex-col hover:shadow-sm transition-shadow">
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-lg">{a.trainerOfUser?.name || `Trainer #${a.trainerId}`}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#111111] text-white">Trainer</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                <span className="font-semibold text-gray-700">{a.clientOfUser?.name || `Client #${a.clientId}`}</span>
              </div>
            </div>
            
            {a.objetivo && <p className="text-sm mt-2 text-gray-700 font-medium">Objetivo: <span className="text-gray-900">{a.objetivo}</span></p>}
            {a.notas && <p className="text-xs mt-2 text-gray-500 bg-white p-3 rounded-2xl">{a.notas}</p>}
            
            <div className="flex-grow"></div>
            
            <button onClick={() => handleRemove(a.id)}
              className="mt-6 w-full py-3 rounded-2xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-[0.98]">
              Quitar Asignación
            </button>
          </div>
        )) : (
          <div className="col-span-full py-16 text-center rounded-3xl bg-slate-50">
            <p className="text-gray-500 font-medium">No hay asignaciones creadas</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">Asignar Entrenador</h3>
          <form onSubmit={handleAssign} className="space-y-6">
            <SelectInput label="Entrenador" value={form.trainerId} onChange={e => setForm({...form, trainerId: e.target.value})}
              options={trainers.map(t => ({value: t.id, label: t.name}))} required />
            <SelectInput label="Cliente" value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
              options={clients.map(c => ({value: c.id, label: c.name}))} required />
            <TextareaInput label="Objetivo" value={form.objetivo} onChange={e => setForm({...form, objetivo: e.target.value})} placeholder="Ej: Perder 10kg en 3 meses" />
            <TextareaInput label="Notas" value={form.notas} onChange={e => setForm({...form, notas: e.target.value})} placeholder="Observaciones adicionales..." />
            
            <div className="flex flex-col gap-3 pt-6">
              <button type="submit" className="w-full py-4 rounded-2xl font-bold text-white bg-[#111111] hover:bg-zinc-800 active:scale-[0.98] transition-all">Asignar</button>
              <button type="button" onClick={() => setModalOpen(false)} className="w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition-all">Cancelar</button>
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
    <div className="p-8 md:p-10 rounded-[32px] bg-white shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleIn" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const SelectInput = ({ label, value, onChange, options, required }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">{label}</label>
    <select value={value} onChange={onChange} required={required}
      className="w-full p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all appearance-none cursor-pointer">
      <option value="">Seleccionar...</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const TextareaInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">{label}</label>
    <textarea value={value} onChange={onChange} rows={2} placeholder={placeholder}
      className="w-full p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all resize-none" />
  </div>
);

export default EntrenadoresSection;
