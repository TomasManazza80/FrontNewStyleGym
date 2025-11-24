import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import video2 from '../videos/video2.mp4';

const videoPaths = [video2];

function Hero() {
  const [currentVideo, setCurrentVideo] = useState('');

  useEffect(() => {
    if (!sessionStorage.getItem('lastVideoIndex')) {
      sessionStorage.setItem('lastVideoIndex', -1);
    }
    
    const lastVideoIndex = parseInt(sessionStorage.getItem('lastVideoIndex'), 10);
    const nextVideoIndex = (lastVideoIndex + 1) % videoPaths.length;
    sessionStorage.setItem('lastVideoIndex', nextVideoIndex);
    setCurrentVideo(videoPaths[nextVideoIndex]);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const textLineVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95, 
      filter: "blur(5px)" 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.0,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 0.8,
      },
    },
  };

  return (
    <header className="relative w-full h-screen flex items-center justify-center overflow-hidden text-center px-4">
      {currentVideo && (
        <video 
          className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 z-[-2]" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={currentVideo} type="video/mp4" />
          Tu navegador no soporta la etiqueta de video.
        </video>
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 z-[-1]"></div> 
      
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* ===== TÍTULO PRINCIPAL ===== */}
          <motion.h1 
            className="text-7xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] font-black leading-none uppercase tracking-tighter"
            style={{ overflow: 'hidden' }}
          >
            {/* NEW STYLE - Blanco */}
            <motion.span 
              className="block text-white drop-shadow-[0_4px_15px_rgba(255,255,255,0.8)]"
              variants={textLineVariants}
            >
              NEW STYLE
            </motion.span>

            {/* GYM - Dorado */}
            <motion.span 
              className="block text-yellow-400 drop-shadow-[0_4px_25px_rgba(255,215,0,0.9)]"
              variants={textLineVariants}
            >
              GYM
            </motion.span>
          </motion.h1>

          {/* ===== BOTONES ===== */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            variants={containerVariants}
          >
            {/* Botón dorado */}
            <motion.button 
              className="px-10 py-4 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 text-black rounded-full text-lg font-extrabold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/50"
              variants={buttonVariants}
            >
              ¡Inscríbete Hoy!
            </motion.button>

            {/* Botón blanco */}
            <motion.button 
              className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-full text-lg font-extrabold transition-all duration-300 ease-in-out hover:bg-white hover:text-gray-900 hover:scale-105 hover:shadow-xl hover:shadow-white/30"
              variants={buttonVariants}
            >
              Explora Clases
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}

export default Hero;
