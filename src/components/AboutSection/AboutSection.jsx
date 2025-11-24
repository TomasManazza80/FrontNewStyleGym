import React from 'react';
import { motion } from 'framer-motion';
import AboutImg from '../../Assets/Images/about-img.jpg';
import PurpleBtn from '../PurpleBtn/PurpleBtn';
import './about.css';

function AboutSection() {
  return (
    <motion.section 
      className='nosotros-section'
      id='about'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
            when: "beforeChildren"
          }
        }
      }}
    >
      <div className="container">
        <div className='nosotros-grid'>
          <motion.div
            className='nosotros-img-container'
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1]
                }
              }
            }}
          >
            <motion.img 
              className='nosotros-img'
              src={AboutImg} 
              alt="Imagen de nuestro gimnasio"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>

          <motion.div
            className='nosotros-content'
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.6, 0.01, 0.12, 0.95]
                }
              }
            }}
          >
            <motion.h2 
              className='nosotros-title'
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    delay: 0.2
                  }
                }
              }}
            >
              Conoce <span className='nosotros-highlight'>New Style Gym</span>
            </motion.h2>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    delay: 0.3
                  }
                }
              }}
            >
              En <strong>New Style Gym</strong> no solo transformamos cuerpos, forjamos mentalidades ganadoras. Somos el espacio donde los límites se rompen y cada entrenamiento es un paso hacia la mejor versión de ti.
            </motion.p>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    delay: 0.4
                  }
                }
              }}
            >
              Nuestro diferencial: <strong>entrenadores certificados</strong> que diseñan programas personalizados, clases grupales que desafían tus capacidades, y una filosofía que combina disciplina con diversión.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    delay: 0.5,
                    type: "spring",
                    stiffness: 200
                  }
                }
              }}
            >
              <PurpleBtn btnTitle='Descubre más' />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default AboutSection;