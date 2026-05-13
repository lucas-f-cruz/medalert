import nodemailer from "nodemailer";

export async function enviarEmailReset(email, nome, resetUrl) {
  const transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST,
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from:    `"MedAlert" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to:      email,
    subject: "Recuperação de senha — MedAlert",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:28px">
          <div style="width:32px;height:32px;background:#e03131;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:14px">M</div>
          <span style="font-size:18px;font-weight:700">Med<span style="color:#e03131">Alert</span></span>
        </div>

        <h2 style="font-size:22px;font-weight:800;color:#0a1628;margin-bottom:12px">Redefinição de senha</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin-bottom:24px">
          Olá, <strong>${nome}</strong>!<br/>
          Recebemos uma solicitação para redefinir a senha da sua conta MedAlert.
          Clique no botão abaixo para criar uma nova senha. O link expira em <strong>1 hora</strong>.
        </p>

        <a href="${resetUrl}" style="display:inline-block;background:#e03131;color:#fff;text-decoration:none;padding:13px 28px;border-radius:10px;font-size:14px;font-weight:700;margin-bottom:24px">
          Redefinir minha senha
        </a>

        <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin-bottom:0">
          Se você não solicitou a redefinição, ignore este email — sua senha permanece a mesma.<br/>
          Link direto: <a href="${resetUrl}" style="color:#e03131">${resetUrl}</a>
        </p>
      </div>
    `,
  });
}
