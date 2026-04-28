// ============================================================
//  MODEL: Medicacao
//  Representa um remédio cadastrado por um usuário.
//  Campos: nome, dosagem, horários, frequência, histórico
// ============================================================
import mongoose from "mongoose";

const medicacaoSchema = new mongoose.Schema({
  usuario: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      "Usuario",
    required: true,
  },
  nome: {
    type:     String,
    required: [true, "Nome do remédio é obrigatório"],
    trim:     true,
  },
  dosagem: {
    type:     String,
    required: [true, "Dosagem é obrigatória"],
    // Ex: "50mg", "2 comprimidos", "1 cápsula"
  },
  instrucoes: {
    type:    String,
    default: "", // Ex: "Tomar em jejum", "Tomar com água"
  },
  // Dias da semana: 0=Dom, 1=Seg, ..., 6=Sáb
  // [] = todos os dias
  diasDaSemana: {
    type:    [Number],
    default: [],
  },
  // Horários em que deve ser tomado — Ex: ["08:00", "20:00"]
  horarios: {
    type:     [String],
    required: [true, "Horários são obrigatórios"],
  },
  // Data de início e fim do tratamento
  dataInicio: {
    type:    Date,
    default: Date.now,
  },
  dataFim: {
    type:    Date,
    default: null, // null = sem data de fim (uso contínuo)
  },
  ativo: {
    type:    Boolean,
    default: true,
  },
  cor: {
    type:    String,
    default: "#e03131", // cor do card no app
  },
  icone: {
    type:    String,
    default: "💊",
  },
}, { timestamps: true });

export const Medicacao = mongoose.model("Medicacao", medicacaoSchema);
