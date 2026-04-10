import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Importación de Componentes de Módulos ---
import AsistenciaSection from './components/Asistencia';
import ClasesSection from './components/Clases';
import EntrenadoresSection from './components/Entrenadores';
import NotificacionesSection from './components/Notificaciones';
import PlansSection from './components/Planes';
import ProgresoSection from './components/Progreso';
import Suscripciones from './components/Suscripciones';
import GymProfilesSection from './components/GymProfiles';
import PagosIngresosSection from './components/PagosIngresos';
import ReservasSection from './components/Reservas';
import RutinasSection from './components/Rutinas'; // Nuevo: Importar RutinasSection

// --- Dropset Style Constants ---
const BG_MAIN = '#0A0A0A';
const BG_CARD = '#1C1C1E';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_SECONDARY = '#8E8E93';
const BORDER_COLOR = '#2C2C2E';
const ACCENT = '#FFFFFF';

const API_URL = "http://localhost:3000";

// --- Iconos (usando SVG/Inline) con el color de texto blanco por defecto ---
const IconDashboard = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const IconUsers = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const IconChecklist = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const IconTag = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"></path></svg>;
const IconPricing = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V5m0 20v-3m0-12v-3"></path></svg>;
const IconGym = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"></path></svg>;
const IconCalendar = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m8 4H3a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2v-5"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18"></path></svg>;
const IconDollarSign = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8.5l2.5 2.5L12 13.5l-2.5 2.5M12 4V8m0 8v4m4-8H8"></path></svg>;
const IconCheckCircle = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V5m0 20v-3m0-12v-3"></path></svg>;
const IconBookOpen = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3V6z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 11a9 9 0 01-9 9h3.012a1 1 0 010-2H9a2 2 0 00-2-2V5a2 2 0 012-2h5a2 2 0 012 2v5a2 2 0 002 2z"></path></svg>;
const IconClipboardList = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 002-2H9M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const IconBell = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 4H6a2 2 0 00-2 2v2a4 4 0 004 4h6a4 4 0 004-4v-2a2 2 0 00-2-2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2a2 2 0 012 2v6a2 2 0 00-2 2H6"></path></svg>;
const IconUsersAlt = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4h2a2 2 0 012 2v10a2 2 0 01-2 2h-2M8 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2M20 12h-1a2 2 0 00-2 2v8a2 2 0 002 2h1zM12 18a4 4 0 110-8 4 4 0 010 8z"></path></svg>; // Icono para Progreso
const IconRoutine = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>;
const IconMenu = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;
const IconClose = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

// Componente de Animación de Carga (Esqueleto) con los nuevos estilos
const LoadingSkeleton = () => {
    return (
        <div className={`min-h-screen flex text-white`} style={{ backgroundColor: BG_MAIN }}>
            {/* Sidebar Skeleton - Hidden on mobile */}
            <div className={`hidden md:block w-72 flex-shrink-0 p-6 border-r border-[#2C2C2E] bg-[#0A0A0A]`}>
                <div className="h-12 rounded-2xl w-12 mx-auto mb-12 bg-[#1C1C1E]"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 py-3 px-2 mb-3">
                        <div className="h-6 w-6 rounded bg-[#1C1C1E]"></div>
                        <div className="h-6 rounded w-3/4 bg-[#1C1C1E]"></div>
                    </div>
                ))}
            </div>
            {/* Main Content Skeleton Area */}
            <div className="flex-grow p-4 md:p-10 animate-pulse">
                <div className="h-10 rounded-lg w-full md:w-96 mb-8 bg-[#1C1C1E]"></div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 h-64 rounded-[28px] bg-[#1C1C1E] border border-[#2C2C2E]"></div>
                    <div className="h-64 rounded-[28px] bg-[#1C1C1E] border border-[#2C2C2E]"></div>
                </div>
            </div>
        </div>
    );
};

