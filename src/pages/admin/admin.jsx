import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Asegúrate de que Tailwind CSS esté configurado en tu proyecto
// npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p
// Configura tu tailwind.config.js para escanear tus archivos de componentes.
// Agrega los estilos base de Tailwind a tu index.css o app.css:
/*
@tailwind base;
@tailwind components;
@tailwind utilities;
*/

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'; // Fallback por si no está la variable de entorno

const Admin = () => {
  const getCurrentMonthName = () => {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[new Date().getMonth()];
  };

  // Estados para usuarios
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [todosMisProductos, setTodosMisProductos] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState('Usuarios');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para precios de actividades
  const [preciosActividades, setPreciosActividades] = useState({
    unaActividad: 0,
    paseLibre: 0,
    estudiante3dias: 0
  });

  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  // Se mantiene mostrarErrorPrecios, pero su lógica de setting por tiempo se elimina.
  // Podría ser útil si en el futuro se quiere mostrar un error solo si la API no carga NADA.
  const [mostrarErrorPrecios, setMostrarErrorPrecios] = useState(false); 

  // Opciones de actividad permitidas
  const opcionesActividad = [
    "1 actividad",
    "pase libre",
    "Estudiante"
  ];

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAllUsers`);
        const usuarios = response.data;
        setTodosMisProductos(usuarios.map(usuario => ({
          id: usuario.id,
          nombre: usuario.name,
          numero: usuario.number,
          email: usuario.email,
          role: usuario.role,
          meses: usuario.meses || [], // Asegurarse que meses es un array
          actividad: usuario.actividad,
          fechaCreacion: new Date(usuario.createdAt).toLocaleDateString(),
          fechaActualizacion: new Date(usuario.updatedAt).toLocaleDateString()
        })));
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        setMensajeError('Error al cargar los usuarios.');
        setTimeout(() => setMensajeError(''), 3000);
      }
    };

    const obtenerPreciosActividades = async () => {
      let preciosCargados = false;
      try {
        const response = await axios.get(`${API_URL}/api/activity-prices`);
        if (response.data) {
          setPreciosActividades({
            unaActividad: response.data.unaActividad,
            paseLibre: response.data.paseLibre,
            estudiante3dias: response.data.estudiante3dias
          });
          preciosCargados = true;
        }
      } catch (error) {
        console.error('Error al obtener precios de actividades:', error);
        // Puedes agregar aquí un mensaje de error inmediato si quieres,
        // pero el requisito era quitar el que aparecía después de 5 segundos.
        // setMensajeError('Error al cargar los precios de actividades.');
        // setTimeout(() => setMensajeError(''), 3000);
      } finally {
        // *** ESTE BLOQUE HA SIDO COMENTADO/ELIMINADO PARA QUITAR EL MENSAJE DE ADVERTENCIA ESPECÍFICO ***
        // if (!preciosCargados) {
        //   const timer = setTimeout(() => {
        //     setMostrarErrorPrecios(true);
        //     setMensajeError('Error al cargar los precios de actividades.');
        //   }, 5000); // Muestra el error después de 5 segundos
        //   return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta o el efecto se ejecuta de nuevo
        // } else {
        //   setMostrarErrorPrecios(false); // Si se cargan, asegúrate de que el error no se muestre
        //   setMensajeError(''); // Limpia el mensaje de error general si este era el único error
        // }
        // Si los precios se cargaron, asegúrate de resetear el estado de error de precios
        if (preciosCargados) {
          setMostrarErrorPrecios(false);
        }
      }
    };

    obtenerUsuarios();
    obtenerPreciosActividades();
  }, []);

  const filteredUsers = (users) => {
    return users.filter(usuario =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.actividad.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleEliminarProducto = async (userId) => {
    try {
      await axios.delete(`${API_URL}/deleteUser/${userId}`);
      setTodosMisProductos(todosMisProductos.filter((usuario) => usuario.id !== userId));
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

      setTodosMisProductos(todosMisProductos.map(usuario =>
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
      const mesActual = getCurrentMonthName();
      await axios.post(`${API_URL}/addMount`, {
        userId,
        month: mesActual
      });

      setTodosMisProductos(todosMisProductos.map(usuario => {
        if (usuario.id === userId) {
          const updatedMeses = usuario.meses.includes(mesActual) ? usuario.meses : [...usuario.meses, mesActual];
          return {
            ...usuario,
            meses: updatedMeses
          };
        }
        return usuario;
      }));

      setMensajeExito('Mes marcado como pagado correctamente.');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (error) {
      console.error('Error al marcar el mes como pagado:', error);
      setMensajeError('Error al marcar el mes como pagado. Puede que ya esté marcado.');
      setTimeout(() => setMensajeError(''), 3000);
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

  // --- Componente auxiliar para el modal de edición ---
  const EditarActividad = ({ producto, onGuardarCambios }) => {
    const [actividad, setActividad] = useState(producto.actividad);

    const handleGuardarCambios = () => {
      onGuardarCambios(producto.id, actividad);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-blue-600">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">Editar Actividad</h3>
          <div className="space-y-5">
            <div>
              <label htmlFor="activity-select" className="block text-sm font-medium text-gray-300 mb-2">Actividad</label>
              <select
                id="activity-select"
                value={actividad}
                onChange={(e) => setActividad(e.target.value)}
                className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-200"
              >
                {opcionesActividad.map((opcion, index) => (
                  <option key={index} value={opcion} className="bg-gray-700 text-white">
                    {opcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={handleGuardarCambios}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => setProductoAEditar(null)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-gray-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-400 mb-12 drop-shadow-lg">
          Dashboard de Administrador
        </h1>

        {mensajeExito && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg shadow-lg flex items-center justify-between animate-fadeInUp">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{mensajeExito}</span>
            </div>
            <button onClick={() => setMensajeExito('')} className="text-white hover:text-gray-200 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        {/* El bloque que mostraba el error de precios después de 5 segundos ha sido eliminado.
            Este condicional solo se activaría si en alguna otra parte del código
            se setea mostrarErrorPrecios a true y mensajeError a 'Error al cargar los precios de actividades.'.
            Actualmente, con los cambios en useEffect, esto no debería ocurrir automáticamente.
        */}
        {mostrarErrorPrecios && mensajeError === 'Error al cargar los precios de actividades.' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-lg flex items-center justify-between animate-fadeInUp">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{mensajeError}</span>
            </div>
            <button onClick={() => {setMensajeError(''); setMostrarErrorPrecios(false);}} className="text-white hover:text-gray-200 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}


        {/* Mensaje de error general, si no es el de precios (o si lo fuera y no se activa el mostrarErrorPrecios) */}
        {mensajeError && mensajeError !== 'Error al cargar los precios de actividades.' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-lg flex items-center justify-between animate-fadeInUp">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{mensajeError}</span>
            </div>
            <button onClick={() => setMensajeError('')} className="text-white hover:text-gray-200 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}


        <nav className="mb-10 flex flex-wrap justify-center gap-3">
          {['Usuarios', 'Abonados', 'No Abonados', 'Precios Actividades'].map((section, idx) => (
            <button
              key={idx}
              className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out shadow-md
                ${seccionActiva === section
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white scale-105 transform'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              onClick={() => {
                setSeccionActiva(section);
                setSearchTerm(''); // Limpiar búsqueda al cambiar de sección
              }}
            >
              {section}
            </button>
          ))}
        </nav>

        {(seccionActiva === 'Usuarios' || seccionActiva === 'Abonados' || seccionActiva === 'No Abonados') && (
          <section className="mb-10 bg-[#282A36] p-8 rounded-xl shadow-xl border border-[#3E404C]">
            <h2 className="text-3xl font-semibold text-blue-300 mb-6 text-center">
              {seccionActiva === 'Usuarios' && 'Gestión de Usuarios'}
              {seccionActiva === 'Abonados' && `Usuarios Abonados (Mes Actual: ${getCurrentMonthName()})`}
              {seccionActiva === 'No Abonados' && `Usuarios No Abonados (Mes Actual: ${getCurrentMonthName()})`}
            </h2>
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Buscar por nombre o actividad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-12 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <ul className="space-y-4">
              {filteredUsers(todosMisProductos.filter(usuario => {
                const ultimoMesPagado = usuario.meses.length > 0 ? usuario.meses[usuario.meses.length - 1] : null;
                if (seccionActiva === 'Abonados') {
                  return ultimoMesPagado === getCurrentMonthName();
                } else if (seccionActiva === 'No Abonados') {
                  return ultimoMesPagado !== getCurrentMonthName();
                }
                return true; // Para la sección 'Usuarios'
              })).map((usuario) => (
                <li key={usuario.id} className="bg-[#1E1E2F] p-5 rounded-lg shadow-lg border border-[#3E404C] flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 md:space-x-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
                  <div className="flex flex-col flex-grow">
                    <span className="font-bold text-xl text-white">{usuario.nombre}</span>
                    <span className="text-gray-400 text-sm">Email: {usuario.email}</span>
                    <span className="text-gray-400 text-sm">Teléfono: {usuario.numero}</span>
                    <span className="text-blue-300 text-md mt-1">Actividad: <span className="font-semibold">{usuario.actividad}</span></span>
                    <span className="text-gray-500 text-xs italic">Último mes pagado: {usuario.meses.length > 0 ? usuario.meses[usuario.meses.length - 1] : 'No registrado'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => setProductoAEditar(usuario)}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-md shadow-sm hover:from-yellow-600 hover:to-orange-600 transition duration-200 text-sm"
                    >
                      Editar Actividad
                    </button>
                    <button
                      onClick={() => marcarMesPagado(usuario.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-medium rounded-md shadow-sm hover:from-green-600 hover:to-green-800 transition duration-200 text-sm"
                    >
                      Marcar Mes Pagado
                    </button>
                    <button
                      onClick={() => handleEliminarProducto(usuario.id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-medium rounded-md shadow-sm hover:from-red-600 hover:to-red-800 transition duration-200 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
              {filteredUsers(todosMisProductos.filter(usuario => {
                const ultimoMesPagado = usuario.meses.length > 0 ? usuario.meses[usuario.meses.length - 1] : null;
                if (seccionActiva === 'Abonados') {
                  return ultimoMesPagado === getCurrentMonthName();
                } else if (seccionActiva === 'No Abonados') {
                  return ultimoMesPagado !== getCurrentMonthName();
                }
                return true;
              })).length === 0 && (
                <li className="text-center text-gray-500 py-6">No hay usuarios que coincidan con la búsqueda o el filtro.</li>
              )}
            </ul>
            {productoAEditar && <EditarActividad producto={productoAEditar} onGuardarCambios={handleEditarActividad} />}
          </section>
        )}

        {seccionActiva === 'Precios Actividades' && (
          <section className="mb-10 bg-[#282A36] p-8 rounded-xl shadow-xl border border-[#3E404C]">
            <h2 className="text-3xl font-semibold text-blue-300 mb-6 text-center">Gestión de Precios de Actividades</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label htmlFor="unaActividad" className="block text-md font-medium text-gray-300 mb-2">Precio - Una Actividad</label>
                <input
                  type="number"
                  id="unaActividad"
                  name="unaActividad"
                  value={preciosActividades.unaActividad}
                  onChange={handleChangePrecio}
                  className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  step="0.01"
                  placeholder="Ej: 30.00"
                />
              </div>
              <div>
                <label htmlFor="paseLibre" className="block text-md font-medium text-gray-300 mb-2">Precio - Pase Libre</label>
                <input
                  type="number"
                  id="paseLibre"
                  name="paseLibre"
                  value={preciosActividades.paseLibre}
                  onChange={handleChangePrecio}
                  className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  step="0.01"
                  placeholder="Ej: 50.00"
                />
              </div>
              <div>
                <label htmlFor="estudiante3dias" className="block text-md font-medium text-gray-300 mb-2">Precio - Estudiante</label>
                <input
                  type="number"
                  id="estudiante3dias"
                  name="estudiante3dias"
                  value={preciosActividades.estudiante3dias}
                  onChange={handleChangePrecio}
                  className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  step="0.01"
                  placeholder="Ej: 25.00"
                />
              </div>
            </div>

            <button
              onClick={guardarPreciosActividades}
              className="mt-6 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Guardar Precios
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default Admin;