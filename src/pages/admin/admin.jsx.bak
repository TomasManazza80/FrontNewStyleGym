import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Constantes de Estilo Extrictamente de la Imagen de Referencia ---
// Colores base de la imagen: Fondo oscuro/negro, blanco para "Conoce", amarillo brillante para "New Style Gym"
const BACKGROUND_GRADIENT_START = '#1a1a1a'; // Un negro muy oscuro
const BACKGROUND_GRADIENT_END = '#0a0a0a';   // Un negro aún más oscuro
const TEXT_COLOR_WHITE = '#ffffff';        // Blanco puro para "Conoce"
const TEXT_COLOR_YELLOW = '#fdcc0d';      // Amarillo brillante de "New Style Gym"
const LIGHT_GLOW_COLOR = '#ffeb3b';       // Un amarillo más claro para el efecto de brillo
const BORDER_HIGHLIGHT_COLOR = '#333333';   // Un gris muy oscuro para bordes sutiles

const API_URL = 'https://newstylegym-back.onrender.com';

// --- Iconos (usando SVG/Inline) con el color de texto blanco por defecto ---
const IconDashboard = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const IconUsers = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const IconChecklist = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const IconTag = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"></path></svg>;
const IconPricing = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V5m0 20v-3m0-12v-3"></path></svg>;

