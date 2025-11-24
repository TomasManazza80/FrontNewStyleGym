import React from 'react';
import './TrainSection.css';
import Container from 'react-bootstrap/Container';
import { motion } from 'framer-motion';

function TrainSection() {
  return (
    <motion.section
      className='train-section'
      id='train'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.25, when: "beforeChildren" }
        }
      }}
    >
      {/* Background Shape animada */}
      <motion.div
        className='train-bg-shape'
        initial={{ opacity: 0, x: -200 }}
        whileInView={{ opacity: 0.15, x: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <Container>
        <div className="row align-items-center">
          <motion.div
            className='col-md-6 z-2'
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 1 } }
            }}
          >
            <h2 className='train-title'>
              Entrenemos <span className='highlight'>Juntos</span>
            </h2>
            <p className='train-text'>
              Nuestro equipo de expertos está listo para acompañarte en cada paso de tu transformación.
              Entrena con energía, compromiso y los mejores resultados.
            </p>

            <div className="train-contact d-flex align-items-center">
              <h5 className='fw-semibold text-nowrap'>📞 Llámanos:</h5>
              <a href="tel:0900800700" className='train-phone'>
                0900 800 700
              </a>
            </div>
          </motion.div>
        </div>
      </Container>
    </motion.section>
  );
}

export default TrainSection;
