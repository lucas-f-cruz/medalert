// ============================================================
//  CONTROLLER: Auth
//  Rotas: POST /auth/cadastro | POST /auth/login | GET /auth/perfil
// ============================================================
import jwt        from "jsonwebtoken";
import crypto      from "crypto";
import { Usuario } from "../models/Usuario.js";
import { enviarEmailReset } from "../config/email.js";

function gerarToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// ── CADASTRO ────────────────────────────────────────────────
export async function cadastro(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    const jaExiste = await Usuario.findOne({ email });
    if (jaExiste) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const usuario = await Usuario.create({ nome, email, senha });
    const token   = gerarToken(usuario._id);

    res.status(201).json({
      mensagem: "Cadastro realizado com sucesso!",
      token,
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email },
    });
  } catch (error) {
    console.error("❌ Erro no cadastro:", error);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
}

// ── LOGIN ────────────────────────────────────────────────────
export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Informe email e senha" });
    }

    const usuario = await Usuario.findOne({ email }).select("+senha");
    if (!usuario) {
      return res.status(401).json({ erro: "Email ou senha incorretos" });
    }

    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Email ou senha incorretos" });
    }

    const token = gerarToken(usuario._id);

    res.json({
      token,
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email },
    });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
}

// ── ESQUECEU SENHA ───────────────────────────────────────────
export async function esqueceuSenha(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ erro: "Informe o email" });

    const usuario = await Usuario.findOne({ email });

    // Resposta genérica para não revelar se o email existe
    const mensagem = "Se esse email estiver cadastrado, você receberá as instruções em breve.";

    if (!usuario) return res.json({ mensagem });

    const token = crypto.randomBytes(32).toString("hex");
    usuario.resetPasswordToken   = token;
    usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await usuario.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await enviarEmailReset(usuario.email, usuario.nome, resetUrl);

    res.json({ mensagem });
  } catch (error) {
    console.error("❌ Erro em esqueceu-senha:", error);
    res.status(500).json({ erro: "Erro ao processar solicitação" });
  }
}

// ── REDEFINIR SENHA ──────────────────────────────────────────
export async function redefinirSenha(req, res) {
  try {
    const { token, senha } = req.body;

    if (!token || !senha) {
      return res.status(400).json({ erro: "Token e nova senha são obrigatórios" });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: "Senha deve ter no mínimo 6 caracteres" });
    }

    const usuario = await Usuario.findOne({
      resetPasswordToken:   token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+senha +resetPasswordToken +resetPasswordExpires");

    if (!usuario) {
      return res.status(400).json({ erro: "Link inválido ou expirado. Solicite um novo." });
    }

    usuario.senha                = senha;
    usuario.resetPasswordToken   = undefined;
    usuario.resetPasswordExpires = undefined;
    await usuario.save();

    res.json({ mensagem: "Senha redefinida com sucesso! Faça login com a nova senha." });
  } catch (error) {
    console.error("❌ Erro em redefinir-senha:", error);
    res.status(500).json({ erro: "Erro ao redefinir senha" });
  }
}

// ── PERFIL ───────────────────────────────────────────────────
export async function perfil(req, res) {
  try {
    res.json({
      usuario: {
        id:    req.usuario._id,
        nome:  req.usuario.nome,
        email: req.usuario.email,
      },
    });
  } catch (error) {
    console.error("❌ Erro no perfil:", error);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
}