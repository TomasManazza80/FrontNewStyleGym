import React from 'react';

const GOLD = '#FFD700'; // Dorado Sólido
const GOLD_SHADOW_SMOOTH = '0 0 10px rgba(255, 215, 0, 0.4)';

const Rutina = () => {
  return (
    <section className="bg-gray-950 text-white min-h-screen py-16 px-4 md:px-24 flex items-center justify-center">
      <div className="container mx-auto">
        <h2 
          className="text-4xl font-light mb-12 text-center tracking-widest uppercase"
          style={{ color: GOLD, textShadow: GOLD_SHADOW_SMOOTH }}
        >
          Rutina de Entrenamiento 💪
        </h2>
         
        {/* Contenedor de la Imagen con Sombra sutil para el efecto premium */}
        <div className="flex justify-center items-center">
          <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.01] border border-gray-700/50">
            <img
              src="https://cdn.shopify.com/s/files/1/0918/2062/2161/files/Rutina_de_entrenamiento_Weider_5_dias_frecuencia_2_Avanzados.webp?v=1746431088"
              alt="Rutina de entrenamiento Weider de 5 días"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rutina;