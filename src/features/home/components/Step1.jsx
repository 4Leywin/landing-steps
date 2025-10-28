import { CONTENT } from "../../../constants";
import "./Step1.css";

const Step1 = ({ nextStep, content }) => {
  const s = (content && content.seccion_1) || CONTENT.seccion_1;
  return (
    <div className="hero">
      <div>
        <h2 className="step-title">{s.titulo}</h2>
        <h3 className="step-subtitle">{s.subtitulo}</h3>
      </div>

      <p className="description">{s.descripcion}</p>

      <div className="cta-col">
        <div className="hero-note">{s.accion.indicacion}</div>
        <button className="primary-btn" onClick={nextStep}>
          {s.accion.texto_boton}
        </button>
      </div>
    </div>
  );
};

export default Step1;
