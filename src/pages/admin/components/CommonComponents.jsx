import React from 'react';

const BACKGROUND_GRADIENT_START = '#1a1a1a';
const BACKGROUND_GRADIENT_END = '#0a0a0a';
const TEXT_COLOR_WHITE = '#ffffff';
const TEXT_COLOR_YELLOW = '#fdcc0d';
const LIGHT_GLOW_COLOR = '#ffeb3b';
const BORDER_HIGHLIGHT_COLOR = '#333333';

const Modal = ({ isOpen, onClose, title, children, width = 'max-w-md' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`p-8 rounded-xl shadow-2xl border ${width} max-h-[90vh] overflow-y-auto animate-scaleIn`}
        style={{
          backgroundColor: BACKGROUND_GRADIENT_START,
          borderColor: LIGHT_GLOW_COLOR,
          boxShadow: `0 0 20px ${LIGHT_GLOW_COLOR}40`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-3" style={{ borderColor: BORDER_HIGHLIGHT_COLOR }}>
          <h3 className="text-2xl font-bold" style={{ color: TEXT_COLOR_WHITE }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="hover:text-yellow-400 transition-colors"
            style={{ color: TEXT_COLOR_WHITE }}
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
  const inputStyle = {
    marginTop: '4px',
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${BORDER_HIGHLIGHT_COLOR}`,
    borderRadius: '8px',
    backgroundColor: BACKGROUND_GRADIENT_END,
    color: TEXT_COLOR_WHITE,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: TEXT_COLOR_WHITE,
    marginBottom: '4px',
  };

  if (type === 'select') {
    return (
      <div className="mb-4">
        <label style={labelStyle}>{label}</label>
        <select
          name={name}
          value={value || ''}
          onChange={onChange}
          style={inputStyle}
          required={required}
        >
          <option value="">Seleccionar...</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ backgroundColor: BACKGROUND_GRADIENT_END }}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="mb-4">
        <label style={labelStyle}>{label}</label>
        <textarea
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          rows={3}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={step}
        style={inputStyle}
      />
    </div>
  );
};

const ActionButton = ({ onClick, label, variant = 'primary', icon }) => {
  const baseStyle = {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  };

  const variants = {
    primary: {
      backgroundColor: TEXT_COLOR_YELLOW,
      color: BACKGROUND_GRADIENT_END,
      boxShadow: `0 0 8px ${LIGHT_GLOW_COLOR}60`,
    },
    secondary: {
      backgroundColor: BACKGROUND_GRADIENT_START,
      color: TEXT_COLOR_YELLOW,
      border: `1px solid ${TEXT_COLOR_YELLOW}`,
    },
    danger: {
      backgroundColor: BACKGROUND_GRADIENT_END,
      color: '#FF4444',
      border: `1px solid #FF4444`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: TEXT_COLOR_WHITE,
      border: `1px solid ${BORDER_HIGHLIGHT_COLOR}`,
    },
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant] }}
      className="hover:scale-105 transition-transform"
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {label}
    </button>
  );
};

const StatusBadge = ({ status, variant = 'default' }) => {
  const colors = {
    active: { bg: `${TEXT_COLOR_YELLOW}20`, text: TEXT_COLOR_YELLOW, glow: LIGHT_GLOW_COLOR },
    inactive: { bg: `${BORDER_HIGHLIGHT_COLOR}50`, text: TEXT_COLOR_WHITE, glow: 'none' },
    danger: { bg: '#FF444430', text: '#FF4444', glow: '#FF4444' },
    success: { bg: '#1A472A40', text: '#4ADE80', glow: '#4ADE80' },
  };

  const c = colors[variant] || colors.default;

  return (
    <span
      className="text-xs font-semibold px-2 py-1 rounded-full"
      style={{ backgroundColor: c.bg, color: c.text, textShadow: `0 0 5px ${c.glow}` }}
    >
      {status}
    </span>
  );
};

export { Modal, FormField, ActionButton, StatusBadge };
export {
  BACKGROUND_GRADIENT_START,
  BACKGROUND_GRADIENT_END,
  TEXT_COLOR_WHITE,
  TEXT_COLOR_YELLOW,
  LIGHT_GLOW_COLOR,
  BORDER_HIGHLIGHT_COLOR,
};
