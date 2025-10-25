import { CONTENT } from "../../../constants";
import "./Step2.css";

const Step2 = ({ nextStep }) => {
  const { titulo, descripcion, accion } = CONTENT.seccion_2;

  return (
    <div className="card-center">
      <h2 className="step-title">{titulo}</h2>
      <p className="description">{descripcion}</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexDirection: "column",
        }}
      >
        <p>Tu Confianza nos inspira, y por eso queremos premiarla</p>
        <button className="primary-btn" onClick={nextStep}>
          {accion?.texto_boton ?? "Continuar"}
        </button>
      </div>
    </div>
  );
};

export default Step2;
