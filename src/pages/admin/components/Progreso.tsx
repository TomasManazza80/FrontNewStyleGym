import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const BG_MAIN = '#0A0A0A';
const BG_CARD = '#1C1C1E';
const WHITE = '#ffffff';
const TEXT_SECONDARY = '#8E8E93';
const BORDER = '#2C2C2E';
const ACCENT = '#FFFFFF';
const API_URL = import.meta.env.VITE_API_URL || 'https://newstylegym-back.onrender.com';

const ProgresoSection = ({ allUsers = [] }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    userId: '', trainerId: '', fecha: new Date().toISOString().split('T')[0],
    pesoKg: '', alturaCm: '', brazoDerCm: '', brazoIzqCm: '',
    pechoCm: '', cinturaCm: '', caderaCm: '', piernaDerCm: '',
    piernaIzqCm: '', notas: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!selectedUser) return;
    try {
      const res = await axios.get(`${API_URL}/gym/progress/user/${selectedUser}`);
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); setError('Error al cargar progreso'); setTimeout(() => setError(''), 3000); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = {};
    Object.entries(form).forEach(([k, v]) => {
      if (v !== '') data[k] = k === 'userId' || k === 'trainerId' ? parseInt(v) : v;
    });
    data.fecha = form.fecha;
    if (form.pesoKg) data.pesoKg = parseFloat(form.pesoKg);
    if (form.alturaCm) data.alturaCm = parseFloat(form.alturaCm);
    if (form.brazoDerCm) data.brazoDerCm = parseFloat(form.brazoDerCm);
    if (form.brazoIzqCm) data.brazoIzqCm = parseFloat(form.brazoIzqCm);
    if (form.pechoCm) data.pechoCm = parseFloat(form.pechoCm);
    if (form.cinturaCm) data.cinturaCm = parseFloat(form.cinturaCm);
    if (form.caderaCm) data.caderaCm = parseFloat(form.caderaCm);
    if (form.piernaDerCm) data.piernaDerCm = parseFloat(form.piernaDerCm);
    if (form.piernaIzqCm) data.piernaIzqCm = parseFloat(form.piernaIzqCm);

    // Set trainer to admin if not specified
    const trainers = allUsers.filter(u => u.role === 'trainer' || u.role === 'admin');
    if (!data.trainerId && trainers.length > 0) data.trainerId = trainers[0].id;

    try {
      await axios.post(`${API_URL}/gym/progress`, data);
      setMensaje('Registro creado');
      setModalOpen(false);
      setForm({ userId: selectedUser, trainerId: '', fecha: new Date().toISOString().split('T')[0], pesoKg: '', alturaCm: '', brazoDerCm: '', brazoIzqCm: '', pechoCm: '', cinturaCm: '', caderaCm: '', piernaDerCm: '', piernaIzqCm: '', notas: '' });
      handleSearch();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al guardar'); setTimeout(() => setError(''), 3000); }
  };

  // Chart data
  const chartData = records.slice().reverse().filter(r => r.pesoKg).map(r => ({
    fecha: new Date(r.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    peso: parseFloat(r.pesoKg),
  }));

  const trainers = allUsers.filter(u => u.role === 'trainer' || u.role === 'admin');

  return (
    <div className="font-sans antialiased animate-fadeIn" style={{ backgroundColor: BG_MAIN }}>
      <h2 className="text-4xl font-extrabold mb-8 tracking-tighter text-white">
        Seguimiento de Progreso
      </h2>

      {mensaje && <AlertMsg msg={mensaje} type="success" />}
      {error && <AlertMsg msg={error} type="error" />}

      {/* User selector - iOS Style Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end mb-8 p-6 rounded-[28px] border transition-all"
        style={{ backgroundColor: BG_CARD, borderColor: BORDER }}>
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Cliente</label>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}
            className="w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none transition-all cursor-pointer"
            style={{ backgroundColor: BG_MAIN, color: TEXT_PRIMARY, borderColor: BORDER }}>
            <option value="">Seleccionar usuario...</option>
            {allUsers.filter(u => u.role === 'user').map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <button onClick={handleSearch}
          className="px-8 py-4 font-bold rounded-2xl transition-all active:scale-[0.96] shadow-lg"
          style={{ backgroundColor: ACCENT, color: BG_MAIN }}>
          Buscar
        </button>
        {selectedUser && (
          <button onClick={() => { setForm({ ...form, userId: selectedUser }); setModalOpen(true); }}
            className="px-8 py-4 font-bold rounded-2xl border transition-all active:scale-[0.96] backdrop-blur-md text-white"
            style={{ backgroundColor: 'transparent', borderColor: TEXT_PRIMARY }}>
            + Registro
          </button>
        )}
      </div>

      {records.length > 0 && (
        <div className="space-y-8 animate-slideUp">
          {/* Chart Card */}
          {chartData.length > 1 && (
            <div className="p-8 rounded-[28px] border shadow-2xl" style={{ backgroundColor: BG_CARD, borderColor: BORDER }}>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold tracking-tight" style={{ color: WHITE }}>Evolución de Peso</h3>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: TEXT_SECONDARY }}>Últimos Registros</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="fecha" stroke={BORDER} tick={{ fill: TEXT_SECONDARY, fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke={BORDER} tick={{ fill: TEXT_SECONDARY, fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(28, 28, 30, 0.8)', backdropFilter: 'blur(20px)', border: `1px solid ${BORDER}`, borderRadius: '16px', color: TEXT_PRIMARY }} itemStyle={{ color: TEXT_PRIMARY, fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="peso" stroke={WHITE} strokeWidth={3} dot={{ fill: WHITE, r: 6, strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Records List - Replaced Web Table with iOS minimalist list */}
          <div className="p-8 rounded-[28px] border overflow-hidden shadow-2xl" style={{ backgroundColor: BG_CARD, borderColor: BORDER }}>
            <h3 className="text-xl font-bold mb-6 tracking-tight" style={{ color: WHITE }}>Historial de Medidas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b" style={{ borderColor: BORDER }}>
                    {['Fecha', 'Peso', 'Altura', 'Brazo D', 'Brazo I', 'Pecho', 'Cintura', 'Cadera', 'Pierna D', 'Pierna I', 'Notas'].map(h => (
                      <th key={h} className="pb-4 px-2 text-[10px] font-black uppercase tracking-widest text-[#8E8E93]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r.id} className="border-t" style={{ borderColor: BORDER }}>
                      <td className="p-2">{new Date(r.fecha).toLocaleDateString('es-ES')}</td>
                      <td className="font-bold text-white">{r.pesoKg ? `${r.pesoKg}kg` : '-'}</td>
                      <td>{r.alturaCm || '-'}</td>
                      <td>{r.brazoDerCm || '-'}</td>
                      <td>{r.brazoIzqCm || '-'}</td>
                      <td>{r.pechoCm || '-'}</td>
                      <td>{r.cinturaCm || '-'}</td>
                      <td>{r.caderaCm || '-'}</td>
                      <td>{r.piernaDerCm || '-'}</td>
                      <td>{r.piernaIzqCm || '-'}</td>
                      <td className="max-w-[120px] truncate">{r.notas || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedUser && records.length === 0 && (
        <p className="text-center py-20 font-medium italic" style={{ color: TEXT_SECONDARY }}>Sin registros disponibles para este perfil.</p>
      )}

      {/* Modal */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-3xl font-black mb-8 tracking-tighter text-center" style={{ color: TEXT_PRIMARY }}>Nuevo Registro</h3>
          <form onSubmit={handleSave} className="max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            <Input label="Fecha" type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} required />
            <SelectInput label="Entrenador" value={form.trainerId} onChange={e => setForm({ ...form, trainerId: e.target.value })}
              options={trainers.map(t => ({ value: t.id, label: t.name }))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Peso corporal (kg)" value={form.pesoKg} onChange={e => setForm({ ...form, pesoKg: e.target.value })} type="number" step="0.1" />
              <Input label="Estatura (cm)" value={form.alturaCm} onChange={e => setForm({ ...form, alturaCm: e.target.value })} type="number" step="0.1" />
            </div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: TEXT_SECONDARY }}>Perimetros (cm)</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Brazo Der." value={form.brazoDerCm} onChange={e => setForm({ ...form, brazoDerCm: e.target.value })} type="number" step="0.1" />
              <Input label="Brazo Izq." value={form.brazoIzqCm} onChange={e => setForm({ ...form, brazoIzqCm: e.target.value })} type="number" step="0.1" />
              <Input label="Pecho" value={form.pechoCm} onChange={e => setForm({ ...form, pechoCm: e.target.value })} type="number" step="0.1" />
              <Input label="Cintura" value={form.cinturaCm} onChange={e => setForm({ ...form, cinturaCm: e.target.value })} type="number" step="0.1" />
              <Input label="Cadera" value={form.caderaCm} onChange={e => setForm({ ...form, caderaCm: e.target.value })} type="number" step="0.1" />
              <Input label="Pierna Der." value={form.piernaDerCm} onChange={e => setForm({ ...form, piernaDerCm: e.target.value })} type="number" step="0.1" />
              <Input label="Pierna Izq." value={form.piernaIzqCm} onChange={e => setForm({ ...form, piernaIzqCm: e.target.value })} type="number" step="0.1" />
            </div>
            <TextareaInput label="Notas" value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} placeholder="Observaciones del trainer..." />
            <div className="flex flex-col gap-3 pt-4">
              <button type="submit"
                className="w-full py-5 rounded-[20px] font-bold text-lg active:scale-[0.98] transition-all shadow-2xl"
                style={{ backgroundColor: ACCENT, color: BG_MAIN }}>Guardar Entrada</button>
              <button type="button" onClick={() => setModalOpen(false)}
                className="w-full py-4 rounded-[20px] font-bold transition-all text-white/60"
                style={{ backgroundColor: 'transparent' }}>Descartar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

const AlertMsg = ({ msg, type }) => {
  const isSuccess = type === 'success';
  return (
    <div className="mb-6 p-4 rounded-2xl backdrop-blur-xl border animate-slideDown"
      style={{ backgroundColor: isSuccess ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderColor: isSuccess ? '#22c55e' : '#ef4444', color: TEXT_PRIMARY }}>
      <p className="text-sm font-bold text-center tracking-tight">{msg}</p>
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4 transition-all animate-fadeIn" onClick={onClose}>
    <div className="p-10 rounded-[40px] shadow-2xl max-w-2xl w-full animate-scaleIn border" style={{ backgroundColor: BG_CARD, borderColor: BORDER_COLOR }} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const Input = ({ label, type = 'text', value, onChange, step, required }) => (
  <div className="mb-6">
    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>{label}</label>
    <input type={type} value={value} onChange={onChange} step={step} required={required}
      className="w-full p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold"
      style={{ backgroundColor: BG_MAIN, color: TEXT_PRIMARY, border: `1px solid ${BORDER_COLOR}` }} />
  </div>
);

const TextareaInput = ({ label, value, onChange, placeholder }) => (
  <div className="mb-6">
    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>{label}</label>
    <textarea value={value} onChange={onChange} rows={3} placeholder={placeholder}
      className="w-full p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium"
      style={{ backgroundColor: BG_MAIN, color: TEXT_PRIMARY, border: `1px solid ${BORDER_COLOR}` }} />
  </div>
);

const SelectInput = ({ label, value, onChange, options }) => (
  <div className="mb-6">
    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>{label}</label>
    <select value={value} onChange={onChange}
      className="w-full p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold appearance-none cursor-pointer"
      style={{ backgroundColor: BG_MAIN, color: TEXT_PRIMARY, border: `1px solid ${BORDER_COLOR}` }}>
      <option value="">Seleccionar...</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export default ProgresoSection;
