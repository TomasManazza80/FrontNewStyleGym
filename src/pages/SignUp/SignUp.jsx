import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
// Simulamos la importación del contexto de autenticación
// import authContext from "../../store/store"; 

// --- Constantes de Estilo para el Tema Oscuro/Amarillo (New Style Gym) ---
const BACKGROUND_GRADIENT_START = '#1a1a1a'; 
const BACKGROUND_GRADIENT_END = '#0a0a0a';   
const TEXT_COLOR_WHITE = '#ffffff';        
const TEXT_COLOR_YELLOW = '#fdcc0d';      
const LIGHT_GLOW_COLOR = '#ffeb3b';       
const BORDER_HIGHLIGHT_COLOR = '#333333'; 

// URL de la API (simulación del env)
const API_URL = 'https://newstylegym-back.onrender.com';

// Mock del contexto y useAuth si no están disponibles en este entorno
const useAuthContextMock = () => ({
    setToken: (token) => { console.log("Token set (mock):", token); },
    // Añade cualquier otra propiedad que uses del contexto
});
// Reemplaza 'authContext' con el mock si es necesario, o asume que está en el entorno
// Para que el código compile, asumimos que el contexto es accesible.
// const authContext = { Consumer: ({ children }) => children(useAuthContextMock()) };


function SignUp() {
    // Usamos el mock si no tenemos acceso al contexto real para que el código sea autocontenido
    // const authCtx = useContext(authContext); 
    const authCtx = useAuthContextMock(); 
    
    // Si bien no podemos usar useNavigate directamente en el canvas, lo dejamos para la funcionalidad real
    const navigate = (path) => console.log(`Navigating to: ${path}`); // Mock de useNavigate

    const opcionesActividad = ["1 actividad", "pase libre", "Estudiante"];

    const initialValues = {
        name: "",
        number: "",
        email: "",
        password: "",
        confirmPassword: "",
        actividad: "",
        termsAndConditions: false,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("*El nombre es requerido"),
        number: Yup.number()
            .typeError("*Debe ser un número válido")
            .required("*El número de teléfono es requerido"),
        email: Yup.string().email("Formato de email inválido").required("*El email es requerido"),
        password: Yup.string()
            .min(6, "*La contraseña debe tener al menos 6 caracteres")
            .required("*La contraseña es requerida"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
            .required("*Confirmar contraseña es requerido"),
        actividad: Yup.string()
            .oneOf(opcionesActividad, "Por favor selecciona una actividad válida")
            .required("*La actividad es requerida"),
        termsAndConditions: Yup.boolean().oneOf(
            [true],
            "Debes aceptar los términos y condiciones para registrarte"
        ),
    });

    const onSubmit = async (values, { setSubmitting, setStatus }) => {
        try {
            const data = {
                name: values.name,
                number: values.number.toString(),
                email: values.email,
                password: values.password,
                actividad: values.actividad,
            };

            const response = await axios.post(`${API_URL}/createuser`, data);
            console.log("Respuesta del servidor:", response);
            navigate("/login");
        } catch (error) {
            console.error("Error al crear usuario:", error);
            setStatus({
                error:
                    error.response?.data?.message ||
                    "Ocurrió un error al registrar el usuario. Intenta de nuevo.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Dejamos el useEffect, pero las funciones de navegación y localStorage se simulan.
    useEffect(() => {
        const token = localStorage.getItem("token");
        authCtx.setToken(token);
        if (token) {
            navigate("/");
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div 
            className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-12"
            style={{ background: `linear-gradient(135deg, ${BACKGROUND_GRADIENT_START}, ${BACKGROUND_GRADIENT_END})` }}
        >
            {/* Logo/Título con el estilo amarillo/blanco del gym */}
            <NavLink to="/" className="mb-12 transition-transform duration-300 hover:scale-[1.03]">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center">
                    <span style={{ color: TEXT_COLOR_WHITE, textShadow: `0 0 5px ${LIGHT_GLOW_COLOR}` }}>New Style </span>
                    <span style={{ color: TEXT_COLOR_YELLOW, textShadow: `0 0 8px ${LIGHT_GLOW_COLOR}, 0 0 15px ${LIGHT_GLOW_COLOR}` }}>Gym</span>
                </h1>
            </NavLink>

            {/* Formulario Card (Dark/Glowing) */}
            <div 
                className="w-full max-w-md p-8 rounded-2xl shadow-2xl border transition-all duration-300 animate-fadeIn"
                style={{ 
                    backgroundColor: BACKGROUND_GRADIENT_START, 
                    borderColor: BORDER_HIGHLIGHT_COLOR,
                    boxShadow: `0 0 20px ${LIGHT_GLOW_COLOR}20` // Sutil brillo amarillo
                }}
            >
                <h2 className="text-3xl font-bold text-center mb-8 border-b pb-4" 
                    style={{ color: TEXT_COLOR_YELLOW, borderColor: BORDER_HIGHLIGHT_COLOR, textShadow: `0 0 5px ${LIGHT_GLOW_COLOR}` }}>
                    Crea tu cuenta
                </h2>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, status }) => (
                        <Form className="space-y-6">
                            {/* Nombre */}
                            <div>
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder="Nombre completo"
                                    className="w-full p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
                                    style={{ backgroundColor: BACKGROUND_GRADIENT_END, border: `1px solid ${BORDER_HIGHLIGHT_COLOR}` }}
                                />
                                <ErrorMessage name="name" component="p" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Teléfono */}
                            <div>
                                <Field
                                    type="number"
                                    name="number"
                                    placeholder="Número de teléfono"
                                    className="w-full p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
                                    style={{ backgroundColor: BACKGROUND_GRADIENT_END, border: `1px solid ${BORDER_HIGHLIGHT_COLOR}` }}
                                />
                                <ErrorMessage name="number" component="p" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Email */}
                            <div>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Tu email"
                                    className="w-full p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
                                    style={{ backgroundColor: BACKGROUND_GRADIENT_END, border: `1px solid ${BORDER_HIGHLIGHT_COLOR}` }}
                                />
                                <ErrorMessage name="email" component="p" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Contraseña */}
                            <div>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    className="w-full p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
                                    style={{ backgroundColor: BACKGROUND_GRADIENT_END, border: `1px solid ${BORDER_HIGHLIGHT_COLOR}` }}
                                />
                                <ErrorMessage name="password" component="p" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Confirmar contraseña */}
                            <div>
                                <Field
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirmar contraseña"
                                    className="w-full p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
                                    style={{ backgroundColor: BACKGROUND_GRADIENT_END, border: `1px solid ${BORDER_HIGHLIGHT_COLOR}` }}
                                />
                                <ErrorMessage name="confirmPassword" component="p" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Selección de actividad */}
                            <div>
                                <label htmlFor="actividad" className="block text-gray-300 mb-2">
                                    Selecciona tu actividad
                                </label>
                                <Field
                                    as="select"
                                    name="actividad"
                                    id="actividad"
                                    className="w-full p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
                                    style={{ backgroundColor: BACKGROUND_GRADIENT_END, border: `1px solid ${BORDER_HIGHLIGHT_COLOR}` }}
                                >
                                    <option value="" style={{ backgroundColor: BACKGROUND_GRADIENT_END }}>-- Selecciona una opción --</option>
                                    {opcionesActividad.map((opcion) => (
                                        <option key={opcion} value={opcion} style={{ backgroundColor: BACKGROUND_GRADIENT_END }}>
                                            {opcion}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="actividad" component="p" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Términos */}
                            <div className="flex items-center">
                                <Field
                                    type="checkbox"
                                    name="termsAndConditions"
                                    id="termsAndConditions"
                                    className="h-5 w-5 rounded focus:ring-yellow-400 transition duration-200"
                                    style={{ color: TEXT_COLOR_YELLOW, backgroundColor: BACKGROUND_GRADIENT_END, borderColor: BORDER_HIGHLIGHT_COLOR }}
                                />
                                <label htmlFor="termsAndConditions" className="ml-2 text-gray-300 cursor-pointer">
                                    Acepto los{" "}
                                    <NavLink to="/terms" className="hover:underline font-semibold" style={{ color: TEXT_COLOR_YELLOW }}>
                                        términos y condiciones
                                    </NavLink>
                                </label>
                            </div>
                            <ErrorMessage name="termsAndConditions" component="p" className="text-red-400 text-sm" />

                            {/* Errores generales */}
                            {status && status.error && (
                                <p className="text-red-400 text-center mt-4">{status.error}</p>
                            )}

                            {/* Botón principal (Amarillo vibrante) */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 mt-6 rounded-lg font-bold text-lg shadow-xl transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
                                style={{ 
                                    backgroundColor: TEXT_COLOR_YELLOW, 
                                    color: BACKGROUND_GRADIENT_END, 
                                    textShadow: `0 0 3px ${BACKGROUND_GRADIENT_START}`,
                                    boxShadow: `0 0 15px ${LIGHT_GLOW_COLOR}80` 
                                }}
                            >
                                {isSubmitting ? "Registrando..." : "Registrarse"}
                            </button>
                        </Form>
                    )}
                </Formik>

                {/* Enlace para login */}
                <p className="mt-8 text-gray-400 text-center">
                    ¿Ya tienes una cuenta?{" "}
                    <NavLink to="/login" className="font-semibold hover:underline" style={{ color: TEXT_COLOR_YELLOW }}>
                        Inicia sesión
                    </NavLink>
                </p>

                {/* Botón volver al inicio */}
                <NavLink
                    to="/"
                    className="mt-6 block w-full text-center py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-opacity-10 hover:shadow-lg"
                    style={{ 
                        border: `1px solid ${TEXT_COLOR_YELLOW}`,
                        color: TEXT_COLOR_YELLOW,
                        backgroundColor: `${TEXT_COLOR_YELLOW}05`
                    }}
                >
                    Volver al inicio
                </NavLink>
            </div>
        </div>
    );
}

export default SignUp;