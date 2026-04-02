import { useState, useEffect } from "react";

// ── Fondo fijo compatible con iOS/Android ──────────────────────
function PageWrapper({ children }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh", fontFamily: "'Lato', sans-serif" }}>
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        zIndex: 0,
      }} />
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "2rem 1rem 4rem", minHeight: "100vh",
      }}>
        {children}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "rgba(255,255,255,0.30)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1.5px solid rgba(255,255,255,0.55)",
  borderRadius: 20,
};

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", margin: "0.6rem 0" }}>
      <div style={{ flex: 1, maxWidth: 70, height: 1, background: "#3a6d8c" }} />
      <div style={{ width: 7, height: 7, background: "#3a6d8c", transform: "rotate(45deg)" }} />
      <div style={{ flex: 1, maxWidth: 70, height: 1, background: "#3a6d8c" }} />
    </div>
  );
}

function BearSVG() {
  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" style={{ width: 130, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.15))" }}>
      <ellipse cx="80" cy="40" rx="14" ry="18" fill="#b0d8f0" opacity="0.9" />
      <ellipse cx="100" cy="28" rx="14" ry="18" fill="#d4c9a8" opacity="0.9" />
      <ellipse cx="120" cy="38" rx="13" ry="17" fill="#b0d8f0" opacity="0.85" />
      <ellipse cx="60" cy="52" rx="12" ry="16" fill="#d4c9a8" opacity="0.85" />
      <ellipse cx="140" cy="50" rx="12" ry="16" fill="#b0d8f0" opacity="0.8" />
      <line x1="80" y1="58" x2="95" y2="100" stroke="#888" strokeWidth="1" opacity="0.5" />
      <line x1="100" y1="46" x2="98" y2="100" stroke="#888" strokeWidth="1" opacity="0.5" />
      <line x1="120" y1="55" x2="102" y2="100" stroke="#888" strokeWidth="1" opacity="0.5" />
      <line x1="60" y1="68" x2="93" y2="100" stroke="#888" strokeWidth="1" opacity="0.5" />
      <line x1="140" y1="66" x2="105" y2="100" stroke="#888" strokeWidth="1" opacity="0.5" />
      <ellipse cx="100" cy="180" rx="38" ry="48" fill="#c8a06e" />
      <ellipse cx="100" cy="190" rx="22" ry="28" fill="#e2c08e" />
      <ellipse cx="62" cy="165" rx="14" ry="10" fill="#c8a06e" transform="rotate(-30 62 165)" />
      <ellipse cx="138" cy="165" rx="14" ry="10" fill="#c8a06e" transform="rotate(30 138 165)" />
      <ellipse cx="82" cy="222" rx="16" ry="10" fill="#c8a06e" />
      <ellipse cx="118" cy="222" rx="16" ry="10" fill="#c8a06e" />
      <circle cx="100" cy="130" r="36" fill="#c8a06e" />
      <circle cx="72" cy="102" r="14" fill="#c8a06e" />
      <circle cx="72" cy="102" r="8" fill="#e2c08e" />
      <circle cx="128" cy="102" r="14" fill="#c8a06e" />
      <circle cx="128" cy="102" r="8" fill="#e2c08e" />
      <ellipse cx="100" cy="138" rx="18" ry="14" fill="#e2c08e" />
      <circle cx="88" cy="124" r="5" fill="#3a2a1a" />
      <circle cx="112" cy="124" r="5" fill="#3a2a1a" />
      <circle cx="90" cy="122" r="2" fill="white" opacity="0.7" />
      <circle cx="114" cy="122" r="2" fill="white" opacity="0.7" />
      <ellipse cx="100" cy="135" rx="6" ry="4" fill="#8a5a3a" />
      <path d="M93 140 Q100 147 107 140" stroke="#8a5a3a" strokeWidth="1.5" fill="none" />
      <path d="M86 152 Q100 145 114 152 Q100 159 86 152Z" fill="#b0d8f0" opacity="0.9" />
      <circle cx="100" cy="152" r="4" fill="#7ab8d8" />
      <circle cx="97" cy="105" r="8" fill="#c8a06e" />
    </svg>
  );
}

