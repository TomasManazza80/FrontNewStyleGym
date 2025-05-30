import React, { useState, useEffect } from 'react';
import axios from 'axios';
import img from '../../images/logoG.png'; // Asegúrate de que la ruta sea correcta y la imagen exista
import agustin from '../../components/images/team/agus.png';  
import moni from '../../components/images/team/monifoto.png';
import maria from '../../components/images/team/fotomari.jpeg';
// Configura la URL de tu API. Es buena práctica usar variables de entorno.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Usa tu variable de entorno VITE_API_URL o un fallback

const ProductsHome = () => {
  const [showPrices, setShowPrices] = useState(false);
  const [preciosActividades, setPreciosActividades] = useState({
    unaActividad: 0,
    paseLibre: 0,
    estudiante3dias: 0
  });

  const obtenerPreciosActividades = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/activity-prices`);
      if (response.data) {
        setPreciosActividades({
          unaActividad: response.data.unaActividad,
          paseLibre: response.data.paseLibre,
          estudiante3dias: response.data.estudiante3dias
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
    <div className="w-full overflow-x-hidden font-sans">
      {/* HERO SECTION - PANTALLA COMPLETA */}
      <section
        id="home"
        className="relative flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dvmtk00h6/image/upload/v1717013898/gymBg_jjl9h5.jpg')`, // IMAGEN DE FONDO MÁS PROFESIONAL
          backgroundAttachment: 'fixed', // Para efecto parallax
          color: 'white',
          paddingTop: '50px' // Espacio para una posible barra de navegación superior
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div> {/* Superposición más oscura */}
        <div className="container mx-auto px-4 text-center relative z-10 py-12">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <img src={img} className="mx-auto mb-8 w-64 md:w-80 lg:w-[400px] h-auto animate-fade-in-down" alt="Logo New Style Gym" />
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in drop-shadow-lg">NEW STYLE</h1>
            <h2 className="text-3xl md:text-4xl font-light mb-10 tracking-wide">CENTRO FITNESS</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-sm sm:max-w-lg">
              <a href="#feature" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
                COMENZAR
              </a>
              <a href="#about" className="border-2 border-white hover:bg-white hover:text-gray-900 font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
                INFORMACIÓN
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CARACTERÍSTICAS / PRECIOS Y HORARIOS */}
      <section id="feature" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start lg:space-x-12"> {/* Alineación de ítems a start */}
            {/* Bloque de precios */}
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-10">
              <h2 className="text-4xl font-extrabold mb-6 text-yellow-400">COMIENZA HOY MISMO</h2>
              <h3 className="text-2xl mb-8 font-semibold">
                Membresías desde ${preciosActividades.unaActividad.toLocaleString('es-AR')}
              </h3>
              <p className="text-lg mb-8 leading-relaxed">
                Contamos con los mejores precios de la ciudad, ¡no busques más! Nuestras membresías están diseñadas para adaptarse a tus necesidades y presupuesto, ofreciéndote acceso a instalaciones de primera y a un equipo de profesionales dedicados a tu bienestar.
              </p>
              <button
                onClick={togglePricesVisibility}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
              >
                {showPrices ? 'OCULTAR PRECIOS' : 'CONSULTAR PRECIOS'}
              </button>

              {/* Contenedor de Precios - Rendido Condicionalmente */}
              {showPrices && (
                <div className="mt-12 p-8 bg-gray-800 rounded-xl shadow-2xl animate-fade-in-up border border-yellow-500">
                  <h4 className="text-3xl font-extrabold mb-6 text-center text-yellow-400">Nuestras Suscripciones</h4>
                  <ul className="space-y-5 text-xl">
                    <li className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500 shadow-md">
                      <span>Pase Libre:</span>
                      <span className="font-extrabold text-yellow-400 mt-2 sm:mt-0">${preciosActividades.paseLibre.toLocaleString('es-AR')}</span>
                    </li>
                    <li className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg border-l-4 border-green-500 shadow-md">
                      <span>Estudiante (3 veces por semana):</span>
                      <span className="font-extrabold text-yellow-400 mt-2 sm:mt-0">${preciosActividades.estudiante3dias.toLocaleString('es-AR')}</span>
                    </li>
                    <li className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500 shadow-md">
                      <span>Una Actividad:</span>
                      <span className="font-extrabold text-yellow-400 mt-2 sm:mt-0">${preciosActividades.unaActividad.toLocaleString('es-AR')}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Bloque de Horarios */}
            <div className="lg:w-1/2 bg-gray-800 p-8 rounded-xl shadow-2xl border border-blue-500">
              <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-400">HORARIOS DEL GIMNASIO</h2>
              <div className="space-y-6 text-center">
                <div>
                  <h3 className="font-bold text-2xl text-blue-300">Lunes a Viernes</h3>
                  <p className="text-xl">7:00 AM - 10:00 PM</p>
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-blue-300">Sábados</h3>
                  <p className="text-xl">10:00 AM - 2:00 PM</p>
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-blue-300">Domingos</h3>
                  <p className="text-xl">Cerrado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      ---

      {/* SECCIÓN QUIENES SOMOS Y EQUIPO */}
      <section id="about" className="py-20 bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-8 text-gray-900">Quiénes Somos</h1>
          <p className="max-w-3xl mx-auto mb-10 text-xl leading-relaxed">
            En **New Style Gym**, tu bienestar es nuestra prioridad. Nuestro equipo de profesionales altamente calificados te brindará la atención personalizada que necesitas para alcanzar tus objetivos de fitness, salud y bienestar. Estamos comprometidos con tu progreso.
          </p>
          <p className="max-w-3xl mx-auto mb-16 text-xl leading-relaxed">
            ¿Poco tiempo? Nuestra moderna ubicación en **Gdor. Cespo 2427, Santa Fe**, te ofrece fácil acceso y un entorno tranquilo y energizante para que te concentres plenamente en tu entrenamiento, sin distracciones. ¡Ven y descúbrelo!
          </p>

          <h1 className="text-5xl font-extrabold mb-16 text-gray-900">¡Conoce a Nuestro Equipo!</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {/* Mónica */}
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-xs transform hover:scale-105 transition-transform duration-300 border-t-4 border-yellow-500">
              <img src={`${moni}`} className="w-40 h-40 object-cover rounded-full mx-auto mb-6 border-4 border-yellow-500 shadow-md" alt="Mónica Rosales" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Mónica Rosales</h3>
              <p className="text-lg text-gray-600 mb-2">Dody Jump Trainer</p>
              <p className="text-lg text-gray-600 mb-6">Gym Coach</p>
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-gray-700 hover:text-yellow-500 text-2xl transition-colors duration-300"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-gray-700 hover:text-yellow-500 text-2xl transition-colors duration-300"><i className="fab fa-facebook"></i></a>
              </div>
            </div>

            {/* Agustín */}
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-xs transform hover:scale-105 transition-transform duration-300 border-t-4 border-blue-500">
              <img src={`${agustin}`} className="w-40 h-40 object-cover rounded-full mx-auto mb-6 border-4 border-blue-500 shadow-md" alt="Agustín Nardoni" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Agustín Nardoni</h3>
              <p className="text-lg text-gray-600 mb-6">Gym Coach</p>
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-gray-700 hover:text-blue-500 text-2xl transition-colors duration-300"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-700 hover:text-blue-500 text-2xl transition-colors duration-300"><i className="fab fa-instagram"></i></a>
              </div>
            </div>

            {/* María */}
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-xs transform hover:scale-105 transition-transform duration-300 border-t-4 border-purple-500">
              <img src={`${maria}`} className="w-40 h-40 object-cover rounded-full mx-auto mb-6 border-4 border-purple-500 shadow-md" alt="María Giovagnoli" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900">María Giovagnoli</h3>
              <p className="text-lg text-gray-600 mb-6">Gym Coach</p>
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-gray-700 hover:text-purple-500 text-2xl transition-colors duration-300"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-700 hover:text-purple-500 text-2xl transition-colors duration-300"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      ---

      {/* SECCIÓN CLASES */}
      <section id="class" className="py-20 bg-gray-100 text-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-4 text-blue-600">¡MEJORA TU RENDIMIENTO!</h2>
            <h3 className="text-5xl font-extrabold text-gray-900">NUESTRAS CLASES</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Body Jump */}
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transition-transform hover:scale-105 duration-300 border-b-4 border-yellow-500">
              <img src="images/class/bodyjump.jpg" className="w-full h-56 object-cover" alt="Body Jump" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Body Jump</h3>
                <p className="text-gray-700 mb-5 text-lg font-semibold">Clases Coordinadas - Mónica</p>
                <ul className="space-y-3 text-gray-700 text-base">
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
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transition-transform hover:scale-105 duration-300 border-b-4 border-blue-500">
              <img src="images/class/funcional.webp" className="w-full h-56 object-cover" alt="Funcional" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Funcional</h3>
                <p className="text-gray-700 mb-5 text-lg font-semibold">Clases Coordinadas - Agustín</p>
                <ul className="space-y-3 text-gray-700 text-base">
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
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transition-transform hover:scale-105 duration-300 border-b-4 border-green-500">
              <img src="images/class/zumba1.jpeg" className="w-full h-56 object-cover" alt="Zumba" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Zumba</h3>
                <p className="text-gray-700 mb-5 text-lg font-semibold">Clases Coordinadas</p>
                <ul className="space-y-3 text-gray-700 text-base">
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
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transition-transform hover:scale-105 duration-300 border-b-4 border-purple-500">
              <img src="images/class/bodibalance.jpg" className="w-full h-56 object-cover" alt="Body Balance" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Body Balance</h3>
                <p className="text-gray-700 mb-5 text-lg font-semibold">Clases Coordinadas - Mónica</p>
                <ul className="space-y-3 text-gray-700 text-base">
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

      ---

      {/* SECCIÓN DE HORARIOS DE CLASES */}
      <section id="schedule" className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-4 text-yellow-400">ACTIVIDADES</h2>
            <h3 className="text-5xl font-extrabold text-white">HORARIOS DE CLASES</h3>
          </div>

          <div className="overflow-x-auto shadow-2xl rounded-lg"> {/* Contenedor para scroll horizontal en móviles */}
            <table className="w-full min-w-[768px] bg-gray-700 rounded-lg overflow-hidden"> {/* min-w para evitar que se comprima demasiado */}
              <thead className="bg-gray-900 text-yellow-400">
                <tr>
                  <th className="py-4 px-6 text-left text-lg font-bold"><i className="far fa-clock mr-3"></i>Hora</th>
                  <th className="py-4 px-6 text-lg font-bold">Lunes</th>
                  <th className="py-4 px-6 text-lg font-bold">Martes</th>
                  <th className="py-4 px-6 text-lg font-bold">Miércoles</th>
                  <th className="py-4 px-6 text-lg font-bold">Jueves</th>
                  <th className="py-4 px-6 text-lg font-bold">Viernes</th>
                  <th className="py-4 px-6 text-lg font-bold">Sábado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600 text-lg">
                {/* Ejemplo de filas de horarios. Completa con tus datos reales */}
                <tr className="hover:bg-gray-600 transition-colors duration-200">
                  <td className="py-4 px-6 font-semibold">08:00 AM</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                  <td className="py-4 px-6 text-yellow-300">Body Jump</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                  <td className="py-4 px-6 text-yellow-300">Body Jump</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                  <td className="py-4 px-6">-</td>
                </tr>
                <tr className="hover:bg-gray-600 transition-colors duration-200">
                  <td className="py-4 px-6 font-semibold">10:00 AM</td>
                  <td className="py-4 px-6 text-green-300">Zumba</td>
                  <td className="py-4 px-6 text-purple-300">Body Balance</td>
                  <td className="py-4 px-6 text-green-300">Zumba</td>
                  <td className="py-4 px-6 text-purple-300">Body Balance</td>
                  <td className="py-4 px-6 text-green-300">Zumba</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                </tr>
                <tr className="hover:bg-gray-600 transition-colors duration-200">
                  <td className="py-4 px-6 font-semibold">06:00 PM</td>
                  <td className="py-4 px-6 text-yellow-300">Body Jump</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                  <td className="py-4 px-6 text-yellow-300">Body Jump</td>
                  <td className="py-4 px-6 text-blue-300">Funcional</td>
                  <td className="py-4 px-6 text-yellow-300">Body Jump</td>
                  <td className="py-4 px-6">-</td>
                </tr>
                <tr className="hover:bg-gray-600 transition-colors duration-200">
                  <td className="py-4 px-6 font-semibold">08:00 PM</td>
                  <td className="py-4 px-6 text-purple-300">Body Balance</td>
                  <td className="py-4 px-6 text-green-300">Zumba</td>
                  <td className="py-4 px-6 text-purple-300">Body Balance</td>
                  <td className="py-4 px-6 text-green-300">Zumba</td>
                  <td className="py-4 px-6 text-purple-300">Body Balance</td>
                  <td className="py-4 px-6">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      ---

      {/* SECCIÓN CONTACTO */}
      <section id="contact" className="py-20 bg-gray-50 text-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:space-x-12">
            {/* Formulario de Contacto */}
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-10">
              <h2 className="text-4xl font-extrabold mb-8 text-blue-600 text-center lg:text-left">CONTÁCTANOS</h2>
              <form className="space-y-6 bg-white p-8 rounded-xl shadow-2xl border border-blue-200">
                <input
                  type="text"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Tu Nombre"
                />
                <input
                  type="email"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Tu Email"
                />
                <textarea
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 resize-y"
                  rows="6"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
                >
                  ENVIAR MENSAJE
                </button>
              </form>
            </div>

            {/* Ubicación y Mapa */}
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-extrabold mb-8 text-yellow-600 text-center lg:text-left">NOS ENCONTRARÁS EN:</h2>
              <p className="text-2xl mb-10 text-center lg:text-left font-semibold text-gray-700">📍 Gdor. Cespo 2427, Santa Fe</p>

              <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-yellow-500">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.6321453229875!2d-60.702758123565985!3d-31.624108874130098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b5a7a7266df1ad%3A0x629559c3a3734138!2sGdor.%20Crespo%202427%2C%20S3000%20Santa%20Fe!5e0!3m2!1ses-419!2sar!4v1717014603958!5m2!1ses-419!2sar"
                  width="100%"
                  height="450" // Aumentada la altura del mapa
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

      ---

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-8 md:space-y-0">
            {/* Copyright */}
            <div className="mb-4 md:mb-0">
              <p className="text-md text-gray-400">Copyright © 2024 <span className="font-semibold text-yellow-400">New Style Gym</span>. Todos los derechos reservados.</p>
            </div>

            {/* Información de Contacto */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-10 text-lg">
              <p className="flex items-center text-gray-300">
                <i className="far fa-envelope mr-3 text-yellow-500"></i>
                <a href="mailto:sleagus_4@gmail.com" className="hover:text-yellow-400 transition-colors duration-300">sleagus_4@gmail.com</a>
              </p>
              <p className="flex items-center text-gray-300">
                <i className="fas fa-phone mr-3 text-yellow-500"></i>
                <span>+54 342-5406918</span> {/* Formato de número de teléfono internacional */}
              </p>
            </div>

            {/* Diseño por */}
            <p className="mt-4 md:mt-0 text-md text-gray-400">
              Diseñado por: <a href="https://www.linkedin.com/in/tomasmanazza/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline font-semibold">Tomás Manazza</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductsHome;