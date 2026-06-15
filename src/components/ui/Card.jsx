import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', noPadding = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#1E2235] border border-gray-700/50 rounded-xl shadow-lg shadow-black/20 ${
        noPadding ? '' : 'p-6'
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      <div>
        <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
