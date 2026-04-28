// ============================================================
//  ROTAS: Auth
// ============================================================
import { Router }                       from "express";
import { cadastro, login, perfil }      from "../controllers/authController.js";
import { autenticar }                   from "../middlewares/autenticar.js";

export const authRoutes = Router();
authRoutes.post("/cadastro", cadastro);
authRoutes.post("/login",    login);
authRoutes.get("/perfil",    autenticar, perfil);
