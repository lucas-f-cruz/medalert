// ============================================================
//  SERVICE: Notificações
//  Gerencia os 3 tipos de notificação:
//  1. Web Push (navegador)
//  2. Email (Nodemailer)
//  3. Cron job — dispara alertas nos horários certos
// ============================================================
import webpush from "web-push";
import nodemailer from "nodemailer";
import cron from "node-cron";
import { Medicacao } from "../models/Medicacao.js";
import { Usuario } from "../models/Usuario.js";
import { Historico } from "../models/Historico.js";

// ── CONFIGURAR WEB PUSH ──────────────────────────────────────
// Só configura se as chaves VAPID estiverem no .env
if (
  process.env.VAPID_EMAIL &&
  process.env.VAPID_PUBLIC_KEY &&
  process.env.VAPID_PRIVATE_KEY
) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log("✅ Web Push configurado!");
} else {
  console.log("⚠️  Web Push desativado — configure as chaves VAPID no .env quando quiser ativar");
}

// ── CONFIGURAR EMAIL ─────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── ENVIAR WEB PUSH ──────────────────────────────────────────
export async function enviarWebPush(subscription, payload) {
  if (!process.env.VAPID_PUBLIC_KEY) return; // pula se não configurado
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error("Erro ao enviar Web Push:", error.message);
  }
}

// ── SALVAR SUBSCRIPTION DO NAVEGADOR ─────────────────────────
export async function salvarSubscription(usuarioId, subscription) {
  await Usuario.findByIdAndUpdate(usuarioId, { pushSubscription: subscription });
}

// ── ENVIAR EMAIL DE LEMBRETE ─────────────────────────────────
export async function enviarEmailLembrete(email, nome, medicacao) {
  if (!process.env.EMAIL_USER) return; // pula se não configurado
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `⏰ MedAlert — Hora do seu remédio!`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <div style="background:#e03131;padding:24px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:22px">💊 MedAlert</h1>
          </div>
          <div style="background:#f9fafb;padding:28px;border-radius:0 0 12px 12px">
            <h2 style="color:#0a1628;margin-bottom:8px">Olá, ${nome}!</h2>
            <p style="color:#6b7280">Está na hora de tomar seu remédio:</p>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin:16px 0">
              <strong style="color:#e03131;font-size:18px">${medicacao.nome}</strong>
              <p style="color:#374151;margin:4px 0">${medicacao.dosagem}</p>
              ${medicacao.instrucoes ? `<p style="color:#9ca3af;font-size:13px">${medicacao.instrucoes}</p>` : ""}
            </div>
            <p style="color:#9ca3af;font-size:12px;text-align:center">MedAlert — Cuidando de quem você ama</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Erro ao enviar email:", error.message);
  }
}

// ── CRON JOB — verifica a cada minuto ────────────────────────
export function iniciarCronJob() {
  cron.schedule("* * * * *", async () => {
    try {
      const agora = new Date();
      const horaAtual = `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;

      const medicacoes = await Medicacao.find({
        ativo: true,
        horarios: horaAtual,
      }).populate("usuario", "nome email pushSubscription");

      for (const med of medicacoes) {
        const usuario = med.usuario;
        if (!usuario) continue;

        if (usuario.pushSubscription) {
          await enviarWebPush(usuario.pushSubscription, {
            titulo: `💊 Hora do remédio!`,
            corpo: `${med.nome} — ${med.dosagem}`,
            icone: "/icon-192.png",
            dados: { medicacaoId: med._id },
          });
        }

        await enviarEmailLembrete(usuario.email, usuario.nome, med);

        const jaRegistrado = await Historico.findOne({
          medicacao: med._id,
          horarioProgramado: {
            $gte: new Date(new Date().setSeconds(0, 0)),
            $lt: new Date(new Date().setSeconds(59, 999)),
          },
        });

        if (!jaRegistrado) {
          await Historico.create({
            usuario: usuario._id,
            medicacao: med._id,
            horarioProgramado: new Date(),
            status: "atrasado",
          });
        }

        console.log(`📬 Notificação enviada: ${usuario.nome} → ${med.nome} (${horaAtual})`);
      }
    } catch (error) {
      console.error("Erro no cron job:", error.message);
    }
  });

  console.log("⏰ Cron job de notificações iniciado!");
}