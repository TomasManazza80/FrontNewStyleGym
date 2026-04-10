import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import fotoMoni from '../../../../pages/Home/Components/staf/moni.png';
import fotoAgus from '../../../../pages/Home/Components/staf/agus.png';
import fotoMari from '../../../../pages/Home/Components/staf/mari.png';
const team = [
  {
    id: 1,
    name: "MÓNICA ROSALES",
    title: "INSTRUCTORA DE BODY JUMP / GYM COACH",
    bio: "Especializada en Body Jump, una disciplina que combina entrenamiento cardiovascular de alto impacto con ejercicios de cama elástica para mejorar la resistencia, la coordinación y la quema de calorías de forma divertida. También es una entrenadora de gimnasio certificada.",
    image: fotoMoni,
  },
  {
    id: 2,
    name: "AGUSTÍN NARDONI",
    title: "GYM COACH",
    bio: "Entrenador de gimnasio enfocado en el desarrollo de la fuerza y la técnica de levantamiento de pesas. Ayuda a los clientes a establecer bases sólidas para el entrenamiento de hipertrofia y potencia, garantizando una progresión segura y efectiva.",
    image: fotoAgus,
  },
  {
    id: 3,
    name: "MARÍA GIOVAGNOLI",
    title: "GYM COACH",
    bio: "Entrenadora personal con amplia experiencia en la tonificación muscular y el entrenamiento funcional. Se dedica a diseñar rutinas personalizadas para mejorar la composición corporal y la condición física general, motivando a sus clientes a alcanzar sus objetivos.",
    image: fotoMari,
  }
];

const cardVariants = {
  offscreen: { opacity: 0, y: 50, scale: 0.95 },
  onscreen: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0.3, duration: 0.8 },
  },
};

const Staf = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (itemsPerView > 1 && !isHovering) {
      const maxIndex = Math.max(0, team.length - itemsPerView);
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (maxIndex + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [itemsPerView, isHovering]);

  const maxIndex = Math.max(0, team.length - itemsPerView);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1));
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1));
  const gapSize = itemsPerView > 1 ? 32 : 0;

  return (
    <section ref={containerRef} className="bg-[#100D1B] text-white py-12 md:py-16 px-4 font-sans">
      <div className="container max-w-7xl mx-auto">
        <motion.h2
          className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 md:mb-12 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          CONOCE A NUESTROS{" "}
          <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">
            PROFESIONALES
          </span>
        </motion.h2>

        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {itemsPerView > 1 ? (
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out gap-6 md:gap-8"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
              >
                {team.map((member, index) => (
                  <motion.div
                    key={member.id}
                    className="flex-shrink-0"
                    style={{ width: `calc((100% / ${itemsPerView}) - ${gapSize * (itemsPerView - 1) / itemsPerView}px)` }}
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={cardVariants}
                    transition={{ delay: index * 0.15 }}
                  >
                    <Card member={member} />
                  </motion.div>
                ))}
              </div>
              <CarouselControls goToPrev={goToPrev} goToNext={goToNext} />
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {team.map((member) => (
                <motion.div
                  key={member.id}
                  className="w-full"
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                >
                  <Card member={member} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Card = ({ member }) => (
  <div className="bg-[#1C182A] rounded-xl overflow-hidden border border-[#3C384B] h-full shadow-lg transition-all duration-300 hover:shadow-[0_15px_40px_rgba(255,215,0,0.2)] hover:border-yellow-400 flex flex-col">
    <div className="h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden relative">
      <img
        src={member.image}
        alt={`Retrato de ${member.name}, ${member.title}`}
        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        style={{ objectPosition: "center 30%" }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1C182A] to-transparent"></div>
    </div>
    <div className="p-4 sm:p-5 md:p-6 flex flex-col items-center text-center flex-grow justify-center">
      <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2">
        {member.name}
      </h3>
      <p className="text-gray-300 font-semibold text-sm uppercase tracking-wider mb-3">
        {member.title}
      </p>
      <p className="text-gray-200 leading-relaxed text-sm sm:text-base">{member.bio}</p>
    </div>
  </div>
);

const CarouselControls = ({ goToPrev, goToNext }) => (
  <>
    <button
      onClick={goToPrev}
      className="absolute left-0 sm:left-2 top-1/2 transform -translate-y-1/2 bg-yellow-400/80 hover:bg-yellow-400 text-black rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-10"
      aria-label="Anterior miembro del equipo"
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      onClick={goToNext}
      className="absolute right-0 sm:right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400/80 hover:bg-yellow-400 text-black rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-10"
      aria-label="Siguiente miembro del equipo"
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </>
);

export default Staf;
