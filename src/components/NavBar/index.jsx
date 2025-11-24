import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import logo from "../../../src/images/logoG.png";
import authContext from "../../store/store";
import { useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API_URL = "https://newstylegym-back.onrender.com";
const GOLD = "#FFD700";
const HOVER_GOLD_BG = "rgba(255, 215, 0, 0.1)";
const ACTIVE_GOLD_BG = "rgba(255, 215, 0, 0.2)";

function Index() {
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const authCtx = useContext(authContext);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const signOutHandler = () => {
    localStorage.removeItem("token");
    authCtx.setToken(null);
    window.dispatchEvent(
      new CustomEvent("showNotification", {
        detail: { message: "Sesión cerrada exitosamente", type: "success" },
      })
    );
    closeNavbar();
  };

  const isAdmin = async (email) => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const response = await axios.get(`${API_URL}/role/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.role === "admin";
    } catch {
      return false;
    }
  };

  const toggleHandler = () => setToggle(!toggle);
  const closeNavbar = () => setToggle(false);

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
    } catch {
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
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          scrolled ? "bg-black/70 backdrop-blur-md border-b border-gray-800" : "bg-black"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-2 md:py-3">
          {/* Logo responsivo */}
          <div className="flex items-center justify-center lg:justify-start">
            <img
              src={logo}
              alt="NEW STYLE GYM"
              className="h-10 md:h-12 lg:h-14 w-auto max-w-[160px] sm:max-w-[180px] md:max-w-[200px] transition-all duration-300"
            />
          </div>

          {/* Menú Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {[
              { to: "/", label: "Inicio" },
              { to: "/products", label: "Pagos" },
              { to: "/rutina", label: "Mi Rutina" },
              { to: "/about", label: "Información" },
              { to: "/contact", label: "Contacto" },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                style={({ isActive }) => ({
                  color: isActive ? GOLD : "white",
                  backgroundColor: isActive ? ACTIVE_GOLD_BG : "",
                  borderBottom: isActive ? `2px solid ${GOLD}` : "",
                })}
              >
                {link.label}
              </NavLink>
            ))}
            {role === "admin" && (
              <NavLink
                to="/admin"
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                style={({ isActive }) => ({
                  color: isActive ? GOLD : "white",
                  backgroundColor: isActive ? ACTIVE_GOLD_BG : "",
                  borderBottom: isActive ? `2px solid ${GOLD}` : "",
                })}
              >
                Admin
              </NavLink>
            )}
          </div>

          {/* Botones Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {authCtx.token ? (
              <button
                onClick={signOutHandler}
                className="px-4 py-2 text-black rounded-full text-sm font-semibold transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: GOLD }}
              >
                Cerrar Sesión
              </button>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 text-black rounded-full text-sm font-semibold transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: GOLD }}
              >
                Iniciar Sesión
              </NavLink>
            )}
          </div>

          {/* Botón hamburguesa (Mobile) */}
          <div className="lg:hidden z-50">
            <button
              onClick={toggleHandler}
              className="p-2 text-white rounded-full transition-all"
              style={{ backgroundColor: HOVER_GOLD_BG }}
            >
              <FontAwesomeIcon
                icon={toggle ? faXmark : faBars}
                className="text-lg"
                style={{ color: GOLD }}
              />
            </button>
          </div>
        </div>

        {/* Menú Mobile */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-md transform transition-transform duration-500 ease-in-out z-30 ${
            toggle ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-6 py-20 h-full flex flex-col">
            <div className="flex-1">
              {[
                { to: "/", label: "Inicio" },
                { to: "/products", label: "Pagos" },
                { to: "/rutina", label: "Mi Rutina" },
                { to: "/about", label: "Información" },
                { to: "/contact", label: "Contacto" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeNavbar}
                  className="block py-3 px-4 text-base font-medium rounded-lg mb-2 transition-colors duration-300"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? GOLD : "",
                    color: isActive ? "black" : "white",
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
              {role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={closeNavbar}
                  className="block py-3 px-4 text-base font-medium rounded-lg mb-2 transition-colors duration-300"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? GOLD : "",
                    color: isActive ? "black" : "white",
                  })}
                >
                  Panel de Administración
                </NavLink>
              )}
            </div>
            <div className="pt-4 border-t border-gray-700">
              {authCtx.token ? (
                <button
                  onClick={signOutHandler}
                  className="w-full py-2 px-4 text-black font-semibold rounded-lg hover:opacity-90 transition-colors duration-300"
                  style={{ backgroundColor: GOLD }}
                >
                  Cerrar Sesión
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={closeNavbar}
                  className="block w-full py-2 px-4 text-black font-semibold rounded-lg text-center hover:opacity-90 transition-colors duration-300"
                  style={{ backgroundColor: GOLD }}
                >
                  Iniciar Sesión
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="pt-20">
        <Outlet />
      </div>
    </>
  );
}

export default Index;
