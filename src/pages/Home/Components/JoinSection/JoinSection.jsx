import React from 'react';
import { motion } from 'framer-motion';
import Container from 'react-bootstrap/Container';
// Nota: 'PurpleBtn' ahora debería ser un 'YellowBtn' o el componente
// debe aceptar una prop de color para que este cambio sea visible.
import PurpleBtn from '../PurpleBtn/PurpleBtn'; 
// Este archivo CSS ahora debería contener estilos para un fondo oscuro
// y texto/acentos amarillo/dorado.
import './JoinSection.css'; 

function JoinSection() {
  return (
    // CAMBIO DE COLOR: Fondo oscuro (similar al módulo anterior: negro/gris-900)
    <motion.div 
      // Añadiendo clases de color para la sección principal (fondo oscuro)
      className='join-section bg-gradient-to-b from-black via-gray-900 to-gray-900 text-white py-20' 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2
          }
        }
      }}
    >
      <Container className='join-container'>
        <div className='join-content text-center'> {/* Se centra el contenido para mejor presentación */}
          <motion.h2
            // CAMBIO DE COLOR: Acento amarillo en el texto principal
            className='join-title text-4xl md:text-6xl font-extrabold mb-4'
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1]
                }
              }
            }}
          >
            {/* CAMBIO DE COLOR: Aplicación del degradado amarillo/dorado para el acento */}
            <span className='join-highlight bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent'>
              Transforma
            </span>{' '}
            tu Cuerpo
          </motion.h2>

          <motion.p
            // CAMBIO DE COLOR: Texto secundario en gris claro
            className='join-description text-xl text-gray-300 max-w-3xl mx-auto mb-8'
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.6, 0.01, 0.12, 0.95]
                }
              }
            }}
          >
            Entrena con los mejores profesionales y equipos de alta calidad. Alcanza tus metas de fitness y redefine tu potencial con nuestros planes personalizados. ¡Tu viaje hacia una mejor versión de ti mismo comienza aquí!
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.5,
                  delay: 0.4,
                  type: "spring",
                  stiffness: 200
                }
              }
            }}
          >
            {/* NOTA IMPORTANTE: El color de este botón debe cambiarse dentro del componente PurpleBtn
               o mediante CSS externo para reflejar el acento amarillo/dorado. */}
            <PurpleBtn btnTitle='¡Únete Ahora!' />
          </motion.div>
        </div>
      </Container>
    </motion.div>
  )
}

export default JoinSection;