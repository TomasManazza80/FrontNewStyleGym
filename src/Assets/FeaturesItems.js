import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { faFireFlameCurved } from "@fortawesome/free-solid-svg-icons";
import { faMusic } from "@fortawesome/free-solid-svg-icons";

let ServiciosDestacados = [
    {
        id: 1,
        itemIcon: faDumbbell,
        itemTitle: 'MUSCULACIÓN',
        itemDescription: 'Zona premium con máquinas de última generación y pesos libres. Programa de entrenamiento personalizado para ganar fuerza y masa muscular con seguimiento de nuestros coaches certificados.'
    },
    {
        id: 2,
        itemIcon: faPersonRunning,
        itemTitle: 'G.A.P',
        itemDescription: 'Clases especializadas en Glúteos, Abdomen y Piernas. Combina ejercicios localizados con alta intensidad para moldear tu silueta y mejorar tu postura en sesiones dinámicas de 45 minutos.'
    },
    {
        id: 3,
        itemIcon: faFireFlameCurved,
        itemTitle: 'CROSS-FUNCIONAL',
        itemDescription: 'Entrenamiento explosivo que combina fuerza, resistencia y agilidad. Circuitos con kettlebells, cuerdas, cajas y neumáticos para desafiar tus límites en cada sesión.'
    },
    {
        id: 4,
        itemIcon: faMusic,
        itemTitle: 'RITMOS',
        itemDescription: '¡Ejercítate bailando! Clases grupales con coreografías divertidas que mezclan ritmos latinos, urbanos y fitness. Quema calorías sin darte cuenta mientras mejoras tu coordinación.'
    }
];

export default ServiciosDestacados;