// ============================================================
//  CONTROLLER: Medicacoes
//  CRUD completo de medicações do usuário logado
//  Rotas: GET/POST /medicacoes | PUT/DELETE /medicacoes/:id
// ============================================================
import { Medicacao } from "../models/Medicacao.js";
import { Historico } from "../models/Historico.js";

// ── LISTAR ───────────────────────────────────────────────────
export async function listar(req, res) {
  try {
    const medicacoes = await Medicacao.find({
      usuario: req.usuario._id,
      ativo:   true,
    }).sort({ createdAt: -1 });

    res.json({ medicacoes });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar medicações" });
  }
}

// ── CRIAR ────────────────────────────────────────────────────
export async function criar(req, res) {
  try {
    const { nome, dosagem, instrucoes, diasDaSemana, horarios, dataInicio, dataFim, cor, icone } = req.body;

    if (!nome || !dosagem || !horarios?.length) {
      return res.status(400).json({ erro: "Nome, dosagem e horários são obrigatórios" });
    }

    const medicacao = await Medicacao.create({
      usuario: req.usuario._id,
      nome, dosagem, instrucoes, diasDaSemana,
      horarios, dataInicio, dataFim, cor, icone,
    });

    res.status(201).json({ mensagem: "Medicação cadastrada!", medicacao });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar medicação" });
  }
}

// ── ATUALIZAR ────────────────────────────────────────────────
export async function atualizar(req, res) {
  try {
    const medicacao = await Medicacao.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!medicacao) {
      return res.status(404).json({ erro: "Medicação não encontrada" });
    }

    res.json({ mensagem: "Medicação atualizada!", medicacao });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar medicação" });
  }
}

// ── DELETAR (soft delete) ─────────────────────────────────────
export async function deletar(req, res) {
  try {
    const medicacao = await Medicacao.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario._id },
      { ativo: false },
      { new: true }
    );

    if (!medicacao) {
      return res.status(404).json({ erro: "Medicação não encontrada" });
    }

    res.json({ mensagem: "Medicação removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao remover medicação" });
  }
}

// ── CONFIRMAR DOSE TOMADA ─────────────────────────────────────
export async function confirmarDose(req, res) {
  try {
    const { medicacaoId, horarioProgramado, observacao } = req.body;

    const historico = await Historico.create({
      usuario:           req.usuario._id,
      medicacao:         medicacaoId,
      horarioProgramado: new Date(horarioProgramado),
      horarioTomado:     new Date(),
      status:            "tomado",
      observacao:        observacao || "",
    });

    res.status(201).json({ mensagem: "Dose confirmada!", historico });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao confirmar dose" });
  }
}

// ── HISTÓRICO ─────────────────────────────────────────────────
export async function historico(req, res) {
  try {
    const registros = await Historico.find({ usuario: req.usuario._id })
      .populate("medicacao", "nome dosagem icone cor")
      .sort({ horarioProgramado: -1 })
      .limit(100);

    res.json({ historico: registros });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar histórico" });
  }
}
