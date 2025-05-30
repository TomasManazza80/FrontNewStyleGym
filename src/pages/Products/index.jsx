import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react'; // Añadimos Loader2 para el spinner
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

// Componente Skeleton Loader para mejorar la UX durante la carga
const SkeletonLoader = () => (
  <div className="animate-pulse bg-gray-700 p-6 rounded-2xl shadow-xl max-w-xl mx-auto mt-[150px] space-y-6">
    <div className="h-8 bg-gray-600 rounded-lg w-3/4 mx-auto mb-6"></div> {/* Título */}
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
      <div className="h-6 bg-gray-600 rounded-md w-1/2 mx-auto"></div> {/* Mes Actual */}
      <div className="h-4 bg-gray-600 rounded-md w-1/3 mx-auto"></div> {/* Actividad */}
      <div className="h-4 bg-gray-600 rounded-md w-1/4 mx-auto"></div> {/* Precio */}
      <div className="h-10 bg-blue-600 rounded-xl w-2/3 mx-auto"></div> {/* Botón */}
      <div className="h-px bg-gray-700 w-full"></div> {/* Divisor */}
      <div className="h-6 bg-gray-600 rounded-md w-1/2 mx-auto"></div> {/* Historial de Pagos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => ( // Placeholder para algunos meses
          <div key={i} className="h-16 bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);


const Products = () => {
  const [mesesPagados, setMesesPagados] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Estado inicial de carga
  const [paymentProcessing, setPaymentProcessing] = useState(false); // Estado para el botón de pago
  const [mesActual, setMesActual] = useState('');
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
      setLoading(true); // Iniciar carga
      setError(''); // Limpiar errores previos
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay token de autenticación. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        // 1. Obtener precios de actividades
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

        // 2. Obtener información del usuario (ID y actividad)
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

        // 3. Calcular precio según la actividad del usuario
        let price = 0;
        if (activity === '1 actividad') {
          price = pricesData.unaActividad;
        } else if (activity === 'pase libre') {
          price = pricesData.paseLibre;
        } else if (activity === 'Estudiante') {
          price = pricesData.estudiante3dias;
        } else {
          console.warn('Actividad no reconocida para el cálculo de precio:', activity);
          setError(`Actividad no reconocida: "${activity}". No se puede determinar el precio.`);
          price = 0; // Asegurarse de que el precio sea 0 si la actividad no es reconocida
        }
        setActivityPrice(parseFloat(price));

        // 4. Obtener meses pagados
        const mesesResponse = await axios.get(`${API_URL}/getMounts/${fetchedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMesesPagados(mesesResponse.data.meses || []);

      } catch (err) {
        console.error('Error al cargar datos:', err);
        if (err.response) {
          if (err.response.status === 404) {
            setError('Usuario o datos no encontrados. Verifique la información.');
          } else if (err.response.status === 401) {
            setError('Sesión expirada o no autorizada. Por favor, vuelve a iniciar sesión.');
          } else {
            setError(`Error del servidor: ${err.response.status} - ${err.response.data?.message || err.message}`);
          }
        } else if (err.request) {
          setError('Error de red. Asegúrese que el servidor esté funcionando y su conexión a internet.');
        } else {
          setError(`Error: ${err.message || 'Error desconocido al cargar datos.'}`);
        }
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchData();
  }, []); // El array de dependencias vacío asegura que se ejecute solo una vez al montar

  const handlePagar = async () => {
    setPaymentProcessing(true); // Iniciar procesamiento de pago
    setError(''); // Limpiar errores previos

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Debes iniciar sesión para realizar el pago.');
      }

      if (activityPrice === null || activityPrice <= 0) { // Validar que el precio sea válido
        throw new Error(`No se puede procesar el pago. Precio no válido para la actividad: "${userActivity}".`);
      }

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

      if (paymentUrl) {
        window.location.href = paymentUrl; // Redirigir al usuario para el pago
      } else {
        throw new Error('No se recibió un enlace de pago válido. Por favor, intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      if (err.message.includes('Actividad no válida') || err.message.includes('Precio no válido')) {
        setError(err.message);
      } else if (err.response) {
        setError(`Error en el pago: ${err.response.data?.message || err.message}`);
      } else {
        setError(`Error inesperado: ${err.message || 'Intenta de nuevo.'}`);
      }
    } finally {
      setPaymentProcessing(false); // Finalizar procesamiento de pago
    }
  };

  const mesPagado = mesesPagados.includes(mesActual);

  if (loading) {
    return <SkeletonLoader />; // Mostrar el skeleton loader mientras carga
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-2xl w-full border border-gray-700 transform hover:scale-102 transition-all duration-300 ease-in-out">
        <h2 className="text-4xl font-extrabold text-center text-blue-400 mb-8 tracking-wide">
          Estado de tu Membresía
        </h2>

        {/* Sección de Estado del Mes Actual */}
        <div className="bg-gray-700 rounded-2xl shadow-xl p-6 mb-8 border border-gray-600">
          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-gray-200 mb-2">Mes Actual</p>
            <h3 className="text-4xl font-extrabold text-indigo-400 mb-4">{mesActual}</h3>

            {userActivity && (
              <div className="mt-4 space-y-1">
                <p className="text-lg text-gray-300">
                  <span className="font-semibold text-blue-300">Actividad:</span> {userActivity}
                </p>
                <p className="text-lg text-gray-300">
                  <span className="font-semibold text-blue-300">Precio:</span> ${activityPrice?.toLocaleString('es-AR') || 'N/A'}
                </p>
              </div>
            )}

            <div className="mt-6">
              {mesPagado ? (
                <div className="inline-flex items-center text-green-400 bg-green-900/40 px-6 py-3 rounded-full text-lg font-bold shadow-md animate-pulse-once">
                  <CheckCircle className="w-7 h-7 mr-3" /> Membresía Pagada
                </div>
              ) : (
                <button
                  onClick={handlePagar}
                  disabled={paymentProcessing || activityPrice === null || activityPrice === 0}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:-translate-y-1"
                >
                  {paymentProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Procesando Pago...
                    </>
                  ) : (
                    'Pagar Membresía Ahora'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Historial de Pagos */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <h4 className="text-2xl font-bold text-center text-gray-300 mb-6">Historial de Pagos</h4>
          {mesesPagados.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mesesPagados.map((mes) => (
                <div
                  key={mes}
                  className="bg-green-800/30 text-green-300 rounded-xl px-5 py-3 text-center shadow-md border border-green-700 flex flex-col items-center justify-center transition-all duration-200 hover:bg-green-800/50"
                >
                  <div className="font-semibold text-lg">{mes}</div>
                  <div className="mt-1 flex items-center justify-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" /> Pagado
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg py-4">No hay pagos registrados aún.</p>
          )}
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-900/30 text-red-300 border border-red-700 p-4 rounded-xl mt-8 text-center text-lg font-medium shadow-md">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;  