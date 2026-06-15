import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div className="animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 tracking-tight">
        Seguimiento de Progreso
      </h2>

      {mensaje && <AlertMsg msg={mensaje} type="success" />}
      {error && <AlertMsg msg={error} type="error" />}

      {/* User selector */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end mb-8 p-6 md:p-8 rounded-3xl bg-slate-50 border border-gray-100">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">Cliente</label>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all shadow-sm appearance-none cursor-pointer">
            <option value="">Seleccionar usuario...</option>
            {allUsers.filter(u => u.role === 'user').map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <button onClick={handleSearch}
          className="px-8 py-4 font-bold rounded-2xl bg-[#111111] text-white hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-md">
          Buscar
        </button>
        {selectedUser && (
          <button onClick={() => { setForm({ ...form, userId: selectedUser }); setModalOpen(true); }}
            className="px-8 py-4 font-bold rounded-2xl bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm">
            + Nuevo Registro
          </button>
        )}
      </div>

      {records.length > 0 && (
        <div className="space-y-8 animate-slideUp">
          {/* Chart Card */}
          {chartData.length > 1 && (
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Evolución de Peso</h3>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Últimos Registros</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="fecha" stroke="#E5E7EB" tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#E5E7EB" tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #F3F4F6', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} itemStyle={{ color: '#111111', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="peso" stroke="#111111" strokeWidth={3} dot={{ fill: '#111111', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Records List */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-900 tracking-tight">Historial de Medidas</h3>
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Fecha', 'Peso', 'Altura', 'Brazo D', 'Brazo I', 'Pecho', 'Cintura', 'Cadera', 'Pierna D', 'Pierna I', 'Notas'].map(h => (
                      <th key={h} className="pb-4 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r.id} className="border-t border-gray-100 hover:bg-white transition-colors">
                      <td className="p-3 text-sm text-gray-600 font-medium">{new Date(r.fecha).toLocaleDateString('es-ES')}</td>
                      <td className="p-3 font-bold text-gray-900">{r.pesoKg ? `${r.pesoKg}kg` : '-'}</td>
                      <td className="p-3 text-sm text-gray-600">{r.alturaCm || '-'}</td>
                      <td className="p-3 text-sm text-gray-600">{r.brazoDerCm || '-'}</td>
                      <td className="p-3 text-sm text-gray-600">{r.brazoIzqCm || '-'}</td>
                      <td className="p-3 text-sm text-gray-600">{r.pechoCm || '-'}</td>
                      <td className="p-3 text-sm text-gray-600">{r.cinturaCm || '-'}</td>
                      <td className="p-3 text-sm text-gray-600">{r.caderaCm || '-'}</td>
                      <td className="p-3 text-sm text-gray-600">{r.piernaDerCm || '-'}</td>
                      <td className="p-3 text-sm text-gray-600">{r.piernaIzqCm || '-'}</td>
                      <td className="p-3 text-sm text-gray-500 max-w-[150px] truncate">{r.notas || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedUser && records.length === 0 && (
        <div className="p-16 rounded-3xl bg-slate-50 text-center">
            <p className="text-gray-500 font-medium">Sin registros disponibles para este perfil.</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">Nuevo Registro</h3>
          <form onSubmit={handleSave} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <Input label="Fecha" type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} required />
            <SelectInput label="Entrenador" value={form.trainerId} onChange={e => setForm({ ...form, trainerId: e.target.value })}
              options={trainers.map(t => ({ value: t.id, label: t.name }))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Peso corporal (kg)" value={form.pesoKg} onChange={e => setForm({ ...form, pesoKg: e.target.value })} type="number" step="0.1" />
              <Input label="Estatura (cm)" value={form.alturaCm} onChange={e => setForm({ ...form, alturaCm: e.target.value })} type="number" step="0.1" />
            </div>
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-4">Perímetros (cm)</h4>
                <div className="grid grid-cols-2 gap-4">
                <Input label="Brazo Der." value={form.brazoDerCm} onChange={e => setForm({ ...form, brazoDerCm: e.target.value })} type="number" step="0.1" />
                <Input label="Brazo Izq." value={form.brazoIzqCm} onChange={e => setForm({ ...form, brazoIzqCm: e.target.value })} type="number" step="0.1" />
                <Input label="Pecho" value={form.pechoCm} onChange={e => setForm({ ...form, pechoCm: e.target.value })} type="number" step="0.1" />
                <Input label="Cintura" value={form.cinturaCm} onChange={e => setForm({ ...form, cinturaCm: e.target.value })} type="number" step="0.1" />
                <Input label="Cadera" value={form.caderaCm} onChange={e => setForm({ ...form, caderaCm: e.target.value })} type="number" step="0.1" />
                <Input label="Pierna Der." value={form.piernaDerCm} onChange={e => setForm({ ...form, piernaDerCm: e.target.value })} type="number" step="0.1" />
                <Input label="Pierna Izq." value={form.piernaIzqCm} onChange={e => setForm({ ...form, piernaIzqCm: e.target.value })} type="number" step="0.1" />
                </div>
            </div>

            <TextareaInput label="Notas" value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} placeholder="Observaciones del trainer..." />
            
            <div className="flex flex-col gap-3 pt-6">
              <button type="submit"
                className="w-full py-4 rounded-2xl font-bold text-white bg-[#111111] hover:bg-zinc-800 active:scale-[0.98] transition-all">Guardar Entrada</button>
              <button type="button" onClick={() => setModalOpen(false)}
                className="w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition-all">Descartar</button>
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
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn" onClick={onClose}>
    <div className="p-8 md:p-10 rounded-[32px] bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const Input = ({ label, type = 'text', value, onChange, step, required }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">{label}</label>
    <input type={type} value={value} onChange={onChange} step={step} required={required}
      className="w-full p-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 transition-all font-medium text-gray-900" />
  </div>
);

const TextareaInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">{label}</label>
    <textarea value={value} onChange={onChange} rows={3} placeholder={placeholder}
      className="w-full p-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 transition-all font-medium text-gray-900 resize-none" />
  </div>
);

const SelectInput = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">{label}</label>
    <select value={value} onChange={onChange}
      className="w-full p-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 transition-all font-medium text-gray-900 appearance-none cursor-pointer">
      <option value="">Seleccionar...</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export default ProgresoSection;
