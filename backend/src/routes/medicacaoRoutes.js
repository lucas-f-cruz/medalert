// ============================================================
//  ROTAS: Medicacoes
//  Todas as rotas são protegidas por autenticação JWT
// ============================================================
import { Router }        from "express";
import { autenticar }    from "../middlewares/autenticar.js";
import {
  listar, criar, atualizar, deletar,
  confirmarDose, historico,
} from "../controllers/medicacaoController.js";
import { salvarSubscription } from "../services/notificacaoService.js";

export const medicacaoRoutes = Router();

medicacaoRoutes.use(autenticar); // protege todas as rotas abaixo

medicacaoRoutes.get("/",                listar);
medicacaoRoutes.post("/",               criar);
medicacaoRoutes.put("/:id",             atualizar);
medicacaoRoutes.delete("/:id",          deletar);
medicacaoRoutes.post("/confirmar-dose", confirmarDose);
medicacaoRoutes.get("/historico",       historico);

// Salva a subscription do Web Push do navegador
medicacaoRoutes.post("/push-subscription", async (req, res) => {
  try {
    await salvarSubscription(req.usuario._id, req.body.subscription);
    res.json({ mensagem: "Subscription salva com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao salvar subscription" });
  }
});
