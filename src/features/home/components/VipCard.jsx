import React from "react";
import "./VipCard.css";

const initials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const VipCard = ({ data = {}, branding = {} }) => {
  const { name, telefono, email, visits } = data || {};

  return (
    <div className="vip-card" aria-live="polite">
      <div className="vip-header">
        <div className="vip-avatar">{initials(name || branding.nombre)}</div>
        <div className="vip-meta">
          <div className="vip-badge">CLIENTE VIP</div>
          <div className="vip-brand">{branding?.nombre}</div>
        </div>
      </div>

      <div className="vip-body">
        <div className="vip-name">{name || "Nombre no disponible"}</div>
        <div className="vip-rows">
          {telefono && (
            <div className="vip-row">
              <span className="vip-row-key">Teléfono</span>
              <span className="vip-row-value">{telefono}</span>
            </div>
          )}
          {email && (
            <div className="vip-row">
              <span className="vip-row-key">Email</span>
              <span className="vip-row-value">{email}</span>
            </div>
          )}
          {visits && (
            <div className="vip-row">
              <span className="vip-row-key">Visitas</span>
              <span className="vip-row-value">{visits}</span>
            </div>
          )}
        </div>
      </div>

      <div className="vip-footer">
        <button className="vip-btn">Descargar credencial</button>
        <div className="vip-quiet">Válido hasta 31/12/2025</div>
      </div>
    </div>
  );
};

export default VipCard;
