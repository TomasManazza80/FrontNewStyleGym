import React from 'react';

const PagosIngresosSection = () => {
    return (
        <div className="p-6 bg-[#1a1a1a] border border-[#333333] rounded-xl">
            <h2 className="text-2xl font-bold text-[#fdcc0d] mb-4">Pagos & Ingresos</h2>
            <p className="text-white opacity-70">Visualización de historial de pagos y estadísticas de facturación.</p>
            {/* Implementación conectando a /api/gym/payments y /api/gym/payments/revenue */}
        </div>
    );
};

export default PagosIngresosSection;