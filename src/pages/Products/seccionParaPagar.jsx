import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Dumbbell, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

const ACCENT_WHITE = '#FFFFFF';
const SECONDARY_TEXT = '#8E8E93';

const SkeletonLoader = () => (
    <div className="animate-pulse bg-[#0A0A0A] min-h-screen flex items-center justify-center p-6">
        <div className="bg-[#1C1C1E] p-10 rounded-[28px] border border-[#2C2C2E] max-w-xl w-full space-y-8">
            <div className="h-8 bg-[#2C2C2E] rounded-lg w-1/2 mx-auto"></div>
            <div className="space-y-4">
                <div className="h-32 bg-[#2C2C2E] rounded-[24px] w-full"></div>
                <div className="h-12 bg-[#2C2C2E] rounded-2xl w-full"></div>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-12 bg-[#2C2C2E] rounded-xl"></div>
                ))}
            </div>
        </div>
    </div>
);

const Products = () => {
    const [mesesPagados, setMesesPagados] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [mesActual, setMesActual] = useState('');
    const [userRoutine, setUserRoutine] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userActivity, setUserActivity] = useState('');
    const [activityPrice, setActivityPrice] = useState(null);
    const [prices, setPrices] = useState({
        unaActividad: 0,
        paseLibre: 0,
        estudiante3dias: 0
    });

    useEffect(() => {
        const obtenerMesActual = () => {
            const mes = new Date().toLocaleString('es-ES', { month: 'long' });
            return mes.charAt(0).toUpperCase() + mes.slice(1);
        };

        setMesActual(obtenerMesActual());

        const fetchData = async () => {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión.');
                setLoading(false);
                return;
            }

            try {
                const pricesResponse = await axios.get(`${API_URL}/api/activity-prices/prices`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const pricesData = pricesResponse.data;
                setPrices({
                    unaActividad: parseFloat(pricesData.unaActividad),
                    paseLibre: parseFloat(pricesData.paseLibre),
                    estudiante3dias: parseFloat(pricesData.estudiante3dias)
                });

                const decoded = jwtDecode(token);
                const userResponse = await axios.get(`${API_URL}/getId/${decoded.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const fetchedUserId = userResponse.data;
                setUserId(fetchedUserId);

                const activityResponse = await axios.get(`${API_URL}/getActivity/${fetchedUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const activity = activityResponse.data;
                setUserActivity(activity);

                let price = 0;
                if (activity === '1 actividad') {
                    price = pricesData.unaActividad;
                } else if (activity === 'pase libre') {
                    price = pricesData.paseLibre;
                } else if (activity === 'Estudiante') {
                    price = pricesData.estudiante3dias;
                } else {
                    console.warn('Actividad no reconocida:', activity);
                    setError(`Actividad no reconocida: "${activity}".`);
                    price = 0;
                }
                setActivityPrice(parseFloat(price));

                const mesesResponse = await axios.get(`${API_URL}/getMounts/${fetchedUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setMesesPagados(mesesResponse.data.meses || []);

                // Fetch Routine based on ID
                try {
                    const routineResponse = await axios.get(`${API_URL}/api/routines/${fetchedUserId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (routineResponse.data && routineResponse.data.ejercicios && routineResponse.data.ejercicios.length > 0) {
                        setUserRoutine(routineResponse.data);
                    }
                } catch (e) { console.log("No routine found for user"); }

            } catch (err) {
                console.error('Error al cargar datos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePagar = async () => {
        setPaymentProcessing(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Debes iniciar sesión para realizar el pago.');
            if (activityPrice === null || activityPrice <= 0)
                throw new Error(`Precio no válido para la actividad: "${userActivity}".`);

            const response = await axios.post(`${API_URL}/payment/create_payment`, {
                product: {
                    title: `Cuota ${mesActual} - ${userActivity}`,
                    unit_price: activityPrice,
                    quantity: 1,
                    userId: userId
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const paymentUrl = response.data.init_point || response.data.payment_url || response.data.url;
            if (paymentUrl) window.location.href = paymentUrl;
            else throw new Error('No se recibió un enlace de pago válido.');

        } catch (err) {
            console.error('Error al procesar pago:', err);
            setError(err.message || 'Error inesperado, intenta de nuevo.');
        } finally {
            setPaymentProcessing(false);
        }
    };

    const mesPagado = mesesPagados.includes(mesActual);

    if (loading) return <SkeletonLoader />;

    return (
        <div className="bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center p-4 font-sans antialiased animate-fadeIn">
            <div className="bg-[#1C1C1E] p-8 md:p-10 rounded-[28px] border border-[#2C2C2E] shadow-2xl max-w-xl w-full transition-all animate-slideUp">

                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter leading-none mb-1">MEMBRESÍA</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8E8E93]">Gestión de suscripción</p>
                    </div>
                    {/* Minimalist Progress Circle Simulation */}
                    <div className="w-12 h-12 rounded-full border-2 border-white/5 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-2 border-t-white border-transparent"></div>
                        <span className="text-[10px] font-bold">{mesPagado ? '100%' : '0%'}</span>
                    </div>
                </header>

                <div className="space-y-6 mb-10">
                    <div className="p-6 rounded-[24px] bg-[#0A0A0A] border border-[#2C2C2E] flex justify-between items-center group active:scale-[0.98] transition-all">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8E8E93] mb-1">Mes Actual</span>
                            <span className="text-2xl font-black tracking-tight">{mesActual}</span>
                        </div>
                        {mesPagado && <CheckCircle className="text-white w-6 h-6" />}
                    </div>

                    {userActivity && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-[24px] bg-[#0A0A0A] border border-[#2C2C2E]">
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8E8E93] block mb-2">Plan</span>
                                <span className="text-sm font-bold text-white truncate">{userActivity}</span>
                            </div>
                            <div className="p-5 rounded-[24px] bg-[#0A0A0A] border border-[#2C2C2E]">
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8E8E93] block mb-2">Importe</span>
                                <span className="text-xl font-black text-white">${activityPrice?.toLocaleString('es-AR')}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* SECTION: ROUTINE CARD (Dropset Aesthetic) */}
                <section className="mb-10 animate-slideUp" style={{ animationDelay: '100ms' }}>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8E8E93] mb-4 ml-1">ENTRENAMIENTO</h4>
                    {userRoutine && userRoutine.ejercicios && userRoutine.ejercicios.length > 0 ? (
                        <div className="p-6 rounded-[28px] bg-[#1C1C1E] border border-[#2C2C2E] shadow-xl group active:scale-[0.98] transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-black tracking-tighter leading-none mb-1">
                                        {userRoutine.nombre || 'Rutina Diaria'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
                                        {userRoutine.ejercicios?.length || 0} EJERCICIOS TOTALES
                                    </p>
                                </div>
                                <Dumbbell className="text-white/20 w-8 h-8" />
                            </div>

                            <div className="space-y-3">
                                {userRoutine.ejercicios?.slice(0, 3).map((ej, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                        <span className="text-xs font-bold text-white/90 truncate mr-4">{ej.ejercicio || ej.nombre}</span>
                                        <div className="flex gap-2 shrink-0">
                                            <span className="text-[10px] font-black bg-[#0A0A0A] px-2 py-1 rounded-md border border-[#2C2C2E]">
                                                {ej.series}x{ej.repeticiones}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 rounded-[28px] border border-dashed border-[#2C2C2E] text-center bg-[#0A0A0A]/50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8E8E93]">
                                Sin rutina asignada
                            </p>
                        </div>
                    )}
                </section>

                <div className="flex flex-col gap-4 mb-10">
                    {mesPagado ? (
                        <div className="w-full py-5 rounded-2xl bg-[#2C2C2E]/30 text-white font-black text-center text-xs uppercase tracking-widest border border-white/10">
                            Suscripción al día
                        </div>
                    ) : (
                        <button
                            onClick={handlePagar}
                            disabled={paymentProcessing || activityPrice === null || activityPrice === 0}
                            className="w-full py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            {paymentProcessing ? (
                                <div className="flex items-center justify-center gap-3">
                                    <Loader2 className="w-4 h-4 animate-spin" /> PROCESANDO
                                </div>
                            ) : (
                                'Pagar ahora'
                            )}
                        </button>
                    )}
                </div>

                <section>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8E8E93] mb-6">Historial de Consistencia</h4>
                    {mesesPagados.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {/* Heatmap-style dots */}
                            {mesesPagados.map((mes) => (
                                <div
                                    key={mes}
                                    className="group relative"
                                >
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-white/10">
                                        <span className="text-[10px] font-black text-black">{mes.substring(0, 3)}</span>
                                    </div>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                                </div>
                            ))}
                            {/* Empty dots for aesthetic consistency */}
                            {[...Array(Math.max(0, 4 - mesesPagados.length))].map((_, i) => (
                                <div key={i} className="w-10 h-10 bg-[#0A0A0A] rounded-xl border border-[#2C2C2E]"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 rounded-[24px] border border-dashed border-[#2C2C2E] text-center">
                            <p className="text-xs font-medium text-[#8E8E93]">No hay registros de pago.</p>
                        </div>
                    )}
                </section>

                {error && (
                    <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-xs font-bold">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;