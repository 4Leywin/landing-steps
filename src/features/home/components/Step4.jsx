import { CONTENT } from "../../../constants";
import "./Step4.css";
import VipCard from "./VipCard";

const Step4 = ({ formData, content }) => {
  const { beneficio_extra, branding } =
    (content && content.seccion_4) || CONTENT.seccion_4;

  return (
    <div className="result-card">
      {formData ? (
        <VipCard
          data={formData}
          branding={branding}
          validUntil={beneficio_extra?.expiry_date}
        />
      ) : (
        <h2 className="step-title">{branding?.nombre}</h2>
      )}

      <p className="description">{beneficio_extra?.descripcion}</p>

      <div
        style={{
          width: "100%",
          display: "flex",
          gap: 12,
          justifyContent: "center",
        }}
      >
        <span className="benefit-badge">{beneficio_extra?.boton}</span>
      </div>

      <div className="branding">{branding?.logo}</div>
    </div>
  );
};

export default Step4;
