import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Planes de Membresía
        </h2>
        <button
          onClick={() => { setEditing(null); setForm({ nombre: '', descripcion: '', precio: '', duracionDias: '', actividadesIncluidas: '', descuentoPorcentaje: 0, activa: true }); setMostrarModal(true); }}
          className="px-6 py-3 font-bold rounded-2xl bg-[#111111] text-white hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-md"
        >
          + Nuevo Plan
        </button>
      </div>

      {mensaje && <AlertSuccess msg={mensaje} />}
      {error && <AlertError msg={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {planes.map(plan => (
          <div key={plan.id}
            className="p-6 md:p-8 rounded-3xl bg-slate-50 flex flex-col transition-shadow hover:shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{plan.nombre}</h3>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex-shrink-0 ${plan.activa ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                {plan.activa ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>
            
            {plan.descripcion && <p className="text-sm mb-6 text-gray-500 leading-relaxed min-h-[40px]">{plan.descripcion}</p>}
            
            <div className="flex-grow"></div>
            
            <div className="flex flex-col gap-1 mb-6">
              <p className="text-4xl font-black text-[#111111] tracking-tighter mb-2"><span className="text-2xl text-gray-400 font-bold mr-1">$</span>{plan.precio}</p>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{plan.duracionDias} días</p>
              {plan.actividadesIncluidas && plan.actividadesIncluidas.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {plan.actividadesIncluidas.map((a, i) => (
                    <span key={i} className="text-[10px] font-bold uppercase px-3 py-1.5 rounded-full bg-white border border-gray-100 text-gray-600 shadow-sm">{a}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-4 pt-6 border-t border-gray-100">
              <button onClick={() => handleEdit(plan)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition-all active:scale-[0.98]">
                Editar
              </button>
              <button onClick={() => handleDelete(plan.id)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-[0.98]">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {planes.length === 0 && (
        <div className="p-16 rounded-3xl bg-slate-50 text-center">
            <p className="text-gray-500 font-medium">No hay planes creados aún.</p>
        </div>
      )}

      {mostrarModal && (
        <ModalForm form={form} editing={editing} onChange={handleChange} onSubmit={handleSubmit}
          onClose={() => { setMostrarModal(false); setEditing(null); }} />
      )}
    </div>
  );
};

const AlertSuccess = ({ msg }) => (
  <div className="mb-6 p-4 rounded-2xl bg-green-50 text-green-800 text-sm font-semibold">
    <span>{msg}</span>
  </div>
);

const AlertError = ({ msg }) => (
  <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-800 text-sm font-semibold">
    <span>{msg}</span>
  </div>
);

const ModalForm = ({ form, editing, onChange, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
    <div className="p-8 md:p-10 rounded-[32px] bg-white shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleIn" onClick={e => e.stopPropagation()}>
      <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">
        {editing ? 'Editar Plan' : 'Crear Nuevo Plan'}
      </h3>
      <form onSubmit={onSubmit} className="space-y-6">
        <FieldInput label="Nombre del Plan" name="nombre" value={form.nombre} onChange={onChange} required placeholder="Ej: Plan Trimestral" />
        <FieldInput label="Descripción (opcional)" name="descripcion" value={form.descripcion} onChange={onChange} placeholder="Ej: Acceso completo al gimnasio" />
        
        <div className="grid grid-cols-2 gap-4">
          <FieldInput label="Precio ($)" name="precio" value={form.precio} onChange={onChange} required placeholder="0.00" type="number" step="0.01" />
          <FieldInput label="Duración (días)" name="duracionDias" value={form.duracionDias} onChange={onChange} required placeholder="30" type="number" />
        </div>
        
        <FieldInput label="Actividades incluidas (separadas por coma)" name="actividadesIncluidas" value={form.actividadesIncluidas} onChange={onChange} placeholder="Ej: musculación, crossfit, yoga" />
        <FieldInput label="Descuento (%)" name="descuentoPorcentaje" value={form.descuentoPorcentaje} onChange={onChange} placeholder="0" type="number" />
        
        <label className="flex items-center gap-3 mb-6 cursor-pointer p-4 rounded-2xl bg-slate-50 border border-gray-100 hover:bg-gray-100 transition-colors">
          <input type="checkbox" name="activa" checked={form.activa} onChange={onChange} className="w-5 h-5 accent-[#111111] rounded" />
          <span className="font-bold text-gray-900">Plan activo y disponible</span>
        </label>
        
        <div className="flex flex-col gap-3 pt-6">
          <button type="submit" className="w-full py-4 rounded-2xl font-bold text-white bg-[#111111] hover:bg-zinc-800 active:scale-[0.98] transition-all">
            {editing ? 'Actualizar Plan' : 'Crear Plan'}
          </button>
          <button type="button" onClick={onClose} className="w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition-all">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
);

const FieldInput = ({ label, name, value, onChange, placeholder, type = 'text', required, step }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} step={step}
      className="w-full p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all" />
  </div>
);

export default PlansSection;
