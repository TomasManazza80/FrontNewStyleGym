import React from 'react';

export const Input = React.forwardRef(({ className = '', error, label, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-sm font-medium text-gray-300 mb-1.5 ml-1">{label}</label>}
      <input
        ref={ref}
        className={`w-full bg-[#11131E] border ${
          error ? 'border-red-500/50' : 'border-gray-700/50'
        } text-white rounded-lg px-4 py-2.5 outline-none transition-all duration-200 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 placeholder-gray-500 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
    </div>
  );
});
Input.displayName = 'Input';

export const Select = React.forwardRef(({ className = '', error, label, children, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-sm font-medium text-gray-300 mb-1.5 ml-1">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={`appearance-none w-full bg-[#11131E] border ${
            error ? 'border-red-500/50' : 'border-gray-700/50'
          } text-white rounded-lg px-4 py-2.5 outline-none transition-all duration-200 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
    </div>
  );
});
Select.displayName = 'Select';

export const Checkbox = React.forwardRef(({ className = '', label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col">
      <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            className={`peer appearance-none w-5 h-5 rounded border ${
              error ? 'border-red-500/50' : 'border-gray-600'
            } bg-[#11131E] checked:bg-[#D4AF37] checked:border-[#D4AF37] transition-all duration-200 cursor-pointer ${className}`}
            {...props}
          />
          <svg
            className="absolute w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-[#11131E] transition-opacity duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {label && <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>}
      </label>
      {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
    </div>
  );
});
Checkbox.displayName = 'Checkbox';
