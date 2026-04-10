import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BG_START = '#1a1a1a';
const BG_END = '#0a0a0a';
const WHITE = '#ffffff';
const YELLOW = '#fdcc0d';
const GLOW = '#ffeb3b';
const BORDER = '#333333';

const API_URL = import.meta.env.VITE_API_URL || 'https://newstylegym-back.onrender.com';

const PlansSection = () => {
  const [planes, setPlanes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', duracionDias: '',
    actividadesIncluidas: '', descuentoPorcentaje: 0, activa: true,
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const fetchPlanes = async () => {
    try {
      const res = await axios.get(`${API_URL}/gym/plans`);
      setPlanes(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchPlanes(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      precio: parseFloat(form.precio) || 0,
      duracionDias: parseInt(form.duracionDias) || 30,
      descuentoPorcentaje: parseInt(form.descuentoPorcentaje) || 0,
      actividadesIncluidas: form.actividadesIncluidas.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await axios.put(`${API_URL}/gym/plans/${editing.id}`, payload);
        setMensaje('Plan actualizado correctamente');
      } else {
        await axios.post(`${API_URL}/gym/plans`, payload);
        setMensaje('Plan creado correctamente');
      }
      setForm({ nombre: '', descripcion: '', precio: '', duracionDias: '', actividadesIncluidas: '', descuentoPorcentaje: 0, activa: true });
      setEditing(null);
      setMostrarModal(false);
      fetchPlanes();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) {
      setError('Error al guardar el plan');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (plan) => {
    setEditing(plan);
    setForm({
      nombre: plan.nombre, descripcion: plan.descripcion || '', precio: plan.precio,
      duracionDias: plan.duracionDias, actividadesIncluidas: (plan.actividadesIncluidas || []).join(', '),
      descuentoPorcentaje: plan.descuentoPorcentaje || 0, activa: plan.activa,
    });
    setMostrarModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este plan?')) return;
    try {
      await axios.delete(`${API_URL}/gym/plans/${id}`);
      setMensaje('Plan eliminado');
      fetchPlanes();
      setTimeout(() => setMensaje(''), 3000);
    } catch (e) { setError('Error al eliminar'); setTimeout(() => setError(''), 3000); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold" style={{ color: YELLOW, textShadow: `0 0 5px ${GLOW}` }}>
          Planes de Membresía
        </h2>
        <button
          onClick={() => { setEditing(null); setForm({ nombre: '', descripcion: '', precio: '', duracionDias: '', actividadesIncluidas: '', descuentoPorcentaje: 0, activa: true }); setMostrarModal(true); }}
          style={{ backgroundColor: YELLOW, color: BG_END, boxShadow: `0 0 8px ${GLOW}60` }}
          className="px-6 py-3 font-semibold rounded-lg shadow-md transition hover:scale-105"
        >
          + Nuevo Plan
        </button>
      </div>

      {mensaje && <AlertSuccess msg={mensaje} />}
      {error && <AlertError msg={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planes.map(plan => (
          <div key={plan.id}
            className="p-6 rounded-xl border shadow-lg transition hover:shadow-xl hover:scale-[1.02]"
            style={{ backgroundColor: BG_START, borderColor: BORDER, boxShadow: `0 0 10px ${GLOW}10` }}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold" style={{ color: YELLOW }}>{plan.nombre}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${plan.activa ? 'text-yellow-400' : 'text-gray-400'}`}
                style={{ backgroundColor: plan.activa ? `${YELLOW}20` : `${BORDER}`, color: plan.activa ? YELLOW : '#888' }}>
                {plan.activa ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>
            {plan.descripcion && <p className="text-sm mb-3" style={{ color: WHITE, opacity: 0.7 }}>{plan.descripcion}</p>}
            <div className="space-y-2 mb-4" style={{ color: WHITE }}>
              <p className="text-lg"><span style={{ color: YELLOW }}>$</span>{plan.precio}</p>
              <p className="text-sm">{plan.duracionDias} días</p>
              {plan.actividadesIncluidas && plan.actividadesIncluidas.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {plan.actividadesIncluidas.map((a, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${YELLOW}15`, color: YELLOW }}>{a}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(plan)}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition"
                style={{ backgroundColor: BG_END, color: YELLOW, border: `1px solid ${YELLOW}` }}>
                Editar
              </button>
              <button onClick={() => handleDelete(plan.id)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition"
                style={{ backgroundColor: BG_END, color: '#FF4444', border: '1px solid #FF4444' }}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {planes.length === 0 && (
        <p className="text-center py-16" style={{ color: '#888' }}>No hay planes creados aún.</p>
      )}

      {mostrarModal && (
        <ModalForm form={form} editing={editing} onChange={handleChange} onSubmit={handleSubmit}
          onClose={() => { setMostrarModal(false); setEditing(null); }} />
      )}
    </div>
  );
};

const AlertSuccess = ({ msg }) => (
  <div className="mb-4 p-3 rounded-lg" style={{ background: 'linear-gradient(90deg, #1A472A, #0A3319)', border: `1px solid ${YELLOW}` }}>
    <span style={{ color: WHITE }}>{msg}</span>
  </div>
);

const AlertError = ({ msg }) => (
  <div className="mb-4 p-3 rounded-lg" style={{ background: 'linear-gradient(90deg, #5C1D1D, #3D1212)', border: '1px solid #FF4444' }}>
    <span style={{ color: WHITE }}>{msg}</span>
  </div>
);

const ModalForm = ({ form, editing, onChange, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="p-8 rounded-xl shadow-2xl max-w-lg w-full animate-scaleIn"
      style={{ backgroundColor: BG_START, borderColor: GLOW, border: `1px solid ${GLOW}`, boxShadow: `0 0 20px ${GLOW}40` }}
      onClick={e => e.stopPropagation()}>
      <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: WHITE }}>
        {editing ? 'Editar Plan' : 'Crear Nuevo Plan'}
      </h3>
      <form onSubmit={onSubmit}>
        <FieldInput label="Nombre del Plan" name="nombre" value={form.nombre} onChange={onChange} required placeholder="Ej: Plan Trimestral" />
        <FieldInput label="Descripción (opcional)" name="descripcion" value={form.descripcion} onChange={onChange} placeholder="Ej: Acceso completo al gimnasio" />
        <div className="grid grid-cols-2 gap-4">
          <FieldInput label="Precio ($)" name="precio" value={form.precio} onChange={onChange} required placeholder="0.00" type="number" step="0.01" />
          <FieldInput label="Duración (días)" name="duracionDias" value={form.duracionDias} onChange={onChange} required placeholder="30" type="number" />
        </div>
        <FieldInput label="Actividades incluidas (separadas por coma)" name="actividadesIncluidas" value={form.actividadesIncluidas} onChange={onChange} placeholder="Ej: musculación, crossfit, yoga" />
        <FieldInput label="Descuento (%)" name="descuentoPorcentaje" value={form.descuentoPorcentaje} onChange={onChange} placeholder="0" type="number" />
        <label className="flex items-center gap-2 mb-6 cursor-pointer">
          <input type="checkbox" name="activa" checked={form.activa} onChange={onChange} className="w-4 h-4 accent-yellow-400" />
          <span style={{ color: WHITE }}>Plan activo</span>
        </label>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: BG_END, color: WHITE, border: `1px solid ${BORDER}` }}>Cancelar</button>
          <button type="submit" className="px-6 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: YELLOW, color: BG_END, boxShadow: `0 0 8px ${GLOW}60` }}>
            {editing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const FieldInput = ({ label, name, value, onChange, placeholder, type = 'text', required, step }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1" style={{ color: WHITE }}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} step={step}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
      style={{ backgroundColor: BG_END, color: WHITE, borderColor: BORDER }} />
  </div>
);

export default PlansSection;
