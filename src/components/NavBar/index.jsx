import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faHome, faCalendar, faChartBar, faUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import logo from "../../../src/images/logoG.png";
import authContext from "../../store/store";
import { useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API_URL = "https://newstylegym-back.onrender.com";

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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-[#2C2C2E]" 
            : "bg-[#0A0A0A]"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-center lg:justify-start">
            <img
              src={logo}
              alt="NEW STYLE GYM"
              className="h-9 md:h-10 lg:h-11 w-auto max-w-[140px] sm:max-w-[160px] md:max-w-[180px] opacity-90 transition-all duration-300 hover:opacity-100"
            />
          </div>

          <div className="hidden lg:flex items-center space-x-0.5">
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
                className="px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 hover:bg-[#1C1C1E] active:scale-[0.98]"
                style={({ isActive }) => ({
                  color: isActive ? "#FFFFFF" : "#8E8E93",
                  backgroundColor: isActive ? "#1C1C1E" : "transparent",
                })}
              >
                {link.label}
              </NavLink>
            ))}
            {role === "admin" && (
              <NavLink
                to="/admin"
                className="px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 hover:bg-[#1C1C1E] active:scale-[0.98]"
                style={({ isActive }) => ({
                  color: isActive ? "#FFFFFF" : "#8E8E93",
                  backgroundColor: isActive ? "#1C1C1E" : "transparent",
                })}
              >
                Admin
              </NavLink>
            )}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {authCtx.token ? (
              <button
                onClick={signOutHandler}
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-[0.98] hover:bg-[#1C1C1E]"
                style={{ 
                  backgroundColor: "#1C1C1E", 
                  color: "#FFFFFF",
                  border: "1px solid #2C2C2E"
                }}
              >
                Cerrar Sesión
              </button>
            ) : (
              <NavLink
                to="/login"
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-[0.98]"
                style={{ 
                  backgroundColor: "#1C1C1E", 
                  color: "#FFFFFF",
                  border: "1px solid #2C2C2E"
                }}
              >
                Iniciar Sesión
              </NavLink>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={toggleHandler}
              className="p-2.5 rounded-2xl transition-all duration-300 active:scale-[0.95]"
              style={{ 
                backgroundColor: toggle ? "#1C1C1E" : "transparent",
                border: "1px solid #2C2C2E"
              }}
            >
              <FontAwesomeIcon
                icon={toggle ? faXmark : faBars}
                className="text-lg"
                style={{ color: "#FFFFFF" }}
              />
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-[#0A0A0A]/98 backdrop-blur-xl transform transition-transform duration-500 ease-out z-40 ${
            toggle ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-6 pt-24 h-full flex flex-col">
            <div className="flex-1 space-y-2">
              {[
                { to: "/", label: "Inicio", icon: faHome },
                { to: "/products", label: "Pagos", icon: null },
                { to: "/rutina", label: "Mi Rutina", icon: null },
                { to: "/about", label: "Información", icon: null },
                { to: "/contact", label: "Contacto", icon: null },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeNavbar}
                  className="flex items-center px-5 py-4 rounded-[20px] text-base font-medium transition-all duration-300 active:scale-[0.98]"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? "#1C1C1E" : "transparent",
                    color: isActive ? "#FFFFFF" : "#8E8E93",
                    border: "1px solid",
                    borderColor: isActive ? "#2C2C2E" : "transparent",
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
              {role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={closeNavbar}
                  className="flex items-center px-5 py-4 rounded-[20px] text-base font-medium transition-all duration-300 active:scale-[0.98]"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? "#1C1C1E" : "transparent",
                    color: isActive ? "#FFFFFF" : "#8E8E93",
                    border: "1px solid",
                    borderColor: isActive ? "#2C2C2E" : "transparent",
                  })}
                >
                  Panel de Administración
                </NavLink>
              )}
            </div>
            <div className="pt-6 pb-8 border-t border-[#2C2C2E]">
              {authCtx.token ? (
                <button
                  onClick={signOutHandler}
                  className="w-full py-4 px-5 rounded-[20px] font-semibold transition-all duration-300 active:scale-[0.98]"
                  style={{ 
                    backgroundColor: "#1C1C1E", 
                    color: "#FFFFFF",
                    border: "1px solid #2C2C2E"
                  }}
                >
                  Cerrar Sesión
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={closeNavbar}
                  className="block w-full py-4 px-5 rounded-[20px] font-semibold text-center transition-all duration-300 active:scale-[0.98]"
                  style={{ 
                    backgroundColor: "#1C1C1E", 
                    color: "#FFFFFF",
                    border: "1px solid #2C2C2E"
                  }}
                >
                  Iniciar Sesión
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-[72px] md:pt-[80px]">
        <Outlet />
      </div>
    </>
  );
}

export default Index;