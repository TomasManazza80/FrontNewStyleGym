import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const GOLD = '#FFD700'; // Dorado Sólido
const GOLD_GRADIENT_FROM = 'rgb(255, 215, 0)'; // Dorado Claro
const GOLD_GRADIENT_TO = 'rgb(204, 168, 0)'; // Dorado Oscuro
const GOLD_SHADOW_SMOOTH = '0 0 15px rgba(255, 215, 0, 0.5)';

// Animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12
    }
  }
};

const titleVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 130,
      damping: 10,
      duration: 0.8
    }
  }
};

const buttonVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 130,
      damping: 10,
      delay: 0.6
    }
  },
  hover: {
    scale: 1.05,
    // Sombra dorada para el efecto hover
    boxShadow: `0px 5px 15px rgba(255, 215, 0, 0.4)`,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.98
  }
};

const backgroundVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.5, 0.3],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

function ContactUs() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white overflow-hidden">
      {/* Elementos decorativos de fondo animados - Adaptados a Dorado/Amarillo */}
      <motion.div 
        className="absolute top-1/4 left-10 w-72 h-72 bg-yellow-900/30 rounded-full filter blur-3xl z-0"
        variants={backgroundVariants}
        animate="animate"
      ></motion.div>
      
      <motion.div 
        className="absolute bottom-1/4 right-10 w-96 h-96 bg-yellow-800/20 rounded-full filter blur-3xl z-0"
        variants={backgroundVariants}
        animate="animate"
        transition={{ delay: 2, duration: 10 }}
      ></motion.div>
      
      <motion.div 
        className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <motion.h1 
          className="text-4xl font-black text-center mb-8 uppercase tracking-widest"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          style={{ color: GOLD, textShadow: GOLD_SHADOW_SMOOTH }}
        >
          Contacto
        </motion.h1>

        <motion.div 
          className="space-y-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Contacto 1: Email */}
          <motion.div 
            className="bg-gray-900 p-5 rounded-xl flex items-center shadow-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              transition: { type: "spring", stiffness: 400, damping: 10 } 
            }}
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: GOLD }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-4 5a2 2 0 01-2 2H9a2 2 0 01-2-2v-4a2 2 0 012-2h6a2 2 0 012 2v4z"
                />
              </svg>
            </motion.div>
            <p className="text-lg text-gray-300 font-medium">sleagus_4@gmail.com</p>
          </motion.div>

          {/* Contacto 2: Teléfono/WhatsApp */}
          <motion.div 
            className="bg-gray-900 p-5 rounded-xl flex items-center shadow-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              transition: { type: "spring", stiffness: 400, damping: 10 } 
            }}
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: GOLD }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.293 1.147a1 1 0 00-.447.894v.045a18.364 18.364 0 005.807 5.807 1 1 0 00.045-.447l1.147-2.293a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.717 21 3 14.283 3 6V5z"
                />
              </svg>
            </motion.div>
            <a href="https://wa.me/342-5406918"><p className="text-lg text-gray-300 font-medium">342-5784049</p></a>
          </motion.div>

          {/* Contacto 3: Instagram */}
          <motion.div 
            className="bg-gray-900 p-5 rounded-xl flex items-center shadow-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              transition: { type: "spring", stiffness: 400, damping: 10 } 
            }}
          >
           <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ color: GOLD }}
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.779 1.624 4.931 4.773.07 1.173.08 1.406.08 4.14 0 2.733-.01 2.966-.08 4.14-.148 3.249-1.624 4.774-4.774 4.931-1.173.07-1.406.08-4.14.08s-2.966-.01-4.14-.08c-3.249-.149-4.774-1.624-4.931-4.774-.07-1.173-.08-1.406-.08-4.14s.01-2.966.08-4.14c.149-3.248 1.624-4.773 4.774-4.931 1.173-.07 1.406-.08 4.14-.08zm0-2.163c-3.727 0-4.184.014-5.591.077C2.4 .272.784 1.832.188 5.432.122 6.84.114 7.289.114 12s.008 5.16.074 6.568c.596 3.6 2.212 5.16 5.812 5.432 1.407.065 1.856.074 5.591.074s4.184-.009 5.591-.074c3.6-.272 5.216-1.832 5.812-5.432.066-1.408.074-1.857.074-6.568s-.008-5.16-.074-6.568c-.596-3.6-2.212-5.16-5.812-5.432-1.407-.065-1.856-.074-5.591-.074zM12 6.556c-3.33 0-6.033 2.703-6.033 6.033s2.703 6.033 6.033 6.033 6.033-2.703 6.033-6.033-2.703-6.033-6.033-6.033zM18.541 7.845c-.661 0-1.196.536-1.196 1.196s.536 1.196 1.196 1.196 1.196-.536 1.196-1.196-.536-1.196-1.196-1.196z" />
              </svg>
            </motion.div>
             <a href="https://www.instagram.com/new_stylegym"><p className="text-lg text-gray-300 font-medium">@new_stylegym</p></a>
          </motion.div>
          
        </motion.div>

        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
        >
          <NavLink
            to="/"
            className="block w-full py-4 px-6 text-center text-lg font-extrabold rounded-xl transition-all duration-300
                        text-black focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-50"
            style={{ 
              backgroundImage: `linear-gradient(to right, ${GOLD_GRADIENT_FROM}, ${GOLD_GRADIENT_TO})`,
              boxShadow: GOLD_SHADOW_SMOOTH 
            }}
          >
            Volver al Inicio
          </NavLink>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ContactUs;