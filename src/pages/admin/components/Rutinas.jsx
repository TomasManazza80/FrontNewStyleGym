import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://newstylegym-back.onrender.com';

// Dropset Style Constants (overriding parent context for this component as per strict visual rules)
const BACKGROUND_GRADIENT_START = '#0A0A0A'; // Main background
const BACKGROUND_GRADIENT_END = '#1C1C1E';   // Card background
const TEXT_COLOR_WHITE = '#FFFFFF';         // Primary text
const TEXT_COLOR_SECONDARY = '#8E8E93';     // Secondary text
const BORDER_COLOR = '#2C2C2E';             // Border color
const TEXT_COLOR_ACCENT = '#FFFFFF';        // Accent color (white as per "no vibrant colors")

const IconPlus = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>;
const IconTrash = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const IconClose = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
const IconDownload = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>;
const IconCheck = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>;

const RutinasSection = ({ allUsers = [] }) => {
    const [routines, setRoutines] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState(null);
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        ejercicios: [{ ejercicio: '', series: '', repeticiones: '', peso: '', tiempo: '', descanso: '' }]
    });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/routines`);
            setRoutines(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            // Silenciado
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEjercicioChange = (index, field, value) => {
        const newEjercicios = [...form.ejercicios];
        newEjercicios[index] = { ...newEjercicios[index], [field]: value };
        setForm(prev => ({ ...prev, ejercicios: newEjercicios }));
    };

    const handleAddEjercicio = () => {
        setForm(prev => ({
            ...prev,
            ejercicios: [...prev.ejercicios, { ejercicio: '', series: '', repeticiones: '', peso: '', tiempo: '', descanso: '' }]
        }));
    };

    const handleDeleteEjercicio = (index) => {
        if (form.ejercicios.length > 1) {
            const newEjercicios = form.ejercicios.filter((_, i) => i !== index);
            setForm(prev => ({ ...prev, ejercicios: newEjercicios }));
        }
    };

    const handleSubmitRoutine = async (e) => {
        e.preventDefault();

        if (selectedUsers.length === 0) {
            setError('Por favor, selecciona al menos un usuario.');
            setTimeout(() => setError(''), 3000);
            return;
        }

        const validEjercicios = form.ejercicios.filter(ej => ej.ejercicio && ej.ejercicio.trim() !== '');
        if (validEjercicios.length === 0) {
            setError('Agrega al menos un ejercicio con nombre.');
            setTimeout(() => setError(''), 3000);
            return;
        }

        const payload = {
            nombre: form.nombre,
            descripcion: form.descripcion,
            ejercicios: validEjercicios
        };

        try {
            // Bulk assignment logic
            await Promise.all(selectedUsers.map(userId => 
                axios.post(`${API_URL}/api/routines/${userId}`, payload)
            ));

            setMensaje(selectedUsers.length > 1 
                ? `Rutina asignada correctamente a ${selectedUsers.length} socios` 
                : 'Rutina guardada correctamente');
            
            fetchRoutines();
            resetForm();
            setTimeout(() => setMensaje(''), 3000);
        } catch (e) {
            console.error('Error al guardar:', e);
            const errorMsg = e.response?.data?.message || e.response?.data?.details || 'Error al guardar la rutina.';
            setError(errorMsg);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleEditRoutine = (routine) => {
        setEditingRoutine(routine);
        setSelectedUsers([routine.userId]);
        setForm({
            nombre: routine.nombre || '',
            descripcion: routine.descripcion || '',
            ejercicios: routine.ejercicios?.length > 0
                ? routine.ejercicios
                : [{ ejercicio: '', series: '', repeticiones: '', peso: '', tiempo: '', descanso: '' }]
        });
        setModalOpen(true);
    };

    const handleDeleteRoutine = async (userId) => {
        if (!confirm('¿Eliminar esta rutina?')) return;
        try {
            await axios.delete(`${API_URL}/api/routines/${userId}`);
            setMensaje('Rutina eliminada correctamente');
            fetchRoutines();
            setTimeout(() => setMensaje(''), 3000);
        } catch (e) {
            setError('Error al eliminar la rutina.');
            setTimeout(() => setError(''), 3000);
        }
    };

    const resetForm = () => {
        setForm({ nombre: '', descripcion: '', ejercicios: [{ ejercicio: '', series: '', repeticiones: '', peso: '', tiempo: '', descanso: '' }] });
        setEditingRoutine(null);
        setModalOpen(false);
        setSelectedUsers([]);
        setUserSearch('');
    };

    const regularUsers = allUsers.filter(u => u.role === 'user');
    const filteredUsers = regularUsers.filter(u => {
        const name = (u.name || u.nombre || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const search = userSearch.toLowerCase();
        return name.includes(search) || email.includes(search);
    });
    const selectedUsersData = regularUsers.filter(u => selectedUsers.includes(u.id));

    const sampleRoutines = [
        {
            nombre: 'Hipertrofia - Tren Inferior',
            descripcion: 'Rutina enfocada en el desarrollo de masa muscular del tren inferior',
            ejercicios: [
                { ejercicio: 'Sentadilla con barra', series: '4', repeticiones: '8-10', peso: '60-80', tiempo: '', descanso: '90s' },
                { ejercicio: 'Prensa de piernas', series: '4', repeticiones: '10-12', peso: '80-100', tiempo: '', descanso: '90s' },
                { ejercicio: 'Zancadas caminando', series: '3', repeticiones: '12 cada pierna', peso: '20-30', tiempo: '', descanso: '60s' },
                { ejercicio: 'Curl femoral', series: '3', repeticiones: '12-15', peso: '30-40', tiempo: '', descanso: '60s' },
                { ejercicio: 'Extensión cuádriceps', series: '3', repeticiones: '15-20', peso: '40-50', tiempo: '', descanso: '60s' },
                { ejercicio: 'Pantorrillas de pie', series: '4', repeticiones: '15-20', peso: '40-50', tiempo: '', descanso: '45s' },
            ]
        },
        {
            nombre: 'Hipertrofia - Tren Superior',
            descripcion: 'Rutina enfocada en el desarrollo de masa muscular del tren superior',
            ejercicios: [
                { ejercicio: 'Press de banca', series: '4', repeticiones: '8-10', peso: '50-70', tiempo: '', descanso: '90s' },
                { ejercicio: 'Press inclinado con mancuernas', series: '4', repeticiones: '10-12', peso: '20-30', tiempo: '', descanso: '90s' },
                { ejercicio: 'Jalón al pecho', series: '4', repeticiones: '10-12', peso: '50-70', tiempo: '', descanso: '60s' },
                { ejercicio: 'Remo con barra', series: '4', repeticiones: '8-10', peso: '40-60', tiempo: '', descanso: '90s' },
                { ejercicio: 'Press militar', series: '3', repeticiones: '8-10', peso: '30-45', tiempo: '', descanso: '90s' },
                { ejercicio: 'Curl bíceps con barra', series: '3', repeticiones: '12-15', peso: '20-25', tiempo: '', descanso: '60s' },
                { ejercicio: 'Extensión tríceps polea', series: '3', repeticiones: '12-15', peso: '20-30', tiempo: '', descanso: '60s' },
            ]
        },
        {
            nombre: 'Full Body',
            descripcion: 'Rutina completa para trabajar todo el cuerpo en una sesión',
            ejercicios: [
                { ejercicio: 'Sentadilla con barra', series: '3', repeticiones: '10-12', peso: '50-70', tiempo: '', descanso: '90s' },
                { ejercicio: 'Press de banca', series: '3', repeticiones: '10-12', peso: '40-60', tiempo: '', descanso: '90s' },
                { ejercicio: 'Remo con mancuerna', series: '3', repeticiones: '10 cada brazo', peso: '15-20', tiempo: '', descanso: '60s' },
                { ejercicio: 'Zancadas', series: '3', repeticiones: '10 cada pierna', peso: '15-20', tiempo: '', descanso: '60s' },
                { ejercicio: 'Jalón al pecho', series: '3', repeticiones: '12-15', peso: '40-60', tiempo: '', descanso: '60s' },
                { ejercicio: 'Elevaciones laterales', series: '3', repeticiones: '15-20', peso: '5-8', tiempo: '', descanso: '45s' },
                { ejercicio: 'Crunch en polea', series: '3', repeticiones: '15-20', peso: '20-30', tiempo: '', descanso: '45s' },
            ]
        }
    ];

    const loadSampleRoutines = async () => {
        if (regularUsers.length === 0) {
            setError('No hay usuarios disponibles para asignar rutinas.');
            setTimeout(() => setError(''), 3000);
            return;
        }

        const userId = regularUsers[0].id;
        let loadedCount = 0;
        let lastError = null;

        for (const routine of sampleRoutines) {
            try {
                await axios.post(`${API_URL}/api/routines/${userId}`, routine);
                loadedCount++;
            } catch (e) {
                console.error('Error al cargar rutina de ejemplo:', e);
                lastError = e.response?.data?.message || e.response?.data?.details || e.message;
            }
        }

        if (loadedCount > 0) {
            setMensaje(`${loadedCount} rutinas de ejemplo cargadas correctamente`);
            fetchRoutines();
            setTimeout(() => setMensaje(''), 5000);
        } else if (lastError) {
            setError(`Error al cargar ejemplos: ${lastError}`);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="p-0 md:p-4 font-sans antialiased text-white animate-fadeIn" style={{ backgroundColor: BACKGROUND_GRADIENT_START }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-4xl font-extrabold tracking-tighter" style={{ color: TEXT_COLOR_WHITE }}>
                    Rutinas
                </h2>

                <div className="flex gap-3">
                    <button
                        onClick={() => { resetForm(); setModalOpen(true); }}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all active:scale-95 shadow-lg"
                        style={{ backgroundColor: TEXT_COLOR_WHITE, color: BACKGROUND_GRADIENT_START }}
                    >
                        <IconPlus className="w-5 h-5" />
                        Nueva
                    </button>
                    <button
                        onClick={loadSampleRoutines}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all active:scale-95 border"
                        style={{ backgroundColor: 'transparent', color: TEXT_COLOR_WHITE, borderColor: BORDER_COLOR }}
                    >
                        <IconDownload className="w-5 h-5" />
                        Muestras
                    </button>
                </div>
            </div>

            {mensaje && <AlertMsg msg={mensaje} type="success" />}
            {error && <AlertMsg msg={error} type="error" />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-slideUp">
                {routines.length > 0 ? (
                    routines.map(routine => {
                        const user = allUsers.find(u => u.id === routine.userId);
                        return (
                            <div key={routine.id}
                                className="p-6 rounded-[28px] border transition-all active:scale-[0.98] hover:border-white/20 shadow-2xl flex flex-col h-full"
                                style={{ backgroundColor: BACKGROUND_GRADIENT_END, borderColor: BORDER_COLOR }}>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black tracking-tighter leading-none mb-2" style={{ color: TEXT_COLOR_WHITE }}>
                                            {routine.nombre || 'Rutina sin nombre'}
                                        </h3>
                                        <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: TEXT_COLOR_SECONDARY }}>
                                            {user?.name || user?.nombre || 'Usuario'}
                                        </span>
                                    </div>
                                    {/* Minimalist Progress Icon Simulation */}
                                    <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center relative">
                                        <span className="text-[10px] font-bold">{routine.ejercicios?.length || 0}</span>
                                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="2" strokeDasharray="100" strokeDashoffset="40" className="opacity-40" />
                                        </svg>
                                    </div>
                                </div>

                                <p className="text-sm font-medium mb-6 line-clamp-2" style={{ color: TEXT_COLOR_SECONDARY }}>
                                    {routine.descripcion || 'Sin descripción adicional.'}
                                </p>

                                <div className="space-y-3 mb-8 flex-grow">
                                    {(routine.ejercicios || []).slice(0, 3).map((ej, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                            <span className="text-xs font-bold text-white/90 truncate mr-4">{ej.ejercicio || ej.nombre}</span>
                                            <div className="flex gap-2 shrink-0">
                                                <span className="text-[10px] font-black bg-white/5 px-2 py-1 rounded-md">
                                                    {ej.series}X{ej.repeticiones}
                                                </span>
                                                {ej.peso && <span className="text-[10px] font-black bg-white px-2 py-1 rounded-md text-black">{ej.peso}KG</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => handleEditRoutine(routine)}
                                        className="flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                                        style={{ backgroundColor: TEXT_COLOR_ACCENT, color: BACKGROUND_GRADIENT_START }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRoutine(routine.id)}
                                        className="p-3 rounded-xl transition-all active:scale-90"
                                        style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', color: '#FF4444' }}
                                    >
                                        <IconTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center py-20 col-span-full text-white/40 italic font-medium">No hay rutinas configuradas.</p>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl flex justify-center items-end md:items-center z-50 p-0 md:p-4 animate-fadeIn">
                    <div className="w-full max-w-5xl h-[95vh] md:h-auto md:max-h-[90vh] overflow-hidden flex flex-col rounded-t-[40px] md:rounded-[40px] border shadow-2xl animate-slideUp"
                        style={{ backgroundColor: BACKGROUND_GRADIENT_START, borderColor: BORDER_COLOR }}>

                        <div className="flex items-center justify-between p-8 border-b" style={{ borderColor: BORDER_COLOR }}>
                            <h3 className="text-3xl font-black tracking-tighter" style={{ color: TEXT_COLOR_WHITE }}>
                                {editingRoutine ? 'Editar Rutina' : 'Nueva'}
                            </h3>
                            <button onClick={resetForm} className="p-3 rounded-full transition-all active:scale-90" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <IconClose className="w-6 h-6" style={{ color: TEXT_COLOR_WHITE }} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitRoutine} className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-grow">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1" style={{ color: TEXT_COLOR_SECONDARY }}>ASIGNAR A SOCIOS ({selectedUsers.length})</label>
                                    <input
                                        type="text"
                                        value={userSearch}
                                        onChange={(e) => { setUserSearch(e.target.value); }}
                                        placeholder="Buscar por nombre o email..."
                                        className="w-full p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold mb-4"
                                        style={{ backgroundColor: BACKGROUND_GRADIENT_END, color: TEXT_COLOR_WHITE, border: `1px solid ${BORDER_COLOR}` }}
                                    />
                                    
                                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                                        {selectedUsersData.map(u => (
                                            <div key={u.id} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 animate-scaleIn">
                                                <span className="text-xs font-bold">{u.name || u.nombre}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setSelectedUsers(prev => prev.filter(id => id !== u.id))}
                                                    className="text-[#FF4444] hover:scale-110 transition-all"
                                                >
                                                    <IconClose className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {selectedUsers.length === 0 && (
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-2 ml-2">Ningún socio seleccionado</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1" style={{ color: TEXT_COLOR_SECONDARY }}>
                                        RESULTADOS DE BÚSQUEDA
                                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-white/10" style={{ color: TEXT_COLOR_WHITE }}>
                                            {filteredUsers.length}
                                        </span>
                                    </label>
                                    <div className="rounded-2xl border max-h-48 overflow-y-auto custom-scrollbar" style={{ backgroundColor: BACKGROUND_GRADIENT_END, borderColor: BORDER_COLOR }}>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map(u => {
                                                const isSelected = selectedUsers.includes(u.id);
                                                return (
                                                    <button
                                                        key={u.id}
                                                        type="button"
                                                        onClick={() => { 
                                                            if (!isSelected) {
                                                                setSelectedUsers(prev => [...prev, u.id]);
                                                                setUserSearch('');
                                                            } else {
                                                                setSelectedUsers(prev => prev.filter(id => id !== u.id));
                                                            }
                                                        }}
                                                        className={`w-full text-left px-5 py-4 transition-all border-b last:border-b-0 flex items-center justify-between group
                                                            ${isSelected ? 'bg-white text-black' : 'hover:bg-white/5'}
                                                        `}
                                                        style={{ borderColor: BORDER_COLOR }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div>
                                                                <span className="font-bold text-sm">{u.name || u.nombre}</span>
                                                                <span className={`text-[10px] ml-2 font-medium ${isSelected ? 'text-black/60' : 'text-white/40'}`}>{u.email}</span>
                                                            </div>
                                                        </div>
                                                        {isSelected ? (
                                                            <IconCheck className="w-4 h-4 text-black" />
                                                        ) : (
                                                            routines.find(r => r.userId === u.id) && (
                                                                <span className="text-[8px] font-black uppercase tracking-tighter bg-white/20 px-2 py-0.5 rounded text-white">Rutina Activa</span>
                                                            )
                                                        )}
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            <div className="px-5 py-8 text-center text-[10px] font-bold uppercase tracking-widest opacity-30">
                                                Sin resultados
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1" style={{ color: TEXT_COLOR_SECONDARY }}>NOMBRE RUTINA</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        placeholder="Push Day, Hipertrofia..."
                                        className="w-full p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold"
                                        style={{ backgroundColor: BACKGROUND_GRADIENT_END, color: TEXT_COLOR_WHITE, border: `1px solid ${BORDER_COLOR}` }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1" style={{ color: TEXT_COLOR_SECONDARY }}>DESCRIPCIÓN</label>
                                    <input
                                        type="text"
                                        name="descripcion"
                                        value={form.descripcion}
                                        onChange={handleChange}
                                        placeholder="Notas adicionales..."
                                        className="w-full p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold"
                                        style={{ backgroundColor: BACKGROUND_GRADIENT_END, color: TEXT_COLOR_WHITE, border: `1px solid ${BORDER_COLOR}` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-6 ml-1" style={{ color: TEXT_COLOR_SECONDARY }}>LISTA DE EJERCICIOS</label>

                                <div className="space-y-4">
                                    {form.ejercicios.map((ejercicio, index) => (
                                        <div key={index} className="p-6 rounded-[28px] border animate-fadeInUp" style={{ backgroundColor: BACKGROUND_GRADIENT_END, borderColor: BORDER_COLOR }}>
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-[10px] font-black bg-white text-black px-3 py-1 rounded-full"># {index + 1}</span>
                                                <button type="button" onClick={() => handleDeleteEjercicio(index)} className="text-[#FF4444] p-1 active:scale-90 transition-all">
                                                    <IconTrash className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                                                <div className="md:col-span-2">
                                                    <input
                                                        type="text"
                                                        value={ejercicio.ejercicio}
                                                        onChange={(e) => handleEjercicioChange(index, 'ejercicio', e.target.value)}
                                                        placeholder="Nombre Ejercicio"
                                                        className="w-full bg-black/40 p-4 rounded-xl border-0 focus:ring-2 focus:ring-white/20 font-bold placeholder:opacity-30"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={ejercicio.series}
                                                        onChange={(e) => handleEjercicioChange(index, 'series', e.target.value)}
                                                        placeholder="Sets"
                                                        className="w-full bg-black/40 p-4 rounded-xl border-0 text-center font-black focus:ring-2 focus:ring-white/20"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={ejercicio.repeticiones}
                                                        onChange={(e) => handleEjercicioChange(index, 'repeticiones', e.target.value)}
                                                        placeholder="Reps"
                                                        className="w-full bg-black/40 p-4 rounded-xl border-0 text-center font-black focus:ring-2 focus:ring-white/20"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={ejercicio.peso}
                                                        onChange={(e) => handleEjercicioChange(index, 'peso', e.target.value)}
                                                        placeholder="KG"
                                                        className="w-full bg-black/40 p-4 rounded-xl border-0 text-center font-black focus:ring-2 focus:ring-white/20"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={ejercicio.descanso}
                                                        onChange={(e) => handleEjercicioChange(index, 'descanso', e.target.value)}
                                                        placeholder="Rest"
                                                        className="w-full bg-black/40 p-4 rounded-xl border-0 text-center font-black focus:ring-2 focus:ring-white/20"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddEjercicio}
                                    className="mt-6 flex items-center justify-center gap-2 w-full py-5 rounded-[20px] font-black uppercase tracking-widest transition-all active:scale-[0.98] border"
                                    style={{ backgroundColor: 'transparent', color: TEXT_COLOR_WHITE, borderStyle: 'dashed', borderColor: BORDER_COLOR }}
                                >
                                    <IconPlus className="w-5 h-5" />
                                    Añadir Ejercicio
                                </button>
                            </div>

                            <div className="flex flex-col gap-3 pt-12">
                                <button
                                    type="submit"
                                    className="w-full py-6 rounded-[28px] font-black text-xl tracking-tight transition-all active:scale-[0.98] shadow-2xl"
                                    style={{ backgroundColor: TEXT_COLOR_WHITE, color: BACKGROUND_GRADIENT_START }}
                                >
                                    {editingRoutine ? 'Guardar Cambios' : 'Confirmar Rutina'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="w-full py-4 rounded-[28px] font-bold text-white/40"
                                >
                                    Descartar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const AlertMsg = ({ msg, type }) => {
    const isSuccess = type === 'success';
    return (
        <div className="mb-8 p-5 rounded-[24px] backdrop-blur-3xl border animate-slideDown flex items-center justify-center text-center"
            style={{
                backgroundColor: isSuccess ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderColor: isSuccess ? '#22c55e' : '#ef4444', // Keep these specific colors for success/error
                color: TEXT_COLOR_WHITE
            }}>
            <p className="text-sm font-black tracking-tight">{msg}</p>
        </div>
    );
};

export default RutinasSection;
