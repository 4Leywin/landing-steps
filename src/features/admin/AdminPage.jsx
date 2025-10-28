import { getById, setDocument } from "../../services/firebase/content";
import React, { useState, useEffect } from "react";
import { CONTENT as DEFAULT_CONTENT } from "../../constants";
import {
  uploadImageFile,
  uploadVideoFile,
} from "../../services/cloudinary/index";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase/auth";

export default function AdminPage() {
  const [content, setContent] = useState(() =>
    JSON.parse(JSON.stringify(DEFAULT_CONTENT))
  );
  const [status, setStatus] = useState(null);
  const [statusObj, setStatusObj] = useState(null);
  const statusTimer = React.useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  // single fixed document id used for content
  const DOCUMENT_ID = "site_content";
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  function updatePath(path, value) {
    const parts = path.split(".");
    const next = { ...content };
    let cur = next;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      cur[p] = { ...(cur[p] || {}) };
      cur = cur[p];
    }

    cur[parts[parts.length - 1]] = value;
    setContent(next);
  }

  // Load the single fixed document from Firestore
  // Redirect / check auth
  // helper to show a toast/status with auto-hide
  function showStatus(type, message, ms = 4500) {
    // clear previous
    if (statusTimer.current) {
      clearTimeout(statusTimer.current);
      statusTimer.current = null;
    }
    setStatusObj({ type, message });
    // also set plain status for backward compat where used
    setStatus(message);
    if (ms > 0) {
      statusTimer.current = setTimeout(() => {
        setStatusObj(null);
        setStatus(null);
        statusTimer.current = null;
      }, ms);
    }
  }

  // Load the single fixed document from Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  // Load the single fixed document from Firestore once auth checked
  useEffect(() => {
    if (checkingAuth) return;
    let mounted = true;
    async function load() {
      try {
        const id = DOCUMENT_ID;
        const doc = await getById("content", id);
        if (!mounted) return;
        if (doc) {
          const merged = { ...DEFAULT_CONTENT, ...doc };
          delete merged.id;
          setContent(merged);
          showStatus("success", "Contenido cargado desde Firestore");
        } else {
          showStatus(
            "info",
            "No hay documento en Firestore (content/site_content). Usando valores por defecto."
          );
        }
      } catch (err) {
        console.error("Error loading content from Firestore:", err);
        showStatus("error", "Error al cargar contenido desde Firestore");
      }
    }
    load();
    return () => (mounted = false);
  }, [checkingAuth]);

  async function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const type = content.seccion_2?.src?.type || "image";
    setUploading(true);
    showStatus("info", "Subiendo archivo...");
    try {
      let url;
      if (type === "video") {
        url = await uploadVideoFile(file, "admin_uploads");
      } else {
        url = await uploadImageFile(file, "admin_uploads");
      }
      updatePath("seccion_2.src.url", url);
      showStatus("success", "Subida completa");
    } catch (err) {
      console.error(err);
      showStatus("error", "Error al subir archivo");
    } finally {
      setUploading(false);
    }
  }

  function handleSave() {
    (async () => {
      setIsSaving(true);
      showStatus("info", "Guardando contenido...");
      try {
        const id = DOCUMENT_ID;
        await setDocument("content", id, content);
        showStatus(
          "success",
          `Contenido guardado en content/${id} (Firestore)`
        );
        // also keep a local copy for fast reloads
        window.localStorage.setItem(
          "content_override",
          JSON.stringify(content)
        );
      } catch (err) {
        console.error(err);
        showStatus(
          "error",
          "Error al guardar contenido (Firestore). Se guardará en localStorage"
        );
        try {
          window.localStorage.setItem(
            "content_override",
            JSON.stringify(content)
          );
        } catch (e) {
          console.error(e);
        }
      } finally {
        setIsSaving(false);
      }
    })();
  }

  function handleReset() {
    window.localStorage.removeItem("content_override");
    setContent(JSON.parse(JSON.stringify(DEFAULT_CONTENT)));
    showStatus("success", "Restablecido al contenido por defecto");
  }

  if (checkingAuth) {
    return (
      <div className="admin-root">
        <div className="admin-card">
          <h2>Comprobando sesión...</h2>
        </div>
      </div>
    );
  }

  // Toast / status banner render
  function renderStatus() {
    if (!statusObj) return null;
    const type = statusObj.type || "info";
    return (
      <div className={`admin-toast ${type}`} role="status">
        <div className="admin-toast-inner">
          <div className="admin-toast-icon">
            {type === "success" ? "✔" : type === "error" ? "✖" : "ℹ"}
          </div>
          <div className="admin-toast-message">{statusObj.message}</div>
          <button
            className="admin-toast-close"
            onClick={() => {
              if (statusTimer.current) clearTimeout(statusTimer.current);
              setStatusObj(null);
              setStatus(null);
            }}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <div className="admin-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2>Admin — Editar contenido</h2>
          <div className="admin-actions">
            <button
              className="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  Guardando...
                  <span className="admin-spinner" aria-hidden="true" />
                </>
              ) : (
                "Guardar"
              )}
            </button>
            <button
              className="danger"
              onClick={handleReset}
              disabled={isSaving}
            >
              Restablecer
            </button>
          </div>
        </div>
        {renderStatus()}

        <div>
          <div className="admin-grid">
            <div className="admin-section">
              <h3>Sección 1</h3>
              <label>Título</label>
              <input
                className="admin-input"
                value={content.seccion_1.titulo || ""}
                onChange={(e) => updatePath("seccion_1.titulo", e.target.value)}
              />
              <label>Subtítulo</label>
              <input
                className="admin-input"
                value={content.seccion_1.subtitulo || ""}
                onChange={(e) =>
                  updatePath("seccion_1.subtitulo", e.target.value)
                }
              />
              <label>Descripción</label>
              <textarea
                className="admin-textarea"
                value={content.seccion_1.descripcion || ""}
                onChange={(e) =>
                  updatePath("seccion_1.descripcion", e.target.value)
                }
                rows={5}
              />
            </div>

            <div className="admin-section" style={{ marginTop: 12 }}>
              <h3>Sección 2 (media)</h3>
              <label>Título</label>
              <input
                className="admin-input"
                value={content.seccion_2.titulo || ""}
                onChange={(e) => updatePath("seccion_2.titulo", e.target.value)}
              />
              <label>Descripción</label>
              <textarea
                className="admin-textarea"
                value={content.seccion_2.descripcion || ""}
                onChange={(e) =>
                  updatePath("seccion_2.descripcion", e.target.value)
                }
                rows={5}
              />

              <label>Tipo de media</label>
              <select
                className="admin-select"
                value={content.seccion_2.src?.type || "video"}
                onChange={(e) =>
                  updatePath("seccion_2.src.type", e.target.value)
                }
              >
                <option value="video">Video</option>
                <option value="image">Imagen</option>
                <option value="none">Ninguno</option>
              </select>

              <label>URL (si ya tienes una)</label>
              <input
                className="admin-input"
                value={content.seccion_2.src?.url || ""}
                onChange={(e) =>
                  updatePath("seccion_2.src.url", e.target.value)
                }
              />

              <label>Subir archivo (imagen o video según el tipo)</label>
              <input
                className="admin-file"
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {uploading && <div className="admin-note">Subiendo...</div>}
              {/* Vista previa inline para la sección 2 */}
              <div
                className="admin-preview admin-preview-inline"
                style={{ marginTop: 12 }}
              >
                <h4>Vista previa</h4>
                <div className="media-wrap">
                  {content.seccion_2.src?.url ? (
                    content.seccion_2.src.type === "video" ? (
                      <video src={content.seccion_2.src.url} controls />
                    ) : (
                      <img src={content.seccion_2.src.url} alt="preview" />
                    )
                  ) : (
                    <div className="admin-note">No hay media</div>
                  )}
                </div>
              </div>
            </div>

            <div className="admin-section" style={{ marginTop: 12 }}>
              <h3>Sección 3</h3>
              <label>Título</label>
              <input
                className="admin-input"
                value={content.seccion_3.titulo || ""}
                onChange={(e) => updatePath("seccion_3.titulo", e.target.value)}
              />
              <label>Botón</label>
              <input
                className="admin-input"
                value={content.seccion_3.boton || ""}
                onChange={(e) => updatePath("seccion_3.boton", e.target.value)}
              />
              <label>Mensaje de éxito</label>
              <input
                className="admin-input"
                value={content.seccion_3.mensaje_exito || ""}
                onChange={(e) =>
                  updatePath("seccion_3.mensaje_exito", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