// Componente de Animación de Carga (Esqueleto) con los nuevos estilos
const LoadingSkeleton = () => {
    return (
        <div className={`min-h-screen flex text-white`} style={{ background: `linear-gradient(135deg, ${BACKGROUND_GRADIENT_START}, ${BACKGROUND_GRADIENT_END})` }}>
            {/* Sidebar Skeleton */}
            <div className={`w-20 md:w-64 flex-shrink-0 p-4 border-r`} style={{ backgroundColor: BACKGROUND_GRADIENT_START, borderColor: BORDER_HIGHLIGHT_COLOR }}>
                <div className="h-10 rounded-full w-10 mx-auto mb-10" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 py-3 px-2 mb-3">
                        <div className="h-6 w-6 rounded" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                        <div className="hidden md:block h-6 rounded w-3/4" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                    </div>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-grow p-6 md:p-10 animate-pulse">
                {/* Header/Search Skeleton */}
                <div className="flex justify-end mb-10">
                    <div className="h-10 rounded-lg w-full md:w-96" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Card Skeleton */}
                    <div className={`lg:col-span-2 p-6 rounded-xl h-64 shadow-xl border`} style={{ backgroundColor: BACKGROUND_GRADIENT_START, borderColor: BORDER_HIGHLIGHT_COLOR }}>
                        <div className="h-8 rounded w-1/3 mb-4" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                        <div className="h-40 rounded" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                    </div>
                    {/* Right Card Skeleton */}
                    <div className={`p-6 rounded-xl h-64 shadow-xl border`} style={{ backgroundColor: BACKGROUND_GRADIENT_START, borderColor: BORDER_HIGHLIGHT_COLOR }}>
                        <div className="h-8 rounded w-1/2 mb-4" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="h-4 rounded w-1/3" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                                    <div className="h-6 rounded w-1/4" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* List Section Skeleton */}
                <div className={`mt-10 p-6 rounded-xl shadow-xl border`} style={{ backgroundColor: BACKGROUND_GRADIENT_START, borderColor: BORDER_HIGHLIGHT_COLOR }}>
                    <div className="h-8 rounded w-1/4 mb-6" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={`flex justify-between items-center p-4 rounded-lg`} style={{ backgroundColor: BACKGROUND_GRADIENT_END }}>
                                <div className="flex flex-col">
                                    <div className="h-5 rounded w-40 mb-1" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                                    <div className="h-4 rounded w-24" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                                </div>
                                <div className="flex space-x-2">
                                    <div className="h-8 w-20 rounded-md" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                                    <div className="h-8 w-20 rounded-md" style={{backgroundColor: BORDER_HIGHLIGHT_COLOR}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// Componente de Navegación Lateral (Sidebar)
const Sidebar = ({ seccionActiva, setSeccionActiva }) => {
    const navItems = [
        { name: 'Dashboard', icon: IconDashboard },
        { name: 'Usuarios', icon: IconUsers },
        { name: 'Abonados', icon: IconChecklist },
        { name: 'No Abonados', icon: IconTag },
        { name: 'Precios Actividades', icon: IconPricing },
    ];

    return (
        <div className={`hidden md:block w-64 flex-shrink-0 p-4 border-r text-white`} style={{ backgroundColor: BACKGROUND_GRADIENT_START, borderColor: BORDER_HIGHLIGHT_COLOR }}>
            <div className="flex items-center justify-center p-2 mb-10">
                {/* Logo con color amarillo y blanco, y un sutil brillo */}
                <span className="text-2xl font-black" style={{ color: TEXT_COLOR_WHITE, textShadow: `0 0 5px ${LIGHT_GLOW_COLOR}` }}>Gym</span>
                <span className="text-2xl font-black" style={{ color: TEXT_COLOR_YELLOW, textShadow: `0 0 8px ${LIGHT_GLOW_COLOR}, 0 0 15px ${LIGHT_GLOW_COLOR}` }}>Admin</span>
            </div>

            <nav className="space-y-3">
                {navItems.map((item, idx) => (
                    <button
                        key={idx}
                        className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.03]
                          ${seccionActiva === item.name
                            ? `text-white shadow-xl ring-2` // Estilo activo con anillo y brillo
                            : 'hover:text-white' // Color blanco en hover
                        }`}
                        // Estilos directamente en el botón para el fondo activo y el borde de anillo
                        style={{
                            color: seccionActiva === item.name ? TEXT_COLOR_YELLOW : TEXT_COLOR_WHITE,
                            background: seccionActiva === item.name ? `linear-gradient(90deg, ${BACKGROUND_GRADIENT_START} 0%, #2a2a2a 100%)` : 'none',
                            borderColor: seccionActiva === item.name ? LIGHT_GLOW_COLOR : 'transparent',
                            boxShadow: seccionActiva === item.name ? `0 0 10px ${LIGHT_GLOW_COLOR}20` : 'none', // Sombra de brillo
                            textShadow: seccionActiva === item.name ? `0 0 5px ${TEXT_COLOR_YELLOW}` : 'none'
                        }}
                        onClick={() => setSeccionActiva(item.name)}
                    >
                        <item.icon className="w-6 h-6" style={{ color: seccionActiva === item.name ? TEXT_COLOR_YELLOW : TEXT_COLOR_WHITE }} />
                        <span>{item.name}</span>
                    </button>
                ))}
            </nav>
        </div>
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
        const mesesDelAnio = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        data.forEach(user => {
            user.meses.forEach(mesItem => {
                const mes = getMonthNameFromItem(mesItem); 
                if (mes) {
                    counts[mes] = (counts[mes] || 0) + 1;
                }
            });
        });

        return mesesDelAnio.map(mes => ({
            name: mes.substring(0, 3),
            'Usuarios Pagados': counts[mes] || 0,
        }));
    }, [data]);

    return (
        <div className={`p-6 rounded-xl shadow-2xl border h-full transition-all duration-300 transform hover:shadow-lg animate-fadeIn`} 
             style={{ 
                 backgroundColor: BACKGROUND_GRADIENT_START, 
                 borderColor: BORDER_HIGHLIGHT_COLOR,
                 boxShadow: `0 0 15px ${LIGHT_GLOW_COLOR}05` // Sutil brillo amarillo
             }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: TEXT_COLOR_WHITE }}>Pagos de Suscripción por Mes</h3>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={BORDER_HIGHLIGHT_COLOR} />
                        <XAxis dataKey="name" stroke={TEXT_COLOR_WHITE} tick={{ fill: TEXT_COLOR_WHITE, fontSize: 12 }} />
                        <YAxis stroke={TEXT_COLOR_WHITE} tick={{ fill: TEXT_COLOR_WHITE, fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: BACKGROUND_GRADIENT_END, border: `1px solid ${LIGHT_GLOW_COLOR}`, borderRadius: '6px' }}
                            labelStyle={{ color: TEXT_COLOR_YELLOW, fontWeight: 'bold' }}
                            itemStyle={{ color: TEXT_COLOR_WHITE }}
                        />
                        <Bar dataKey="Usuarios Pagados" fill={TEXT_COLOR_YELLOW} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


