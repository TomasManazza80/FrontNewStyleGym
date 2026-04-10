import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  faDumbbell,
  faFire,
  faPersonRunning,
  faUserGroup, // Para Cross-Funcional (mejor que faFire)
  faRunning, // Para G.A.P. (mejor que faPersonRunning)
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";

import bodybalance from '../../../../../src/images/actividades/bodybalance.mp4';
import bodyjump from '../../../../../src/images/actividades/bodyjump.mp4';
import zumba from '../../../../../src/images/actividades/zumba.mp4';


// ----------------------------------------------------
// 1. Datos del Horario (Según la imagen original del calendario)
// ----------------------------------------------------
const horarioClases = [
    {
        hora: "08:00 AM",
        Lunes: "Funcional",
        Martes: "Body Jump",
        Miércoles: "Funcional",
        Jueves: "Body Jump",
        Viernes: "Funcional",
        Sábado: "-",
    },
    {
        hora: "10:00 AM",
        Lunes: "Zumba",
        Martes: "Body Balance",
        Miércoles: "Zumba",
        Jueves: "Body Balance",
        Viernes: "Zumba",
        Sábado: "Funcional",
    },
    {
        hora: "06:00 PM",
        Lunes: "Body Jump",
        Martes: "Funcional",
        Miércoles: "Body Jump",
        Jueves: "Funcional",
        Viernes: "Body Jump",
        Sábado: "-",
    },
    {
        hora: "08:00 PM",
        Lunes: "Body Balance",
        Martes: "Zumba",
        Miércoles: "Body Balance",
        Jueves: "Zumba",
        Viernes: "Body Balance",
        Sábado: "-",
    },
];

// Mapeo de actividades para estilos dinámicos de Tailwind en la tabla
const actividadEstilos = {
    Funcional: {
        name: "Cross-Funcional", // Usamos el nombre del componente original para la tabla
        className: "bg-green-800/20 text-green-300 hover:bg-green-800/40",
        icon: faUserGroup,
        iconColor: "text-green-500",
    },
    "Cross-Funcional": { // Mantenemos el estilo si la clase es llamada por este nombre
        name: "Cross-Funcional",
        className: "bg-green-800/20 text-green-300 hover:bg-green-800/40",
        icon: faUserGroup,
        iconColor: "text-green-500",
    },
    "Zumba": {
        name: "Zumba",
        className: "bg-red-800/20 text-red-300 hover:bg-red-800/40",
        icon: faDumbbell, // Icono genérico si no se importa
        iconColor: "text-red-500",
    },
    "Body Jump": {
        name: "Body Jump",
        className: "bg-yellow-800/20 text-yellow-300 hover:bg-yellow-800/40",
        icon: faRunning,
        iconColor: "text-yellow-500",
    },
    "Body Balance": {
        name: "Body Balance",
        className: "bg-blue-800/20 text-blue-300 hover:bg-blue-800/40",
        icon: faClock, // Icono genérico si no se importa
        iconColor: "text-blue-500",
    },
    "-": {
        name: "-",
        className: "bg-gray-950 text-gray-600 cursor-default italic font-light",
        icon: null,
        iconColor: "",
    },
};

// Componente para manejar reproducción automática de video
function VideoCard({ videoUrl }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Reproducción automática exitosa
          })
          .catch((error) => {
            console.log("Error reproduciendo video:", error);
          });
      }
    }
  }, []);

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-40 object-cover rounded-lg mt-auto relative z-10"
    />
  );
}

