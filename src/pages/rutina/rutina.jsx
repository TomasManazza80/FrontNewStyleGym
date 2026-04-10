import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import authContext from "../../store/store";
import { jwtDecode } from "jwt-decode";
import { Activity, Dumbbell, Scale, Calendar, Home, TrendingUp, User, ChevronRight, Check, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Rutina = () => {
    const authCtx = useContext(authContext);
    const [userRoutine, setUserRoutine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({ peso: '--', altura: '--', historialActividad: [] });
    const [error, setError] = useState(null);
    const [markingProgress, setMarkingProgress] = useState(false);
    const [completedExercises, setCompletedExercises] = useState([]);

    useEffect(() => {
        const fetchUserRoutine = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);

                // Obtenemos el ID real del usuario basado en su email para asegurar sincronización
                const userResponse = await axios.get(`${API_URL}/getId/${decoded.email}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const fetchedUserId = userResponse.data;

                if (fetchedUserId) {
                    // Obtenemos los datos extendidos del usuario (peso, altura, historial)
                    try {
                        const userDataRes = await axios.get(`${API_URL}/api/users/profile/${fetchedUserId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (userDataRes.data) {
                            // Usamos una actualización funcional para no perder los valores por defecto
                            setUserData(prev => ({ ...prev, ...userDataRes.data }));
                        }
                    } catch (e) { console.log("No se pudieron cargar los datos del perfil"); }

                    const response = await axios.get(`${API_URL}/api/routines/${fetchedUserId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (response.data && response.data.ejercicios && response.data.ejercicios.length > 0) {
                        setUserRoutine(response.data);
                    }
                }
            } catch (err) {
                console.log('No se encontró rutina personalizada o error al cargar');
            } finally {
                setLoading(false);
            }
        };

        fetchUserRoutine();
    }, []);

    const handleCompleteWorkout = async () => {
        setMarkingProgress(true);
        const token = localStorage.getItem("token");
        const today = new Date().toISOString().split('T')[0];

        // Evitar duplicados locales antes de la petición
        if (userData.historialActividad.includes(today)) {
            setMarkingProgress(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const userRes = await axios.get(`${API_URL}/getId/${decoded.email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userId = userRes.data;

            await axios.post(`${API_URL}/api/users/activity/${userId}`, { date: today }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUserData(prev => ({
                ...prev,
                historialActividad: [...prev.historialActividad, today]
            }));

            // Opcional: Limpiar ejercicios completados al finalizar la sesión
            setCompletedExercises([]);
        } catch (err) {
            console.error("Error al marcar consistencia", err);
        } finally {
            setMarkingProgress(false);
        }
    };

    const toggleExerciseCompletion = (index) => {
        setCompletedExercises(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const getAttendanceThisMonth = () => {
        if (!userData.historialActividad) return [];
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return userData.historialActividad
            .filter(dateStr => {
                const date = new Date(dateStr + 'T12:00:00'); // Evitar problemas de timezone
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            })
            .sort((a, b) => new Date(b) - new Date(a)); // Descendente
    };

    if (loading) {
        return (
            <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!authCtx.token) {
        return (
            <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center p-6">
                <div className="bg-[#1C1C1E] p-10 rounded-[28px] border border-[#2C2C2E] text-center max-w-sm w-full animate-slideUp">
                    <User className="w-12 h-12 mx-auto mb-6 text-[#8E8E93]" />
                    <h2 className="text-2xl font-black tracking-tighter mb-2">ACCESO RESTRINGIDO</h2>
                    <p className="text-[#8E8E93] text-sm mb-8">Inicia sesión para visualizar tu plan de entrenamiento premium.</p>
                    <a href="/login" className="block w-full py-4 bg-white text-black font-black rounded-2xl transition-all active:scale-95 uppercase text-xs tracking-widest">Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0A0A0A] text-white min-h-screen font-sans antialiased pb-32 overflow-x-hidden">
            {/* Header ultra-minimalista */}
            <header className="px-6 pt-10 pb-6 md:pt-12 md:pb-8 max-w-5xl mx-auto animate-fadeIn">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8E8E93] mb-1">Workout Dashboard</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-none">MI SESIÓN</h1>
            </header>

            <main className="px-4 md:px-6 max-w-5xl mx-auto space-y-6">
                {/* Stats Grid - Unified Horizontal Layout */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 animate-slideUp" style={{ animationDelay: '100ms' }}>
                    {/* Card de Peso Corporal */}
                    <div className="bg-[#1C1C1E] p-3 sm:p-6 md:p-8 rounded-[20px] md:rounded-[28px] border border-[#2C2C2E] flex flex-col items-center justify-center text-center sm:flex-row sm:justify-between sm:items-end sm:text-left transition-all active:scale-[0.98]">
                        <div className="min-w-0 flex flex-col items-center sm:items-start">
                            <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4 text-[#8E8E93]">
                                <Scale className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                                <span className="text-[7px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest truncate">Peso</span>
                            </div>
                            <div className="flex items-baseline gap-0.5 md:gap-1">
                                <span className="text-xl sm:text-3xl md:text-5xl font-black tracking-tighter">{userData.peso !== null && userData.peso !== undefined ? userData.peso : '--'}</span>
                                <span className="text-[10px] md:text-xl font-bold text-[#8E8E93]">kg</span>
                            </div>
                        </div>
                        <span className="hidden sm:block text-[6px] sm:text-[9px] md:text-[10px] font-bold text-[#8E8E93] bg-white/5 px-1.5 py-0.5 md:px-3 md:py-1 rounded-full mb-1 md:mb-2 uppercase shrink-0">Hoy</span>
                    </div>

                    {/* Card de Altura */}
                    <div className="bg-[#1C1C1E] p-3 sm:p-6 md:p-8 rounded-[20px] md:rounded-[28px] border border-[#2C2C2E] flex flex-col items-center justify-center text-center sm:flex-row sm:justify-between sm:items-end sm:text-left transition-all active:scale-[0.98]">
                        <div className="min-w-0 flex flex-col items-center sm:items-start">
                            <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4 text-[#8E8E93]">
                                <Activity className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                                <span className="text-[7px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest truncate">Altura</span>
                            </div>
                            <div className="flex items-baseline gap-0.5 md:gap-1">
                                <span className="text-xl sm:text-3xl md:text-5xl font-black tracking-tighter">{userData.altura !== null && userData.altura !== undefined ? userData.altura : '--'}</span>
                                <span className="text-[10px] md:text-xl font-bold text-[#8E8E93]">cm</span>
                            </div>
                        </div>
                        <span className="hidden sm:block text-[6px] sm:text-[9px] md:text-[10px] font-bold text-[#8E8E93] bg-white/5 px-1.5 py-0.5 md:px-3 md:py-1 rounded-full mb-1 md:mb-2 uppercase shrink-0">Fijo</span>
                    </div>

                    {/* Card de Volumen Total */}
                    <div className="relative overflow-hidden bg-[#1C1C1E] p-3 sm:p-6 md:p-8 rounded-[20px] md:rounded-[28px] border border-[#2C2C2E] flex flex-col items-center justify-center text-center transition-all active:scale-[0.98]">
                        <div className="absolute inset-0 bg-white/[0.03]"></div>
                        <div className="relative z-10 min-w-0 flex flex-col items-center">
                            <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4 text-[#8E8E93]">
                                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                                <span className="text-[7px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest truncate">Volumen</span>
                            </div>
                            <div className="flex items-baseline gap-0.5 md:gap-1">
                                <span className="text-xl sm:text-3xl md:text-4xl font-black tracking-tighter">
                                    {userRoutine ? userRoutine.ejercicios.reduce((acc, e) => acc + (parseInt(e.series || 0) * parseInt(e.repeticiones || 0)), 0) : 0}
                                </span>
                                <span className="text-[7px] sm:text-[10px] md:text-lg font-bold text-[#8E8E93] uppercase ml-0.5">Reps</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráfico de Actividad (Heatmap) */}
                <div className="bg-[#1C1C1E] p-6 md:p-8 rounded-[28px] border border-[#2C2C2E] animate-slideUp" style={{ animationDelay: '200ms' }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-[#8E8E93]">
                            <Calendar className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Consistencia</span>
                        </div>
                        <span className="text-[10px] font-bold text-white bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-wider">{userData.historialActividad.length} Días Activos</span>
                    </div>
                    <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-2">
                        {[...Array(28)].map((_, i) => {
                            const dayDate = new Date();
                            dayDate.setDate(dayDate.getDate() - (27 - i));
                            const dateStr = dayDate.toISOString().split('T')[0];
                            const isActive = Array.isArray(userData.historialActividad) && userData.historialActividad.includes(dateStr);
                            return (
                                <div key={i} className={`aspect-square rounded-[4px] transition-colors duration-500 ${isActive ? 'bg-white' : 'bg-[#2C2C2E]'}`}></div>
                            );
                        })}
                    </div>
                </div>

                {/* Lista de Rutina */}
                <section className="animate-slideUp" style={{ animationDelay: '300ms' }}>
                    <div className="flex justify-between items-end mb-6 ml-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8E8E93]">Ejercicios de Hoy</h3>
                        {userRoutine && (
                            <button
                                onClick={handleCompleteWorkout}
                                disabled={markingProgress || userData.historialActividad.includes(new Date().toISOString().split('T')[0])}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full transition-all active:scale-95 disabled:opacity-50"
                            >
                                {markingProgress ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Check className="w-3 h-3" />
                                )}
                                <span className="text-[10px] font-black uppercase tracking-wider">Finalizar Sesión</span>
                            </button>
                        )}
                    </div>

                    {userRoutine && userRoutine.ejercicios && userRoutine.ejercicios.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {userRoutine.ejercicios.map((ejercicio, index) => {
                                const isCompleted = completedExercises.includes(index);
                                return (
                                    <div
                                        key={index}
                                        className={`bg-[#1C1C1E] p-6 sm:p-8 rounded-[28px] md:rounded-[32px] border transition-all ${isCompleted ? 'border-white/5 opacity-60' : 'border-[#2C2C2E]'}`}
                                    >
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center gap-5">
                                                <div
                                                    onClick={() => toggleExerciseCompletion(index)}
                                                    className={`w-8 h-8 cursor-pointer rounded-full border-2 flex items-center justify-center transition-all ${isCompleted ? 'bg-white border-white' : 'border-[#444446]'}`}
                                                >
                                                    {isCompleted && <Check className="w-4 h-4 text-black stroke-[4px]" />}
                                                </div>
                                                <span className={`text-base sm:text-xl font-bold uppercase tracking-tight ${isCompleted ? 'line-through text-[#8E8E93]' : 'text-white'}`}>
                                                    {ejercicio.ejercicio || ejercicio.nombre}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mt-auto">
                                            <div className="flex gap-4 sm:gap-10">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#8E8E93] mb-3">Sets x Reps</span>
                                                    <span className="text-[10px] sm:text-xs font-black text-white tracking-widest bg-[#2C2C2E] px-4 py-2 rounded-xl inline-block w-fit">
                                                        {ejercicio.series} X {ejercicio.repeticiones}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#8E8E93] mb-3">Peso Sugerido</span>
                                                    <span className="text-[10px] sm:text-xs font-black text-white tracking-widest bg-[#2C2C2E] px-4 py-2 rounded-xl inline-block w-fit">
                                                        {ejercicio.peso ? `${ejercicio.peso}KG` : '--'}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleExerciseCompletion(index)}
                                                className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-transparent transition-all active:scale-95 ${isCompleted ? 'bg-[#2C2C2E] text-white' : 'bg-white text-black'}`}
                                            >
                                                {isCompleted ? 'Reabrir Ejercicio' : 'Marcar Completado'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-[#1C1C1E] p-12 rounded-[28px] border border-dashed border-[#2C2C2E] text-center">
                            <Dumbbell className="w-10 h-10 mx-auto mb-4 text-[#2C2C2E]" />
                            <p className="text-sm font-bold text-[#8E8E93] uppercase tracking-widest">Sin rutina asignada</p>
                        </div>
                    )}
                </section>

                {/* Tabla de Asistencia Mensual */}
                <section className="animate-slideUp" style={{ animationDelay: '400ms' }}>
                    <div className="flex justify-between items-end mb-6 ml-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8E8E93]">Asistencia de este Mes</h3>
                    </div>

                    <div className="bg-[#1C1C1E] rounded-[28px] border border-[#2C2C2E] overflow-hidden divide-y divide-[#2C2C2E]">
                        {getAttendanceThisMonth().length > 0 ? (
                            getAttendanceThisMonth().map((dateStr, idx) => {
                                const date = new Date(dateStr + 'T12:00:00');
                                const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
                                const formattedDate = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);

                                return (
                                    <div key={idx} className="flex items-center justify-between p-6 hover:bg-white/[0.01] transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className="bg-white/5 p-3 rounded-2xl">
                                                <Calendar className="w-5 h-5 text-[#8E8E93]" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-tight text-white">{dayName}</p>
                                                <p className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mt-1">{formattedDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Sesión Completada</span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-16 text-center">
                                <Calendar className="w-12 h-12 mx-auto mb-4 text-[#2B2B2B]" />
                                <p className="text-sm font-bold text-[#8E8E93] uppercase tracking-widest">Sin actividad registrada este mes</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>


        </div>
    );
};

export default Rutina;
