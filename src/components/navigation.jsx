import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Estilos comunes para los botones
const commonButtonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  borderRadius: '8px',
  fontSize: '1em',
  fontWeight: '600',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: '5px',
};

// Estilo de hover para los botones
const buttonHoverStyle = {
  backgroundColor: '#0056b3',
  transform: 'translateY(-2px)',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
};

// Estilos para la barra de navegación
const navStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo negro semitransparente
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // Borde inferior sutil blanco transparente
  padding: '10px 0',
  height: 'auto',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)', // Sombra más pronunciada para el fondo oscuro
};

// Estilos para los enlaces de navegación
const navLinkStyle = {
  color: '#f8f9fa', // Color de texto blanco sutil
  transition: 'color 0.3s ease',
  padding: '10px 15px',
  display: 'block',
};

const navLinkHoverStyle = {
  color: '#00aaff', // Azul más vibrante al hacer hover
};

const NavbarBrandStyle = {
  color: '#f8f9fa', // Color de texto blanco sutil para la marca
  fontWeight: '700',
  fontSize: '1.5em',
  textDecoration: 'none',
};

// Componente para el botón de Registro
const RedirectSingUp = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const handleRedirect = () => {
    navigate("/SingUp");
  };

  return (
    <button
      style={hover ? { ...commonButtonStyle, ...buttonHoverStyle } : commonButtonStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleRedirect}
    >
      Registro
    </button>
  );
};

// Componente para el botón de Login
const RedirectLogin = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <button
      style={hover ? { ...commonButtonStyle, ...buttonHoverStyle } : commonButtonStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleRedirect}
    >
      Login
    </button>
  );
};

// Componente para el botón de Cerrar Sesión
const LogoutButton = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const handleLogout = () => {
    // Aquí podrías agregar lógica para cerrar la sesión, como limpiar tokens, etc.
    navigate("/");
  };

  return (
    <button
      style={hover ? { ...commonButtonStyle, ...buttonHoverStyle } : commonButtonStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleLogout}
    >
      Cerrar Sesión
    </button>
  );
};

export const Navigation = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <nav
      id="menu"
      className="navbar navbar-default navbar-fixed-top navBarMain"
      style={navStyle}
    >
      <div className="container">
        <div className="navbar-header">
          {/* Botón de alternar navegación (hamburguesa) */}
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            aria-expanded="false"
            style={{
              borderColor: '#f8f9fa', // Borde blanco para el botón de hamburguesa
              backgroundColor: 'transparent',
            }}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" style={{ backgroundColor: '#f8f9fa' }}></span> {/* Iconos blancos */}
            <span className="icon-bar" style={{ backgroundColor: '#f8f9fa' }}></span>
            <span className="icon-bar" style={{ backgroundColor: '#f8f9fa' }}></span>
          </button>
          {/* Enlace de marca/logo - Sin espacio para el carrito */}
          <a
            className="navbar-brand page-scroll"
            href="#page-top"
            style={NavbarBrandStyle}
          >
            Tu Marca/Logo Aquí
          </a>
        </div>

        {/* Contenido colapsable de la barra de navegación */}
        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
          style={{
            '@media (max-width: 767px)': {
              borderTop: '1px solid rgba(255, 255, 255, 0.1)', // Separador blanco transparente en móvil
              marginTop: '10px',
              paddingBottom: '10px',
            }
          }}
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a
                href="#Header"
                className="page-scroll"
                style={navLinkStyle}
                onMouseOver={(e) => (e.target.style.color = navLinkHoverStyle.color)}
                onMouseOut={(e) => (e.target.style.color = navLinkStyle.color)}
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="page-scroll"
                style={navLinkStyle}
                onMouseOver={(e) => (e.target.style.color = navLinkHoverStyle.color)}
                onMouseOut={(e) => (e.target.style.color = navLinkStyle.color)}
              >
                Cirugías
              </a>
            </li>
            <li>
              <a
                href="#team"
                className="page-scroll"
                style={navLinkStyle}
                onMouseOver={(e) => (e.target.style.color = navLinkHoverStyle.color)}
                onMouseOut={(e) => (e.target.style.color = navLinkStyle.color)}
              >
                Doctores
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="page-scroll"
                style={navLinkStyle}
                onMouseOver={(e) => (e.target.style.color = navLinkHoverStyle.color)}
                onMouseOut={(e) => (e.target.style.color = navLinkStyle.color)}
              >
                Información
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="page-scroll"
                style={navLinkStyle}
                onMouseOver={(e) => (e.target.style.color = navLinkHoverStyle.color)}
                onMouseOut={(e) => (e.target.style.color = navLinkStyle.color)}
              >
                Servicios
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="page-scroll"
                style={navLinkStyle}
                onMouseOver={(e) => (e.target.style.color = navLinkHoverStyle.color)}
                onMouseOut={(e) => (e.target.style.color = navLinkStyle.color)}
              >
                Contacto
              </a>
            </li>
            {isAuthenticated ? (
              <li>
                <LogoutButton />
              </li>
            ) : (
              <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', '@media (max-width: 767px)': { flexDirection: 'column' } }}>
                <RedirectLogin />
                <RedirectSingUp />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};