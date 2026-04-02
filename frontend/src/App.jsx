import { useState, useEffect } from "react";

// ── Fondo fijo compatible iOS/Android ─────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= 640);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", margin: "0.6rem 0" }}>
      <div style={{ flex: 1, maxWidth: 70, height: 1, background: "#3a6d8c" }} />
      <div style={{ width: 7, height: 7, background: "#3a6d8c", transform: "rotate(45deg)" }} />
      <div style={{ flex: 1, maxWidth: 70, height: 1, background: "#3a6d8c" }} />
    </div>
  );
}

function BearSVG({ size = 130 }) {
  return (
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.15))" }}>
      
    </svg>
  );
}

// ── Página principal ───────────────────────────────────────────
function Home() {
  const isMobile = useIsMobile();
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

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
      setFormOpen(false);
    } catch {
      setStatus("error");
      setMsg("Hubo un error al guardar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // En móvil el ancho del card es 78% de la pantalla
  const cardWidth = isMobile ? "78%" : "100%";
  const maxW = isMobile ? 360 : 480;

  return (
    <PageWrapper>
      {/* Osito — más pequeño en móvil */}
      <div style={{ marginBottom: "-1rem", marginTop: "0.5rem" }}>
        <BearSVG/>
      </div>

      {/* Card principal */}
      <div style={{ ...cardStyle, padding: isMobile ? "1.2rem 1rem 1rem" : "2rem 2rem 1.5rem", width: cardWidth, maxWidth: maxW, textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? "1.8rem" : "2.6rem", fontWeight: 700, color: "#1a3a5c", lineHeight: 1, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>
          Baby<br />Shower
        </h1>
        <p style={{ fontSize: isMobile ? "0.62rem" : "0.75rem", letterSpacing: 3, color: "#3a6d8c", textTransform: "uppercase", margin: "0.5rem 0 0.6rem" }}>
          Te invitamos a celebrar la llegada de nuestro bebé
        </p>
        <Divider />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? "1.3rem" : "2rem", fontWeight: 700, color: "#1a3a5c", letterSpacing: isMobile ? 2 : 4, textTransform: "uppercase", margin: "0.3rem 0" }}>
          Liam Alejandro
        </h2>
        <Divider />
        <p style={{ fontSize: "0.65rem", letterSpacing: 3, color: "#3a6d8c", textTransform: "uppercase", margin: "0.8rem 0 0.6rem" }}>
          Detalles del evento
        </p>
        <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 10, padding: isMobile ? "0.7rem 0.8rem" : "1rem 1.2rem", textAlign: "left" }}>
          {[
            { icon: "📅", text: <span>Domingo <strong>26 de Abril</strong></span> },
            { icon: "🕑", text: <strong>2:00 PM</strong> },
            { icon: "📍", text: "San Andrés 2306, Los Cajetes, Zapopan, Jal." },
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < 2 ? "0.4rem" : 0, fontSize: isMobile ? "0.78rem" : "0.9rem", color: "#1a3a5c" }}>
              <span style={{ fontSize: 13, marginTop: 1, flexShrink: 0 }}>{d.icon}</span>
              <span>{d.text}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.65rem", color: "#3a6d8c", letterSpacing: 2, textTransform: "uppercase", margin: "0.8rem 0 0" }}>
          Confirmar antes del 15 de abril
        </p>
      </div>

      {/* En móvil: botón que abre el formulario como drawer. En desktop: formulario siempre visible */}
      {isMobile ? (
        <>
          <button
            onClick={() => { setFormOpen(!formOpen); setStatus(null); }}
            style={{
              marginTop: "1rem", padding: "10px 28px",
              background: "rgba(26,58,92,0.82)", color: "white",
              border: "none", borderRadius: 10, fontSize: "0.78rem",
              letterSpacing: 2, textTransform: "uppercase",
              cursor: "pointer", fontFamily: "'Lato', sans-serif",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {formOpen ? "✕ Cerrar" : "✓ Confirmar asistencia"}
          </button>

          {formOpen && (
            <div style={{ ...cardStyle, padding: "1.2rem", width: "78%", maxWidth: 360, marginTop: "0.75rem" }}>
              <FormFields
                name={name} setName={setName}
                count={count} setCount={setCount}
                status={status} setStatus={setStatus}
                msg={msg} loading={loading}
                onConfirm={handleConfirm}
                compact
              />
            </div>
          )}

          {/* Mensaje de éxito fuera del form si se cerró */}
          {!formOpen && status === "success" && (
            <div style={{ marginTop: "0.75rem", background: "rgba(200,245,220,0.6)", borderRadius: 10, padding: "0.8rem 1rem", textAlign: "center", color: "#1a5c3a", fontSize: "0.82rem", width: "78%", maxWidth: 360, ...cardStyle }}>
              {msg}
            </div>
          )}
        </>
      ) : (
        <div style={{ ...cardStyle, padding: "1.5rem", maxWidth: 480, width: "100%", marginTop: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#1a3a5c", marginBottom: "1rem", textAlign: "center", fontWeight: 400 }}>
            Confirmar asistencia
          </h3>
          <FormFields
            name={name} setName={setName}
            count={count} setCount={setCount}
            status={status} setStatus={setStatus}
            msg={msg} loading={loading}
            onConfirm={handleConfirm}
          />
        </div>
      )}

      {/* Mapa — más pequeño en móvil */}
      <div style={{ ...cardStyle, width: isMobile ? "78%" : "100%", maxWidth: isMobile ? 360 : 480, marginTop: "1.5rem", overflow: "hidden" }}>
        <div style={{ background: "rgba(26,58,92,0.75)", color: "white", textAlign: "center", padding: 8, fontSize: "0.7rem", letterSpacing: 2, textTransform: "uppercase" }}>
          📍 Ubicación del evento
        </div>
        <iframe
          title="Mapa"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.1!2d-103.407!3d20.668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSan+Andr%C3%A9s+2306%2C+Los+Cajetes%2C+Zapopan%2C+Jalisco!5e0!3m2!1ses!2smx!4v1680000000000!5m2!1ses!2smx&q=San+Andr%C3%A9s+2306,+Los+Cajetes,+Zapopan,+Jalisco"
          style={{ width: "100%", height: isMobile ? 180 : 280, border: "none", display: "block" }}
          allowFullScreen loading="lazy"
        />
      </div>

      <p style={{ marginTop: "1.5rem", fontSize: "0.72rem", color: "rgba(26,58,92,0.75)", letterSpacing: 2, textTransform: "uppercase", textAlign: "center" }}>
        Con amor, esperando a Liam Alejandro 🩵
      </p>
    </PageWrapper>
  );
}

// ── Campos del formulario reutilizables ────────────────────────
function FormFields({ name, setName, count, setCount, status, setStatus, msg, loading, onConfirm, compact }) {
  const fs_ = compact ? "0.82rem" : "0.95rem";
  const lfs = compact ? "0.65rem" : "0.75rem";
  return (
    <>
      {[
        { label: "Nombre completo", type: "text", val: name, set: setName, placeholder: "Tu nombre" },
        { label: "Número de personas", type: "number", val: count, set: setCount, placeholder: "¿Cuántos van?" },
      ].map((f, i) => (
        <div key={i} style={{ marginBottom: compact ? "0.7rem" : "1rem", textAlign: "left" }}>
          <label style={{ display: "block", fontSize: lfs, letterSpacing: 2, textTransform: "uppercase", color: "#3a6d8c", marginBottom: 5 }}>
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
              width: "100%", padding: compact ? "8px 10px" : "10px 14px",
              border: "1.5px solid rgba(255,255,255,0.7)", borderRadius: 10,
              fontSize: fs_, fontFamily: "'Lato', sans-serif",
              background: "rgba(255,255,255,0.35)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              color: "#1a3a5c", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
      ))}
      <button
        onClick={onConfirm}
        disabled={loading}
        style={{
          width: "100%", padding: compact ? 9 : 12,
          background: loading ? "rgba(122,154,184,0.7)" : "rgba(26,58,92,0.85)",
          color: "white", border: "none", borderRadius: 10,
          fontSize: lfs, letterSpacing: 2, textTransform: "uppercase",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Lato', sans-serif", marginTop: "0.3rem",
        }}
      >
        {loading ? "Guardando..." : "Confirmar"}
      </button>
      {status && (
        <div style={{
          marginTop: "0.6rem",
          background: status === "success" ? "rgba(200,245,220,0.6)" : "rgba(255,220,200,0.6)",
          borderRadius: 10, padding: "0.7rem", textAlign: "center",
          color: status === "success" ? "#1a5c3a" : "#8a3a1a", fontSize: compact ? "0.78rem" : "0.9rem",
        }}>
          {msg}
        </div>
      )}
    </>
  );
}

// ── Página /confirmados ────────────────────────────────────────
function Confirmados() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmandoBorrarTodo, setConfirmandoBorrarTodo] = useState(false);
  const [borrando, setBorrando] = useState(false);
  // índice del invitado cuya fila está en modo "confirmar borrado"
  const [confirmandoIdx, setConfirmandoIdx] = useState(null);

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

  const descargarExcel = () => { window.location.href = "/api/confirmados/excel"; };

  const borrarTodo = async () => {
    if (!confirmandoBorrarTodo) { setConfirmandoBorrarTodo(true); return; }
    setBorrando(true);
    try {
      await fetch("/api/confirmados", { method: "DELETE" });
      setLista([]);
      setConfirmandoBorrarTodo(false);
    } catch { setError("No se pudo borrar."); }
    finally { setBorrando(false); }
  };

  const borrarUno = async (idx) => {
    if (confirmandoIdx !== idx) { setConfirmandoIdx(idx); return; }
    try {
      const res = await fetch(`/api/confirmados/${idx}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setLista((prev) => prev.filter((_, i) => i !== idx));
      setConfirmandoIdx(null);
    } catch { setError("No se pudo borrar."); }
  };

  const btnBase = {
    padding: "9px 16px", borderRadius: 10, fontSize: "0.75rem",
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
          <div style={{ display: "flex", gap: 12, marginBottom: "1.2rem" }}>
            {[{ label: "Familias", value: lista.length }, { label: "Total personas", value: total }].map((m, i) => (
              <div key={i} style={{ ...cardStyle, flex: 1, padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1a3a5c", fontFamily: "'Playfair Display', serif" }}>{m.value}</div>
                <div style={{ fontSize: "0.7rem", letterSpacing: 2, textTransform: "uppercase", color: "#3a6d8c", marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Botones de acción globales */}
        {!loading && !error && lista.length > 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: "1rem", flexWrap: "wrap" }}>
            <button onClick={descargarExcel} style={{ ...btnBase, background: "rgba(26,92,58,0.82)", color: "white", flex: 1, minWidth: 140 }}>
              ⬇ Descargar Excel
            </button>
            <button
              onClick={borrarTodo} disabled={borrando}
              style={{ ...btnBase, flex: 1, minWidth: 140, background: confirmandoBorrarTodo ? "rgba(162,45,45,0.85)" : "rgba(255,255,255,0.35)", color: confirmandoBorrarTodo ? "white" : "#8a3a1a", border: "1.5px solid rgba(162,45,45,0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            >
              {borrando ? "Borrando..." : confirmandoBorrarTodo ? "⚠ Confirmar borrado" : "🗑 Borrar todo"}
            </button>
            {confirmandoBorrarTodo && (
              <button onClick={() => setConfirmandoBorrarTodo(false)} style={{ ...btnBase, background: "rgba(255,255,255,0.35)", color: "#3a6d8c", border: "1.5px solid rgba(255,255,255,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", flex: 1, minWidth: 90 }}>
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
            <div key={i}>
              <div style={{
                display: "flex", alignItems: "center",
                padding: "0.85rem 1rem", gap: 10,
                borderBottom: "1px solid rgba(176,216,240,0.35)",
              }}>
                {/* Avatar */}
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(176,216,240,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", color: "#1a3a5c", flexShrink: 0 }}>
                  {c.nombre.charAt(0).toUpperCase()}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: "#1a3a5c", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.nombre}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#3a6d8c", marginTop: 2 }}>{formatDate(c.fecha)}</div>
                </div>
                {/* Cantidad */}
                <div style={{ background: "rgba(26,58,92,0.8)", color: "white", borderRadius: 20, padding: "3px 12px", fontSize: "0.78rem", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}>
                  {c.cantidad} {c.cantidad === 1 ? "persona" : "personas"}
                </div>
                {/* Botón borrar individual */}
                <button
                  onClick={() => borrarUno(i)}
                  title="Eliminar"
                  style={{
                    flexShrink: 0, width: 30, height: 30, borderRadius: "50%",
                    border: "none", cursor: "pointer", fontSize: "0.8rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: confirmandoIdx === i ? "rgba(162,45,45,0.85)" : "rgba(255,100,100,0.18)",
                    color: confirmandoIdx === i ? "white" : "#a32d2d",
                    transition: "background 0.2s",
                  }}
                >
                  {confirmandoIdx === i ? "✓" : "✕"}
                </button>
              </div>

              {/* Fila de confirmación de borrado individual */}
              {confirmandoIdx === i && (
                <div style={{ background: "rgba(255,220,200,0.5)", padding: "0.5rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, borderBottom: "1px solid rgba(176,216,240,0.35)" }}>
                  <span style={{ fontSize: "0.75rem", color: "#8a3a1a" }}>¿Eliminar a {c.nombre}?</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => borrarUno(i)}
                      style={{ ...btnBase, padding: "5px 12px", background: "rgba(162,45,45,0.85)", color: "white", fontSize: "0.7rem" }}
                    >
                      Sí, eliminar
                    </button>
                    <button
                      onClick={() => setConfirmandoIdx(null)}
                      style={{ ...btnBase, padding: "5px 12px", background: "rgba(255,255,255,0.5)", color: "#3a6d8c", border: "1px solid rgba(255,255,255,0.7)", fontSize: "0.7rem" }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
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

// ── Router ─────────────────────────────────────────────────────
export default function App() {
  const path = window.location.pathname;
  return path === "/confirmados" ? <Confirmados /> : <Home />;
}
