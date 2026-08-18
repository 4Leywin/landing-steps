import { CONTENT } from "../../../constants";
import { toSecureUrl } from "../../../services/cloudinary/index";
import "./Step2.css";

const Step2 = ({ nextStep, content }) => {
  const { titulo, descripcion, accion, src } =
    (content && content.seccion_2) || CONTENT.seccion_2;
  const mediaUrl = src?.url ? toSecureUrl(src.url) : "";

  return (
    <div className="card-center">
      {src && src.type === "image" && (
        <div className="image-container">
          <img src={mediaUrl} alt="Promotional" className="promo-image" />
        </div>
      )}
      {src && src.type === "video" && (
        <div className="video-container">
          <video controls className="promo-video" autoPlay muted loop>
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
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
