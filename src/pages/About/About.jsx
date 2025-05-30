import React from "react";
import { NavLink } from "react-router-dom";
import agustin from '../../components/images/team/agus.png'; // Make sure paths are correct
import moni from '../../components/images/team/monifoto.png';
import maria from '../../components/images/team/fotomari.jpeg';

function About() {
  return (
    <div className="w-full overflow-x-hidden font-sans bg-gray-950 text-white min-h-screen py-20">
      <div className="container mx-auto px-4 text-center">
        {/* Quiénes Somos Section */}
        <section id="who-we-are" className="mb-20">
          <h1 className="text-5xl font-extrabold mb-8 text-yellow-400">
            Quiénes Somos 🌟
          </h1>
          <p className="max-w-3xl mx-auto mb-10 text-xl leading-relaxed text-gray-300">
            En <span className="font-bold text-yellow-400">New Style Gym</span>, tu bienestar es nuestra prioridad. Nuestro equipo de profesionales
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
        </section>

        {/* Conoce a Nuestro Equipo Section */}
        <section id="our-team" className="mb-20">
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
                  <i className="fab fa-twitter"></i> {/* Requires Font Awesome */}
                </a>
                <a
                  href="https://www.instagram.com/agustinnardoni/" // Example link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 text-3xl transition-colors duration-300"
                >
                  <i className="fab fa-instagram"></i> {/* Requires Font Awesome */}
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
              <p className="text-lg text-gray-300 mb-2">Body Jump Trainer</p>
              <p className="text-lg text-gray-300 mb-6">Gym Coach</p>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://www.instagram.com/monicarosales/" // Example link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 text-3xl transition-colors duration-300"
                >
                  <i className="fab fa-instagram"></i> {/* Requires Font Awesome */}
                </a>
                <a
                  href="https://www.facebook.com/monicarosales" // Example link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 text-3xl transition-colors duration-300"
                >
                  <i className="fab fa-facebook"></i> {/* Requires Font Awesome */}
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
                  <i className="fab fa-twitter"></i> {/* Requires Font Awesome */}
                </a>
                <a
                  href="https://www.instagram.com/mariagiovagnoli/" // Example link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-500 text-3xl transition-colors duration-300"
                >
                  <i className="fab fa-instagram"></i> {/* Requires Font Awesome */}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Go Back Button */}
        <NavLink
          to="/"
          className="py-3 px-8 text-lg font-semibold rounded-full transition-all duration-300
                     bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600
                     focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-75 mt-12 inline-block"
        >
          Volver al Inicio
        </NavLink>
      </div>
    </div>
  );
}

export default About;