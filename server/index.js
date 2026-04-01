import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data", "confirmados.txt");

app.use(express.json());

// Servir el build de React
app.use(express.static(path.join(__dirname, "public")));

// Asegurar que existe el directorio de datos
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

// POST /api/confirmar  — guarda nombre y cantidad
app.post("/api/confirmar", (req, res) => {
  const { nombre, cantidad } = req.body;

  if (!nombre || !cantidad) {
    return res.status(400).json({ error: "Faltan datos." });
  }

  const linea = `${new Date().toISOString()} | ${nombre.trim()} | ${cantidad}\n`;

  fs.appendFile(DATA_FILE, linea, (err) => {
    if (err) return res.status(500).json({ error: "No se pudo guardar." });
    res.json({ ok: true });
  });
});

// GET /api/confirmados — devuelve lista de confirmados
app.get("/api/confirmados", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.json({ confirmados: [] });
  }

  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const confirmados = raw
    .split("\n")
    .filter(Boolean)
    .map((linea) => {
      const [fecha, nombre, cantidad] = linea.split(" | ");
      return { fecha, nombre, cantidad: parseInt(cantidad, 10) };
    });

  res.json({ confirmados });
});

// SPA fallback — cualquier ruta sirve index.html
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
