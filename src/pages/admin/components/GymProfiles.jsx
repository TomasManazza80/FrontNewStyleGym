import React from 'react';

const GymProfilesSection = () => {
    return (
        <div className="p-6 bg-[#1a1a1a] border border-[#333333] rounded-xl">
            <h2 className="text-2xl font-bold text-[#fdcc0d] mb-4">Perfiles de Gimnasio</h2>
            <p className="text-white opacity-70">Módulo de gestión de información pública del gimnasio (Dirección, Contacto, Redes).</p>
            {/* Implementación de CRUD conectando a /api/gym/profiles */}
        </div>
    );
};

export default GymProfilesSection;