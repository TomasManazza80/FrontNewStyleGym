import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  icon: Icon,
  disabled = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#11131E]';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#D4AF37] to-[#AA8222] text-[#11131E] hover:from-[#F0C950] hover:to-[#C69B2A] focus:ring-[#D4AF37] shadow-lg shadow-[#D4AF37]/20',
    secondary: 'bg-[#2A2F45] text-white hover:bg-[#363C58] focus:ring-gray-500 border border-gray-700/50',
    outline: 'bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 focus:ring-[#D4AF37]',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 focus:ring-red-500 border border-red-500/20',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 focus:ring-gray-500',
  };

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} px-4 py-2 ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </motion.button>
  );
};
