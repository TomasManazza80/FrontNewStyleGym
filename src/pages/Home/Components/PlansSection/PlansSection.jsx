import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlanCard from './PlanCard';

function PlansSection() {
  const [plansData, setPlansData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://newstylegym-back.onrender.com/api/activity-prices/prices');
        
        if (!response.ok) {
          throw new Error('Error al obtener los precios');
        }
        
        const priceData = await response.json();
        
        // Transformar los datos de la API al formato requerido por los componentes
        const transformedData = [
          {
            id: 1,
            title: 'UNA ACTIVIDAD',
            price: `$${parseFloat(priceData.unaActividad).toLocaleString('es-AR')}`,
            description: 'Acceso a una actividad específica de tu elección.',
            features: [
              'Cuota única',
              'Una actividad específica',
              'Pago en efectivo o transferencia',
              'Acceso limitado a una actividad'
            ],
            buttonText: '¡Paga en efectivo!',
            isFeatured: false,
          },
          {
            id: 2,
            title: 'PASE LIBRE MENSUAL',
            price: `$${parseFloat(priceData.paseLibre).toLocaleString('es-AR')}`,
            description: 'Acceso ilimitado a todas las instalaciones y clases grupales.',
            features: [
              'Cuota mensual',
              'Pase libre',
              'Pago en efectivo o transferencia',
              'Acceso a todas las actividades'
            ],
            buttonText: '¡Paga con transferencia!',
            isFeatured: true,
          },
          {
            id: 3,
            title: 'PASE ESTUDIANTE 3 DÍAS',
            price: `$${parseFloat(priceData.estudiante3dias).toLocaleString('es-AR')}`,
            description: 'Plan especial para estudiantes con acceso por 3 días.',
            features: [
              'Pase por 3 días',
              'Descuento para estudiantes',
              'Acceso a todas las actividades',
              'Requiere acreditación'
            ],
            buttonText: '¡Obtener plan estudiante!',
            isFeatured: false,
          }
        ];
        
        setPlansData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching prices:', err);
        
        // Datos de respaldo en caso de error
        setPlansData([
          {
            id: 1,
            title: 'UNA ACTIVIDAD',
            price: '$20.000',
            description: 'Acceso a una actividad específica de tu elección.',
            features: [
              'Cuota única',
              'Una actividad específica',
              'Pago en efectivo',
              'Acceso limitado a una actividad'
            ],
            buttonText: '¡Paga en efectivo!',
            isFeatured: false,
          },
          {
            id: 2,
            title: 'PASE LIBRE MENSUAL',
            price: '$25.000',
            description: 'Acceso ilimitado a todas las instalaciones y clases grupales.',
            features: [
              'Cuota mensual',
              'Pase libre',
              'Pago con transferencia',
              'Acceso a todas las actividades'
            ],
            buttonText: '¡Paga con transferencia!',
            isFeatured: true,
          },
          {
            id: 3,
            title: 'PASE ESTUDIANTE 3 DÍAS',
            price: '$17.000',
            description: 'Plan especial para estudiantes con acceso por 3 días.',
            features: [
              'Pase por 3 días',
              'Descuento para estudiantes',
              'Acceso a todas las actividades',
              'Requiere acreditación'
            ],
            buttonText: '¡Obtener plan estudiante!',
            isFeatured: false,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) {
    return (
      <section 
        className="py-20 px-5 bg-gradient-to-br from-gray-900 via-black to-yellow-900 text-center"
      >
        <div className="container mx-auto">
          <div className="text-[#FFD700]">Cargando precios...</div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="py-20 px-5 bg-gradient-to-br from-gray-900 via-black to-yellow-900 font-['Poppins'] text-white text-center"
      id='plans'
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
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl font-bold mb-12 uppercase tracking-wide text-white"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
            }
          }}
        >
          Nuestros 
          <span className="text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] ml-2">Planes</span>
        </motion.h2>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-500 rounded-md text-white">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-center gap-8">
          {plansData.map((item) => (
            <PlanCard
              key={item.id}
              {...item}
            />
          ))}
        </div>
        
        <p className="mt-10 text-xl font-semibold">
          <span className="text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">🔥</span> ¡La primer clase es gratis! 
          <span className="text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">🔥</span>
        </p>
      </div>
    </motion.section>
  );
}

export default PlansSection;
