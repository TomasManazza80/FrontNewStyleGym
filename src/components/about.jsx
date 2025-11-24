import React from "react";

export const About = (props) => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Imagen */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img 
                src="img/about.jpg" 
                className="w-full h-auto rounded-2xl shadow-2xl transform transition-all duration-700 hover:scale-105" 
                alt="Exodium Gym" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              
              {/* Elementos decorativos */}
              <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-purple-600/20 rounded-full filter blur-xl animate-pulse-slow z-0"></div>
              <div className="absolute -top-5 -right-5 w-24 h-24 bg-cyan-400/10 rounded-full filter blur-xl animate-pulse-slow z-0"></div>
            </div>
          </div>
          
          {/* Contenido */}
          <div className="w-full lg:w-1/2">
            <div className="about-text">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                SOBRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">NOSOTROS</span>
              </h2>
              
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                {props.data ? props.data.paragraph : "loading..."}
              </p>
              
              <h3 className="text-2xl font-bold mb-6 text-purple-300">
                ¿Por qué elegirnos?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-3">
                    {props.data
                      ? props.data.Why.map((d, i) => (
                          <li key={`${d}-${i}`} className="flex items-start">
                            <div className="bg-gradient-to-r from-purple-600 to-cyan-500 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-200">{d}</span>
                          </li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                
                <div>
                  <ul className="space-y-3">
                    {props.data
                      ? props.data.Why2.map((d, i) => (
                          <li key={`${d}-${i}`} className="flex items-start">
                            <div className="bg-gradient-to-r from-purple-600 to-cyan-500 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-200">{d}</span>
                          </li>
                        ))
                      : "loading"}
                  </ul>
                </div>
              </div>

              {/* Elemento decorativo */}
              <div className="mt-10 pt-6 border-t border-gray-800">
                <p className="text-lg font-semibold text-purple-300 flex items-center">
                  <span className="mr-2">🔥</span>
                  Tu transformación comienza hoy
                  <span className="ml-2">💪</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};