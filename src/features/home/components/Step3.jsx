import { useState } from "react";
import { CONTENT } from "../../../constants";
import "./Step3.css";

const Step3 = ({ nextStep, setFormData }) => {
  const section = CONTENT.seccion_3;

  const [name, setName] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [visits, setVisits] = useState("");
  const [whatsapp, setWhatsapp] = useState("no");
  const [therapist, setTherapist] = useState(8);
  const [receptionist, setReceptionist] = useState(8);
  const [comment, setComment] = useState("");
  const [opinion, setOpinion] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name) e.name = "Por favor indica tu nombre";
    if (!telefono) e.telefono = "Por favor indica tu teléfono";
    if (!visits) e.visits = "Por favor indica cuántas veces te has atendido";
    if (therapist < 1 || therapist > 10) e.therapist = "Valor inválido";
    if (receptionist < 1 || receptionist > 10)
      e.receptionist = "Valor inválido";
    if (email) {
      const re = /^\S+@\S+\.\S+$/;
      if (!re.test(email)) e.email = "Correo electrónico inválido";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name,
      telefono,
      email,
      visits,
      whatsapp,
      therapist,
      receptionist,
      comment,
      opinion,
    };

    // store into parent and advance to step 4
    if (typeof setFormData === "function") setFormData(payload);
    nextStep();
  };

  return (
    <div className="form-card">
      <h2 className="step-title">{section.titulo}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label">Nombre</label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Nombre completo"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-row">
          <label className="form-label">Teléfono</label>
          <input
            name="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="form-input"
            placeholder="Teléfono o celular"
          />
          {errors.telefono && (
            <div className="form-error">{errors.telefono}</div>
          )}
        </div>

        <div className="form-row">
          <label className="form-label">Email (opcional)</label>
          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="ejemplo@correo.com"
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-row">
          <label className="form-label">
            ¿Cuántas veces te has atendido aproximadamente?
          </label>
          <input
            name="visits"
            value={visits}
            onChange={(e) => setVisits(e.target.value)}
            className="form-input"
            placeholder="Ej: 3"
          />
          {errors.visits && <div className="form-error">{errors.visits}</div>}
        </div>

        <div className="form-row">
          <label className="form-label">
            ¿Deseas recibir promociones o descuentos por WhatsApp?
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                name="whatsapp"
                checked={whatsapp === "si"}
                onChange={() => setWhatsapp("si")}
              />{" "}
              Sí
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                name="whatsapp"
                checked={whatsapp === "no"}
                onChange={() => setWhatsapp("no")}
              />{" "}
              No
            </label>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">La atención de la terapeuta</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="range"
              min="1"
              max="10"
              value={therapist}
              onChange={(e) => setTherapist(Number(e.target.value))}
              className="form-input-range"
            />
            <div className="range-value">{therapist}</div>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">La atención de la recepcionista</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="range"
              min="1"
              max="10"
              value={receptionist}
              onChange={(e) => setReceptionist(Number(e.target.value))}
              className="form-input-range"
            />
            <div className="range-value">{receptionist}</div>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">
            Comentario (¿qué cambiarías para mejorar el servicio?)
          </label>
          <textarea
            className="form-input"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu comentario aquí"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Opinión abierta (opcional)</label>
          <textarea
            className="form-input"
            rows={4}
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            placeholder="Escribe tu opinión aquí"
          />
        </div>

        <p className="form-note">{section.nota}</p>
        <button type="submit" className="primary-btn">
          {section.boton}
        </button>
      </form>
    </div>
  );
};

export default Step3;
