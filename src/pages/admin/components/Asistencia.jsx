import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://newstylegym-back.onrender.com';

const AsistenciaSection = ({ allUsers = [] }) => {
  const [presentes, setPresentes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  useEffect(() => {
    fetchPresentes();
  }, []);

  const fetchPresentes = async () => {
    try {
      const res = await axios.get(`${API_URL}/gym/attendance/present`);
      setPresentes(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error('Error fetch presentes:', e); }
  };

  const fetchHistorial = async () => {
    if (!fechaDesde || !fechaHasta) {
      setError('Selecciona un rango de fechas');
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/gym/attendance/user/${selectedUserId}`);
      setHistorial(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error('Error fetch historial:', e); }
  };

  const handleCheckIn = async () => {
    if (!selectedUserId) {
      setError('Selecciona un usuario primero');
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      await axios.post(`${API_URL}/gym/attendance/checkin`, {
        userId: parseInt(selectedUserId),
        metodo: 'manual_staff',
      });
      setMensaje('Entrada registrada correctamente');
      fetchPresentes();
      setSelectedUserId('');
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) {
      setError('Error al registrar entrada');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCheckOut = async (attendanceId) => {
    try {
      await axios.put(`${API_URL}/gym/attendance/checkout/${attendanceId}`);
      setMensaje('Salida registrada');
      fetchPresentes();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) {
      setError('Error al registrar salida');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSearchHistory = async (e) => {
    e.preventDefault();
    fetchHistorial();
  };

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 tracking-tight">
        Control de Asistencia
      </h2>

      {mensaje && <div className="mb-6 p-4 rounded-2xl bg-green-50 text-green-800 text-sm font-semibold">{mensaje}</div>}
      {error && <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-800 text-sm font-semibold">{error}</div>}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Presentes Ahora" value={presentes.length} />
        <StatCard label="Registrados Hoy" value={new Date().toLocaleDateString('es-ES')} />
        <StatCard label="Capacidad" value={`${presentes.length} / ${allUsers.length}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          {/* Check-in form */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-50">
            <h3 className="text-xl font-bold mb-6 text-gray-900 tracking-tight">Registrar Entrada</h3>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">Buscar Usuario</label>
                <input
                  type="text"
                  placeholder="Escribe nombre o email..."
                  value={searchTerm}
                  onChange={e => { setSelectedUserId(''); setSearchTerm(e.target.value); }}
                  className="w-full p-4 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all shadow-sm"
                />
                {searchTerm && !selectedUserId && filteredUsers.length > 0 && (
                  <div className="absolute z-10 w-full max-h-48 overflow-y-auto rounded-2xl bg-white shadow-xl mt-2 border border-gray-100 p-2">
                    {filteredUsers.slice(0, 8).map(u => (
                      <button key={u.id} onClick={() => { setSelectedUserId(u.id); setSearchTerm(u.name); }}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 text-gray-900 font-medium transition-all">
                        {u.name} <span className="text-gray-500 font-normal text-sm">({u.email})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={handleCheckIn}
                className="w-full py-4 font-bold rounded-2xl text-white bg-[#111111] hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-md">
                Check In
              </button>
            </div>
          </div>

          {/* Historial por usuario */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-50 flex-grow">
            <h3 className="text-xl font-bold mb-6 text-gray-900 tracking-tight">Historial de Asistencia</h3>
            <form onSubmit={handleSearchHistory} className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">Usuario</label>
                <select
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all shadow-sm appearance-none cursor-pointer"
                >
                  <option value="">Seleccionar usuario...</option>
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit"
                className="w-full py-4 font-bold rounded-2xl text-[#111111] bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all">
                Buscar Historial
              </button>
            </form>

            {historial.length > 0 && (
              <div className="space-y-3 mt-4">
                {historial.slice(0, 20).map(r => (
                  <div key={r.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-white shadow-sm text-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{new Date(r.checkIn).toLocaleDateString('es-ES')}</span>
                      <span className="text-gray-500 text-xs mt-1">Ingreso: {new Date(r.checkIn).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-gray-500 text-xs">Salida: {r.checkOut ? new Date(r.checkOut).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Aún dentro'}</span>
                    </div>
                    <span className="mt-3 sm:mt-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 text-gray-600">{r.metodo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {/* Presentes */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#111111] h-full flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-white tracking-tight">Personas en el Gimnasio ({presentes.length})</h3>
            <div className="space-y-3 flex-grow overflow-y-auto">
              {presentes.length > 0 ? presentes.map(r => (
                <div key={r.id} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-lg">{r.user?.name || r.userId}</span>
                    <span className="text-xs text-gray-400 font-medium mt-0.5">
                      Ingresó a las {new Date(r.checkIn).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button onClick={() => handleCheckOut(r.id)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white text-[#111111] hover:bg-gray-200 active:scale-[0.95] transition-all">
                    Check Out
                  </button>
                </div>
              )) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <p className="text-center text-gray-500 font-medium">No hay personas en el gimnasio</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 flex flex-col items-center justify-center hover:shadow-sm transition-all h-full">
    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest text-center">{label}</p>
    <p className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter text-center">{value}</p>
  </div>
);

export default AsistenciaSection;
