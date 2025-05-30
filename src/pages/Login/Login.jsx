import { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import authContext from "../../store/store";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();
  const authCtx = useContext(authContext);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("*Formato de email inválido").required("*El email es requerido"),
    password: Yup.string().required("*La contraseña es requerida"),
  });

  const onSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const data = {
        email: values.email,
        password: values.password,
      };

      const response = await axios.post(`${API_URL}/login`, data);
      console.log(response);
      alert(`¡Bienvenido de nuevo, ${response.data.email}!`);
      authCtx.setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setStatus({ error: error.response?.data?.message || "Credenciales inválidas. Intenta de nuevo." });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    authCtx.setToken(token);
    if (token) {
      navigate("/");
    }
  }, [authCtx, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      {/* Título principal/Logo del gimnasio */}
      <NavLink to="/" className="w-full max-w-xs mb-12">
        <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-4xl font-extrabold text-center py-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
          NEW STYLE GYM
        </h1>
      </NavLink>

      {/* Formulario de inicio de sesión */}
      <div className="w-full flex flex-col items-center justify-center bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md">
        <h2 className="font-extrabold text-center text-4xl mb-8 text-blue-400">Iniciar Sesión</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="w-full space-y-6">
              {/* Campo Email */}
              <div>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu email"
                />
                <ErrorMessage name="email" component="p" className="text-red-400 text-sm mt-1" />
              </div>

              {/* Campo Contraseña */}
              <div>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contraseña"
                />
                <ErrorMessage name="password" component="p" className="text-red-400 text-sm mt-1" />
              </div>

              {/* Mensaje de error general del servidor */}
              {status && status.error && (
                <p className="text-red-400 text-center mt-4">{status.error}</p>
              )}

              {/* Botón de Login */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-6 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Iniciando Sesión..." : "Iniciar Sesión"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Enlace para Registrarse */}
        <p className="mt-8 text-gray-300 text-center">
          ¿No tienes una cuenta? {" "}
          <NavLink to="/signup" className="text-blue-400 hover:underline font-semibold">
            Regístrate
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;