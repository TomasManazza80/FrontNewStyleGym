import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from "react-google-recaptcha"; // Importa el componente ReCAPTCHA

const API_URL = import.meta.env.VITE_API_URL;

console.log(API_URL);

// Estilos (se recomienda mover a un archivo CSS o usar Tailwind CSS para mejor práctica)
const containerStyle = {
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  textAlign: 'center'
};

const formGroupStyle = {
  marginBottom: '15px',
  textAlign: 'left'
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '3px'
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  margin: '5px',
  transition: 'background-color 0.3s ease'
};

const buttonHoverStyle = {
  backgroundColor: '#0056b3'
};

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null); // Estado para el token de reCAPTCHA
  const navigate = useNavigate();

  const [hover, setHover] = useState(false);

  // **MUY IMPORTANTE:** Reemplaza 'YOUR_RECAPTCHA_SITE_KEY' con tu clave de sitio de reCAPTCHA real.
  // Idealmente, esta clave debería cargarse desde una variable de entorno para producción.
  // Ejemplo: en tu archivo .env, VITE_RECAPTCHA_SITE_KEY="tu_clave_de_sitio"
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Ld3o1ArAAAAAAg-uNDYFbSCHMiQXz_VglvGsKU6';

  // Función que se llama cuando el reCAPTCHA cambia (es completado)
  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    console.log("reCAPTCHA token:", token); // Para depuración
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Verificación básica del token en el frontend
    // Esto solo asegura que el widget fue "marcado", pero no verifica la validez con Google.
    if (!recaptchaToken) {
      toast.error('Por favor, completa el reCAPTCHA.');
      return;
    }

    axios.post(`${API_URL}/createuser`, {
      name: username,
      email: email,
      password: password,
      number: number,
      // Aunque no lo verificaremos en el backend en este ejemplo,
      // enviamos el token por si en el futuro se decide añadir la verificación.
      recaptchaToken: recaptchaToken
    })
    .then(function (response) {
      console.log(response);
      toast.success('¡Usuario creado exitosamente!');
    })
    .catch(function (error) {
      console.error("Error al crear el usuario:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Mostrar mensaje de error específico del backend
      } else {
        toast.error('Hubo un error al crear el usuario.');
      }
    })
    .finally(() => {
      // Restablecer el formulario y el token reCAPTCHA
      setUsername("");
      setEmail("");
      setPassword("");
      setNumber("");
      setRecaptchaToken(null); // Limpiar el token después del intento de envío
      // Si usas reCAPTCHA v2 y quieres resetear el checkbox visual:
      // Si tienes una ref al componente ReCAPTCHA, podrías hacer recaptchaRef.current.reset();
    });
  };

  const redireccionar = () => {
    navigate("/");
  };

  return (
    <div style={containerStyle} className="signup-container">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle} className="form-group">
          <label style={labelStyle} htmlFor="username">Nombre de usuario</label>
          <input
            style={inputStyle}
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={formGroupStyle} className="form-group">
          <label style={labelStyle} htmlFor="email">Correo electrónico</label>
          <input
            style={inputStyle}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={formGroupStyle} className="form-group">
          <label style={labelStyle} htmlFor="password">Contraseña</label>
          <input
            style={inputStyle}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div style={formGroupStyle} className="form-group">
          <label style={labelStyle} htmlFor="number">Número</label>
          <input
            style={inputStyle}
            type="text"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </div>

        {/* Componente ReCAPTCHA */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={onRecaptchaChange}
            // Puedes añadir 'hl="es"' para que el widget se muestre en español si no lo detecta automáticamente
            // hl="es"
          />
        </div>

        <button
          type="submit"
          style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Registrar
        </button>
        <button
          type="button"
          style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={redireccionar}
        >
          Volver al Inicio
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUp;