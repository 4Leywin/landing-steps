import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/firebase/auth";
import "./auth.css";

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      // store minimal session info
      window.localStorage.setItem(
        "user",
        JSON.stringify({ uid: user.uid, email: user.email })
      );
      setLoading(false);
      if (typeof onSuccess === "function") onSuccess(user);
      // after successful login, send admin users to the admin page
      navigate("/admin");
    } catch (err) {
      console.error("Login error (caught in LoginPage):", err);
      setLoading(false);
      // show code + message when available for easier debugging
      setError(
        (err &&
          (err.code ? `${err.code} — ` : "") + (err.message || String(err))) ||
          "Error al iniciar sesión"
      );
    }
  };

  return (
    <div className="auth-root">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title">Iniciar sesión</h2>
        {error && <div className="auth-error">{error}</div>}
        <label className="auth-label">Correo electrónico</label>
        <input
          className="auth-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label className="auth-label">Contraseña</label>
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button className="auth-cta" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage(props) {
  // render as a normal page component (not an overlay/portal)
  return <LoginForm {...props} />;
}
