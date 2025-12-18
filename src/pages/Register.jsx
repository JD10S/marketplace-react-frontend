import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import "../styles/register.css"; 

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; 

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "El nombre completo es obligatorio";
    } else if (form.fullName.trim().length < 3) {
      newErrors.fullName = "El nombre debe tener al menos 3 caracteres";
    } else if (!nameRegex.test(form.fullName.trim())) {
      newErrors.fullName = "Solo letras y espacios";
    }

    if (!form.email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email,
        passwordHash: form.password,
      });

      navigate("/login");
    } catch (err) {
      setServerError(err.message || "Error al registrarse. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>Marketplace</h2>
        <p className="subtitle">Crea tu cuenta</p>

        {serverError && <div className="error-box">{serverError}</div>}

        <div className="input-group">
          <input
            name="fullName"
            placeholder="Nombre completo"
            value={form.fullName}
            onChange={handleChange}
            className={errors.fullName ? "error" : ""}
            disabled={loading}
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>

        <div className="input-group">
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            disabled={loading}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

  
        <div className="input-group">
          <input
            name="password"
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
            disabled={loading}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>

        <p className="login-link">
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => navigate("/login")}>Inicia sesión</span>
        </p>
      </form>
    </div>
  );
}