// Componente de Lista de Precios
const PricesCard = ({ preciosActividades, handleChangePrecio, guardarPreciosActividades }) => {
    return (
        <div className={`p-6 rounded-xl shadow-2xl border h-full animate-slideInLeft`} 
             style={{ 
                 backgroundColor: BACKGROUND_GRADIENT_START, 
                 borderColor: BORDER_HIGHLIGHT_COLOR,
                 boxShadow: `0 0 15px ${LIGHT_GLOW_COLOR}05` // Sutil brillo amarillo
             }}>
            <h3 className="text-xl font-bold mb-6 border-b pb-3" style={{ color: TEXT_COLOR_WHITE, borderColor: BORDER_HIGHLIGHT_COLOR }}>Gestión de Tarifas</h3>
            <div className="space-y-5">
                {[
                    { key: 'unaActividad', label: 'Precio - 1 Actividad' },
                    { key: 'paseLibre', label: 'Precio - Pase Libre' },
                    { key: 'estudiante3dias', label: 'Precio - Estudiante' },
                ].map(({ key, label }) => (
                    <div key={key} className="flex flex-col">
                        <label htmlFor={key} className="block text-sm font-medium mb-1" style={{ color: TEXT_COLOR_WHITE }}>{label}</label>
                        <div className="relative">
                            <input
                                type="number"
                                id={key}
                                name={key}
                                value={preciosActividades[key]}
                                onChange={handleChangePrecio}
                                className={`w-full p-3 pl-10 border rounded-lg shadow-inner focus:outline-none focus:ring-1 focus:ring-yellow-400 transition duration-300`}
                                style={{ backgroundColor: BACKGROUND_GRADIENT_END, color: TEXT_COLOR_WHITE, borderColor: BORDER_HIGHLIGHT_COLOR }}
                                step="0.01"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 font-bold" style={{ color: TEXT_COLOR_YELLOW }}>$</span>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={guardarPreciosActividades}
                className="mt-8 w-full px-6 py-3 font-semibold rounded-lg shadow-xl transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
                style={{ 
                    backgroundColor: TEXT_COLOR_YELLOW, 
                    color: BACKGROUND_GRADIENT_END, // Texto oscuro sobre el botón amarillo
                    textShadow: `0 0 3px ${BACKGROUND_GRADIENT_START}`, // Sombra sutil para legibilidad
                    boxShadow: `0 0 10px ${LIGHT_GLOW_COLOR}80` // Brillo amarillo en el botón
                }}
            >
                Guardar Precios
            </button>
        </div>
    );
};


// --- Componente auxiliar para el modal de edición ---
const EditarActividadModal = ({ producto, onGuardarCambios, setProductoAEditar, opcionesActividad }) => {
    const [actividad, setActividad] = useState(producto.actividad);

    const handleGuardarCambios = () => {
        onGuardarCambios(producto.id, actividad);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className={`p-8 rounded-xl shadow-2xl max-w-md w-full border animate-scaleIn`} 
                 style={{ 
                     backgroundColor: BACKGROUND_GRADIENT_START, 
                     borderColor: LIGHT_GLOW_COLOR, // Borde amarillo para el modal
                     boxShadow: `0 0 20px ${LIGHT_GLOW_COLOR}40` // Brillo amarillo para el modal
                 }}>
                <h3 className="text-2xl font-bold mb-6 text-center border-b pb-3" style={{ color: TEXT_COLOR_WHITE, borderColor: BORDER_HIGHLIGHT_COLOR }}>
                    Editar Actividad de <span style={{ color: TEXT_COLOR_YELLOW, textShadow: `0 0 5px ${LIGHT_GLOW_COLOR}` }}>{producto.nombre}</span>
                </h3>
                <div className="space-y-5">
                    <div>
                        <label htmlFor="activity-select" className="block text-sm font-medium mb-2" style={{ color: TEXT_COLOR_WHITE }}>Selecciona la Nueva Actividad</label>
                        <select
                            id="activity-select"
                            value={actividad}
                            onChange={(e) => setActividad(e.target.value)}
                            className={`mt-1 block w-full border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 appearance-none transition duration-200`}
                            style={{ backgroundColor: BACKGROUND_GRADIENT_END, color: TEXT_COLOR_WHITE, borderColor: BORDER_HIGHLIGHT_COLOR }}
                        >
                            {opcionesActividad.map((opcion, index) => (
                                <option key={index} value={opcion} style={{ backgroundColor: BACKGROUND_GRADIENT_END, color: TEXT_COLOR_WHITE }}>
                                    {opcion}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        onClick={handleGuardarCambios}
                        className="px-6 py-3 font-semibold rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                        style={{ 
                            backgroundColor: TEXT_COLOR_YELLOW, 
                            color: BACKGROUND_GRADIENT_END,
                            boxShadow: `0 0 8px ${LIGHT_GLOW_COLOR}60`
                        }}
                    >
                        Guardar
                    </button>
                    <button
                        onClick={() => setProductoAEditar(null)}
                        className="px-6 py-3 font-semibold rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        style={{ 
                            backgroundColor: BACKGROUND_GRADIENT_END, 
                            color: TEXT_COLOR_WHITE, 
                            borderColor: BORDER_HIGHLIGHT_COLOR, 
                            border: `1px solid ${BORDER_HIGHLIGHT_COLOR}` 
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};


// Componente Principal
const Admin = () => {
    
    const [isLoading, setIsLoading] = useState(true);
    const [productoAEditar, setProductoAEditar] = useState(null);
    const [todosMisProductos, setTodosMisProductos] = useState([]);
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
                const usersResponse = await axios.get(`${API_URL}/getAllUsers`);
                const usuarios = usersResponse.data.map(usuario => ({
                    id: usuario.id,
                    nombre: usuario.name,
                    numero: usuario.number,
                    email: usuario.email,
                    role: usuario.role,
                    meses: usuario.meses || [],
                    actividad: usuario.actividad,
                    fechaCreacion: new Date(usuario.createdAt).toLocaleDateString(),
                    fechaActualizacion: new Date(usuario.updatedAt).toLocaleDateString()
                }));
                setTodosMisProductos(usuarios);

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
        <div className={`min-h-screen flex text-white font-sans`} style={{ background: `linear-gradient(135deg, ${BACKGROUND_GRADIENT_START}, ${BACKGROUND_GRADIENT_END})` }}>
            {/* 1. Sidebar */}
            <Sidebar seccionActiva={seccionActiva} setSeccionActiva={setSeccionActiva} />

            {/* 2. Contenido Principal */}
            <div className="flex-grow p-4 md:p-8">
                {/* Header */}
                <div className={`flex justify-between items-center mb-8 p-4 rounded-xl border animate-slideInDown`} 
                     style={{ 
                         backgroundColor: BACKGROUND_GRADIENT_START, 
                         borderColor: BORDER_HIGHLIGHT_COLOR,
                         boxShadow: `0 0 10px ${LIGHT_GLOW_COLOR}05` // Sutil brillo amarillo
                     }}>
                    <h1 className="text-xl md:text-3xl font-extrabold" style={{ color: TEXT_COLOR_WHITE }}>
                        Bienvenido al Dashboard 👋
                    </h1>
                        {/* El bloque de búsqueda está comentado, se mantiene para referencia. */}
                </div>

                {/* Mensajes de Alerta (Éxito/Error) */}
                {(mensajeExito || mensajeError) && (
                    <div className={`mb-6 p-4 rounded-lg shadow-lg flex items-center justify-between animate-fadeInUp`} 
                         style={{ 
                             background: mensajeExito 
                                 ? `linear-gradient(90deg, #1A472A, #0A3319)` // Verde oscuro para éxito
                                 : `linear-gradient(90deg, #5C1D1D, #3D1212)`,  // Rojo oscuro para error
                             border: mensajeExito 
                                 ? `1px solid ${TEXT_COLOR_YELLOW}` 
                                 : `1px solid #FF4444`,
                             boxShadow: mensajeExito
                                 ? `0 0 10px ${LIGHT_GLOW_COLOR}30`
                                 : `0 0 10px #FF444430`
                         }}>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 mr-3" style={{ color: TEXT_COLOR_YELLOW }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mensajeExito ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"}></path>
                            </svg>
                            <span style={{ color: TEXT_COLOR_WHITE }}>{mensajeExito || mensajeError}</span>
                        </div>
                        <button onClick={() => { setMensajeExito(''); setMensajeError(''); }} className="hover:text-gray-400 transition-colors duration-200" style={{ color: TEXT_COLOR_WHITE }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                )}

                {/* Contenido Dinámico */}
                {seccionActiva === 'Dashboard' && (
                    <section>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Gráfico de Pagos - Ya con estilos y animación en su componente */}
                            <div className="lg:col-span-2">
                                <PagosMensualesChart data={todosMisProductos} />
                            </div>

                            {/* Tarjeta de Resumen */}
                            <div className={`p-6 rounded-xl shadow-2xl border animate-slideInRight`} 
                                 style={{ 
                                     backgroundColor: BACKGROUND_GRADIENT_START, 
                                     borderColor: BORDER_HIGHLIGHT_COLOR,
                                     boxShadow: `0 0 15px ${LIGHT_GLOW_COLOR}05` // Sutil brillo amarillo
                                 }}>
                                <h3 className="text-xl font-bold mb-6 border-b pb-3" style={{ color: TEXT_COLOR_WHITE, borderColor: BORDER_HIGHLIGHT_COLOR }}>Resumen del Gimnasio</h3>
                                <div className="space-y-4">
                                    <div className={`flex justify-between items-center p-3 rounded-lg transition duration-200 hover:scale-[1.03] hover:shadow-lg`} 
                                         style={{ 
                                             backgroundColor: BACKGROUND_GRADIENT_END, 
                                             boxShadow: `0 0 5px ${LIGHT_GLOW_COLOR}10` 
                                         }}>
                                        <span className="text-md font-medium" style={{ color: TEXT_COLOR_WHITE }}>Total de Usuarios</span>
                                        <span className="text-xl font-bold" style={{ color: TEXT_COLOR_YELLOW }}>{totalUsers}</span>
                                    </div>
                                    <div className={`flex justify-between items-center p-3 rounded-lg transition duration-200 hover:scale-[1.03] hover:shadow-lg`} 
                                         style={{ 
                                             backgroundColor: BACKGROUND_GRADIENT_END, 
                                             boxShadow: `0 0 5px ${LIGHT_GLOW_COLOR}10` 
                                         }}>
                                        <span className="text-md font-medium" style={{ color: TEXT_COLOR_WHITE }}>Abonados ({mesActual})</span>
                                        <span className="text-xl font-bold" style={{ color: TEXT_COLOR_YELLOW }}>{abonadosCount}</span>
                                    </div>
                                    <div className={`flex justify-between items-center p-3 rounded-lg transition duration-200 hover:scale-[1.03] hover:shadow-lg`} 
                                         style={{ 
                                             backgroundColor: BACKGROUND_GRADIENT_END, 
                                             boxShadow: `0 0 5px ${LIGHT_GLOW_COLOR}10` 
                                         }}>
                                        <span className="text-md font-medium" style={{ color: TEXT_COLOR_WHITE }}>No Abonados</span>
                                        <span className="text-xl font-bold" style={{ color: TEXT_COLOR_YELLOW }}>{noAbonadosCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Listado de Últimos Usuarios */}
                        <div className={`p-6 rounded-xl shadow-2xl border mt-6 animate-slideInUp`} 
                             style={{ 
                                 backgroundColor: BACKGROUND_GRADIENT_START, 
                                 borderColor: BORDER_HIGHLIGHT_COLOR,
                                 boxShadow: `0 0 15px ${LIGHT_GLOW_COLOR}05` // Sutil brillo amarillo
                             }}>
                            <h3 className="text-xl font-bold mb-6 border-b pb-3" style={{ color: TEXT_COLOR_WHITE, borderColor: BORDER_HIGHLIGHT_COLOR }}>Últimos 5 Usuarios Registrados</h3>
                            <ul className="space-y-3">
                                {todosMisProductos.slice(0, 5).map((usuario) => (
                                    <li key={usuario.id} className={`flex justify-between items-center p-3 rounded-lg transition duration-200 hover:scale-[1.01] hover:shadow-xl`} 
                                        style={{ 
                                            backgroundColor: BACKGROUND_GRADIENT_END,
                                            boxShadow: `0 0 5px ${LIGHT_GLOW_COLOR}10`
                                        }}>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-white">{usuario.nombre}</span>
                                            <span className="text-xs" style={{ color: TEXT_COLOR_WHITE }}>{usuario.actividad}</span>
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: TEXT_COLOR_YELLOW }}>{usuario.fechaCreacion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* Secciones de Usuarios (Común para Usuarios, Abonados, No Abonados) */}
                {(seccionActiva === 'Usuarios' || seccionActiva === 'Abonados' || seccionActiva === 'No Abonados') && (
                    <section className={`mb-10 p-6 rounded-xl shadow-2xl border animate-fadeIn`} 
                             style={{ 
                                 backgroundColor: BACKGROUND_GRADIENT_START, 
                                 borderColor: BORDER_HIGHLIGHT_COLOR,
                                 boxShadow: `0 0 15px ${LIGHT_GLOW_COLOR}05` // Sutil brillo amarillo
                             }}>
                        <h2 className="text-3xl font-bold mb-6 text-center border-b pb-3" style={{ color: TEXT_COLOR_YELLOW, borderColor: BORDER_HIGHLIGHT_COLOR, textShadow: `0 0 5px ${LIGHT_GLOW_COLOR}` }}>
                            {seccionActiva === 'Usuarios' && 'Gestión de Todos los Usuarios'}
                            {seccionActiva === 'Abonados' && `Usuarios Abonados (${mesActual})`}
                            {seccionActiva === 'No Abonados' && `Usuarios No Abonados`}
                        </h2>
                        
                        {/* Barra de Búsqueda */}
                        <div className="mb-6 relative">
                            <input
                                type="text"
                                placeholder="Buscar por nombre, actividad o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full p-3 pl-12 border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200`}
                                style={{ backgroundColor: BACKGROUND_GRADIENT_END, color: TEXT_COLOR_WHITE, borderColor: BORDER_HIGHLIGHT_COLOR }}
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
                                style={{ color: TEXT_COLOR_YELLOW }}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>
                        
                        <ul className="space-y-4">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((usuario) => {
                                    const estaPagadoEsteMes = usuario.meses.some(pago => {
                                        const mesDelPago = getMonthNameFromItem(pago);
                                        return mesDelPago === mesActual;
                                    });
                                    
                                    const statusColor = estaPagadoEsteMes ? TEXT_COLOR_YELLOW : TEXT_COLOR_WHITE;
                                    const statusGlow = estaPagadoEsteMes ? `0 0 5px ${LIGHT_GLOW_COLOR}` : 'none';

                                    const paymentButtonStyles = estaPagadoEsteMes
                                        ? { 
                                            backgroundColor: BACKGROUND_GRADIENT_START, 
                                            color: TEXT_COLOR_YELLOW,
                                            border: `1px solid ${TEXT_COLOR_YELLOW}`,
                                            boxShadow: `0 0 8px ${LIGHT_GLOW_COLOR}60`
                                        } // Desmarcar (Amarillo sobre oscuro)
                                        : { 
                                            backgroundColor: TEXT_COLOR_YELLOW, 
                                            color: BACKGROUND_GRADIENT_END, 
                                            boxShadow: `0 0 8px ${LIGHT_GLOW_COLOR}60`
                                        }; // Marcar (Amarillo sólido)
                                    
                                    const lastPayment = usuario.meses[usuario.meses.length - 1]; 
                                    
                                    const ultimoPagoDisplay = usuario.meses.length > 0 && lastPayment ? (
                                        typeof lastPayment === 'string' && lastPayment.includes('T')
                                            ? new Date(lastPayment).toLocaleDateString('es-ES')
                                            : lastPayment 
                                    ) : 'No registrado';


                                    return (
                                        <li key={usuario.id} className={`p-5 rounded-xl shadow-lg border flex flex-col xl:flex-row justify-between items-start xl:items-center space-y-3 xl:space-y-0 xl:space-x-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl`} 
                                            style={{ 
                                                backgroundColor: BACKGROUND_GRADIENT_END,
                                                borderColor: BORDER_HIGHLIGHT_COLOR,
                                                boxShadow: `0 0 10px ${LIGHT_GLOW_COLOR}15`,
                                            }}>
                                            <div className="flex flex-col flex-grow">
                                                <div className="flex items-center space-x-3">
                                                    <span className="font-bold text-xl" style={{ color: TEXT_COLOR_WHITE }}>{usuario.nombre}</span>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full`} 
                                                        style={{ 
                                                            backgroundColor: estaPagadoEsteMes ? `${TEXT_COLOR_YELLOW}20` : `${BORDER_HIGHLIGHT_COLOR}50`, 
                                                            color: statusColor, 
                                                            textShadow: statusGlow 
                                                        }}>
                                                        {estaPagadoEsteMes ? 'ABONADO' : 'NO ABONADO'}
                                                    </span>
                                                </div>
                                                <span className="text-sm" style={{ color: TEXT_COLOR_WHITE }}>Email: {usuario.email} | Teléfono: {usuario.numero}</span>
                                                <span className="text-md mt-1" style={{ color: TEXT_COLOR_WHITE }}>
                                                    Actividad: <span className="font-semibold" style={{ color: TEXT_COLOR_YELLOW }}>{usuario.actividad}</span>
                                                </span>
                                                <span className="text-xs italic mt-1" style={{ color: BORDER_HIGHLIGHT_COLOR }}>
                                                    Registro: {usuario.fechaCreacion} | Último pago: <span style={{ color: statusColor }}>{ultimoPagoDisplay}</span>
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 justify-end">
                                                <button
                                                    onClick={() => setProductoAEditar(usuario)}
                                                    className={`px-4 py-2 font-medium rounded-md shadow-sm transition duration-200 text-sm`}
                                                    style={{ 
                                                        backgroundColor: BACKGROUND_GRADIENT_START,
                                                        color: TEXT_COLOR_YELLOW, 
                                                        border: `1px solid ${TEXT_COLOR_YELLOW}`,
                                                        boxShadow: `0 0 5px ${LIGHT_GLOW_COLOR}50`
                                                    }}
                                                >
                                                    Editar Actividad
                                                </button>
                                                <button
                                                    onClick={() => handleToggleMesPagado(usuario, estaPagadoEsteMes)}
                                                    className={`px-4 py-2 font-medium rounded-md shadow-sm transition duration-200 text-sm`}
                                                    style={paymentButtonStyles}
                                                >
                                                    {estaPagadoEsteMes ? 'Desmarcar Mes' : 'Marcar Mes Pagado'}
                                                </button>
                                                <button
                                                    onClick={() => handleEliminarProducto(usuario.id)}
                                                    className="px-4 py-2 font-medium rounded-md shadow-sm transition duration-200 text-sm"
                                                    style={{ 
                                                        backgroundColor: BACKGROUND_GRADIENT_END,
                                                        color: TEXT_COLOR_WHITE,
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
                                <li className="text-center py-6" style={{ color: BORDER_HIGHLIGHT_COLOR }}>No hay usuarios que coincidan con la búsqueda o el filtro.</li>
                            )}
                        </ul>
                        {productoAEditar && <EditarActividadModal producto={productoAEditar} onGuardarCambios={handleEditarActividad} setProductoAEditar={setProductoAEditar} opcionesActividad={opcionesActividad} />}
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

            </div>
        </div>
    );
};

export default Admin;