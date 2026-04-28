// ============================================================
//  MIDDLEWARE: autenticar
//  Verifica se o token JWT é válido em rotas protegidas.
//  Uso: router.get("/rota", autenticar, controller)
// ============================================================
import jwt      from "jsonwebtoken";
import { Usuario } from "../models/Usuario.js";

export async function autenticar(req, res, next) {
  try {
    // Pega o token do header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ erro: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca o usuário no banco
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: "Usuário não encontrado ou inativo" });
    }

    // Adiciona o usuário na requisição
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}
