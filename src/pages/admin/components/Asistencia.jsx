import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const BG_START = '#1a1a1a';
const BG_END = '#0a0a0a';
const WHITE = '#ffffff';
const YELLOW = '#fdcc0d';
const GLOW = '#ffeb3b';
const BORDER = '#333333';
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
    <div>
      <h2 className="text-3xl font-bold mb-6" style={{ color: YELLOW, textShadow: `0 0 5px ${GLOW}` }}>
        Asistencia
      </h2>

      {mensaje && <p className="mb-3 p-3 rounded-lg" style={{ background: 'linear-gradient(90deg, #1A472A, #0A3319)', border: `1px solid ${YELLOW}`, color: WHITE }}>{mensaje}</p>}
      {error && <p className="mb-3 p-3 rounded-lg" style={{ background: 'linear-gradient(90deg, #5C1D1D, #3D1212)', border: '1px solid #FF4444', color: WHITE }}>{error}</p>}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Presentes Ahora" value={presentes.length} />
        <StatCard label="Registrados Hoy" value={new Date().toLocaleDateString('es-ES')} />
        <StatCard label="Capacidad" value={`${presentes.length} / ${allUsers.length}`} />
      </div>

      {/* Check-in form */}
      <div className="p-6 rounded-xl border mb-8" style={{ backgroundColor: BG_START, borderColor: BORDER, boxShadow: `0 0 10px ${GLOW}05` }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: WHITE }}>Registrar Entrada</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm mb-1" style={{ color: WHITE }}>Buscar Usuario</label>
            <input
              type="text"
              placeholder="Escribe nombre o email..."
              value={searchTerm}
              onChange={e => setSelectedUserId('') || setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
              style={{ backgroundColor: BG_END, color: WHITE, borderColor: BORDER }}
            />
            {searchTerm && !selectedUserId && filteredUsers.length > 0 && (
              <div className="absolute z-10 max-h-48 overflow-y-auto rounded-lg border mt-1"
                style={{ backgroundColor: BG_END, borderColor: BORDER }}>
                {filteredUsers.slice(0, 8).map(u => (
                  <button key={u.id} onClick={() => { setSelectedUserId(u.id); setSearchTerm(u.name); }}
                    className="w-full text-left p-3 hover:bg-gray-800 transition"
                    style={{ color: WHITE }}>
                    {u.name} ({u.email})
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleCheckIn}
            className="px-6 py-3 font-semibold rounded-lg shadow-md transition hover:scale-105"
            style={{ backgroundColor: YELLOW, color: BG_END, boxShadow: `0 0 8px ${GLOW}60` }}>
            Check In
          </button>
        </div>
      </div>

      {/* Presentes */}
      <div className="p-6 rounded-xl border mb-8" style={{ backgroundColor: BG_START, borderColor: BORDER }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: WHITE }}>Personas en el Gimnasio ({presentes.length})</h3>
        <div className="space-y-3">
          {presentes.length > 0 ? presentes.map(r => (
            <div key={r.id} className="flex justify-between items-center p-4 rounded-lg"
              style={{ backgroundColor: BG_END }}>
              <div>
                <span className="font-semibold" style={{ color: WHITE }}>{r.user?.name || r.userId}</span>
                <span className="text-xs ml-2" style={{ color: WHITE, opacity: 0.5 }}>
                  Entrada: {new Date(r.checkIn).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button onClick={() => handleCheckOut(r.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: BG_START, color: YELLOW, border: `1px solid ${YELLOW}` }}>
                Check Out
              </button>
            </div>
          )) : (
            <p className="text-center py-8" style={{ color: '#888' }}>No hay personas en el gimnasio</p>
          )}
        </div>
      </div>

      {/* Historial por usuario */}
      <div className="p-6 rounded-xl border" style={{ backgroundColor: BG_START, borderColor: BORDER }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: WHITE }}>Historial de Asistencia</h3>
        <form onSubmit={handleSearchHistory} className="flex gap-4 items-end mb-4">
          <div className="flex-1">
            <label className="block text-sm mb-1" style={{ color: WHITE }}>Usuario</label>
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
              style={{ backgroundColor: BG_END, color: WHITE, borderColor: BORDER }}
            >
              <option value="">Seleccionar usuario...</option>
              {allUsers.map(u => (
                <option key={u.id} value={u.id} style={{ backgroundColor: BG_END }}>{u.name}</option>
              ))}
            </select>
          </div>
          <button type="submit"
            className="px-6 py-3 font-semibold rounded-lg shadow-md transition hover:scale-105"
            style={{ backgroundColor: YELLOW, color: BG_END }}>
            Buscar
          </button>
        </form>

        {historial.length > 0 && (
          <div className="space-y-2">
            {historial.slice(0, 20).map(r => (
              <div key={r.id} className="flex justify-between items-center p-3 rounded-lg text-sm"
                style={{ backgroundColor: BG_END, color: WHITE }}>
                <span>{new Date(r.checkIn).toLocaleDateString('es-ES')}</span>
                <span>{new Date(r.checkIn).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Aún dentro'}</span>
                <span style={{ color: YELLOW }}>{r.metodo}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="p-6 rounded-xl border text-center"
    style={{ backgroundColor: BG_START, borderColor: BORDER, boxShadow: `0 0 10px ${GLOW}05` }}>
    <p className="text-sm font-medium mb-1" style={{ color: WHITE, opacity: 0.7 }}>{label}</p>
    <p className="text-3xl font-bold" style={{ color: YELLOW }}>{value}</p>
  </div>
);

export default AsistenciaSection;