// Componente de Navegación Lateral (Sidebar)
const Sidebar = ({ seccionActiva, setSeccionActiva, sidebarOpen, setSidebarOpen }) => {
    const navItems = [
        { name: 'Dashboard', icon: IconDashboard },
        { name: 'Usuarios', icon: IconUsers },
        { name: 'Abonados', icon: IconChecklist },
        { name: 'No Abonados', icon: IconTag },
        { name: 'Precios Actividades', icon: IconPricing },
        { name: 'Perfiles de Gimnasio', icon: IconGym },
        { name: 'Planes de Membresía', icon: IconCalendar },
        { name: 'Suscripciones', icon: IconCheckCircle },
        { name: 'Pagos & Ingresos', icon: IconDollarSign },
        { name: 'Asistencia', icon: IconUsersAlt },
        { name: 'Clases', icon: IconBookOpen },
        { name: 'Reservas', icon: IconClipboardList },
        { name: 'Progreso', icon: IconUsersAlt },
        { name: 'Notificaciones', icon: IconBell },
        { name: 'Entrenadores', icon: IconUsers },
        { name: 'Rutinas', icon: IconRoutine },
    ];

    const handleNavClick = (name) => {
        setSeccionActiva(name);
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-50
                w-64 flex-shrink-0 p-4 border-r text-white
                transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `} style={{ backgroundColor: BG_MAIN }}>
                {/* Mobile close button */}
                <div className="flex items-center justify-between mb-8 md:hidden">
                    <div className="flex items-center">
                        <span className="text-xl font-black" style={{ color: TEXT_PRIMARY }}>Gym</span>
                        <span className="text-xl font-black" style={{ color: ACCENT }}>Admin</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <IconClose className="w-6 h-6" style={{ color: TEXT_PRIMARY }} />
                    </button>
                </div>

                {/* Desktop logo */}
                <div className="hidden md:flex items-center justify-center p-2 mb-10">
                    <span className="text-2xl font-black" style={{ color: TEXT_PRIMARY }}>Gym</span>
                    <span className="text-2xl font-black" style={{ color: ACCENT }}>Admin</span>
                </div>

                <nav className="space-y-2 md:space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] pb-4">
                    {navItems.map((item, idx) => (
                        <button
                            key={idx}
                            className={`w-full flex items-center space-x-3 py-2.5 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.03]
                              ${seccionActiva === item.name
                                    ? `text-white shadow-xl ring-2`
                                    : 'hover:text-white'
                                }`}
                            style={{
                                color: seccionActiva === item.name ? ACCENT : TEXT_PRIMARY,
                                background: seccionActiva === item.name ? BG_CARD : 'none',
                                borderColor: seccionActiva === item.name ? BORDER_COLOR : 'transparent',
                                boxShadow: seccionActiva === item.name ? `0 0 10px ${ACCENT}20` : 'none',
                                textShadow: seccionActiva === item.name ? `0 0 5px ${ACCENT}` : 'none'
                            }}
                            onClick={() => handleNavClick(item.name)}
                        >
                            <item.icon className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" style={{ color: seccionActiva === item.name ? ACCENT : TEXT_PRIMARY }} />
                            <span className="text-sm md:text-base truncate">{item.name}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </>
    );
};


// --- Funciones Auxiliares ---
const getCurrentMonthName = () => {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[new Date().getMonth()];
};

// Función auxiliar para obtener el nombre del mes de un objeto Date
const getCurrentMonthNameFromDate = (date) => {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[date.getMonth()];
};

const getMonthNameFromItem = (item) => {
    if (!item || typeof item !== 'string') return null;

    if (item.includes('T')) {
        try {
            const date = new Date(item);
            if (isNaN(date)) return null;
            return getCurrentMonthNameFromDate(date);
        } catch (e) {
            return null;
        }
    }
    return item;
};

// Componente de Gráfico
const PagosMensualesChart = ({ data }) => {
    const chartData = useMemo(() => {
        const counts = {};
        const altas = {};
        const mesesDelAnio = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        data.forEach(user => {
            // Calcular Suscripciones (Pagos)
            user.meses?.forEach(mesItem => {
                const mes = getMonthNameFromItem(mesItem);
                if (mes) {
                    counts[mes] = (counts[mes] || 0) + 1;
                }
            });

            // Calcular Altas (Nuevos Socios) basado en fecha de creación
            if (user.createdAt) {
                const date = new Date(user.createdAt);
                const mesAlta = mesesDelAnio[date.getMonth()];
                altas[mesAlta] = (altas[mesAlta] || 0) + 1;
            }
        });

        return mesesDelAnio.map(mes => ({
            name: mes.substring(0, 3),
            'Suscripciones': counts[mes] || 0,
            'Altas': altas[mes] || 0,
        }));
    }, [data]);

    return (
        <div className="p-8 rounded-[32px] border shadow-2xl transition-all hover:shadow-white/5 animate-fadeIn"
            style={{
                backgroundColor: BG_CARD,
                borderColor: BORDER_COLOR,
                background: `linear-gradient(145deg, ${BG_CARD} 0%, #151517 100%)`
            }}>
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h3 className="text-2xl font-black tracking-tighter text-white mb-1">Actividad Mensual</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8E93]">Estadísticas de crecimiento y pagos</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B82F6' }}></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#8E8E93]">Pagos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A855F7' }}></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#8E8E93]">Altas</span>
                    </div>
                </div>
            </div>
            
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPagos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorAltas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#8E8E93', fontSize: 10, fontWeight: '900' }} 
                            dy={15}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#444446', fontSize: 10, fontWeight: 'bold' }} 
                        />
                        <Tooltip
                            contentStyle={{ 
                                backgroundColor: 'rgba(28, 28, 30, 0.9)', 
                                backdropFilter: 'blur(10px)', 
                                border: `1px solid ${BORDER_COLOR}`, 
                                borderRadius: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                padding: '12px'
                            }}
                            itemStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}
                            labelStyle={{ color: '#8E8E93', marginBottom: '8px', fontWeight: 'black', fontSize: '10px' }}
                            cursor={{ stroke: '#FFFFFF', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="Suscripciones" 
                            stroke="#3B82F6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorPagos)" 
                            animationDuration={2000}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="Altas" 
                            stroke="#A855F7" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorAltas)" 
                            animationDuration={2500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
// Componente de Lista de Precios
const PricesCard = ({ preciosActividades, handleChangePrecio, guardarPreciosActividades }) => {
    return (
        <div className="p-8 rounded-[28px] border shadow-2xl animate-slideInLeft"
            style={{
                backgroundColor: BG_CARD,
                borderColor: BORDER_COLOR,
                boxShadow: `0 0 15px ${ACCENT}05`
            }}>
            <h3 className="text-xl font-black tracking-tighter mb-6" style={{ color: TEXT_PRIMARY }}>Gestión de Tarifas</h3>
            <div className="space-y-6">
                {[
                    { key: 'unaActividad', label: 'Precio - 1 Actividad' },
                    { key: 'paseLibre', label: 'Precio - Pase Libre' },
                    { key: 'estudiante3dias', label: 'Precio - Estudiante' },
                ].map(({ key, label }) => (
                    <div key={key} className="flex flex-col">
                        <label htmlFor={key} className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>{label}</label>
                        <div className="relative">
                            <input
                                type="number"
                                id={key}
                                name={key}
                                value={preciosActividades[key]}
                                onChange={handleChangePrecio}
                                className="w-full p-4 pl-10 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold"
                                style={{ backgroundColor: BG_MAIN, color: TEXT_PRIMARY, borderColor: BORDER_COLOR }}
                                step="0.01"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 font-black text-lg" style={{ color: TEXT_SECONDARY }}>$</span>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={guardarPreciosActividades}
                className="mt-8 w-full py-5 rounded-[20px] font-bold text-lg active:scale-[0.98] transition-all shadow-2xl"
                style={{
                    backgroundColor: ACCENT,
                    color: BG_MAIN,
                }}
            >
                Guardar Precios
            </button>
        </div>
    );
};
// --- Componente auxiliar para el modal de edición ---
const CrearUsuarioModal = ({ onSave, onClose, BG_CARD, BORDER_COLOR, BG_MAIN, TEXT_PRIMARY, TEXT_SECONDARY, ACCENT, opcionesActividad }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        number: '',
        actividad: opcionesActividad[0] || '',
        peso: '',
        altura: '',
        historialMedico: '',
        diasEntrenamiento: '',
        rutinaCorrespondiente: '',
        role: 'user'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
            <div className="p-8 rounded-[40px] border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_COLOR }}
                onClick={(e) => e.stopPropagation()}>
                <h3 className="text-3xl font-black mb-8 tracking-tighter text-center" style={{ color: TEXT_PRIMARY }}>
                    Crear <span style={{ color: ACCENT }}>Nuevo Socio</span>
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Nombre Completo</label>
                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Email</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Contraseña</label>
                            <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Teléfono</label>
                            <input required name="number" value={formData.number} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Plan de Actividad</label>
                            <select name="actividad" value={formData.actividad} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }}>
                                {opcionesActividad.map(opc => <option key={opc} value={opc}>{opc}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Rol</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }}>
                                <option value="user">USER</option>
                                <option value="admin">ADMIN</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Peso (kg)</label>
                            <input name="peso" type="number" step="0.1" value={formData.peso} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Altura (cm)</label>
                            <input name="altura" type="number" step="1" value={formData.altura} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Días de Entrenamiento</label>
                        <input name="diasEntrenamiento" placeholder="Ej: Lun, Mie, Vie" value={formData.diasEntrenamiento} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Historial Médico</label>
                        <textarea name="historialMedico" rows="2" value={formData.historialMedico} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold resize-none" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Rutina Correspondiente</label>
                        <textarea name="rutinaCorrespondiente" rows="2" value={formData.rutinaCorrespondiente} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold resize-none" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-4">
                        <button type="submit" className="w-full py-5 rounded-[20px] font-bold text-lg active:scale-[0.98] transition-all bg-white text-black shadow-2xl">
                            Crear Usuario
                        </button>
                        <button type="button" onClick={onClose} className="w-full py-4 text-white/40 font-bold hover:text-white transition-all">
                            Descartar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const UserDetailModal = ({ usuario, onSave, onClose, BG_CARD, BORDER_COLOR, BG_MAIN, TEXT_PRIMARY, TEXT_SECONDARY, ACCENT }) => {
    const [formData, setFormData] = useState({
        name: usuario.nombre || usuario.name,
        email: usuario.email,
        number: usuario.numero || usuario.number,
        peso: usuario.peso || '',
        altura: usuario.altura || '',
        historialMedico: usuario.historialMedico || '',
        diasEntrenamiento: usuario.diasEntrenamiento || '',
        rutinaCorrespondiente: usuario.rutinaCorrespondiente || '',
        role: usuario.role || 'user',
        password: '' // Campo opcional por si se quiere resetear
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Si el password está vacío, no lo enviamos
        const dataToSend = { ...formData };
        if (!dataToSend.password) delete dataToSend.password;
        onSave(usuario.id, dataToSend);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
            <div className="p-8 rounded-[40px] border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_COLOR }}
                onClick={(e) => e.stopPropagation()}>
                <h3 className="text-3xl font-black mb-8 tracking-tighter text-center" style={{ color: TEXT_PRIMARY }}>
                    Perfil de <span style={{ color: ACCENT }}>{formData.name}</span>
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Nombre</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Email</label>
                            <input name="email" value={formData.email} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                        </div>
                        <div>
                            <label className="block text-[10px) font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Teléfono</label>
                            <input name="number" value={formData.number} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Peso (kg)</label>
                            <input name="peso" type="number" step="0.1" value={formData.peso} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Altura (cm)</label>
                            <input name="altura" type="number" step="1" value={formData.altura} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Rol</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }}>
                                <option value="user">USER</option>
                                <option value="admin">ADMIN</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Días de Entrenamiento</label>
                        <input name="diasEntrenamiento" placeholder="Ej: Lun, Mie, Vie" value={formData.diasEntrenamiento} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Historial Médico</label>
                        <textarea name="historialMedico" rows="2" value={formData.historialMedico} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold resize-none" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Rutina Correspondiente</label>
                        <textarea name="rutinaCorrespondiente" rows="2" value={formData.rutinaCorrespondiente} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#2C2C2E] text-white font-bold resize-none" style={{ backgroundColor: BG_MAIN, borderColor: BORDER_COLOR }} />
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-4">
                        <button type="submit" className="w-full py-5 rounded-[20px] font-bold text-lg active:scale-[0.98] transition-all bg-white text-black shadow-2xl">
                            Guardar cambios
                        </button>
                        <button type="button" onClick={onClose} className="w-full py-4 text-white/40 font-bold hover:text-white transition-all">
                            Descartar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const EditarActividadModal = ({ producto, onGuardarCambios, setProductoAEditar, opcionesActividad }) => {
    const [actividad, setActividad] = useState(producto.actividad);

    const handleGuardarCambios = () => {
        onGuardarCambios(producto.id, actividad);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4 transition-all animate-fadeIn" onClick={() => setProductoAEditar(null)}>
            <div className="p-10 rounded-[40px] shadow-2xl max-w-2xl w-full animate-scaleIn border"
                style={{
                    backgroundColor: BG_CARD,
                    borderColor: BORDER_COLOR
                }}>
                <h3 className="text-3xl font-black mb-8 tracking-tighter text-center" style={{ color: TEXT_PRIMARY }}>
                    Editar Actividad de <span style={{ color: ACCENT }}>{producto.nombre}</span>
                </h3>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="activity-select" className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: TEXT_SECONDARY }}>Selecciona la Nueva Actividad</label>
                        <select
                            id="activity-select"
                            value={actividad}
                            onChange={(e) => setActividad(e.target.value)}
                            className="w-full p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold appearance-none cursor-pointer"
                            style={{ backgroundColor: BG_MAIN, color: TEXT_PRIMARY, border: `1px solid ${BORDER_COLOR}` }}
                        >
                            {opcionesActividad.map((opcion, index) => (
                                <option key={index} value={opcion}>{opcion}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                    <button
                        onClick={handleGuardarCambios}
                        className="w-full py-5 rounded-[20px] font-bold text-lg active:scale-[0.98] transition-all shadow-2xl"
                        style={{ backgroundColor: ACCENT, color: BG_MAIN }}
                    >
                        Guardar Cambios
                    </button>
                    <button
                        onClick={() => setProductoAEditar(null)}
                        className="w-full py-4 rounded-[20px] font-bold transition-all text-white/60"
                        style={{ backgroundColor: 'transparent' }}
                    >
                        Descartar
                    </button>
                </div>
            </div>
        </div>
    );
};


// Componente Principal
const Admin = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [productoAEditar, setProductoAEditar] = useState(null);
    const [usuarioDetalle, setUsuarioDetalle] = useState(null);
    const [mostrandoCrearUsuario, setMostrandoCrearUsuario] = useState(false);
    const [todosMisProductos, setTodosMisProductos] = useState([]);
    const [allUsersRaw, setAllUsersRaw] = useState([]); // Estado para formato original
    const [seccionActiva, setSeccionActiva] = useState('Dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [preciosActividades, setPreciosActividades] = useState({
        unaActividad: 0,
        paseLibre: 0,
        estudiante3dias: 0
    });
    const [mensajeExito, setMensajeExito] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    const opcionesActividad = [
        "1 actividad",
        "pase libre",
        "Estudiante"
    ];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch users
                const usersResponse = await axios.get(`${API_URL}/getAllUsers`);
                const usuarios = usersResponse.data.map(usuario => ({
                    // Guardamos una versión transformada para las vistas rápidas
                    // pero mantenemos usersResponse.data en allUsersRaw para los módulos hijos
                    id: usuario.id,
                    nombre: usuario.name,
                    numero: usuario.number,
                    email: usuario.email,
                    role: usuario.role,
                    meses: usuario.meses || [],
                    actividad: usuario.actividad,
                    peso: usuario.peso,
                    altura: usuario.altura,
                    historialMedico: usuario.historialMedico,
                    diasEntrenamiento: usuario.diasEntrenamiento,
                    rutinaCorrespondiente: usuario.rutinaCorrespondiente,
                    fechaCreacion: new Date(usuario.createdAt).toLocaleDateString(),
                    fechaActualizacion: new Date(usuario.updatedAt).toLocaleDateString()
                }));
                setAllUsersRaw(usersResponse.data);
                setTodosMisProductos(usuarios);

                // Fetch activity prices
                const pricesResponse = await axios.get(`${API_URL}/api/activity-prices/prices`);
                if (pricesResponse.data) {
                    setPreciosActividades({
                        unaActividad: pricesResponse.data.unaActividad || 0,
                        paseLibre: pricesResponse.data.paseLibre || 0,
                        estudiante3dias: pricesResponse.data.estudiante3dias || 0
                    });
                }

            } catch (error) {
                console.error('Error al cargar datos iniciales:', error);
                setMensajeError('Error al cargar los datos iniciales.');
                setTimeout(() => setMensajeError(''), 5000);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const mesActual = getCurrentMonthName();
    const estaPagadoEsteMesCheck = (u) =>
        u.meses.some(pago => getMonthNameFromItem(pago) === mesActual);

    const abonadosCount = todosMisProductos.filter(estaPagadoEsteMesCheck).length;
    const totalUsers = todosMisProductos.length;
    const noAbonadosCount = totalUsers - abonadosCount;


    const filteredUsers = useMemo(() => {
        const mesActual = getCurrentMonthName();

        return todosMisProductos.filter(usuario => {
            const estaPagadoEsteMes = usuario.meses.some(pago => {
                return getMonthNameFromItem(pago) === mesActual;
            });

            if (seccionActiva === 'Abonados') {
                if (!estaPagadoEsteMes) return false;
            } else if (seccionActiva === 'No Abonados') {
                if (estaPagadoEsteMes) return false;
            }

            return (
                usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [todosMisProductos, seccionActiva, searchTerm]);


    const handleEliminarProducto = async (userId) => {
        try {
            await axios.delete(`${API_URL}/deleteUser/${userId}`);
            setTodosMisProductos(prev => prev.filter((usuario) => usuario.id !== userId));
            setMensajeExito('Usuario eliminado correctamente.');
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            setMensajeError('Error al eliminar el usuario.');
            setTimeout(() => setMensajeError(''), 3000);
        }
    };

    const handleEditarActividad = async (userId, nuevaActividad) => {
        try {
            await axios.put(`${API_URL}/updateActivity/${userId}`, {
                actividad: nuevaActividad
            });

            setTodosMisProductos(prev => prev.map(usuario =>
                usuario.id === userId ? { ...usuario, actividad: nuevaActividad } : usuario
            ));

            setProductoAEditar(null);
            setMensajeExito('Actividad actualizada correctamente.');
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (error) {
            console.error('Error al editar la actividad:', error);
            setMensajeError('Error al actualizar la actividad.');
            setTimeout(() => setMensajeError(''), 3000);
        }
    };

    const handleUpdateUser = async (userId, updatedData) => {
        try {
            await axios.put(`${API_URL}/updateuser/${userId}`, updatedData);

            // Actualizamos el estado local
            setTodosMisProductos(prev => prev.map(usuario =>
                usuario.id === userId ? { ...usuario, ...updatedData, nombre: updatedData.name, numero: updatedData.number } : usuario
            ));
            
            // También actualizamos allUsersRaw
            setAllUsersRaw(prev => prev.map(usuario =>
                usuario.id === userId ? { ...usuario, ...updatedData } : usuario
            ));

            setUsuarioDetalle(null);
            setMensajeExito('Perfil de usuario actualizado correctamente.');
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            setMensajeError('Error al actualizar el perfil del usuario.');
            setTimeout(() => setMensajeError(''), 3000);
        }
    };

    const handleCrearUsuario = async (userData) => {
        try {
            await axios.post(`${API_URL}/createuser`, userData);
            
            setMensajeExito('Usuario creado correctamente.');
            setMostrandoCrearUsuario(false);
            
            // Recargamos los datos
            setTimeout(() => {
                setMensajeExito('');
                fetchData();
            }, 2000);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            const msg = error.response?.data?.message || error.response?.data || 'Error al crear el usuario.';
            setMensajeError(msg);
            setTimeout(() => setMensajeError(''), 3000);
        }
    };

    const marcarMesPagado = async (userId) => {
        try {
            const fechaActual = new Date().toISOString();
            await axios.post(`${API_URL}/addMount`, { fecha: fechaActual, userId });

            setTodosMisProductos(prev => prev.map(usuario => {
                if (usuario.id === userId) {
                    const updatedFechas = usuario.meses.includes(fechaActual) ? usuario.meses : [...usuario.meses, fechaActual];
                    return { ...usuario, meses: updatedFechas };
                }
                return usuario;
            }));

            const fechaLegible = new Date(fechaActual).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            setMensajeExito(`El pago con fecha ${fechaLegible} ha sido marcado.`);
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (error) {
            console.error('Error al marcar el pago:', error);
            setMensajeError('Error al marcar el pago.');
            setTimeout(() => setMensajeError(''), 3000);
        }
    };

    const desmarcarMesPagado = async (userId) => {
        try {
            const mesActual = getCurrentMonthName();

            await axios.delete(`${API_URL}/removeMount`, {
                data: {
                    userId,
                    month: mesActual
                }
            });

            setTodosMisProductos(prev => prev.map(usuario => {
                if (usuario.id === userId) {
                    const updatedMeses = usuario.meses.filter(pago => {
                        const mesDelPago = getMonthNameFromItem(pago);
                        return mesDelPago !== mesActual;
                    });

                    return { ...usuario, meses: updatedMeses };
                }
                return usuario;
            }));

            setMensajeExito(`El pago del mes de ${mesActual} ha sido desmarcado.`);
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (error) {
            console.error('Error al desmarcar el mes:', error);
            setMensajeError('Error al desmarcar el mes. Asegúrate de que el endpoint `/removeMount` existe en tu API.');
            setTimeout(() => setMensajeError(''), 3000);
        }
    };

    const handleToggleMesPagado = (usuario, esAbonado) => {
        if (esAbonado) {
            desmarcarMesPagado(usuario.id);
        } else {
            marcarMesPagado(usuario.id);
        }
    };

    const handleChangePrecio = (e) => {
        const { name, value } = e.target;
        setPreciosActividades(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const guardarPreciosActividades = async () => {
        try {
            const body = {
                unaActividad: parseFloat(preciosActividades.unaActividad),
                paseLibre: parseFloat(preciosActividades.paseLibre),
                estudiante3dias: parseFloat(preciosActividades.estudiante3dias)
            };

            await axios.post(`${API_URL}/api/activity-prices/update-prices`, body);
            setMensajeExito('Precios actualizados correctamente.');
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (error) {
            console.error('Error al guardar precios:', error);
            setMensajeError('Error al actualizar precios.');
            setTimeout(() => setMensajeError(''), 3000);
        }
    };

    // --- Renderizado Principal ---
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className={`min-h-screen flex text-white font-sans`} style={{ backgroundColor: BG_MAIN }}>
            {/* 1. Sidebar */}
            <Sidebar seccionActiva={seccionActiva} setSeccionActiva={setSeccionActiva} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* 2. Contenido Principal */}
            <div className="flex-grow flex flex-col min-h-screen p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className={`flex items-center justify-between md:justify-end gap-4 mb-6 md:mb-8 p-3 md:p-4 rounded-xl border animate-slideInDown`}
                    style={{
                        backgroundColor: BG_CARD,
                        borderColor: BORDER_COLOR,
                        boxShadow: `0 0 10px ${ACCENT}05`
                    }}>
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
                        aria-label="Abrir menú"
                    >
                        <IconMenu className="w-6 h-6" style={{ color: ACCENT }} />
                    </button>

                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold flex-grow" style={{ color: TEXT_PRIMARY }}>
                        Bienvenido 👋
                    </h1>
                </div>

                {/* Mensajes de Alerta (Éxito/Error) */}
                {(mensajeExito || mensajeError) && (
                    <div className={`mb-6 p-4 rounded-2xl backdrop-blur-xl border animate-slideDown flex items-center justify-center text-center`}
                        style={{
                            backgroundColor: mensajeExito ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            borderColor: mensajeExito ? '#22c55e' : '#ef4444',
                            color: TEXT_PRIMARY
                        }}>
                        <p className="text-sm font-black tracking-tight">{mensajeExito || mensajeError}</p>
                        <button onClick={() => { setMensajeExito(''); setMensajeError(''); }} className="ml-4 p-1 rounded-full hover:bg-white/10 transition-colors duration-200" style={{ color: TEXT_PRIMARY }}>
                            <IconClose className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Contenido Dinámico */}
                {seccionActiva === 'Dashboard' && (
                    <section className="px-0 md:px-2 lg:px-4">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                            {/* Gráfico de Pagos */}
                            <div className="xl:col-span-2">
                                <PagosMensualesChart data={todosMisProductos} />
                            </div>

                            {/* Tarjeta de Resumen */}
                            <div className="p-8 rounded-[28px] border shadow-2xl animate-slideInRight"
                                style={{
                                    backgroundColor: BG_CARD,
                                    borderColor: BORDER_COLOR,
                                    boxShadow: `0 0 15px ${ACCENT}05`
                                }}>
                                <h3 className="text-xl font-black tracking-tighter mb-6" style={{ color: TEXT_PRIMARY }}>Resumen del Gimnasio</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 rounded-2xl transition-all active:scale-[0.98] hover:shadow-lg"
                                        style={{
                                            backgroundColor: BG_MAIN,
                                            boxShadow: `0 0 5px ${ACCENT}10`
                                        }}>
                                        <span className="text-sm md:text-base font-medium" style={{ color: TEXT_PRIMARY }}>Total de Usuarios</span>
                                        <span className="text-lg md:text-xl font-black" style={{ color: ACCENT }}>{totalUsers}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 rounded-2xl transition-all active:scale-[0.98] hover:shadow-lg"
                                        style={{
                                            backgroundColor: BG_MAIN,
                                            boxShadow: `0 0 5px ${ACCENT}10`
                                        }}>
                                        <span className="text-sm md:text-base font-medium" style={{ color: TEXT_PRIMARY }}>Abonados ({mesActual})</span>
                                        <span className="text-lg md:text-xl font-black" style={{ color: ACCENT }}>{abonadosCount}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 rounded-2xl transition-all active:scale-[0.98] hover:shadow-lg"
                                        style={{
                                            backgroundColor: BG_MAIN,
                                            boxShadow: `0 0 5px ${ACCENT}10`
                                        }}>
                                        <span className="text-sm md:text-base font-medium" style={{ color: TEXT_PRIMARY }}>No Abonados</span>
                                        <span className="text-lg md:text-xl font-black" style={{ color: ACCENT }}>{noAbonadosCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Listado de Últimos Usuarios */}
                        <div className="p-8 rounded-[28px] border shadow-2xl mt-4 md:mt-6 animate-slideInUp"
                            style={{
                                backgroundColor: BG_CARD,
                                borderColor: BORDER_COLOR,
                                boxShadow: `0 0 15px ${ACCENT}05`
                            }}>
                            <h3 className="text-xl font-black tracking-tighter mb-6" style={{ color: TEXT_PRIMARY }}>Últimos 5 Usuarios Registrados</h3>
                            <ul className="space-y-3">
                                {todosMisProductos.slice(0, 5).map((usuario) => (
                                    <li key={usuario.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 rounded-2xl transition-all active:scale-[0.98] hover:shadow-xl"
                                        style={{
                                            backgroundColor: BG_MAIN,
                                            boxShadow: `0 0 5px ${ACCENT}10`
                                        }}>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-base md:text-lg" style={{ color: TEXT_PRIMARY }}>{usuario.nombre}</span>
                                            <span className="text-xs" style={{ color: TEXT_SECONDARY }}>{usuario.actividad}</span>
                                        </div>
                                        <span className="text-xs md:text-sm font-medium" style={{ color: TEXT_SECONDARY }}>{usuario.fechaCreacion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* Secciones de Usuarios (Común para Usuarios, Abonados, No Abonados) */}
                {(seccionActiva === 'Usuarios' || seccionActiva === 'Abonados' || seccionActiva === 'No Abonados') && (
                    <section className="mb-6 md:mb-10 p-8 rounded-[28px] shadow-2xl border animate-fadeIn"
                        style={{
                            backgroundColor: BG_CARD,
                            borderColor: BORDER_COLOR,
                            boxShadow: `0 0 15px ${ACCENT}05`
                        }}>
                        <h2 className="text-3xl font-black tracking-tighter mb-6 text-center" style={{ color: TEXT_PRIMARY }}>
                            {seccionActiva === 'Usuarios' && 'Gestión de Usuarios'}
                            {seccionActiva === 'Abonados' && `Abonados (${mesActual})`}
                            {seccionActiva === 'No Abonados' && `No Abonados`}
                        </h2>

                        {/* Barra de Búsqueda */}
                        <div className="mb-6 relative">
                            <input
                                type="text"
                                placeholder="Buscar por nombre, actividad o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-4 pl-12 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold"
                                style={{ backgroundColor: BG_MAIN, color: TEXT_PRIMARY, borderColor: BORDER_COLOR }}
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
                                style={{ color: TEXT_SECONDARY }}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <ul className="space-y-4">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((usuario) => {
                                    const estaPagadoEsteMes = usuario.meses.some(pago => {
                                        const mesDelPago = getMonthNameFromItem(pago);
                                        return mesDelPago === mesActual;
                                    });

                                    const statusColor = estaPagadoEsteMes ? ACCENT : TEXT_SECONDARY;

                                    const paymentButtonStyles = estaPagadoEsteMes
                                        ? {
                                            backgroundColor: BG_MAIN,
                                            color: ACCENT,
                                            border: `1px solid ${ACCENT}`,
                                            boxShadow: `0 0 8px ${ACCENT}60`
                                        }
                                        : {
                                            backgroundColor: ACCENT,
                                            color: BG_MAIN,
                                            boxShadow: `0 0 8px ${ACCENT}60`
                                        };

                                    const lastPayment = usuario.meses[usuario.meses.length - 1];

                                    const ultimoPagoDisplay = usuario.meses.length > 0 && lastPayment ? (
                                        typeof lastPayment === 'string' && lastPayment.includes('T')
                                            ? `${new Date(lastPayment).toLocaleDateString('es-ES')} ${new Date(lastPayment).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
                                            : lastPayment
                                    ) : 'No registrado';


                                    return (
                                        <li key={usuario.id} className="p-5 rounded-[28px] shadow-lg border flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 transition-all active:scale-[0.98] hover:shadow-2xl"
                                            style={{
                                                backgroundColor: BG_MAIN,
                                                borderColor: BORDER_COLOR,
                                                boxShadow: `0 0 10px ${ACCENT}15`,
                                            }}>
                                            <div className="flex flex-col flex-grow w-full lg:w-auto">
                                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                                    <span className="font-bold text-base md:text-xl" style={{ color: TEXT_PRIMARY }}>{usuario.nombre}</span>
                                                    <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0`}
                                                        style={{
                                                            backgroundColor: estaPagadoEsteMes ? 'rgba(255,255,255,0.1)' : 'rgba(28,28,30,0.5)',
                                                            color: statusColor,
                                                        }}>
                                                        {estaPagadoEsteMes ? 'ABONADO' : 'NO ABONADO'}
                                                    </span>
                                                </div>
                                                <span className="text-xs md:text-sm" style={{ color: TEXT_SECONDARY }}>Email: {usuario.email}</span>
                                                <span className="text-xs md:text-sm" style={{ color: TEXT_SECONDARY }}>Tel: {usuario.numero}</span>
                                                <span className="text-sm mt-2" style={{ color: TEXT_PRIMARY }}>
                                                    Actividad: <span className="font-semibold" style={{ color: ACCENT }}>{usuario.actividad}</span>
                                                </span>
                                                <span className="text-xs italic mt-1 hidden sm:block" style={{ color: TEXT_SECONDARY }}>
                                                    Registro: {usuario.fechaCreacion} | Último pago: <span style={{ color: statusColor }}>{ultimoPagoDisplay}</span>
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-3 justify-end w-full lg:w-auto">
                                                <button
                                                    onClick={() => setUsuarioDetalle(usuario)}
                                                    className="px-4 py-2 font-bold rounded-xl shadow-sm transition-all active:scale-[0.95] text-xs md:text-sm"
                                                    style={{
                                                        backgroundColor: ACCENT,
                                                        color: BG_MAIN,
                                                        boxShadow: `0 0 5px ${ACCENT}50`
                                                    }}
                                                >
                                                    Pefil
                                                </button>
                                                <button
                                                    onClick={() => setProductoAEditar(usuario)}
                                                    className="px-4 py-2 font-bold rounded-xl shadow-sm transition-all active:scale-[0.95] text-xs md:text-sm"
                                                    style={{
                                                        backgroundColor: BG_CARD,
                                                        color: ACCENT,
                                                        border: `1px solid ${ACCENT}`,
                                                        boxShadow: `0 0 5px ${ACCENT}50`
                                                    }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleToggleMesPagado(usuario, estaPagadoEsteMes)}
                                                    className="px-4 py-2 font-bold rounded-xl shadow-sm transition-all active:scale-[0.95] text-xs md:text-sm"
                                                    style={paymentButtonStyles}
                                                >
                                                    {estaPagadoEsteMes ? 'Desmarcar' : 'Marcar'}
                                                </button>
                                                <button
                                                    onClick={() => handleEliminarProducto(usuario.id)}
                                                    className="px-4 py-2 font-bold rounded-xl shadow-sm transition-all active:scale-[0.95] text-xs md:text-sm"
                                                    style={{
                                                        backgroundColor: BG_CARD,
                                                        color: '#FF4444',
                                                        border: `1px solid #FF4444`,
                                                        boxShadow: `0 0 5px #FF444450`
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="text-center py-8 text-white/40 italic font-medium">No hay usuarios que coincidan con la búsqueda o el filtro.</li>
                            )}
                        </ul>
                        {productoAEditar && <EditarActividadModal producto={productoAEditar} onGuardarCambios={handleEditarActividad} setProductoAEditar={setProductoAEditar} opcionesActividad={opcionesActividad} />}
                        {usuarioDetalle && (
                            <UserDetailModal 
                                usuario={usuarioDetalle} 
                                onSave={handleUpdateUser} 
                                onClose={() => setUsuarioDetalle(null)}
                                BG_CARD={BG_CARD}
                                BORDER_COLOR={BORDER_COLOR}
                                BG_MAIN={BG_MAIN}
                                TEXT_PRIMARY={TEXT_PRIMARY}
                                TEXT_SECONDARY={TEXT_SECONDARY}
                                ACCENT={ACCENT}
                            />
                        )}
                        {mostrandoCrearUsuario && (
                            <CrearUsuarioModal 
                                onSave={handleCrearUsuario} 
                                onClose={() => setMostrandoCrearUsuario(false)}
                                BG_CARD={BG_CARD}
                                BORDER_COLOR={BORDER_COLOR}
                                BG_MAIN={BG_MAIN}
                                TEXT_PRIMARY={TEXT_PRIMARY}
                                TEXT_SECONDARY={TEXT_SECONDARY}
                                ACCENT={ACCENT}
                                opcionesActividad={opcionesActividad}
                            />
                        )}
                    </section>
                )}

                {/* Sección de Precios */}
                {seccionActiva === 'Precios Actividades' && (
                    <section>
                        <PricesCard
                            preciosActividades={preciosActividades}
                            handleChangePrecio={handleChangePrecio}
                            guardarPreciosActividades={guardarPreciosActividades}
                        />
                    </section>
                )}

                {/* Sección de Perfiles de Gimnasio */}
                {seccionActiva === 'Perfiles de Gimnasio' && (
                    <section>
                        <GymProfilesSection />
                    </section>
                )}

                {/* Sección de Planes de Membresía */}
                {seccionActiva === 'Planes de Membresía' && (
                    <section>
                        <PlansSection />
                    </section>
                )}

                {/* Sección de Suscripciones */}
                {seccionActiva === 'Suscripciones' && (
                    <section>
                        <Suscripciones />
                    </section>
                )}

                {/* Sección de Pagos & Ingresos */}
                {seccionActiva === 'Pagos & Ingresos' && (
                    <section>
                        <PagosIngresosSection />
                    </section>
                )}

                {/* Sección de Asistencia */}
                {seccionActiva === 'Asistencia' && (
                    <section>
                        <AsistenciaSection allUsers={allUsersRaw} />
                    </section>
                )}

                {/* Sección de Clases */}
                {seccionActiva === 'Clases' && (
                    <section>
                        <ClasesSection />
                    </section>
                )}

                {/* Sección de Reservas */}
                {seccionActiva === 'Reservas' && (
                    <section>
                        <ReservasSection />
                    </section>
                )}

                {/* Sección de Progreso */}
                {seccionActiva === 'Progreso' && (
                    <section>
                        <ProgresoSection allUsers={allUsersRaw} />
                    </section>
                )}

                {/* Sección de Notificaciones */}
                {seccionActiva === 'Notificaciones' && (
                    <section>
                        <NotificacionesSection allUsers={allUsersRaw} />
                    </section>
                )}

                {/* Sección de Entrenadores */}
                {seccionActiva === 'Entrenadores' && (
                    <section>
                        <EntrenadoresSection allUsers={allUsersRaw} />
                    </section>
                )}

                {/* Sección de Rutinas */}
                {seccionActiva === 'Rutinas' && (
                    <section>
                        <RutinasSection allUsers={allUsersRaw} />
                    </section>
                )}
            </div>
        </div>
    );
};

export default Admin;