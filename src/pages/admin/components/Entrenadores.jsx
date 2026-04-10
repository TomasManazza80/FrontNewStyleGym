import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BG_START = '#1a1a1a';
const BG_END = '#0a0a0a';
const WHITE = '#ffffff';
const YELLOW = '#fdcc0d';
const GLOW = '#ffeb3b';
const BORDER = '#333333';
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
    if (!confirm('¿Quitar esta asignacion?')) return;
    try {
      await axios.delete(`${API_URL}/gym/trainer-clients/${id}`);
      setMensaje('Asignacion eliminada');
      fetchAll();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al eliminar'); setTimeout(() => setError(''), 3000); }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6" style={{ color: YELLOW, textShadow: `0 0 5px ${GLOW}` }}>
        Entrenadores y Clientes
      </h2>

      {mensaje && <AlertMsg msg={mensaje} type="success" />}
      {error && <AlertMsg msg={error} type="error" />}

      <div className="flex justify-between items-center mb-6">
        <p style={{ color: WHITE, opacity: 0.7 }}>Asigna entrenadores a clientes con objetivos especificos</p>
        <button onClick={() => setModalOpen(true)}
          className="px-5 py-2 font-semibold rounded-lg shadow-md transition hover:scale-105"
          style={{ backgroundColor: YELLOW, color: BG_END }}>
          + Nueva Asignacion
        </button>
      </div>

      <div className="space-y-3">
        {asignaciones.length > 0 ? asignaciones.map(a => (
          <div key={a.id} className="p-5 rounded-xl border flex justify-between items-center"
            style={{ backgroundColor: BG_START, borderColor: BORDER }}>
            <div className="flex-1">
              <div className="flex items-center gap-4" style={{ color: WHITE }}>
                <div className="flex items-center gap-2">
                  <span style={{ color: YELLOW, fontWeight: 'bold' }}>{a.trainerOfUser?.name || `Trainer #${a.trainerId}`}</span>
                  <svg className="w-5 h-5" style={{ color: YELLOW }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  <span className="font-semibold">{a.clientOfUser?.name || `Client #${a.clientId}`}</span>
                </div>
              </div>
              {a.objetivo && <p className="text-sm mt-1" style={{ color: WHITE, opacity: 0.5 }}>Objetivo: {a.objetivo}</p>}
              {a.notas && <p className="text-xs mt-1" style={{ color: '#888' }}>{a.notas}</p>}
            </div>
            <button onClick={() => handleRemove(a.id)}
              className="px-3 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: BG_END, color: '#FF4444', border: '1px solid #FF4444' }}>
              Quitar
            </button>
          </div>
        )) : (
          <p className="text-center py-16" style={{ color: '#888' }}>No hay asignaciones creadas</p>
        )}
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: WHITE }}>Asignar Entrenador</h3>
          <form onSubmit={handleAssign}>
            <SelectInput label="Entrenador" value={form.trainerId} onChange={e => setForm({...form, trainerId: e.target.value})}
              options={trainers.map(t => ({value: t.id, label: t.name}))} required />
            <SelectInput label="Cliente" value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
              options={clients.map(c => ({value: c.id, label: c.name}))} required />
            <TextareaInput label="Objetivo" value={form.objetivo} onChange={e => setForm({...form, objetivo: e.target.value})} placeholder="Ej: Perder 10kg en 3 meses" />
            <TextareaInput label="Notas" value={form.notas} onChange={e => setForm({...form, notas: e.target.value})} placeholder="Observaciones adicionales..." />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: BG_END, color: WHITE, border: `1px solid ${BORDER}` }}>Cancelar</button>
              <button type="submit" className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: YELLOW, color: BG_END }}>Asignar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

const AlertMsg = ({ msg, type }) => (
  <div className="mb-3 p-3 rounded-lg" style={{ background: type === 'success' ? 'linear-gradient(90deg, #1A472A, #0A3319)' : 'linear-gradient(90deg, #5C1D1D, #3D1212)', border: `1px solid ${type === 'success' ? '#fdcc0d' : '#FF4444'}` }}>
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

const SelectInput = ({ label, value, onChange, options, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1" style={{ color: WHITE }}>{label}</label>
    <select value={value} onChange={onChange} required={required}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
      style={{ backgroundColor: BG_END, color: WHITE, borderColor: BORDER }}>
      <option value="">Seleccionar...</option>
      {options.map(o => <option key={o.value} value={o.value} style={{ backgroundColor: BG_END }}>{o.label}</option>)}
    </select>
  </div>
);

const TextareaInput = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1" style={{ color: WHITE }}>{label}</label>
    <textarea value={value} onChange={onChange} rows={2} placeholder={placeholder}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
      style={{ backgroundColor: BG_END, color: WHITE, borderColor: BORDER }} />
  </div>
);

export default EntrenadoresSection;
