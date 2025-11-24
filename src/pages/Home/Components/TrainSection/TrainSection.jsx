import React from "react";
import { motion } from "framer-motion";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css"; // Aún necesitamos el CSS base de la galería

// Importa tus imágenes locales
import foto1 from "./img/foto1.jpg";
import foto2 from "./img/foto2.jpg";
import foto3 from "./img/foto3.jpg";
import foto4 from "./img/foto4.jpg";
import foto5 from "./img/foto5.jpg";
import foto6 from "./img/foto6.jpg";
import foto7 from "./img/foto7.jpg";
import foto8 from "./img/foto8.jpg";
function TrainSection() {
  const images = [
    {
      original: foto1,
      thumbnail: foto1,
      description: "Vista de nuestro gimnasio principal.",
    },
    {
      original: foto2,
      thumbnail: foto2,
      description: "Zona de entrenamiento de pesas.",
    },
    {
      original: foto3,
      thumbnail: foto3,
      description: "Clase de yoga y estiramientos.",
    },
    {
      original: foto4,
      thumbnail: foto4,
      description: "Área de cardio con bicicletas y cintas.",
    },
    {
      original: foto5,
      thumbnail: foto5,
      description: "Sesión de entrenamiento personal.",
    },
    {
      original: foto6,
      thumbnail: foto6,
          description: "Zona de pesas libres y máquinas.",
        },
    {
        original: foto7,
        thumbnail: foto7,
        description: "Área de estiramientos y relajación.",
      },
      {
        original: foto8,
        thumbnail: foto8,
        description: "Vista nocturna de nuestras instalaciones.",
    }
  ];

  // Definición del color dorado ( Tailwind no tiene un yellow-gold nativo, pero podemos usar yellow-400/500/etc. o definirlo en tailwind.config.js )
  // Por ahora, usaremos el mismo #FFD700 directamente en las clases de Tailwind con corchetes
  const GOLD_COLOR = '#FFD700'; 
  const WHITE_COLOR = '#FFFFFF';

  return (
    <motion.section
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-yellow-900 text-white py-24 border-b border-white/10"
      id="nuestros-espacios"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.25, when: "beforeChildren" },
        },
      }}
    >
      <div className="container mx-auto px-6 z-20 max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Título */}
          <motion.div
            className="w-full mb-16 z-20"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 1 } },
            }}
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-white"> {/* Texto "Nuestros" en blanco */}
              Nuestros{" "}
              {/* CAMBIO: Texto "Espacios" en Dorado sólido, sin degradados ni clip-text */}
              <span className={`text-[${GOLD_COLOR}] drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]`}>
                Espacios
              </span>
            </h2>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto text-white opacity-90"> {/* Opacidad más alta para el blanco */}
              Explora nuestras instalaciones diseñadas para tu bienestar, donde
              cada detalle está pensado para motivarte y llevarte más lejos.
            </p>
          </motion.div>

          {/* Galería */}
          <motion.div
            className="w-full lg:w-4/5 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 image-gallery-solid-gold-theme" // Clase personalizada para estilos de galería
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 1 } },
            }}
          >
            <ImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={true}
              showThumbnails={true}
              showBullets={false}
              autoPlay={true}
              slideInterval={5000}
            />
          </motion.div>

          {/* Botón */}
          <motion.a
            href="#"
            // CAMBIO: Botón con degradado dorado, texto negro. Usamos from-yellow-500 y to-yellow-400 de Tailwind.
            className={`mt-16 inline-block text-lg bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-10 py-4 rounded-full font-bold shadow-2xl transition duration-300 ease-in-out hover:scale-[1.03] hover:shadow-yellow-400/50`}
            whileHover={{ scale: 1.05, boxShadow: `0 15px 25px -5px rgba(255,215,0,0.6)` }}
            whileTap={{ scale: 0.95 }}
          >
            Agenda tu Visita
          </motion.a>
        </div>
      </div>
    </motion.section>
  );
}

export default TrainSection;