import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import "../styles/login.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
  };

  const validate = () => {
    const err = {};

    if (!form.email) err.email = "El correo es obligatorio";
    else if (!emailRegex.test(form.email))
      err.email = "Correo inválido";

    if (!form.password) err.password = "La contraseña es obligatoria";
    else if (form.password.length < 6)
      err.password = "Mínimo 6 caracteres";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const userData = await login(form);

      
      console.log("Login exitoso. Datos recibidos:", userData);

 
      const userId = userData.id || userData.userId || userData._id || userData.user?.id;

      if (!userId) {
        console.error("No se encontró ID de usuario en la respuesta:", userData);
        setErrors({ general: "Error interno: ID de usuario no recibido" });
        return;
      }

      localStorage.setItem("userId", userId);
     
      navigate("/home");
    } catch (err) {
      console.error("Error en login:", err);
      setErrors({
        general: err.message || "Correo o contraseña inválidos",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Marketplace</h2>
        <p className="subtitle">Inicia sesión</p>

        {errors.general && <div className="error-box">{errors.general}</div>}

        <div className="input-group">
          <input
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            disabled={loading}
          />
          {errors.email && <span>{errors.email}</span>}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
            disabled={loading}
          />
          {errors.password && <span>{errors.password}</span>}
        </div>

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? (
            <>
              <span className="spinner"></span>
              Entrando...
            </>
          ) : (
            "Ingresar"
          )}
        </button>

        <p className="register-link">
          ¿No tienes cuenta?{" "}
          <span onClick={() => navigate("/register")}>Regístrate</span>
        </p>
      </form>
    </div>
  );
}