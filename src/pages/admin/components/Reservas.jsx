import React from 'react';

const ReservasSection = () => {
    return (
        <div className="p-6 bg-[#1a1a1a] border border-[#333333] rounded-xl">
            <h2 className="text-2xl font-bold text-[#fdcc0d] mb-4">Gestión de Reservas</h2>
            <p className="text-white opacity-70">Listado de reservas de clases y cambio de estados.</p>
            {/* Implementación conectando a /api/gym/bookings */}
        </div>
    );
};

export default ReservasSection;