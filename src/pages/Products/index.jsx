import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

const GOLD = '#FFD700';
const WHITE = '#FFFFFF';
const GOLD_SHADOW_SMOOTH = '0 0 10px rgba(255, 215, 0, 0.4)';

const SkeletonLoader = () => (
  <div className="animate-pulse bg-gray-900/80 p-6 rounded-3xl shadow-lg max-w-xl mx-auto mt-12 space-y-6 border border-gray-700">
    <div className="h-8 bg-gray-700 rounded-lg w-3/4 mx-auto mb-6"></div>
    <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
      <div className="h-6 bg-gray-700 rounded-md w-1/2 mx-auto"></div>
      <div className="h-4 bg-gray-700 rounded-md w-1/3 mx-auto"></div>
      <div className="h-4 bg-gray-700 rounded-md w-1/4 mx-auto"></div>
      <div className="h-10 bg-yellow-700/70 rounded-full w-2/3 mx-auto"></div>
      <div className="h-px bg-gray-700 w-full"></div>
      <div className="h-6 bg-gray-700 rounded-md w-1/2 mx-auto"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-700 rounded-lg"></div>
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
    <div className="relative bg-black text-white min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <div className="relative bg-gray-950/90 p-10 rounded-xl shadow-2xl max-w-xl w-full border border-gray-800">
        <h2
          className="text-3xl font-light text-center mb-12 tracking-widest uppercase"
          style={{ color: GOLD, textShadow: GOLD_SHADOW_SMOOTH }}
        >
          ESTADO DE TU MEMBRESÍA
        </h2>

        <div className="bg-gray-900 rounded-lg p-8 mb-10 border border-gray-700 text-center">
          <p className="text-sm font-semibold text-gray-500 mb-1 tracking-widest">MES ACTUAL</p>
          <h3 className="text-4xl font-extrabold mb-6 uppercase" style={{ color: GOLD }}>{mesActual}</h3>

          {userActivity && (
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-lg text-white border-b border-gray-700 pb-2">
                <span className="font-light text-gray-400">ACTIVIDAD</span>
                <span className="font-medium text-white tracking-wide">{userActivity}</span>
              </div>
              <div className="flex justify-between items-center text-xl text-white pt-2">
                <span className="font-semibold text-gray-300">PRECIO A PAGAR</span>
                <span className="font-extrabold" style={{ color: GOLD }}>${activityPrice?.toLocaleString('es-AR')}</span>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            {mesPagado ? (
              <div className="inline-flex items-center bg-green-900/40 text-green-400 px-8 py-3 rounded-full text-lg font-bold border border-green-800 tracking-wide">
                <CheckCircle className="w-5 h-5 mr-3" /> PAGO CONFIRMADO
              </div>
            ) : (
              <button
                onClick={handlePagar}
                disabled={paymentProcessing || activityPrice === null || activityPrice === 0}
                className={`bg-[${GOLD}] hover:bg-yellow-500 text-black font-extrabold py-3 px-12 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-xl`}
                style={{ boxShadow: `0 10px 20px -5px rgba(255, 215, 0, 0.6)` }}
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> PROCESANDO...
                  </>
                ) : (
                  'REALIZAR PAGO AHORA'
                )}
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <h4 className="text-base font-semibold text-gray-500 mb-6 uppercase tracking-widest">Historial de Pagos</h4>
          {mesesPagados.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {mesesPagados.map((mes) => (
                <div
                  key={mes}
                  className="bg-green-700/10 text-green-400 rounded-md px-2 py-2 text-center border border-green-800/50"
                >
                  <div className="font-medium text-xs uppercase">{mes}</div>
                  <div className="mt-1 flex items-center justify-center text-[10px] text-green-500">
                    <CheckCircle className="w-2 h-2 mr-1" /> OK
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-sm py-4">No hay pagos registrados.</p>
          )}
        </div>

        {error && (
          <div className="bg-red-900/30 text-red-300 border border-red-800 p-4 rounded-lg mt-8 text-center">
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;