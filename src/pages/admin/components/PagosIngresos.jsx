import React from 'react';

const PagosIngresosSection = () => {
    return (
        <div className="animate-fadeIn">
            <div className="p-6 md:p-8 bg-slate-50 rounded-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">Pagos & Ingresos</h2>
                <p className="text-gray-500 font-medium">Visualización de historial de pagos y estadísticas de facturación.</p>
                {/* Implementación conectando a /api/gym/payments y /api/gym/payments/revenue */}
            </div>
        </div>
    );
};

export default PagosIngresosSection;