// ----------------------------------------------------
// 2. Componente de Celda de Clase para la Tabla
// ----------------------------------------------------
const ClaseCelda = ({ clase }) => {
    // Reemplaza "Funcional" con "Cross-Funcional" si es necesario para el mapeo
    const claseKey = clase === "Funcional" ? "Cross-Funcional" : clase;
    const { className, icon, iconColor, name } = actividadEstilos[claseKey] || actividadEstilos["-"];

    return (
        <motion.td 
            className={`p-3 border border-gray-800 transition duration-300 cursor-pointer ${className}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className="flex flex-col items-center justify-center space-y-1">
                {icon && <FontAwesomeIcon icon={icon} className={`text-lg md:text-xl ${iconColor}`} />}
                <span className="text-xs md:text-sm font-semibold text-center whitespace-nowrap">
                    {name === "Cross-Funcional" ? "Cross-F." : name} {/* Abreviatura en la tabla */}
                </span>
            </div>
        </motion.td>
    );
};

function CalendarioActividades() {
    const containerRef = useRef(null);
    const tableRef = useRef(null);
    const isTableInView = useInView(tableRef, { once: true, amount: 0.1 });
    
    // Los datos originales de tu componente
    const actividades = [
        {
            id: 1,
            nombre: "SALA DE MUSCULACIÓN",
            icono: faDumbbell,
            emoji: "💪🏼",
            descripcion:
                "Zona premium con equipos Hammer Strength y área de pesos libres. Asesoramiento profesional incluido.",
            horarios: ["Lunes a Viernes: 7:00 - 21:00", "Sábados: 10:00 - 14:00"],
            videoUrl:
                "https://res.cloudinary.com/dkeymyqcb/video/upload/v1756315822/5319752-uhd_3840_2160_25fps_jdunjz.mp4",
        },
        {
            id: 2,
            nombre: "Body Jump",
            icono: faRunning, // Usamos faRunning
            descripcion:
                "Sesiones intensivas de 45 minutos focalizadas en Glúteos, Abdomen y Piernas.",
            horarios: ["Lunes, Miércoles, Viernes: 18:15"],
            videoUrl:
               bodyjump,
        },
        {
            id: 3,
            nombre: "Funcional",
            icono: faUserGroup, // Usamos faUserGroup
            emoji: "🏋🏼‍♂️",
            descripcion:
                "Entrenamiento funcional de alta intensidad con equipamiento especializado.",
            horarios: [
                "Lunes/Miércoles/Viernes: 10:00, 19:00, 20:00",
                "Martes/Jueves: 14:00, 19:00, 20:00",
            ],
            videoUrl:
                "https://res.cloudinary.com/dkeymyqcb/video/upload/v1756316319/4812848-uhd_3840_2160_25fps_uzm1xm.mp4",
        },
          {
            id: 4,
            nombre: "Zumba",
            icono: faUserGroup, // Usamos faUserGroup
            emoji: "🏋🏼‍♂️",
            descripcion:
                "Entrenamiento funcional de alta intensidad con equipamiento especializado.",
            horarios: [
                "Lunes/Miércoles/Viernes: 10:00, 19:00, 20:00",
                "Martes/Jueves: 14:00, 19:00, 20:00",
            ],
            videoUrl:
                zumba,
        },
          {
            id: 5,
            nombre: "Body Balance",
            icono: faUserGroup, // Usamos faUserGroup
            emoji: "🏋🏼‍♂️",
            descripcion:
                "Entrenamiento funcional de alta intensidad con equipamiento especializado.",
            horarios: [
                "Lunes/Miércoles/Viernes: 10:00, 19:00, 20:00",
                "Martes/Jueves: 14:00, 19:00, 20:00",
            ],
            videoUrl:
                bodybalance,
        }
    ];

    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];


    return (
        <section ref={containerRef} className="relative bg-black text-white py-20 px-6">
            <div className="container mx-auto max-w-7xl">
                <motion.h2
                    className="text-center text-4xl md:text-5xl font-extrabold mb-14"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    ACTIVIDADES{" "}
        
                    <span className="bg-gradient-to-r from-yellow-500 to-amber-400 bg-clip-text text-transparent">
                        Y HORARIOS
                    </span>
                </motion.h2>

                {/* --- 1. Tarjetas de Actividades (Estructura Original Mejorada) --- */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {actividades.map((actividad, index) => (
                        <motion.div
                            key={actividad.id}
                            className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-6 text-center relative overflow-hidden group flex flex-col h-full hover:border-yellow-500 transition duration-500"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(255, 193, 7, 0.2)" }}
                        >
             
                            <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>

                            <FontAwesomeIcon
                                icon={actividad.icono}
                                className="text-4xl text-yellow-500 mb-4 relative z-10"
                            />
                            <h3 className="text-2xl font-bold mb-2 relative z-10">
                                {actividad.nombre} {actividad.emoji && actividad.emoji}
                            </h3>
             
                            <p className="text-lg text-gray-300 mb-4 relative z-10 flex-1">
                                {actividad.descripcion}
                            </p>

                            <ul className="text-gray-400 mb-4 relative z-10 space-y-2">
                                {actividad.horarios.map((horario, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center justify-center gap-2 text-sm hover:text-yellow-400 transition"
                                    >
                                        <FontAwesomeIcon icon={faClock} className="text-xs" />
                                        <span>{horario}</span>
                                    </li>
                                ))}
                            </ul>

                            <VideoCard videoUrl={actividad.videoUrl} />
                        </motion.div>
                    ))}
                </div>
                
                {/* --- 2. Título de la Tabla y Separador --- */}
                <motion.hr 
                    className="my-16 border-t border-gray-700 w-1/3 mx-auto"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                />

                <motion.div
                    ref={tableRef}
                    className="mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="flex items-center justify-center mb-10">
                        <FontAwesomeIcon icon={faCalendarDays} className="text-3xl md:text-4xl text-yellow-500 mr-4" />
                        <h3 className="text-2xl md:text-3xl font-extrabold text-white">Horario Detallado de Clases Grupales</h3>
                    </div>

                    {/* --- TABLA DE HORARIOS (Estilo BLACK STYLE) --- */}
                    <div className="overflow-x-auto rounded-xl shadow-2xl shadow-gray-950/80 border border-gray-800 bg-gray-900">
                        <table className="min-w-[800px] w-full border-collapse">
                            <thead className="bg-gray-950 sticky top-0 z-20">
                                <tr>
                                    <th className="p-3 text-left text-sm font-extrabold text-yellow-400 uppercase tracking-wider border-r border-gray-800 sticky left-0 bg-gray-950 z-30">
                                        <FontAwesomeIcon icon={faClock} className="mr-2" /> Hora
                                    </th>
                                    {diasSemana.map((dia) => (
                                        <th key={dia} className="p-3 text-center text-xs md:text-sm font-extrabold text-white uppercase tracking-wider border-l border-gray-800">
                                            {dia}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {horarioClases.map((horario, index) => (
                                    <motion.tr
                                        key={index}
                                        className="hover:bg-gray-800/70 transition duration-300"
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.1 }}
                                        transition={{ duration: 0.5, delay: index * 0.08 }}
                                    >
                                        <td className="p-3 whitespace-nowrap text-sm font-bold text-yellow-300 border-r border-gray-800 sticky left-0 bg-gray-900 z-10">
                                            {horario.hora}
                                        </td>
                                        {diasSemana.map((dia) => (
                                            <ClaseCelda key={dia} clase={horario[dia]} />
                                        ))}
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </section>
  );
}

export default CalendarioActividades;