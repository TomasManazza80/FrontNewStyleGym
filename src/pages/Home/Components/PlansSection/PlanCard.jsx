import React from 'react';
import { motion } from 'framer-motion';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PurpleBtn from '../PurpleBtn/PurpleBtn';

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: 'easeOut' }
    }
};

const PlanCard = ({ title, price, description, features, buttonText, isFeatured }) => {
    
    // Definición de la paleta
    const GOLD = '#FFD700'; // Dorado Elegante
    const WHITE = '#FFFFFF';
    const DARK_BACKGROUND = 'rgba(10, 10, 10, 0.8)'; // Fondo muy oscuro (casi negro) con ligera transparencia
    const GOLD_SHADOW = 'rgba(255, 215, 0, 0.4)';

    return (
        <motion.div
            className={`flex-1 min-w-[300px] max-w-md ${isFeatured ? 'lg:scale-110 lg:-translate-y-5 z-10' : ''}`}
            variants={cardVariants}
        >
            <div 
                // CAMBIO DE COLOR: Fondo oscuro, borde dorado para destacado
                className={`bg-[${DARK_BACKGROUND}] backdrop-blur-sm rounded-2xl p-10 shadow-lg border border-white/20 transition-all duration-300 ease-in-out h-full flex flex-col justify-between hover:translate-y-[-10px] hover:shadow-2xl hover:shadow-[${GOLD_SHADOW}] ${isFeatured ? `border-2 border-[${GOLD}] relative overflow-hidden` : ''}`}
                style={{backgroundColor: DARK_BACKGROUND}}
            >
                
                {isFeatured && (
                    // CAMBIO DE COLOR: Fondo de la etiqueta POPULAR en Dorado, Texto en Blanco
                    <div className={`absolute top-4 -right-8 text-black text-xs font-bold py-1 px-8 uppercase rotate-45`} style={{ backgroundColor: GOLD }}>
                        POPULAR
                    </div>
                )}
                
                <div>
                    {/* CAMBIO DE COLOR: Título en Dorado */}
                    <h3 className="text-xl font-semibold uppercase mb-3" style={{ color: GOLD }}>{title}</h3>
                    
                    {/* CAMBIO DE COLOR: Precio en Blanco con sombra Dorada */}
                    <p className="text-4xl font-extrabold mb-5 drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]" style={{ color: WHITE }}>{price}</p>
                    
                    {/* CAMBIO DE COLOR: Descripción en Blanco */}
                    <p className="text-sm min-h-[40px] mb-6" style={{ color: WHITE }}>{description}</p>
                    
                    <ul className="text-left mb-8">
                        {features.map((feature, index) => (
                            <li key={index} className="mb-3 flex items-start" style={{ color: WHITE }}>
                                {/* CAMBIO DE COLOR: Checkmark en Dorado */}
                                <FontAwesomeIcon icon={faCheck} className="mr-3 mt-1" style={{ color: GOLD }} /> 
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="mt-auto">
                    {/* NOTA: El botón 'PurpleBtn' ahora debe usar dorado y negro (o blanco si es borde) */}
                    <yellowBtn btnTitle={buttonText} />
                </div>
            </div>
        </motion.div>
    );
};

export default PlanCard;