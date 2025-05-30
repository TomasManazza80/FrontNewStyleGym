import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import logo from "../../images/logoG.png";
import authContext from "../../store/store";
import { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Index() {
  const [toggle, setToggle] = useState(false);
  const authCtx = useContext(authContext);
  const [role, setRole] = useState(null);

  const signOutHandler = () => {
    localStorage.removeItem("token");
    authCtx.setToken(null);
    alert("Cierre de sesión exitoso.");
    closeNavbar();
  };

  const isAdmin = async (email) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado!");
      return false;
    }

    try {
      const response = await axios.get(`${API_URL}/role/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.role === "admin";
    } catch (error) {
      console.error(`Error al recuperar el rol de usuario: ${error}`);
      return false;
    }
  };

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const closeNavbar = () => {
    setToggle(false);
  };

  const fetchUserRole = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole(null);
      authCtx.setToken(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const isAdminRole = await isAdmin(decoded.email);
      setRole(isAdminRole ? "admin" : "user");
      authCtx.setToken(token);
    } catch (error) {
      console.error("Error al decodificar el token o al obtener el rol:", error);
      localStorage.removeItem("token");
      authCtx.setToken(null);
      setRole(null);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [authCtx.token]);

  return (
    <>
      <div className="">
        {/* La etiqueta nav ocupa el 100% del ancho de la pantalla */}
        <nav className="fixed top-0 left-0 right-0 w-full p-2 backdrop-blur-sm bg-black/70 z-10 shadow-lg transition-colors duration-300">
          {/* Este div interno es el que centraliza el contenido y le da el ancho limitado */}
          <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
            <div>
              <img src={logo} alt="logo" className="h-24 w-auto" />
            </div>
            {/* Navegación para pantallas grandes */}
            <div className="max-lg:hidden flex items-center space-x-6">
              <NavLink to="/" className="text-white p-3 font-semibold hover:text-blue-400 transition-colors duration-200">
                Inicio
              </NavLink>
              <NavLink to="/products" className="text-white p-3 font-semibold hover:text-blue-400 transition-colors duration-200">
                Pagos
              </NavLink>
              <NavLink to="/about" className="text-white p-3 font-semibold hover:text-blue-400 transition-colors duration-200">
                Información
              </NavLink>
              <NavLink to="/contact" className="text-white p-3 font-semibold hover:text-blue-400 transition-colors duration-200">
                Contacto
              </NavLink>
              {role === "admin" && (
                <NavLink to="/admin" className="text-white p-3 font-semibold hover:text-blue-400 transition-colors duration-200">
                  Panel de Administración
                </NavLink>
              )}
            </div>
            {/* Botones de Login/Logout para pantallas grandes */}
            <div className="text-white max-lg:hidden flex items-center space-x-4">
              {authCtx.token ? (
                <button
                  onClick={signOutHandler}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <NavLink to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                  Login
                </NavLink>
              )}
            </div>
            {/* Botón de hamburguesa para móviles (SOLO CUANDO EL MENÚ ESTÁ CERRADO) */}
            <div className="lg:hidden z-20">
              {!toggle && ( // Muestra el icono de barras solo si el menú está cerrado
                <FontAwesomeIcon
                  icon={faBars}
                  className="text-white cursor-pointer text-2xl"
                  onClick={toggleHandler}
                />
              )}
            </div>
          </div> {/* Fin del div.container */}
        </nav>

        {/* Menú desplegable para móviles (SE ACTIVA/DESACTIVA con la variable 'toggle') */}
        <div
          className={`fixed inset-0 bg-neutral-800 text-white p-6 flex flex-col items-center justify-center space-y-6 transition-transform duration-300 ease-in-out transform ${
            toggle ? "translate-x-0" : "-translate-x-full"
          } lg:hidden z-50`} 
        >
          {/* Botón de cerrar (faXmark) DENTRO del menú desplegable */}
          <FontAwesomeIcon
            icon={faXmark}
            className="absolute top-6 right-6 text-white cursor-pointer text-3xl" // Posicionado en la esquina superior derecha del menú
            onClick={toggleHandler} // Al hacer clic, se cierra el menú
          />

          <NavLink
            to="/"
            className="text-white text-2xl font-bold hover:text-blue-400 transition-colors duration-200"
            onClick={closeNavbar}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/products"
            className="text-white text-2xl font-bold hover:text-blue-400 transition-colors duration-200"
            onClick={closeNavbar}
          >
            Pagos
          </NavLink>
          <NavLink
            to="/about"
            className="text-white text-2xl font-bold hover:text-blue-400 transition-colors duration-200"
            onClick={closeNavbar}
          >
            Información
          </NavLink>
          <NavLink
            to="/contact"
            className="text-white text-2xl font-bold hover:text-blue-400 transition-colors duration-200"
            onClick={closeNavbar}
          >
            Contacto
          </NavLink>
          {role === "admin" && (
            <NavLink
              to="/admin"
              className="text-white text-2xl font-bold hover:text-blue-400 transition-colors duration-200"
              onClick={closeNavbar}
            >
              Panel de Administración
            </NavLink>
          )}
          {authCtx.token ? (
            <button
              onClick={signOutHandler}
              className="px-6 py-3 bg-blue-600 text-white rounded-md text-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          ) : (
            <NavLink
              to="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-md text-xl hover:bg-blue-700 transition-colors duration-200 text-center"
              onClick={closeNavbar}
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Este padding asegura que el contenido no quede bajo el navbar fijo */}
        <div className="pt-[100px]">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Index;