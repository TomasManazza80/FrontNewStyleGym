import React from 'react';
import { motion } from 'framer-motion';
import Container from 'react-bootstrap/Container';
import './staf.css';
import coach1 from '../../img/coach1.png';
// Datos del equipo
const team = [
  {
    id: 1,
    name: "JUAN PÉREZ",
    title: "ENTRENADOR DE MUSCULACIÓN",
    bio: "Especializado en hipertrofia y fuerza. Más de 10 años de experiencia ayudando a atletas a alcanzar su máximo potencial.",
    image: 'https://i.postimg.cc/tT4QtWhR/image.png',
  },
  {
    id: 2,
    name: "LAUTARO GÓMEZ",
    title: "INSTRUCTORA DE RITMOS",
    bio: "Experta en coreografías de alta energía y clases grupales. Transforma el entrenamiento en una experiencia divertida.",
    image: "https://i.postimg.cc/XXMzhCyC/image.png",
  },
  {
    id: 3,
    name: "CARLOS RAMOS",
    title: "ESPECIALISTA EN CROSS-FUNCIONAL",
    bio: "Certificado en entrenamiento funcional de alta intensidad. Diseña rutinas para mejorar resistencia y condición física general.",
    image: "https://i.postimg.cc/RZhgRdYD/image.png",
  },
  {
    id: 4,
    name: "ANA LÓPEZ",
    title: "NUTRICIONISTA DEPORTIVA",
    bio: "Ayuda a nuestros clientes a optimizar su alimentación para complementar su entrenamiento y lograr resultados sostenibles.",
    image: "https://i.postimg.cc/wTTCChPh/image.png",
  },
];

// Variantes de animación para las tarjetas
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

function Staf() {
  return (
    <section className="r22-team-section">
      <Container className="r22-team-container">
        <motion.h2
          className="r22-team-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
        >
          CONOCE A NUESTROS <span className="r22-team-highlight">PROFESIONALES</span>
        </motion.h2>

        <div className="r22-team-grid">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              className="r22-team-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              transition={{ delay: index * 0.2 }}
            >
              <div className="r22-team-image-wrapper">
                <img src={member.image} alt={member.name} className="r22-team-image" />
              </div>
              <div className="r22-team-content">
                <h3 className="r22-team-name">{member.name}</h3>
                <p className="r22-team-role">{member.title}</p>
                <p className="r22-team-bio">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Staf;