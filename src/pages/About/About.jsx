import React from "react";
import { NavLink } from "react-router-dom";
import agustin from '../../../src/pages/Home/Components/staf/agus.png';
import moni from '../../../src/pages/Home/Components/staf/moni.png';
import maria from '../../../src/pages/Home/Components/staf/mari.png';
import { motion } from "framer-motion";
import Staf from "../Home/Components/staf/staf";

const GOLD = '#FFD700'; // Dorado Sólido
const GOLD_SHADOW_SMOOTH = '0 0 15px rgba(255, 215, 0, 0.5)';
const GOLD_GRADIENT_FROM = 'rgb(255, 215, 0)'; // Dorado Claro
const GOLD_GRADIENT_TO = 'rgb(204, 168, 0)'; // Dorado Oscuro

function About() {
  return (
    <div className="w-full overflow-x-hidden font-sans bg-gray-950 text-white min-h-screen py-20">
      <div className="container mx-auto px-4 text-center">
        
        {/* Elementos decorativos de fondo (Adaptados a Tonalidades Oscuras y Doradas) */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-yellow-900/30 rounded-full filter blur-3xl opacity-20 animate-pulse-slow z-0"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-yellow-800/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slow z-0"></div>

        {/* Quiénes Somos Section */}
        <section id="who-we-are" className="mb-20 relative z-10">
          <motion.h1 
            className="text-5xl md:text-6xl font-black mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white">QUIÉNES </span>
            <span 
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(to right, ${GOLD_GRADIENT_FROM}, ${GOLD_GRADIENT_TO})` }}
            >
              SOMOS
            </span>
            <span className="ml-3" style={{ color: GOLD }}>👑</span>
          </motion.h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-xl md:text-2xl leading-relaxed text-gray-400 font-light">
              En <span className="font-bold" style={{ color: GOLD }}>NEW STYLE GYM</span>, tu bienestar es nuestra prioridad. Nuestro equipo de profesionales
              altamente calificados te brindará la atención personalizada que
              necesitas para alcanzar tus objetivos de fitness, salud y bienestar.
              Estamos comprometidos con tu progreso.
            </p>
            
            <div 
              className="w-24 h-1 mx-auto my-8 rounded-full"
              style={{ backgroundImage: `linear-gradient(to right, ${GOLD_GRADIENT_FROM}, ${GOLD_GRADIENT_TO})` }}
            ></div>
            
            <p className="text-xl md:text-2xl leading-relaxed text-gray-400 font-light">
              ¿Poco tiempo? Nuestra moderna ubicación en{' '}
              <span className="font-bold" style={{ color: GOLD }}>
                 Gdor. Crespo 2427, Santa Fe Capital
              </span>
              , te ofrece fácil acceso y un entorno tranquilo y energizante para
              que te concentres plenamente en tu entrenamiento, sin distracciones.
              ¡Ven y descúbrelo!
            </p>
          </div>
        </section>

        {/* Conoce a Nuestro Equipo Section */}
        <section id="our-team" className="mb-20 relative z-10">
          <motion.h1 
            className="text-5xl md:text-6xl font-black mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Contenido del título del equipo. Lo dejamos vacío ya que llamas a <Staf/> después */}
          </motion.h1>

          <Staf/>

        </section>

        {/* Go Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <NavLink
            to="/"
            className="py-4 px-10 text-lg font-semibold rounded-full transition-all duration-300
                        text-black focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-75 mt-12 inline-block
                        transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            style={{ backgroundImage: `linear-gradient(to right, ${GOLD_GRADIENT_FROM}, ${GOLD_GRADIENT_TO})`, boxShadow: GOLD_SHADOW_SMOOTH }}
          >
            Volver al Inicio
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
}

export default About;