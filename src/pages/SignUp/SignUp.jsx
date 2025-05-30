import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

import axios from "axios";

import authContext from "../../store/store";
import { useContext } from "react";
import { useEffect } from "react";

function SignUp() {
  const authCtx = useContext(authContext);
  const navigate = useNavigate();
  console.log(authCtx);

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
    actividad: "", // Nuevo campo de actividad
    termsAndConditions: false,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("*Requerido"),
    number: Yup.number()
      .typeError("*Debe ser un número")
      .required("*Requerido"),
    email: Yup.string().email("Formato de email inválido").required("*Requerido"),
    password: Yup.string().required("*Requerido"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("*Requerido"),
    actividad: Yup.string() // Validación para el campo de actividad
      .oneOf(opcionesActividad, "Por favor selecciona una actividad válida")
      .required("*Requerido"),
    termsAndConditions: Yup.boolean().oneOf(
      [true],
      "Debes aceptar los términos y condiciones"
    ),
  });

  const onSubmit = async (values) => {
    console.log("---------------------------------");
    console.log("Datos del formulario para crear nuevo usuario", values);
    console.log("---------------------------------");
    try {
      const data = {
        name: values.name,
        number: values.number.toString(),
        email: values.email,
        password: values.password,
        actividad: values.actividad, // Incluye la actividad en los datos a enviar
      };

      axios
        .post(`${API_URL}/createuser`, data)
        .then((response) => {
          console.log("---------------------------------");
          console.log("Respuesta del servidor:", response);
          console.log("---------------------------------");
          navigate("/login");
        })
        .catch((error) => {
          console.log("---------------------------------");
          console.error("Error al crear usuario:", error);
          console.log("---------------------------------");
          alert(error.message || "Ocurrió un error al registrar el usuario.");
        });

    } catch (error) {
      console.log("---------------------------------");
      console.error("Error general:", error.message);
      console.log("---------------------------------");
      alert(error.message);
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
    <>
      <div className="bg-slate-600 text-white text-center p-4 h-screen flex items-center max-lg:flex-col max-lg:h-auto">
        <div className="w-96">
          <NavLink to="/">
            <h1 className="backdrop-blur-sm bg-white/30 p-4 max-lg:m-4">
              CRESCENDO
            </h1>
          </NavLink>
        </div>
        <div className="flex flex-col">
          <h1 className="font-light text-center text-2xl">Sign Up</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form>
              <div className="p-4 m-2">
                <Field
                  className="p-2 outline-none text-center text-black font-bold"
                  type="text"
                  name="name"
                  placeholder="Nombre"
                />
                <p className="text-red-500 text-sm">
                  <ErrorMessage name="name" />
                </p>
              </div>
              <div className="p-4 m-2">
                <Field
                  className="p-2 outline-none text-center text-black font-bold"
                  type="number"
                  name="number"
                  placeholder="Número de teléfono"
                />
                <p className="text-red-500 text-sm">
                  <ErrorMessage name="number" />
                </p>
              </div>
              <div className="p-4 m-2">
                <Field
                  className="p-2 outline-none text-center text-black font-bold"
                  type="email"
                  name="email"
                  placeholder="Email"
                />
                <p className="text-red-500 text-sm">
                  <ErrorMessage name="email" />
                </p>
              </div>
              <div className="p-4 m-2">
                <Field
                  className="p-2 outline-none text-center text-black font-bold"
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                />
                <p className="text-red-500 text-sm">
                  <ErrorMessage name="password" />
                </p>
              </div>
              <div className="p-4 m-2">
                <Field
                  className="p-2 outline-none text-center text-black font-bold"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                />
                <p className="text-red-500 text-sm">
                  <ErrorMessage name="confirmPassword" />
                </p>
              </div>

              {/* Nuevo campo de actividad */}
              <div className="p-4 m-2">
                <label htmlFor="actividad" className="block text-white text-lg font-medium mb-2">
                  Selecciona tu actividad:
                </label>
                <Field
                  as="select" // Usamos 'as="select"' para renderizar un select
                  name="actividad"
                  id="actividad"
                  className="p-2 outline-none text-center text-black font-bold w-full"
                >
                  <option value="">-- Selecciona una opción --</option> {/* Opción por defecto */}
                  {opcionesActividad.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </Field>
                <p className="text-red-500 text-sm">
                  <ErrorMessage name="actividad" />
                </p>
              </div>

              <div>
                <label>
                  <Field
                    className="p-2 outline-none text-center text-black font-bold"
                    type="checkbox"
                    name="termsAndConditions"
                  />
                  <span className="ml-2">
                    Acepto los términos y condiciones
                  </span>
                </label>
                <p className="text-red-500 text-sm">
                  <ErrorMessage name="termsAndConditions" />
                </p>
              </div>

              <button
                type="submit"
                className="p-2 px-6 border cursor-pointer text-center font-bold hover:bg-white hover:text-black"
              >
                Registrarse
              </button>
            </Form>
          </Formik>
          <p className="mt-12">
            Al hacer clic en "Registrarse", te registrarás. Si ya tienes una cuenta,
            entonces haz clic en &nbsp;
            <NavLink to="/login" className="text-red-500">
              Iniciar Sesión
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignUp;
