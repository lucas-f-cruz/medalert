// ============================================================
//  ROTAS: Auth
// ============================================================
import { Router }                       from "express";
import { cadastro, login, perfil, esqueceuSenha, redefinirSenha } from "../controllers/authController.js";
import { autenticar }                   from "../middlewares/autenticar.js";

export const authRoutes = Router();
authRoutes.post("/cadastro",        cadastro);
authRoutes.post("/login",           login);
authRoutes.post("/esqueceu-senha",  esqueceuSenha);
authRoutes.post("/redefinir-senha", redefinirSenha);
authRoutes.get("/perfil",           autenticar, perfil);
