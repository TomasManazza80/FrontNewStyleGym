import React from "react";
import { motion } from "framer-motion";
import { FiInstagram, FiPhone, FiMail } from "react-icons/fi";
import "./ContactSection.css";

function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        {/* Título */}
        <motion.h2
          className="contact-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Contáctanos
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          className="contact-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Estamos disponibles para ayudarte. Elige el medio que prefieras:
        </motion.p>

        {/* Tarjetas de contacto */}
        <div className="contact-cards">
          {[
            {
              icon: <FiPhone className="contact-icon" />,
              title: "Teléfono",
              text: "+54 9 341 123 4567",
            },
            {
              icon: <FiMail className="contact-icon" />,
              title: "Email",
              text: "info@vitalcorp.com",
            },
            {
              icon: <FiInstagram className="contact-icon" />,
              title: "Instagram",
              text: "@vitalcorp",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="contact-card"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, rotateX: 3, rotateY: -3 }}
            >
              {card.icon}
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
