import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      setMensaje('Todas marcadas como leídas');
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
        setMensaje(`Notificación enviada a ${selectedUserIds.length || allUsers.filter(u => u.role === 'user').length} usuarios`);
      } else {
        await axios.post(`${API_URL}/gym/notifications`, payload);
        setMensaje('Notificación enviada');
      }
      setForm({ userId: '', titulo: '', mensaje: '', tipo: 'general' });
      setModalEnvio(false);
      setEnvioMasivo(false);
      fetchNotificaciones();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al enviar notificación'); setTimeout(() => setError(''), 3000); }
  };

  const handleRunAutoExpiring = async () => {
    try {
      const res = await axios.post(`${API_URL}/gym/notifications/auto/expiring`);
      setMensaje(`Notificaciones enviadas a ${res.data.notified || 0} usuarios con suscripción por vencer`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al ejecutar notificación'); setTimeout(() => setError(''), 3000); }
  };

  const handleRunAutoExpired = async () => {
    try {
      const res = await axios.post(`${API_URL}/gym/notifications/auto/expired`);
      setMensaje(`Notificaciones enviadas a ${res.data.notified || 0} usuarios con suscripción vencida`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al ejecutar notificación'); setTimeout(() => setError(''), 3000); }
  };

  const toggleUserId = (id) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const tipoIcons = { vencimiento: '⚠️', pago: '$', clase: '📅', general: '📢', admin: '🔒' };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Notificaciones
        </h2>
        {unreadCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-sm flex-shrink-0 animate-pulse">
            {unreadCount} sin leer
          </span>
        )}
      </div>

      {mensaje && <AlertMsg msg={mensaje} type="success" />}
      {error && <AlertMsg msg={error} type="error" />}

      {/* Actions row */}
      <div className="flex flex-wrap gap-3 mb-8 p-6 md:p-8 rounded-3xl bg-slate-50 border border-gray-100">
        <button onClick={() => { setEnvioMasivo(false); setModalEnvio(true); }}
          className="px-5 py-3 font-bold rounded-2xl bg-[#111111] text-white hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-sm text-sm">
          + Enviar Notificación
        </button>
        <button onClick={() => { setEnvioMasivo(true); setModalEnvio(true); }}
          className="px-5 py-3 font-bold rounded-2xl bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm text-sm">
          Envío Masivo
        </button>
        <button onClick={handleRunAutoExpiring}
          className="px-5 py-3 font-bold rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all active:scale-[0.98] text-sm">
          ⚠️ Notificar Vencimientos
        </button>
        <button onClick={handleRunAutoExpired}
          className="px-5 py-3 font-bold rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-[0.98] text-sm">
          ⚠️ Marcar Vencidas + Notificar
        </button>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead}
            className="px-5 py-3 font-bold rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all active:scale-[0.98] text-sm ml-auto">
            Marcar Todas como Leídas
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {notificaciones.length > 0 ? notificaciones.map(n => (
          <div key={n.id} className={`p-6 rounded-3xl bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all shadow-sm border ${!n.leida ? 'border-[#111111]/20 shadow-md' : 'border-transparent'}`} >
            <div className="flex gap-4 w-full">
              <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${!n.leida ? 'bg-yellow-100' : 'bg-slate-50'}`}>
                {tipoIcons[n.tipo] || '📢'}
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-gray-900 text-lg">{n.titulo}</span>
                  {!n.leida && <span className="w-2.5 h-2.5 rounded-full bg-[#111111]"></span>}
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1 leading-relaxed">{n.mensaje}</p>
                <p className="text-xs text-gray-400 font-semibold">{new Date(n.createdAt).toLocaleString('es-ES')}</p>
              </div>
            </div>
            {!n.leida && (
              <button onClick={() => handleMarkRead(n.id)}
                className="mt-2 sm:mt-0 w-full sm:w-auto px-5 py-2.5 rounded-2xl text-sm font-bold bg-slate-100 text-gray-700 hover:bg-slate-200 transition-all active:scale-[0.98] flex-shrink-0">
                Marcar Leída
              </button>
            )}
          </div>
        )) : (
          <div className="p-16 rounded-3xl bg-slate-50 text-center">
            <p className="text-gray-500 font-medium">No tienes notificaciones pendientes</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalEnvio && (
        <Modal onClose={() => setModalEnvio(false)}>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">
            {envioMasivo ? 'Envío Masivo de Notificaciones' : 'Enviar Notificación'}
          </h3>
          <form onSubmit={handleEnviarNotificacion} className="space-y-6">
            {envioMasivo && (
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-gray-100">
                <p className="text-sm font-semibold text-gray-500 mb-4 ml-1">Selecciona usuarios destino (vacío = todos los clientes):</p>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {allUsers.filter(u => u.role === 'user').map(u => (
                    <label key={u.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-white transition-colors">
                      <input type="checkbox" checked={selectedUserIds.includes(u.id)} onChange={() => toggleUserId(u.id)} className="w-5 h-5 accent-[#111111] rounded" />
                      <span className="font-medium text-gray-900">{u.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {!envioMasivo && (
              <SelectInput label="Destinatario" value={form.userId} onChange={e => setForm({...form, userId: e.target.value})}
                options={allUsers.map(u => ({value: u.id, label: `${u.name} (${u.role})`}))} required />
            )}
            <Input label="Título" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required />
            <TextareaInput label="Mensaje" value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} required placeholder="Escribe el mensaje..." />
            <SelectInput label="Tipo" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
              options={[
                {value: 'general', label: 'General'},
                {value: 'pago', label: 'Pago'},
                {value: 'vencimiento', label: 'Vencimiento'},
                {value: 'clase', label: 'Clase'},
                {value: 'admin', label: 'Admin'},
              ]} />
            <div className="flex flex-col gap-3 pt-6">
              <button type="submit" className="w-full py-4 rounded-2xl font-bold text-white bg-[#111111] hover:bg-zinc-800 active:scale-[0.98] transition-all">Enviar Notificación</button>
              <button type="button" onClick={() => setModalEnvio(false)} className="w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition-all">Cancelar</button>
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

const Input = ({ label, value, onChange, required }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">{label}</label>
    <input value={value} onChange={onChange} required={required}
      className="w-full p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all" />
  </div>
);

const TextareaInput = ({ label, value, onChange, required, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">{label}</label>
    <textarea value={value} onChange={onChange} required={required} rows={3} placeholder={placeholder}
      className="w-full p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all resize-none" />
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

export default NotificacionesSection;
