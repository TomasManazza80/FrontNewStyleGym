import React from 'react';
import { motion } from 'framer-motion';
import video from '../../../../../src/pages/Home/Components/TrainSection/img/video.mp4';

function AboutSection() {
  return (
    <motion.section 
      className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-yellow-900 text-white overflow-hidden"
      id='about'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-soft-light filter blur-xl animate-pulse-slow"></div>
        <div 
          className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full mix-blend-soft-light filter blur-xl animate-pulse-slow" 
          style={{animationDelay: '2s'}}
        ></div>
      </div>
      
      <div className="container mx-auto px-5 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* VIDEO */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:shadow-yellow-500/40 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <motion.video 
                className="w-[350px] h-auto rounded-2xl"
                autoPlay
                muted
                loop
                playsInline
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <source src={video} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </motion.video>
              
              {/* Marco decorativo */}
              <div className="absolute inset-0 border border-yellow-500/20 rounded-2xl pointer-events-none"></div>
            </div>
            
            {/* Efectos decorativos */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-500/20 rounded-full blur-md"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400/20 rounded-full blur-md"></div>
          </motion.div>

          {/* TEXTO */}
          <motion.div
            className="space-y-6 lg:space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* TÍTULO */}
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="text-white drop-shadow-[0_4px_10px_rgba(255,255,255,0.7)]">Conoce </span><br />
              <span className="text-yellow-400 drop-shadow-[0_4px_20px_rgba(255,215,0,0.9)]">New Style Gym</span>
            </motion.h2>

            {/* DESCRIPCIÓN */}
            <motion.div 
              className="space-y-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                En <strong className="text-yellow-400">New Style Gym</strong> no solo transformamos cuerpos, forjamos mentalidades ganadoras. 
                Somos el espacio donde los límites se rompen y cada entrenamiento es un paso hacia la mejor versión de ti.
              </p>

              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                Nuestro diferencial: <strong className="text-yellow-400">entrenadores certificados</strong> que diseñan programas personalizados, 
                clases grupales que desafían tus capacidades, y una filosofía que combina disciplina con diversión.
              </p>
            </motion.div>

            {/* BOTÓN DORADO */}
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7, type: "spring", stiffness: 200 }}
            >
              <motion.button 
                className="px-10 py-4 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 text-black rounded-full text-lg font-extrabold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/50"
              >
                Descubre más
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default AboutSection;
