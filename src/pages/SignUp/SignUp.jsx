import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import authContext from "../../store/store";

const API_URL = "https://newstylegym-back.onrender.com";

function SignUp() {
  const authCtx = useContext(authContext);
  const navigate = useNavigate();

  // Opciones de actividad para el select
  const opcionesActividad = [
    "1 actividad",
    "pase libre",
    "Estudiante"
  ];

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
      setStatus({ error: error.response?.data?.message || "Ocurrió un error al registrar el usuario. Intenta de nuevo." });
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
      <NavLink to="/" className="w-full max-w-xs mb-12"> {/* Aumentado el margen inferior */}
        <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-4xl font-extrabold text-center py-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
          NEW STYLE GYM
        </h1>
      </NavLink>

      {/* Formulario de registro */}
      <div className="w-full flex flex-col items-center justify-center bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md"> {/* Ancho fijo para el formulario */}
        <h2 className="font-extrabold text-center text-4xl mb-8 text-blue-400">Regístrate</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="w-full space-y-6">
              {/* Campo Nombre */}
              <div>
                <Field
                  className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                />
                <ErrorMessage name="name" component="p" className="text-red-400 text-sm mt-1" />
              </div>

              {/* Campo Número de teléfono */}
              <div>
                <Field
                  className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  name="number"
                  placeholder="Número de teléfono"
                />
                <ErrorMessage name="number" component="p" className="text-red-400 text-sm mt-1" />
              </div>

              {/* Campo Email */}
              <div>
                <Field
                  className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  name="email"
                  placeholder="Tu email"
                />
                <ErrorMessage name="email" component="p" className="text-red-400 text-sm mt-1" />
              </div>

              {/* Campo Contraseña */}
              <div>
                <Field
                  className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                />
                <ErrorMessage name="password" component="p" className="text-red-400 text-sm mt-1" />
              </div>

              {/* Campo Confirmar Contraseña */}
              <div>
                <Field
                  className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                />
                <ErrorMessage name="confirmPassword" component="p" className="text-red-400 text-sm mt-1" />
              </div>

              {/* Campo de selección de Actividad */}
              <div>
                <label htmlFor="actividad" className="block text-white text-lg font-medium mb-2">
                  Selecciona tu actividad:
                </label>
                <Field
                  as="select"
                  name="actividad"
                  id="actividad"
                  className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Selecciona una opción --</option>
                  {opcionesActividad.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="actividad" component="p" className="text-red-400 text-sm mt-1" />
              </div>

              {/* Campo de Aceptar Términos y Condiciones */}
              <div className="flex items-center">
                <Field
                  type="checkbox"
                  name="termsAndConditions"
                  id="termsAndConditions"
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="termsAndConditions" className="ml-2 text-gray-300 cursor-pointer">
                  Acepto los <NavLink to="/terms" className="text-blue-400 hover:underline">términos y condiciones</NavLink>
                </label>
              </div>
              <ErrorMessage name="termsAndConditions" component="p" className="text-red-400 text-sm" />

              {/* Mensaje de error general del servidor */}
              {status && status.error && (
                <p className="text-red-400 text-center mt-4">{status.error}</p>
              )}

              {/* Botón de Registrarse */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-6 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Enlace para Iniciar Sesión */}
        <p className="mt-8 text-gray-300 text-center">
          ¿Ya tienes una cuenta? {" "}
          <NavLink to="/login" className="text-blue-400 hover:underline font-semibold">
            Iniciar Sesión
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default SignUp;