// ── Página principal ───────────────────────────────────────────
function Home() {
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!name.trim() || !count) {
      setStatus("error");
      setMsg("Por favor completa tu nombre y número de personas.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: name.trim(), cantidad: Number(count) }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setMsg(`¡Gracias ${name.trim()}! Confirmamos ${count} persona${count == 1 ? "" : "s"}. ¡Nos vemos el 26 de abril! 🩵`);
      setName("");
      setCount("");
    } catch {
      setStatus("error");
      setMsg("Hubo un error al guardar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div style={{ marginBottom: "-1rem", marginTop: "0.5rem" }}>
      
      </div>

      {/* Card principal */}
      <div style={{ ...cardStyle, padding: "2rem 2rem 1.5rem", maxWidth: 480, width: "100%", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.6rem", fontWeight: 700, color: "#1a3a5c", lineHeight: 1, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>
          Baby<br />Shower
        </h1>
        <p style={{ fontSize: "0.75rem", letterSpacing: 3, color: "#3a6d8c", textTransform: "uppercase", margin: "0.6rem 0 0.8rem" }}>
          Te invitamos a celebrar la llegada de nuestro bebé
        </p>
        <Divider />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#1a3a5c", letterSpacing: 4, textTransform: "uppercase", margin: "0.3rem 0" }}>
          Liam Alejandro
        </h2>
        <Divider />
        <p style={{ fontSize: "0.72rem", letterSpacing: 3, color: "#3a6d8c", textTransform: "uppercase", margin: "1.2rem 0 0.8rem" }}>
          Detalles del evento
        </p>
        <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 12, padding: "1rem 1.2rem", textAlign: "left" }}>
          {[
            { icon: "📅", text: <span>Domingo <strong>26 de Abril</strong></span> },
            { icon: "🕑", text: <strong>2:00 PM</strong> },
            { icon: "📍", text: "San Andrés 2306, Los Cajetes, 45234 Zapopan, Jal." },
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 2 ? "0.5rem" : 0, fontSize: "0.9rem", color: "#1a3a5c" }}>
              <span style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>{d.icon}</span>
              <span>{d.text}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "#3a6d8c", letterSpacing: 2, textTransform: "uppercase", margin: "1.2rem 0 0" }}>
          Confirmar antes del 15 de abril
        </p>
      </div>

      {/* Formulario */}
      <div style={{ ...cardStyle, padding: "1.5rem", maxWidth: 480, width: "100%", marginTop: "1.5rem" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#1a3a5c", marginBottom: "1rem", textAlign: "center", fontWeight: 400 }}>
          Confirmar asistencia
        </h3>
        {[
          { label: "Nombre completo", type: "text", val: name, set: setName, placeholder: "Tu nombre" },
          { label: "Número de personas", type: "number", val: count, set: setCount, placeholder: "¿Cuántos van?" },
        ].map((f, i) => (
          <div key={i} style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#3a6d8c", marginBottom: 6 }}>
              {f.label}
            </label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={f.val}
              min={f.type === "number" ? 1 : undefined}
              max={f.type === "number" ? 20 : undefined}
              onChange={(e) => { setStatus(null); f.set(e.target.value); }}
              style={{
                width: "100%", padding: "10px 14px",
                border: "1.5px solid rgba(255,255,255,0.7)", borderRadius: 10,
                fontSize: "0.95rem", fontFamily: "'Lato', sans-serif",
                background: "rgba(255,255,255,0.35)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                color: "#1a3a5c", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        ))}
        <button
          onClick={handleConfirm}
          disabled={loading}
          style={{
            width: "100%", padding: 12,
            background: loading ? "rgba(122,154,184,0.7)" : "rgba(26,58,92,0.85)",
            color: "white", border: "none", borderRadius: 10,
            fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Lato', sans-serif", marginTop: "0.5rem",
          }}
        >
          {loading ? "Guardando..." : "Confirmar asistencia"}
        </button>
        {status && (
          <div style={{
            marginTop: "0.75rem",
            background: status === "success" ? "rgba(200,245,220,0.6)" : "rgba(255,220,200,0.6)",
            borderRadius: 10, padding: "0.9rem", textAlign: "center",
            color: status === "success" ? "#1a5c3a" : "#8a3a1a", fontSize: "0.9rem",
          }}>
            {msg}
          </div>
        )}
      </div>

      {/* Mapa */}
      <div style={{ ...cardStyle, maxWidth: 480, width: "100%", marginTop: "1.5rem", overflow: "hidden" }}>
        <div style={{ background: "rgba(26,58,92,0.75)", color: "white", textAlign: "center", padding: 10, fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase" }}>
          📍 Ubicación del evento
        </div>
        <iframe
          title="Mapa"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.1!2d-103.407!3d20.668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSan+Andr%C3%A9s+2306%2C+Los+Cajetes%2C+Zapopan%2C+Jalisco!5e0!3m2!1ses!2smx!4v1680000000000!5m2!1ses!2smx&q=San+Andr%C3%A9s+2306,+Los+Cajetes,+Zapopan,+Jalisco"
          style={{ width: "100%", height: 280, border: "none", display: "block" }}
          allowFullScreen loading="lazy"
        />
      </div>

      <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "rgba(26,58,92,0.75)", letterSpacing: 2, textTransform: "uppercase", textAlign: "center" }}>
        Con amor, esperando a Liam Alejandro 🩵
      </p>
    </PageWrapper>
  );
}

// ── Página /confirmados ────────────────────────────────────────
function Confirmados() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmandoBorrar, setConfirmandoBorrar] = useState(false);
  const [borrando, setBorrando] = useState(false);

  const cargar = () => {
    setLoading(true);
    fetch("/api/confirmados")
      .then((r) => r.json())
      .then((d) => { setLista(d.confirmados); setLoading(false); })
      .catch(() => { setError("No se pudo cargar la lista."); setLoading(false); });
  };

  useEffect(() => { cargar(); }, []);

  const total = lista.reduce((acc, c) => acc + c.cantidad, 0);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  };

  const descargarExcel = () => {
    window.location.href = "/api/confirmados/excel";
  };

  const borrarTodo = async () => {
    if (!confirmandoBorrar) {
      setConfirmandoBorrar(true);
      return;
    }
    setBorrando(true);
    try {
      await fetch("/api/confirmados", { method: "DELETE" });
      setLista([]);
      setConfirmandoBorrar(false);
    } catch {
      setError("No se pudo borrar.");
    } finally {
      setBorrando(false);
    }
  };

  const btnBase = {
    padding: "10px 18px", borderRadius: 10, fontSize: "0.78rem",
    letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
    fontFamily: "'Lato', sans-serif", border: "none", fontWeight: 700,
  };

  return (
    <PageWrapper>
      <div style={{ maxWidth: 520, width: "100%", marginTop: "1rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#1a3a5c", letterSpacing: 2, textTransform: "uppercase" }}>
            Confirmados
          </h1>
          <p style={{ fontSize: "0.72rem", letterSpacing: 3, color: "#3a6d8c", textTransform: "uppercase", marginTop: 6 }}>
            Baby Shower · Liam Alejandro
          </p>
          <Divider />
        </div>

        {/* Totales */}
        {!loading && !error && (
          <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem" }}>
            {[
              { label: "Familias", value: lista.length },
              { label: "Total personas", value: total },
            ].map((m, i) => (
              <div key={i} style={{ ...cardStyle, flex: 1, padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1a3a5c", fontFamily: "'Playfair Display', serif" }}>{m.value}</div>
                <div style={{ fontSize: "0.72rem", letterSpacing: 2, textTransform: "uppercase", color: "#3a6d8c", marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Botones de acción */}
        {!loading && !error && lista.length > 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: "1rem", flexWrap: "wrap" }}>
            {/* Descargar Excel */}
            <button
              onClick={descargarExcel}
              style={{ ...btnBase, background: "rgba(26,92,58,0.82)", color: "white", flex: 1, minWidth: 140 }}
            >
              ⬇ Descargar Excel
            </button>

            {/* Borrar todo — doble confirmación */}
            <button
              onClick={borrarTodo}
              disabled={borrando}
              style={{
                ...btnBase, flex: 1, minWidth: 140,
                background: confirmandoBorrar ? "rgba(162,45,45,0.85)" : "rgba(255,255,255,0.35)",
                color: confirmandoBorrar ? "white" : "#8a3a1a",
                border: "1.5px solid rgba(162,45,45,0.5)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              }}
            >
              {borrando ? "Borrando..." : confirmandoBorrar ? "⚠ Confirmar borrado" : "🗑 Borrar todo"}
            </button>

            {/* Cancelar borrado */}
            {confirmandoBorrar && (
              <button
                onClick={() => setConfirmandoBorrar(false)}
                style={{ ...btnBase, background: "rgba(255,255,255,0.35)", color: "#3a6d8c", border: "1.5px solid rgba(255,255,255,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", flex: 1, minWidth: 100 }}
              >
                Cancelar
              </button>
            )}
          </div>
        )}

        {/* Lista */}
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          {loading && <div style={{ padding: "2rem", textAlign: "center", color: "#3a6d8c", fontSize: "0.9rem" }}>Cargando...</div>}
          {error && <div style={{ padding: "2rem", textAlign: "center", color: "#8a3a1a", fontSize: "0.9rem" }}>{error}</div>}
          {!loading && !error && lista.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "#3a6d8c", fontSize: "0.9rem" }}>Aún no hay confirmaciones 🩵</div>
          )}
          {!loading && lista.map((c, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.9rem 1.2rem", gap: 12,
              borderBottom: i < lista.length - 1 ? "1px solid rgba(176,216,240,0.35)" : "none",
            }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(176,216,240,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.95rem", color: "#1a3a5c", flexShrink: 0 }}>
                {c.nombre.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "#1a3a5c", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.nombre}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#3a6d8c", marginTop: 2 }}>{formatDate(c.fecha)}</div>
              </div>
              <div style={{ background: "rgba(26,58,92,0.8)", color: "white", borderRadius: 20, padding: "4px 14px", fontSize: "0.82rem", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}>
                {c.cantidad} {c.cantidad === 1 ? "persona" : "personas"}
              </div>
            </div>
          ))}
        </div>

        {/* Botón volver */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a href="/" style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#1a3a5c", textDecoration: "none", ...cardStyle, padding: "10px 24px", borderRadius: 10, display: "inline-block" }}>
            ← Volver a la invitación
          </a>
        </div>
      </div>
    </PageWrapper>
  );
}

// ── Router simple ──────────────────────────────────────────────
export default function App() {
  const path = window.location.pathname;
  return path === "/confirmados" ? <Confirmados /> : <Home />;
}
