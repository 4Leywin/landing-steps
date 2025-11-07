const DEFAULT_CONTENT = {
  // site-level editable title shown in header
  site_title: "Luxury Star Spa",
  seccion_1: {
    titulo: "Tarjeta VIP",
    subtitulo: "Tu fidelidad se convierte en privilegio",
    descripcion:
      "Tu confianza nos inspira y por eso queremos premiarla: disfruta 1 hora de masaje por 140 soles con la terapeuta de tu preferencia. Beneficio válido durante lo que queda del año 2025.",
    accion: {
      texto_boton: "Quiero la tarjeta de fidelización",
      indicacion: "Sólo tienes que inscribirte",
    },
  },
  seccion_2: {
    titulo: "Te falta poco para ser nuestro cliente VIP",
    descripcion:
      "Solo llena este formulario de Fidelización y una mini encuesta .",
    accion: {
      texto_boton: "Quiero inscribirme ahora",
    },
    src: {
      type: "video",
      url: "https://youtu.be/5ZR6wWhQJ6I",
    },
  },
  seccion_3: {
    titulo: "Formulario de fidelización y encuesta",
    campos: [],
    boton: "Enviar encuesta",
    nota: "Contesta del 1 al 10 (1 = malo, 10 = excelente). Todas tus respuestas son confidenciales y nos ayudarán a mejorar.",
    mensaje_exito: "Gracias — tu respuesta ha sido registrada correctamente.",
  },
  seccion_4: {
    beneficio_extra: {
      descripcion:
        "Puedes ir en cualquier día de la semana y disfrutar. Si agendas HOY, podrás venir cualquier día de la semana y disfrutar de un beneficio extra: AMBIENTE PREMIUM sin un coste alguno, disponible para ti hasta fin de año.",
      boton: "Cliente VIP + Ambiente Premium",
      expiry_date: "31/12/2025",
    },
    branding: {
      nombre: "Luxury Star Spa",
      logo: "Luxury Star Spa",
    },
  },
};

// Allow an admin to override content at runtime by saving a JSON string
// under localStorage key `content_override`. This makes it possible to
// edit content from an admin page without editing source files.
function loadContent() {
  try {
    const raw = window.localStorage.getItem("content_override");
    if (raw) {
      const parsed = JSON.parse(raw);
      // If parsed looks valid, return it. Otherwise fall back to default.
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (e) {
    // ignore parse errors and fall back to default
    console.warn("Failed to parse content_override from localStorage:", e);
  }
  return DEFAULT_CONTENT;
}

export const CONTENT = loadContent();
