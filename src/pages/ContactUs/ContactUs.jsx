import React from "react";
import { NavLink } from "react-router-dom";

function ContactUs() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-400">
          Contacto
        </h1>

        <div className="space-y-6 mb-8">
          <div className="bg-gray-700 p-4 rounded-lg flex items-center shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-4 5a2 2 0 01-2 2H9a2 2 0 01-2-2v-4a2 2 0 012-2h6a2 2 0 012 2v4z"
              />
            </svg>
            <p className="text-lg text-gray-200">Email: sleagus_4@gmail.com</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg flex items-center shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.293 1.147a1 1 0 00-.447.894v.045a18.364 18.364 0 005.807 5.807 1 1 0 00.045-.447l1.147-2.293a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.717 21 3 14.283 3 6V5z"
              />
            </svg>
            <p className="text-lg text-gray-200">Cell: 342-5406918</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg flex items-center shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400 mr-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.779 1.624 4.931 4.773.07 1.173.08 1.406.08 4.14 0 2.733-.01 2.966-.08 4.14-.148 3.249-1.624 4.774-4.774 4.931-1.173.07-1.406.08-4.14.08s-2.966-.01-4.14-.08c-3.249-.149-4.774-1.624-4.931-4.774-.07-1.173-.08-1.406-.08-4.14s.01-2.966.08-4.14c.149-3.248 1.624-4.773 4.774-4.931 1.173-.07 1.406-.08 4.14-.08zm0-2.163c-3.727 0-4.184.014-5.591.077C2.4 .272.784 1.832.188 5.432.122 6.84.114 7.289.114 12s.008 5.16.074 6.568c.596 3.6 2.212 5.16 5.812 5.432 1.407.065 1.856.074 5.591.074s4.184-.009 5.591-.074c3.6-.272 5.216-1.832 5.812-5.432.066-1.408.074-1.857.074-6.568s-.008-5.16-.074-6.568c-.596-3.6-2.212-5.16-5.812-5.432-1.407-.065-1.856-.074-5.591-.074zm0 6.556c-3.33 0-6.033 2.703-6.033 6.033s2.703 6.033 6.033 6.033 6.033-2.703 6.033-6.033-2.703-6.033-6.033-6.033zm0 9.946c-2.162 0-3.913-1.751-3.913-3.913s1.751-3.913 3.913-3.913 3.913 1.751 3.913 3.913-1.751 3.913-3.913 3.913zm6.541-11.845c-.661 0-1.196.536-1.196 1.196s.536 1.196 1.196 1.196 1.196-.536 1.196-1.196-.536-1.196-1.196-1.196z" />
            </svg>
            <p className="text-lg text-gray-200">Instagram: new_stylegym</p>
          </div>
        </div>

        <NavLink
          to="/"
          className="block w-full py-3 px-6 text-center text-lg font-semibold rounded-lg transition-all duration-300
                     bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600
                     focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
        >
          Go Back
        </NavLink>
      </div>
    </div>
  );
}

export default ContactUs;