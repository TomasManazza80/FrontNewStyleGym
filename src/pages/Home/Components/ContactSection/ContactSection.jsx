import React from "react";
import { motion } from "framer-motion";
import { FiInstagram, FiPhone, FiMail } from "react-icons/fi";

function ContactSection() {
  // Definición de la paleta
  const GOLD = '#FFD700'; // Dorado Elegante
  const WHITE = '#FFFFFF';
  const GOLD_SHADOW = 'rgba(255, 215, 0, 0.4)';

  return (
    <section 
      // CAMBIO CLAVE: Fondo negro sólido
      className="relative py-24 bg-black text-white" 
      id="contact"
    >
      <div className="container mx-auto px-6 max-w-7xl text-center">
        {/* Título */}
        <motion.h2
          // Color de texto sólido: Dorado
          className={`text-5xl md:text-6xl font-extrabold mb-4 uppercase`}
          style={{ color: GOLD }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Contáctanos
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          // Color de texto sólido: Blanco
          className="text-xl max-w-2xl mx-auto mb-16 text-white opacity-90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Estamos disponibles para ayudarte. Elige el medio que prefieras:
        </motion.p>

        {/* Tarjetas de contacto */}
        <div className="flex flex-wrap justify-center gap-8">
          {[
            {
              icon: <FiPhone className="w-12 h-12 mb-4" />,
              title: "Teléfono (WhatsApp)",
              text: "+54 3425784049",
              link: "https://wa.me/543425406918",
            },
            {
              icon: <FiMail className="w-12 h-12 mb-4" />,
              title: "Email",
              text: "sleagus_4@gmail.com",
              link: "https://gmail.com/",
            },
            {
              icon: <FiInstagram className="w-12 h-12 mb-4" />,
              title: "Instagram",
              text: "@new_stylegym",
              link: "https://www.instagram.com/new_stylegym",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              // Tarjeta: Fondo oscuro (ahora más contrastante sobre el negro sólido), Borde blanco, Sombra dorada al pasar el mouse
              className={`bg-white/5 p-8 rounded-xl shadow-lg border border-white/20 hover:border-[${GOLD}] transition-all duration-300 ease-in-out w-full sm:w-[300px] hover:shadow-xl`}
              style={{ boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)` }} // Sombra inicial oscura
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: `0 10px 15px -3px ${GOLD_SHADOW}, 0 4px 6px -4px ${GOLD_SHADOW}` // Sombra dorada al hacer hover
              }}
            >
              <a 
                href={card.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-white"
              >
                {/* Icono en Dorado */}
                <div style={{ color: GOLD }} className="mx-auto w-fit">
                  {card.icon}
                </div>
                {/* Título en Blanco */}
                <h3 className="text-xl font-bold mb-2 text-white">{card.title}</h3>
                {/* Texto en Blanco */}
                <p className="text-lg opacity-80">{card.text}</p>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactSection;