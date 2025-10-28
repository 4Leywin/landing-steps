import React, { useRef, useEffect } from "react";
import { toPng } from "html-to-image";
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
  const wrapRef = useRef(null);
  const { name, telefono, email, visits } = data || {};
  const code = telefono
    ? `#${telefono.toString().slice(-6)}`
    : name
    ? `#${initials(name).padEnd(6, "X")}`
    : "#000000";

  const behind =
    "radial-gradient(farthest-side circle at 20% 20%, rgba(255,120,120,0.06) 0%, transparent 18%), radial-gradient(40% 60% at 80% 80%, rgba(0,255,200,0.03), transparent 10%)";
  const inner = "linear-gradient(145deg,#2b0f14cc 0%,#3b1e23aa 100%)";

  // attach interactions
  useVipInteractions(wrapRef);

  // download handler: capture the .vip-card node and save PNG
  const downloadCard = async () => {
    try {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const node = wrap.querySelector(".vip-card");
      if (!node) return;

      // Use cacheBust to avoid tainted canvas when images have CORS headers
      const dataUrl = await toPng(node, { cacheBust: true });
      const link = document.createElement("a");
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      link.download = `vip-card-${ts}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error descargando la tarjeta:", err);
      // Fallback: try to open image in new tab
      try {
        const wrap = wrapRef.current;
        const node = wrap && wrap.querySelector(".vip-card");
        if (node) {
          const dataUrl = await toPng(node, { cacheBust: true });
          window.open(dataUrl, "_blank");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div
      ref={wrapRef}
      className="vip-wrapper"
      style={{
        "--behind-gradient": behind,
        "--inner-gradient": inner,
        "--pointer-x": "50%",
        "--pointer-y": "50%",
        "--background-x": "50%",
        "--background-y": "50%",
        "--card-opacity": 0,
      }}
      aria-live="polite"
    >
      <article className="vip-card">
        <div className="vip-inside">
          <div className="vip-shine" />
          <div className="vip-glare" />

          <div className="vip-content">
            <div className="vip-header">
              <div className="vip-avatar">
                {initials(name || branding.nombre)}
              </div>
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
              <div className="vip-left">
                <div className="vip-chip" aria-hidden="true"></div>
                <div className="vip-code">{code}</div>
              </div>
              <div className="vip-quiet">Válido hasta 31/12/2025</div>
            </div>
          </div>
        </div>
      </article>

      {/* controls outside the visual card so they don't alter the composition */}
      <div className="vip-controls" aria-hidden="false">
        <button
          type="button"
          className="vip-download-btn"
          onClick={downloadCard}
          aria-label="Descargar tarjeta"
        >
          Descargar tarjeta
        </button>
      </div>
    </div>
  );
};

// ----- INTERACTION LOGIC -----
// Attach pointer/device interactions to the wrapper and update CSS variables
function useVipInteractions(wrapperRef) {
  const rafRef = useRef(null);

  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;

    // respect reduced motion
    const reduced =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
    if (reduced) return;

    // on small touch devices we simplify the card: disable pointer/device tilting
    // We only disable interactions for *touch-capable* small devices so that
    // narrow desktop windows still get the 3D tilt effect.
    const isSmallScreen =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(max-width: 520px)").matches;
    const isTouchCapable =
      typeof navigator !== "undefined" &&
      ("maxTouchPoints" in navigator
        ? navigator.maxTouchPoints > 0
        : typeof window !== "undefined" && "ontouchstart" in window);

    if (isSmallScreen && isTouchCapable) return;

    const updateVars = (wrapEl, props) => {
      if (!wrapEl) return;
      Object.entries(props).forEach(([k, v]) => wrapEl.style.setProperty(k, v));
    };

    const handlePointer = (e) => {
      const card = wrap.querySelector(".vip-card");
      if (!wrap || !card) return;
      const rect = card.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const percentX = Math.min(Math.max((100 / rect.width) * offsetX, 0), 100);
      const percentY = Math.min(
        Math.max((100 / rect.height) * offsetY, 0),
        100
      );
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      // increase sensitivity a bit so the tilt is more noticeable
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const rotateFactor = 2.8; // lower -> stronger tilt
      const props = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${Math.min(
          90,
          Math.max(10, 35 + (percentX - 50) * 0.6)
        )}%`,
        "--background-y": `${Math.min(
          90,
          Math.max(10, 35 + (percentY - 50) * 0.6)
        )}%`,
        "--pointer-from-center": `${Math.min(
          1,
          Math.hypot(centerX, centerY) / 50
        )}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        // clamp rotations to avoid extreme angles on very small cards
        "--rotate-x": `${clamp(
          (centerY / rotateFactor).toFixed(2),
          -12,
          12
        )}deg`,
        "--rotate-y": `${clamp(
          (-centerX / rotateFactor).toFixed(2),
          -12,
          12
        )}deg`,
      };

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => updateVars(wrap, props));
    };

    const handleEnter = (e) => {
      if (!wrap) return;
      wrap.classList.add("active");
      handlePointer(e);
    };

    const handleLeave = () => {
      if (!wrap) return;
      const card = wrap.querySelector(".vip-card");
      if (!card) return;

      const startX =
        parseFloat(
          (
            getComputedStyle(wrap).getPropertyValue("--pointer-x") || "50"
          ).replace("%", "")
        ) || 50;
      const startY =
        parseFloat(
          (
            getComputedStyle(wrap).getPropertyValue("--pointer-y") || "50"
          ).replace("%", "")
        ) || 50;
      const startTime = performance.now();
      const dur = 450;

      const animate = (now) => {
        const t = Math.min(1, (now - startTime) / dur);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const curX = startX + (50 - startX) * ease;
        const curY = startY + (50 - startY) * ease;
        updateVars(wrap, {
          "--pointer-x": `${curX}%`,
          "--pointer-y": `${curY}%`,
          "--background-x": `50%`,
          "--background-y": `50%`,
          "--pointer-from-center": `0`,
          "--rotate-x": `0deg`,
          "--rotate-y": `0deg`,
        });

        if (t < 1) rafRef.current = requestAnimationFrame(animate);
      };

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
      wrap.classList.remove("active");
    };

    const handleDevice = (ev) => {
      const card = wrap.querySelector(".vip-card");
      if (!wrap || !card) return;
      const { beta, gamma } = ev;
      if (typeof beta !== "number" || typeof gamma !== "number") return;
      const ox = ((gamma + 90) / 180) * card.clientWidth;
      const oy = ((beta + 90) / 180) * card.clientHeight;
      const fake = {
        clientX: card.getBoundingClientRect().left + ox,
        clientY: card.getBoundingClientRect().top + oy,
      };
      handlePointer(fake);
    };

    const card = wrap.querySelector(".vip-card");
    if (!card) return;

    card.addEventListener("pointermove", handlePointer);
    card.addEventListener("pointerenter", handleEnter);
    card.addEventListener("pointerleave", handleLeave);
    window.addEventListener("deviceorientation", handleDevice);

    // initialize
    updateVars(wrap, {
      "--pointer-x": "50%",
      "--pointer-y": "50%",
      "--rotate-x": "0deg",
      "--rotate-y": "0deg",
    });

    return () => {
      card.removeEventListener("pointermove", handlePointer);
      card.removeEventListener("pointerenter", handleEnter);
      card.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("deviceorientation", handleDevice);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [wrapperRef]);
}

export default VipCard;
