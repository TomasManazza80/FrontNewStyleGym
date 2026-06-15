import React from 'react';

const Modal = ({ isOpen, onClose, title, children, width = 'max-w-md' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className={`p-8 md:p-10 rounded-[32px] bg-white shadow-2xl ${width} max-h-[90vh] overflow-y-auto animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const FormField = ({ label, type = 'text', name, value, onChange, options, placeholder, required, step }) => {
  const labelClass = "block text-xs font-semibold text-gray-500 mb-2 ml-1";
  const inputClass = "w-full p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 text-gray-900 font-medium transition-all shadow-sm";

  if (type === 'select') {
    return (
      <div className="mb-6">
        <label className={labelClass}>{label}</label>
        <select
          name={name}
          value={value || ''}
          onChange={onChange}
          className={`${inputClass} appearance-none cursor-pointer`}
          required={required}
        >
          <option value="">Seleccionar...</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="mb-6">
        <label className={labelClass}>{label}</label>
        <textarea
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className={`${inputClass} resize-none`}
          rows={3}
        />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={step}
        className={inputClass}
      />
    </div>
  );
};

const ActionButton = ({ onClick, label, variant = 'primary', icon }) => {
  const baseClass = "px-6 py-4 rounded-2xl font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98]";

  const variants = {
    primary: "bg-[#111111] text-white hover:bg-zinc-800 shadow-md",
    secondary: "bg-slate-100 text-[#111111] hover:bg-slate-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${variants[variant] || variants.primary}`}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {label}
    </button>
  );
};

const StatusBadge = ({ status, variant = 'default' }) => {
  // CRITICAL RULE: DO NOT ALTER STATUS COLORS
  const colors = {
    active: { bg: 'rgba(253, 204, 13, 0.2)', text: '#fdcc0d', glow: '#ffeb3b' },
    inactive: { bg: 'rgba(51, 51, 51, 0.5)', text: '#ffffff', glow: 'none' },
    danger: { bg: '#FF444430', text: '#FF4444', glow: '#FF4444' },
    success: { bg: '#1A472A40', text: '#4ADE80', glow: '#4ADE80' },
    default: { bg: 'rgba(51, 51, 51, 0.5)', text: '#ffffff', glow: 'none' }
  };

  const c = colors[variant] || colors.default;

  return (
    <span
      className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full flex-shrink-0"
      style={{ backgroundColor: c.bg, color: c.text, textShadow: `0 0 5px ${c.glow}` }}
    >
      {status}
    </span>
  );
};

export { Modal, FormField, ActionButton, StatusBadge };
