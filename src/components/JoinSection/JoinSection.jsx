import React from 'react';
import { motion } from 'framer-motion';
import Container from 'react-bootstrap/Container';
import PurpleBtn from '../PurpleBtn/PurpleBtn';
import './JoinSection.css';

function JoinSection() {
  return (
    <motion.div 
      className='join-section'
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
        <div className='join-content'>
          <motion.h2
            className='join-title'
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
            <span className='join-highlight'>Transforma</span> tu Cuerpo
          </motion.h2>

          <motion.p
            className='join-description'
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
            <PurpleBtn btnTitle='¡Únete Ahora!' />
          </motion.div>
        </div>
      </Container>
    </motion.div>
  )
}

export default JoinSection;