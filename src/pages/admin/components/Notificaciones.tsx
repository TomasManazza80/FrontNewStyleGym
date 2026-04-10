import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BG_START = '#1a1a1a';
const BG_END = '#0a0a0a';
const WHITE = '#ffffff';
const YELLOW = '#fdcc0d';
const GLOW = '#ffeb3b';
const BORDER = '#333333';
const API_URL = import.meta.env.VITE_API_URL || 'https://newstylegym-back.onrender.com';

const NotificacionesSection = ({ allUsers = [] }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalEnvio, setModalEnvio] = useState(false);
  const [form, setForm] = useState({ userId: '', titulo: '', mensaje: '', tipo: 'general' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [envioMasivo, setEnvioMasivo] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const fetchNotificaciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/gym/notifications/user/1?limit=50`);
      setNotificaciones(Array.isArray(res.data) ? res.data : []);
      const countRes = await axios.get(`${API_URL}/gym/notifications/user/1/unread-count`);
      setUnreadCount(countRes.data?.unreadCount || 0);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchNotificaciones(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await axios.put(`${API_URL}/gym/notifications/${id}/read`);
      fetchNotificaciones();
    } catch (e) { console.error(e); }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API_URL}/gym/notifications/user/1/read-all`);
      setUnreadCount(0);
      fetchNotificaciones();
      setMensaje('Todas marcadas como leidas');
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { console.error(e); }
  };

  const handleEnviarNotificacion = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, userId: parseInt(form.userId) };
      if (envioMasivo) {
        await axios.post(`${API_URL}/gym/notifications/bulk`, {
          userIds: selectedUserIds.length > 0 ? selectedUserIds : allUsers.filter(u => u.role === 'user').map(u => u.id),
          titulo: form.titulo,
          mensaje: form.mensaje,
          tipo: form.tipo,
        });
        setMensaje(`Notificacion enviada a ${selectedUserIds.length || allUsers.filter(u => u.role === 'user').length} usuarios`);
      } else {
        await axios.post(`${API_URL}/gym/notifications`, payload);
        setMensaje('Notificacion enviada');
      }
      setForm({ userId: '', titulo: '', mensaje: '', tipo: 'general' });
      setModalEnvio(false);
      setEnvioMasivo(false);
      fetchNotificaciones();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al enviar notificacion'); setTimeout(() => setError(''), 3000); }
  };

  const handleRunAutoExpiring = async () => {
    try {
      const res = await axios.post(`${API_URL}/gym/notifications/auto/expiring`);
      setMensaje(`Notificaciones enviadas a ${res.data.notified || 0} usuarios con suscripcion por vencer`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al ejecutar notificacion'); setTimeout(() => setError(''), 3000); }
  };

  const handleRunAutoExpired = async () => {
    try {
      const res = await axios.post(`${API_URL}/gym/notifications/auto/expired`);
      setMensaje(`Notificaciones enviadas a ${res.data.notified || 0} usuarios con suscripcion vencida`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al ejecutar notificacion'); setTimeout(() => setError(''), 3000); }
  };

  const toggleUserId = (id) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const tipoIcons = { vencimiento: '⚠️', pago: '$', clase: '📅', general: '📢', admin: '🔒' };
  const tipoColors = { vencimiento: '#FF4444', pago: YELLOW, clase: '#60A5FA', general: WHITE, admin: '#A78BFA' };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6" style={{ color: YELLOW, textShadow: `0 0 5px ${GLOW}` }}>
        Notificaciones {unreadCount > 0 && <span className="text-lg" style={{ color: '#FF4444' }}>({unreadCount} sin leer)</span>}
      </h2>

      {mensaje && <AlertMsg msg={mensaje} type="success" />}
      {error && <AlertMsg msg={error} type="error" />}

      {/* Actions row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => { setEnvioMasivo(false); setModalEnvio(true); }}
          className="px-5 py-2 font-semibold rounded-lg transition hover:scale-105" style={{ backgroundColor: YELLOW, color: BG_END }}>
          + Enviar Notificacion
        </button>
        <button onClick={() => { setEnvioMasivo(true); setModalEnvio(true); }}
          className="px-5 py-2 font-semibold rounded-lg transition hover:scale-105" style={{ backgroundColor: BG_END, color: YELLOW, border: `1px solid ${YELLOW}` }}>
          Envio Masivo
        </button>
        <button onClick={handleRunAutoExpiring}
          className="px-5 py-2 font-semibold rounded-lg transition hover:scale-105" style={{ backgroundColor: BG_END, color: '#FF4444', border: '1px solid #FF4444' }}>
          ⚠️ Notificar Vencimientos
        </button>
        <button onClick={handleRunAutoExpired}
          className="px-5 py-2 font-semibold rounded-lg transition hover:scale-105" style={{ backgroundColor: BG_END, color: '#FF4444', border: '1px solid #FF4444' }}>
          ⚠️ Marcar Vencidas + Notificar
        </button>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead}
            className="px-5 py-2 font-semibold rounded-lg transition hover:scale-105" style={{ backgroundColor: BG_START, color: WHITE, border: `1px solid ${BORDER}` }}>
            Marcar Todas como Leidas
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {notificaciones.length > 0 ? notificaciones.map(n => (
          <div key={n.id} className={`p-4 rounded-xl border flex justify-between items-center transition hover:shadow-lg ${!n.leida ? 'ring-1' : ''}`}
            style={{ backgroundColor: BG_START, borderColor: BORDER, ringColor: !n.leida ?YELLOW : 'transparent' }}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span style={{ color: tipoColors[n.tipo] || WHITE, fontSize: '18px' }}>{tipoIcons[n.tipo] || '📢'}</span>
                <span className="font-semibold" style={{ color: WHITE }}>{n.titulo}</span>
                {!n.leida && <span className="w-2 h-2 rounded-full bg-yellow-400"></span>}
              </div>
              <p className="text-sm" style={{ color: WHITE, opacity: 0.7 }}>{n.mensaje}</p>
              <p className="text-xs mt-1" style={{ color: '#888' }}>{new Date(n.createdAt).toLocaleString('es-ES')}</p>
            </div>
            {!n.leida && (
              <button onClick={() => handleMarkRead(n.id)}
                className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: BG_END, color: YELLOW, border: `1px solid ${YELLOW}` }}>
                Leida
              </button>
            )}
          </div>
        )) : (
          <p className="text-center py-16" style={{ color: '#888' }}>No hay notificaciones</p>
        )}
      </div>

      {/* Modal */}
      {modalEnvio && (
        <Modal onClose={() => setModalEnvio(false)}>
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: WHITE }}>
            {envioMasivo ? 'Envio Masivo de Notificaciones' : 'Enviar Notificacion'}
          </h3>
          <form onSubmit={handleEnviarNotificacion}>
            {envioMasivo && (
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: BG_END }}>
                <p className="text-sm mb-2" style={{ color: WHITE }}>Selecciona usuarios destino (vacio = todos los clientes):</p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {allUsers.filter(u => u.role === 'user').map(u => (
                    <label key={u.id} className="flex items-center gap-2 cursor-pointer" style={{ color: WHITE }}>
                      <input type="checkbox" checked={selectedUserIds.includes(u.id)} onChange={() => toggleUserId(u.id)} className="w-4 h-4 accent-yellow-400" />
                      {u.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {!envioMasivo && (
              <SelectInput label="Destinatario" value={form.userId} onChange={e => setForm({...form, userId: e.target.value})}
                options={allUsers.map(u => ({value: u.id, label: `${u.name} (${u.role})`}))} required />
            )}
            <Input label="Titulo" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required />
            <TextareaInput label="Mensaje" value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} required placeholder="Escribe el mensaje..." />
            <SelectInput label="Tipo" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
              options={[
                {value: 'general', label: 'General'},
                {value: 'pago', label: 'Pago'},
                {value: 'vencimiento', label: 'Vencimiento'},
                {value: 'clase', label: 'Clase'},
                {value: 'admin', label: 'Admin'},
              ]} />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModalEnvio(false)} className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: BG_END, color: WHITE, border: `1px solid ${BORDER}` }}>Cancelar</button>
              <button type="submit" className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: YELLOW, color: BG_END }}>Enviar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

const AlertMsg = ({ msg, type }) => (
  <div className="mb-3 p-3 rounded-lg" style={{ background: type === 'success' ? 'linear-gradient(90deg, #1A472A, #0A3319)' : 'linear-gradient(90deg, #5C1D1D, #3D1212)', border: `1px solid ${type === 'success' ? YELLOW : '#FF4444'}`, color: WHITE }}>{msg}</div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="p-8 rounded-xl shadow-2xl max-w-lg w-full animate-scaleIn" style={{ backgroundColor: BG_START, border: `1px solid ${GLOW}`, boxShadow: `0 0 20px ${GLOW}40` }} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const Input = ({ label, value, onChange, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1" style={{ color: WHITE }}>{label}</label>
    <input value={value} onChange={onChange} required={required}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
      style={{ backgroundColor: BG_END, color: WHITE, borderColor: BORDER }} />
  </div>
);

const TextareaInput = ({ label, value, onChange, required, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1" style={{ color: WHITE }}>{label}</label>
    <textarea value={value} onChange={onChange} required={required} rows={3} placeholder={placeholder}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
      style={{ backgroundColor: BG_END, color: WHITE, borderColor: BORDER }} />
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

export default NotificacionesSection;
