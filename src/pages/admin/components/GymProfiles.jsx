import React from 'react';

const GymProfilesSection = () => {
    return (
        <div className="animate-fadeIn">
            <div className="p-6 md:p-8 bg-slate-50 rounded-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">Perfiles de Gimnasio</h2>
                <p className="text-gray-500 font-medium">Módulo de gestión de información pública del gimnasio (Dirección, Contacto, Redes).</p>
                {/* Implementación de CRUD conectando a /api/gym/profiles */}
            </div>
        </div>
    );
};

export default GymProfilesSection;