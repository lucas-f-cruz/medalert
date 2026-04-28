// ============================================================
//  CONTROLLER: Auth
//  Rotas: POST /auth/cadastro | POST /auth/login | GET /auth/perfil
// ============================================================
import jwt        from "jsonwebtoken";
import { Usuario } from "../models/Usuario.js";

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