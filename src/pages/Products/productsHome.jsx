import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom'; // Keeping NavLink for potential future use or consistency
import img from '../../images/logoG.png'; // Ensure the path is correct and the image exists
import agustin from '../../components/images/team/agus.png';
import moni from '../../components/images/team/monifoto.png';
import maria from '../../components/images/team/fotomari.jpeg';
import bodyjump from '../../components/images/class/bodyjump.jpg';
import funcional from '../../components/images/class/funcional.webp'; 
import zumba from '../../components/images/class/zumba1.jpeg';
import bodybalance from '../../components/images/class/bodybalance.jpg';
// You might need to import Font Awesome or similar for icons, or use SVGs directly.
// For this example, I'll assume Font Awesome is linked or you have the necessary SVGs.

// Configura la URL de tu API. Es buena práctica usar variables de entorno.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'; // Fallback for VITE_API_URL

const ProductsHome = () => {
  const [showPrices, setShowPrices] = useState(false);
  const [preciosActividades, setPreciosActividades] = useState({
    unaActividad: 0,
    paseLibre: 0,
    estudiante3dias: 0,
  });

  const obtenerPreciosActividades = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/activity-prices/prices`);
      if (response.data) {
        setPreciosActividades({
          unaActividad: response.data.unaActividad,
          paseLibre: response.data.paseLibre,
          estudiante3dias: response.data.estudiante3dias,
        });
      }
    } catch (error) {
      console.error('Error al obtener precios de actividades:', error);
      // Puedes añadir un mensaje de error visible al usuario aquí si es necesario.
    }
  };

  useEffect(() => {
    obtenerPreciosActividades();
  }, []); // Dependencia vacía para que se ejecute solo una vez al montar el componente

  const togglePricesVisibility = () => {
    setShowPrices(!showPrices);
  };

  return (
    <div className="w-full overflow-x-hidden font-sans bg-gray-950 text-white">
      {/* HERO SECTION - PANTALLA COMPLETA */}
      <section
        id="home"
        className="relative flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dvmtk00h6/image/upload/v1717013898/gymBg_jjl9h5.jpg')`, // PROFESSIONAL BACKGROUND IMAGE
          backgroundAttachment: 'fixed', // Parallax effect
          color: 'white',
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>{' '}
        {/* Darker Overlay */}
        <div className="container mx-auto px-4 text-center relative z-10 py-12">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <img
              src={img}
              className="mx-auto mb-8 w-64 md:w-80 lg:w-[400px] h-auto animate-fade-in-down drop-shadow-lg"
              alt="Logo New Style Gym"
            />
            <h1 className="text-6xl md:text-8xl font-extrabold mb-4 animate-fade-in text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg">
              NEW STYLE
            </h1>
            <h2 className="text-3xl md:text-5xl font-light mb-10 tracking-wide text-gray-200 animate-fade-in-up">
              CENTRO FITNESS
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-sm sm:max-w-lg">
              <a
                href="#feature"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-xl animate-bounce-in"
              >
                COMENZAR
              </a>
              <a
                href="#about"
                className="border-2 border-white hover:bg-white hover:text-gray-900 font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-xl animate-bounce-in"
              >
                INFORMACIÓN
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CARACTERÍSTICAS / PRECIOS Y HORARIOS */}
      <section id="feature" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start lg:space-x-12">
            {/* Bloque de precios */}
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-10">
              <h2 className="text-5xl font-extrabold mb-6 text-yellow-400 leading-tight">
                COMIENZA HOY MISMO 💪
              </h2>
              <h3 className="text-3xl mb-8 font-semibold text-gray-200">
                Membresías desde{' '}
                <span className="text-yellow-400">
                  ${preciosActividades.unaActividad.toLocaleString('es-AR')}
                </span>
              </h3>
              <p className="text-xl mb-8 leading-relaxed text-gray-300">
                Contamos con los mejores precios de la ciudad, ¡no busques más!
                Nuestras membresías están diseñadas para adaptarse a tus
                necesidades y presupuesto, ofreciéndote acceso a instalaciones
                de primera y a un equipo de profesionales dedicados a tu
                bienestar.
              </p>
              <button
                onClick={togglePricesVisibility}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
              >
                {showPrices ? 'OCULTAR PRECIOS' : 'CONSULTAR PRECIOS'}
              </button>

              {/* Contenedor de Precios - Rendido Condicionalmente */}
              {showPrices && (
                <div className="mt-12 p-8 bg-gray-800 rounded-xl shadow-2xl animate-fade-in-up border border-yellow-500">
                  <h4 className="text-3xl font-extrabold mb-6 text-center text-yellow-400">
                    Nuestras Suscripciones ✨
                  </h4>
                  <ul className="space-y-5 text-xl">
                    <li className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500 shadow-md">
                      <span>Pase Libre:</span>
                      <span className="font-extrabold text-yellow-400 mt-2 sm:mt-0">
                        ${preciosActividades.paseLibre.toLocaleString('es-AR')}
                      </span>
                    </li>
                    <li className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg border-l-4 border-green-500 shadow-md">
                      <span>Estudiante (3 veces por semana):</span>
                      <span className="font-extrabold text-yellow-400 mt-2 sm:mt-0">
                        $
                        {preciosActividades.estudiante3dias.toLocaleString(
                          'es-AR'
                        )}
                      </span>
                    </li>
                    <li className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500 shadow-md">
                      <span>Una Actividad:</span>
                      <span className="font-extrabold text-yellow-400 mt-2 sm:mt-0">
                        $
                        {preciosActividades.unaActividad.toLocaleString(
                          'es-AR'
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Bloque de Horarios */}
            <div className="lg:w-1/2 bg-gray-800 p-8 rounded-xl shadow-2xl border border-blue-500">
              <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-400">
                HORARIOS DEL GIMNASIO ⏰
              </h2>
              <div className="space-y-6 text-center">
                <div className="bg-gray-700 p-5 rounded-lg shadow-inner">
                  <h3 className="font-bold text-2xl text-blue-300 mb-2">
                    Lunes a Viernes
                  </h3>
                  <p className="text-2xl text-gray-200">7:00 AM - 10:00 PM</p>
                </div>
                <div className="bg-gray-700 p-5 rounded-lg shadow-inner">
                  <h3 className="font-bold text-2xl text-blue-300 mb-2">
                    Sábados
                  </h3>
                  <p className="text-2xl text-gray-200">10:00 AM - 2:00 PM</p>
                </div>
                <div className="bg-gray-700 p-5 rounded-lg shadow-inner">
                  <h3 className="font-bold text-2xl text-blue-300 mb-2">
                    Domingos
                  </h3>
                  <p className="text-2xl text-gray-200">Cerrado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN QUIENES SOMOS Y EQUIPO */}
      <section id="about" className="py-20 bg-gray-950 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-8 text-yellow-400">
            Quiénes Somos 🌟
          </h1>
          <p className="max-w-3xl mx-auto mb-10 text-xl leading-relaxed text-gray-300">
            En <span className="font-bold text-yellow-400">New Style Gym</span>
            , tu bienestar es nuestra prioridad. Nuestro equipo de profesionales
            altamente calificados te brindará la atención personalizada que
            necesitas para alcanzar tus objetivos de fitness, salud y bienestar.
            Estamos comprometidos con tu progreso.
          </p>
          <p className="max-w-3xl mx-auto mb-16 text-xl leading-relaxed text-gray-300">
            ¿Poco tiempo? Nuestra moderna ubicación en{' '}
            <span className="font-bold text-blue-400">
              Gdor. Cespo 2427, Santa Fe
            </span>
            , te ofrece fácil acceso y un entorno tranquilo y energizante para
            que te concentres plenamente en tu entrenamiento, sin distracciones.
            ¡Ven y descúbrelo!
          </p>

          <h1 className="text-5xl font-extrabold mb-16 text-blue-400">
            ¡Conoce a Nuestro Equipo! 👥
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            
            
              {/* Agustín */}
              <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-xs transform hover:scale-105 transition-transform duration-300 border-t-4 border-blue-500">
              <img
                src={agustin}
                className="w-40 h-40 object-cover rounded-full mx-auto mb-6 border-4 border-blue-500 shadow-md"
                alt="Agustín Nardoni"
              />
              <h3 className="text-2xl font-bold mb-2 text-blue-400">
                Agustín Nardoni
              </h3>
              <p className="text-lg text-gray-300 mb-6">Gym Coach</p>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://twitter.com/agustinnardoni" // Example link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 text-3xl transition-colors duration-300"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="https://www.instagram.com/agustinnardoni/" // Example link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 text-3xl transition-colors duration-300"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            
            
            {/* Mónica */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-xs transform hover:scale-105 transition-transform duration-300 border-t-4 border-yellow-500">
              <img
                src={moni}
                className="w-40 h-40 object-cover rounded-full mx-auto mb-6 border-4 border-yellow-500 shadow-md"
                alt="Mónica Rosales"
              />
              <h3 className="text-2xl font-bold mb-2 text-yellow-400">
                Mónica Rosales
              </h3>
              <p className="text-lg text-gray-300 mb-2">Dody Jump Trainer</p>
              <p className="text-lg text-gray-300 mb-6">Gym Coach</p>
              <div className="flex justify-center space-x-6">
                {/* Ensure Font Awesome is loaded for these icons */}
                <a
                  href="https://www.instagram.com/monicarosales/" // Example link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 text-3xl transition-colors duration-300"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://www.facebook.com/monicarosales" // Example link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 text-3xl transition-colors duration-300"
                >
                  <i className="fab fa-facebook"></i>
                </a>
              </div>
            </div>

          

            {/* María */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-xs transform hover:scale-105 transition-transform duration-300 border-t-4 border-purple-500">
              <img
                src={maria}
                className="w-40 h-40 object-cover rounded-full mx-auto mb-6 border-4 border-purple-500 shadow-md"
                alt="María Giovagnoli"
              />
              <h3 className="text-2xl font-bold mb-2 text-purple-400">
                María Giovagnoli
              </h3>
              <p className="text-lg text-gray-300 mb-6">Gym Coach</p>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://twitter.com/mariagiovagnoli" // Example link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-500 text-3xl transition-colors duration-300"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="https://www.instagram.com/mariagiovagnoli/" // Example link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-500 text-3xl transition-colors duration-300"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CLASES */}
      <section id="class" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 text-yellow-400">
              ¡MEJORA TU RENDIMIENTO!
            </h2>
            <h3 className="text-5xl md:text-6xl font-extrabold text-white">
              NUESTRAS CLASES 🤸‍♀️
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Body Jump */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-300 border-b-4 border-yellow-500">
              <img
                src={bodyjump} // Placeholder, replace with actual image
                className="w-full h-56 object-cover"
                alt="Body Jump"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                  Body Jump
                </h3>
                <p className="text-gray-300 mb-5 text-lg font-semibold">
                  Clases Coordinadas - Mónica
                </p>
                <ul className="space-y-3 text-gray-400 text-base">
                  <li className="flex items-start">
                    <span className="text-yellow-500 text-xl mr-3">●</span>
                    <span>Perder peso de forma más rápida y efectiva</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 text-xl mr-3">●</span>
                    <span>Mejorar tu salud cardiovascular</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 text-xl mr-3">●</span>
                    <span>Aumentar tu energía y bienestar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 text-xl mr-3">●</span>
                    <span>Reducir el estrés y mejorar tu estado de ánimo</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Funcional */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-300 border-b-4 border-blue-500">
              <img
                src={funcional} // Placeholder, replace with actual image
                className="w-full h-56 object-cover"
                alt="Funcional"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-blue-400">
                  Funcional
                </h3>
                <p className="text-gray-300 mb-5 text-lg font-semibold">
                  Clases Coordinadas - Agustín
                </p>
                <ul className="space-y-3 text-gray-400 text-base">
                  <li className="flex items-start">
                    <span className="text-blue-500 text-xl mr-3">●</span>
                    <span>Quemarás calorías de forma eficiente y rápida</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 text-xl mr-3">●</span>
                    <span>Tonificarás tu cuerpo de manera integral</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 text-xl mr-3">●</span>
                    <span>Mejorarás tu fuerza y resistencia muscular</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 text-xl mr-3">●</span>
                    <span>Aumentarás tu flexibilidad y movilidad</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Zumba */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-300 border-b-4 border-green-500">
              <img
                src={zumba} // Placeholder, replace with actual image
                className="w-full h-56 object-cover"
                alt="Zumba"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-green-400">
                  Zumba
                </h3>
                <p className="text-gray-300 mb-5 text-lg font-semibold">
                  Clases Coordinadas
                </p>
                <ul className="space-y-3 text-gray-400 text-base">
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">●</span>
                    <span>Reduce el estrés y aumenta la felicidad</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">●</span>
                    <span>Aumenta la energía y el bienestar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">●</span>
                    <span>Ideal para todos los niveles de condición física</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">●</span>
                    <span>Fortalece el corazón y mejora la circulación</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Body Balance */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-300 border-b-4 border-purple-500">
              <img
                src={bodybalance} // Placeholder, replace with actual image
                className="w-full h-56 object-cover"
                alt="Body Balance"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-purple-400">
                  Body Balance
                </h3>
                <p className="text-gray-300 mb-5 text-lg font-semibold">
                  Clases Coordinadas - Mónica
                </p>
                <ul className="space-y-3 text-gray-400 text-base">
                  <li className="flex items-start">
                    <span className="text-purple-500 text-xl mr-3">●</span>
                    <span>Mejora la flexibilidad y el equilibrio</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 text-xl mr-3">●</span>
                    <span>Reduce el estrés y promueve la relajación</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 text-xl mr-3">●</span>
                    <span>Aumenta la fuerza muscular y la resistencia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 text-xl mr-3">●</span>
                    <span>Mejora la postura y la alineación corporal</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE HORARIOS DE CLASES */}
      <section id="schedule" className="py-20 bg-gray-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4 text-yellow-400">
              ACTIVIDADES
            </h2>
            <h3 className="text-5xl md:text-6xl font-extrabold text-white">
              HORARIOS DE CLASES 📅
            </h3>
          </div>

          <div className="overflow-x-auto shadow-2xl rounded-xl border border-gray-700">
            {' '}
            {/* Contenedor para scroll horizontal en móviles */}
            <table className="w-full min-w-[900px] bg-gray-800 rounded-xl overflow-hidden">
              {' '}
              {/* min-w para evitar que se comprima demasiado */}
              <thead className="bg-gray-700 text-yellow-400">
                <tr>
                  <th className="py-4 px-6 text-left text-lg font-bold">
                    <i className="far fa-clock mr-3"></i>Hora
                  </th>
                  <th className="py-4 px-6 text-lg font-bold">Lunes</th>
                  <th className="py-4 px-6 text-lg font-bold">Martes</th>
                  <th className="py-4 px-6 text-lg font-bold">Miércoles</th>
                  <th className="py-4 px-6 text-lg font-bold">Jueves</th>
                  <th className="py-4 px-6 text-lg font-bold">Viernes</th>
                  <th className="py-4 px-6 text-lg font-bold">Sábado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600 text-lg">
                <tr className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-4 px-6 font-semibold">08:00 AM</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                  <td className="py-4 px-6 text-yellow-300">Body Jump</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                  <td className="py-4 px-6 text-yellow-300">Body Jump</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                  <td className="py-4 px-6 text-gray-400">-</td>
                </tr>
                <tr className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-4 px-6 font-semibold">10:00 AM</td>
                  <td className="py-4 px-6 text-green-300">Zumba</td>
                  <td className="py-4 px-6 text-purple-300">Body Balance</td>
                  <td className="py-4 px-6 text-green-300">Zumba</td>
                  <td className="py-4 px-6 text-purple-300">Body Balance</td>
                  <td className="py-4 px-6 text-green-300">Zumba</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                </tr>
                <tr className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-4 px-6 font-semibold">06:00 PM</td>
                  <td className="py-4 px-6 text-yellow-300">Body Jump</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                  <td className="py-4 px-6 text-yellow-300">Body Jump</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                  <td className="py-4 px-6 text-yellow-300">Body Jump</td>
                  <td className="py-4 px-6 text-gray-400">-</td>
                </tr>
                <tr className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-4 px-6 font-semibold">08:00 PM</td>
                  <td className="py-4 px-6 text-purple-300">Body Balance</td>
                  <td className="py-4 px-6 text-green-300">Zumba</td>
                  <td className="py-4 px-6 text-purple-300">Body Balance</td>
                  <td className="py-4 px-6 text-green-300">Zumba</td>
                  <td className="py-4 px-6 text-purple-300">Body Balance</td>
                  <td className="py-4 px-6 text-gray-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECCIÓN CONTACTO */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:space-x-12">
            {/* Formulario de Contacto */}
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-10">
              <h2 className="text-5xl font-extrabold mb-8 text-blue-400 text-center lg:text-left">
                CONTÁCTANOS 📞
              </h2>
              <form className="space-y-6 bg-gray-800 p-8 rounded-xl shadow-2xl border border-blue-500">
                <input
                  type="text"
                  className="w-full px-5 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="Tu Nombre"
                />
                <input
                  type="email"
                  className="w-full px-5 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="Tu Email"
                />
                <textarea
                  className="w-full px-5 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-y min-h-[150px]"
                  rows="6"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
                >
                  ENVIAR MENSAJE
                </button>
              </form>
            </div>

            {/* Ubicación y Mapa */}
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <h2 className="text-5xl font-extrabold mb-8 text-yellow-400 text-center lg:text-left">
                NOS ENCONTRARÁS EN: 📍
              </h2>
              <p className="text-2xl mb-10 text-center lg:text-left font-semibold text-gray-300">
                Gdor. Cespo 2427, Santa Fe
              </p>

              <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-yellow-500">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3399.761763133887!2d-60.70425712398579!3d-31.64413157416399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b5a210d7008705%3A0xf6a7610f9b69107f!2sGdor.%20Crespo%202427%2C%20Santa%20Fe!5e0!3m2!1ses-419!2sar!4v1717094000000!5m2!1ses-419!2sar"
                  width="100%"
                  height="450" // Increased map height
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación del Gimnasio New Style Gym en Google Maps"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-8 md:space-y-0">
            {/* Copyright */}
            <div className="mb-4 md:mb-0">
              <p className="text-md text-gray-400">
                Copyright © {new Date().getFullYear()}{' '}
                <span className="font-semibold text-yellow-400">
                  New Style Gym
                </span>
                . Todos los derechos reservados.
              </p>
            </div>

            {/* Información de Contacto */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-10 text-lg">
              <p className="flex items-center text-gray-300">
                <i className="far fa-envelope mr-3 text-yellow-500"></i>
                <a
                  href="mailto:sleagus_4@gmail.com"
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  sleagus_4@gmail.com
                </a>
              </p>
              <p className="flex items-center text-gray-300">
                <i className="fas fa-phone mr-3 text-yellow-500"></i>
                <span>+54 342-5406918</span>{' '}
                {/* International phone number format */}
              </p>
            </div>

            {/* Diseño por */}
            <p className="mt-4 md:mt-0 text-md text-gray-400">
              Diseñado por:{' '}
              <a
                href="https://www.linkedin.com/in/tomasmanazza/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline font-semibold"
              >
                Tomás Manazza
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductsHome;