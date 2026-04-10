import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BG_START = '#1a1a1a';
const BG_END = '#0a0a0a';
const WHITE = '#ffffff';
const YELLOW = '#fdcc0d';
const GLOW = '#ffeb3b';
const BORDER = '#333333';

const API_URL = import.meta.env.VITE_API_URL || 'https://newstylegym-back.onrender.com';

const Suscripciones = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    userId: '',
    planId: '',
    fechaInicio: '',
    fechaFin: '',
    montoPagado: '',
    metodoPago: '',
    estado: 'activa',
  });

  const fetchSuscripciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/gym/subscriptions`);
      setSuscripciones(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Error al obtener suscripciones:', e);
    }
  };

  const fetchPlanes = async () => {
    try {
      const res = await axios.get(`${API_URL}/gym/plans`);
      setPlanes(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Error al obtener planes:', e);
    }
  };

  useEffect(() => {
    fetchSuscripciones();
    fetchPlanes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId: form.userId,
      planId: form.planId,
      fechaInicio: form.fechaInicio || new Date().toISOString().split('T')[0],
      fechaFin: form.fechaFin,
      montoPagado: parseFloat(form.montoPagado) || 0,
      metodoPago: form.metodoPago,
      estado: form.estado,
    };
    try {
      if (editing) {
        await axios.put(`${API_URL}/gym/subscriptions/${editing.id}`, payload);
        setMensaje('Suscripción actualizada correctamente');
      } else {
        await axios.post(`${API_URL}/gym/subscriptions`, payload);
        setMensaje('Suscripción creada correctamente');
      }
      resetForm();
      fetchSuscripciones();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError('Error al guardar la suscripción');
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetForm = () => {
    setForm({
      userId: '',
      planId: '',
      fechaInicio: '',
      fechaFin: '',
      montoPagado: '',
      metodoPago: '',
      estado: 'activa',
    });
    setEditing(null);
    setMostrarModal(false);
  };

  const handleEdit = (sub) => {
    setEditing(sub);
    setForm({
      userId: sub.userId || '',
      planId: sub.planId || '',
      fechaInicio: sub.fechaInicio || '',
      fechaFin: sub.fechaFin || '',
      montoPagado: sub.montoPagado || '',
      metodoPago: sub.metodoPago || '',
      estado: sub.estado || 'activa',
    });
    setMostrarModal(true);
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.patch(`${API_URL}/gym/subscriptions/${id}/estado`, { estado: nuevoEstado });
      setMensaje(`Estado cambiado a ${nuevoEstado}`);
      fetchSuscripciones();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError('Error al cambiar el estado');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta suscripción?')) return;
    try {
      await axios.delete(`${API_URL}/gym/subscriptions/${id}`);
      setMensaje('Suscripción eliminada');
      fetchSuscripciones();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError('Error al eliminar');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Summary calculations
  const activasCount = suscripciones.filter((s) => s.estado === 'activa').length;
  const vencidasCount = suscripciones.filter((s) => s.estado === 'vencida').length;
  const totalRevenue = suscripciones
    .filter((s) => s.estado === 'activa')
    .reduce((sum, s) => sum + (parseFloat(s.montoPagado) || 0), 0);

  // Filtered list
  const filtradas =
    filtroEstado === 'todas'
      ? suscripciones
      : suscripciones.filter((s) => s.estado === filtroEstado);

  const getPlanName = (planId) => {
    const plan = planes.find((p) => p.id === planId);
    return plan ? plan.nombre : 'N/A';
  };

  const estadoColors = {
    activa: { bg: `${YELLOW}20`, text: YELLOW },
    vencida: { bg: '#FF444430', text: '#FF4444' },
    cancelada: { bg: '#88888830', text: '#888888' },
    pendiente: { bg: '#4A90D930', text: '#4A90D9' },
  };

  const estadosDisponibles = ['todas', 'activa', 'vencida', 'cancelada', 'pendiente'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold" style={{ color: YELLOW, textShadow: `0 0 5px ${GLOW}` }}>
          Suscripciones
        </h2>
        <button
          onClick={() => {
            setEditing(null);
            setForm({
              userId: '',
              planId: '',
              fechaInicio: '',
              fechaFin: '',
              montoPagado: '',
              metodoPago: '',
              estado: 'activa',
            });
            setMostrarModal(true);
          }}
          style={{ backgroundColor: YELLOW, color: BG_END, boxShadow: `0 0 8px ${GLOW}60` }}
          className="px-6 py-3 font-semibold rounded-lg shadow-md transition hover:scale-105"
        >
          + Nueva Suscripción
        </button>
      </div>

      {mensaje && (
        <div className="mb-4 p-3 rounded-lg" style={{ background: 'linear-gradient(90deg, #1A472A, #0A3319)', border: `1px solid ${YELLOW}` }}>
          <span style={{ color: WHITE }}>{mensaje}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-lg" style={{ background: 'linear-gradient(90deg, #5C1D1D, #3D1212)', border: '1px solid #FF4444' }}>
          <span style={{ color: WHITE }}>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className="p-5 rounded-xl border"
          style={{
            backgroundColor: BG_START,
            borderColor: BORDER,
            boxShadow: `0 0 10px ${GLOW}10`,
          }}
        >
          <p className="text-sm mb-1" style={{ color: WHITE, opacity: 0.7 }}>Suscripciones Activas</p>
          <p className="text-3xl font-bold" style={{ color: YELLOW, textShadow: `0 0 8px ${GLOW}40` }}>
            {activasCount}
          </p>
        </div>
        <div
          className="p-5 rounded-xl border"
          style={{
            backgroundColor: BG_START,
            borderColor: BORDER,
            boxShadow: `0 0 10px ${GLOW}10`,
          }}
        >
          <p className="text-sm mb-1" style={{ color: WHITE, opacity: 0.7 }}>Suscripciones Vencidas</p>
          <p className="text-3xl font-bold" style={{ color: '#FF4444', textShadow: '0 0 8px #FF444440' }}>
            {vencidasCount}
          </p>
        </div>
        <div
          className="p-5 rounded-xl border"
          style={{
            backgroundColor: BG_START,
            borderColor: BORDER,
            boxShadow: `0 0 10px ${GLOW}10`,
          }}
        >
          <p className="text-sm mb-1" style={{ color: WHITE, opacity: 0.7 }}>Ingreso Total (Activas)</p>
          <p className="text-3xl font-bold" style={{ color: YELLOW, textShadow: `0 0 8px ${GLOW}40` }}>
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {estadosDisponibles.map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition"
            style={{
              backgroundColor: filtroEstado === estado ? YELLOW : BG_END,
              color: filtroEstado === estado ? BG_END : WHITE,
              border: `1px solid ${filtroEstado === estado ? YELLOW : BORDER}`,
              textTransform: 'capitalize',
            }}
          >
            {estado === 'todas' ? 'Todas' : estado}
          </button>
        ))}
      </div>

      {/* Subscriptions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtradas.map((sub) => {
          const c = estadoColors[sub.estado] || estadoColors.pendiente;
          return (
            <div
              key={sub.id}
              className="p-5 rounded-xl border shadow-lg transition hover:shadow-xl hover:scale-[1.02]"
              style={{ backgroundColor: BG_START, borderColor: BORDER, boxShadow: `0 0 10px ${GLOW}10` }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: WHITE }}>
                    {sub.userName || sub.userEmail || `Usuario ${sub.userId}`}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: YELLOW }}>{getPlanName(sub.planId)}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ backgroundColor: c.bg, color: c.text, textTransform: 'capitalize' }}
                >
                  {sub.estado || 'pendiente'}
                </span>
              </div>

              <div className="space-y-1 mb-4 text-sm" style={{ color: WHITE, opacity: 0.8 }}>
                <p>
                  <span style={{ color: WHITE, opacity: 0.5 }}>Inicio:</span>{' '}
                  {sub.fechaInicio ? new Date(sub.fechaInicio).toLocaleDateString('es-ES') : 'N/A'}
                </p>
                <p>
                  <span style={{ color: WHITE, opacity: 0.5 }}>Fin:</span>{' '}
                  {sub.fechaFin ? new Date(sub.fechaFin).toLocaleDateString('es-ES') : 'N/A'}
                </p>
                <p>
                  <span style={{ color: WHITE, opacity: 0.5 }}>Monto:</span>{' '}
                  <span style={{ color: YELLOW, fontWeight: '600' }}>${parseFloat(sub.montoPagado || 0).toFixed(2)}</span>
                </p>
                {sub.metodoPago && (
                  <p>
                    <span style={{ color: WHITE, opacity: 0.5 }}>Método:</span>{' '}
                    <span style={{ color: WHITE, textTransform: 'capitalize' }}>{sub.metodoPago}</span>
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                {sub.estado !== 'activa' && (
                  <button
                    onClick={() => handleCambiarEstado(sub.id, 'activa')}
                    className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition"
                    style={{ backgroundColor: BG_END, color: YELLOW, border: `1px solid ${YELLOW}` }}
                  >
                    Activar
                  </button>
                )}
                {sub.estado !== 'vencida' && (
                  <button
                    onClick={() => handleCambiarEstado(sub.id, 'vencida')}
                    className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition"
                    style={{ backgroundColor: BG_END, color: '#FF4444', border: '1px solid #FF4444' }}
                  >
                    Vencida
                  </button>
                )}
                {sub.estado !== 'cancelada' && (
                  <button
                    onClick={() => handleCambiarEstado(sub.id, 'cancelada')}
                    className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition"
                    style={{ backgroundColor: BG_END, color: '#888', border: '1px solid #888' }}
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(sub)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition"
                  style={{ backgroundColor: BG_END, color: YELLOW, border: `1px solid ${YELLOW}` }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition"
                  style={{ backgroundColor: BG_END, color: '#FF4444', border: '1px solid #FF4444' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtradas.length === 0 && (
        <p className="text-center py-16" style={{ color: '#888' }}>
          {suscripciones.length === 0
            ? 'No hay suscripciones registradas aún.'
            : 'No hay suscripciones con este estado.'}
        </p>
      )}

      {/* Create/Edit Modal */}
      {mostrarModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={resetForm}
        >
          <div
            className="p-8 rounded-xl shadow-2xl max-w-lg w-full animate-scaleIn"
            style={{ backgroundColor: BG_START, border: `1px solid ${GLOW}`, boxShadow: `0 0 20px ${GLOW}40` }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: WHITE }}>
              {editing ? 'Editar Suscripción' : 'Nueva Suscripción'}
            </h3>
            <form onSubmit={handleSubmit}>
              <FieldInput label="ID de Usuario" name="userId" value={form.userId} onChange={handleChange} required placeholder="Ej: 1" type="number" />
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" style={{ color: WHITE }}>Plan</label>
                <select
                  name="planId"
                  value={form.planId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  style={{ backgroundColor: BG_END, color: WHITE, borderColor: BORDER }}
                >
                  <option value="">Seleccionar plan...</option>
                  {planes.map((p) => (
                    <option key={p.id} value={p.id} style={{ backgroundColor: BG_END }}>
                      {p.nombre} - ${p.precio}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Fecha de Inicio" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} required type="date" />
                <FieldInput label="Fecha de Fin" name="fechaFin" value={form.fechaFin} onChange={handleChange} required type="date" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Monto Pagado ($)" name="montoPagado" value={form.montoPagado} onChange={handleChange} required placeholder="0.00" type="number" step="0.01" />
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: WHITE }}>Método de Pago</label>
                  <select
                    name="metodoPago"
                    value={form.metodoPago}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    style={{ backgroundColor: BG_END, color: WHITE, borderColor: BORDER }}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" style={{ color: WHITE }}>Estado</label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  style={{ backgroundColor: BG_END, color: WHITE, borderColor: BORDER }}
                >
                  <option value="activa">Activa</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="vencida">Vencida</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg font-semibold"
                  style={{ backgroundColor: BG_END, color: WHITE, border: `1px solid ${BORDER}` }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg font-semibold"
                  style={{ backgroundColor: YELLOW, color: BG_END, boxShadow: `0 0 8px ${GLOW}60` }}
                >
                  {editing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FieldInput = ({ label, name, value, onChange, placeholder, type = 'text', required, step }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1" style={{ color: WHITE }}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      step={step}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
      style={{ backgroundColor: BG_END, color: WHITE, borderColor: BORDER }}
    />
  </div>
);

export default Suscripciones;
