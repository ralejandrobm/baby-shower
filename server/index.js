import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data", "confirmados.txt");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

function leerLineas() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return fs.readFileSync(DATA_FILE, "utf-8").split("\n").filter(Boolean);
}

function lineasAObjetos(lineas) {
  return lineas.map((linea) => {
    const [fecha, nombre, cantidad] = linea.split(" | ");
    return { fecha, nombre, cantidad: parseInt(cantidad, 10) };
  });
}

// POST /api/confirmar
app.post("/api/confirmar", (req, res) => {
  const { nombre, cantidad } = req.body;
  if (!nombre || !cantidad) return res.status(400).json({ error: "Faltan datos." });
  const linea = `${new Date().toISOString()} | ${nombre.trim()} | ${cantidad}\n`;
  fs.appendFile(DATA_FILE, linea, (err) => {
    if (err) return res.status(500).json({ error: "No se pudo guardar." });
    res.json({ ok: true });
  });
});

// GET /api/confirmados
app.get("/api/confirmados", (req, res) => {
  res.json({ confirmados: lineasAObjetos(leerLineas()) });
});

// DELETE /api/confirmados — borra todos
app.delete("/api/confirmados", (req, res) => {
  fs.writeFile(DATA_FILE, "", (err) => {
    if (err) return res.status(500).json({ error: "No se pudo borrar." });
    res.json({ ok: true });
  });
});

// DELETE /api/confirmados/:index — borra uno por índice
app.delete("/api/confirmados/:index", (req, res) => {
  const idx = parseInt(req.params.index, 10);
  const lineas = leerLineas();
  if (isNaN(idx) || idx < 0 || idx >= lineas.length) {
    return res.status(400).json({ error: "Índice inválido." });
  }
  lineas.splice(idx, 1);
  fs.writeFile(DATA_FILE, lineas.join("\n") + (lineas.length ? "\n" : ""), (err) => {
    if (err) return res.status(500).json({ error: "No se pudo borrar." });
    res.json({ ok: true });
  });
});

// GET /api/confirmados/excel
app.get("/api/confirmados/excel", (req, res) => {
  const confirmados = lineasAObjetos(leerLineas());
  const total = confirmados.reduce((acc, c) => acc + c.cantidad, 0);
  const bom = "\uFEFF";
  const filas = confirmados.map((c) => {
    const fecha = new Date(c.fecha).toLocaleString("es-MX", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
    return `"${fecha}","${c.nombre}",${c.cantidad}`;
  });
  const csv = [bom, "Fecha,Nombre,Personas", ...filas, "", `Total confirmados,${confirmados.length}`, `Total personas,${total}`].join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=confirmados_baby_shower.csv");
  res.send(csv);
});

// SPA fallback
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
