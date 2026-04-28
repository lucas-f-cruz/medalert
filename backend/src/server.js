// ============================================================
//  MEDALERT — SERVIDOR PRINCIPAL
//  Inicializa Express, conecta ao MongoDB e sobe as rotas
// ============================================================
import "dotenv/config";
import dns     from "dns";

// ── FIX DNS — resolve problema de conexão no Windows ────────
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express             from "express";
import cors                from "cors";
import { connectDB }       from "./config/database.js";
import { authRoutes }      from "./routes/authRoutes.js";
import { medicacaoRoutes } from "./routes/medicacaoRoutes.js";
import { iniciarCronJob }  from "./services/notificacaoService.js";

const app  = express();
const PORT = process.env.PORT || 3001;

// ── MIDDLEWARES ──────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// ── ROTAS ────────────────────────────────────────────────────
app.use("/auth",       authRoutes);
app.use("/medicacoes", medicacaoRoutes);

// Rota de saúde da API
app.get("/", (req, res) => res.json({ status: "MedAlert API rodando! 💊" }));

// ── INICIALIZAR ──────────────────────────────────────────────
async function iniciar() {
  await connectDB();
  iniciarCronJob();
  app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
}

iniciar();