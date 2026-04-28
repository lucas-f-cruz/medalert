// ============================================================
//  MODEL: Historico
//  Registra cada vez que um remédio foi tomado ou ignorado.
//  Usado para relatórios e para o médico acompanhar.
// ============================================================
import mongoose from "mongoose";

const historicoSchema = new mongoose.Schema({
  usuario: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      "Usuario",
    required: true,
  },
  medicacao: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      "Medicacao",
    required: true,
  },
  // Horário programado para tomar
  horarioProgramado: {
    type:     Date,
    required: true,
  },
  // Horário que realmente tomou (null se não tomou)
  horarioTomado: {
    type:    Date,
    default: null,
  },
  // "tomado" | "ignorado" | "atrasado"
  status: {
    type:    String,
    enum:    ["tomado", "ignorado", "atrasado"],
    default: "tomado",
  },
  observacao: {
    type:    String,
    default: "",
  },
}, { timestamps: true });

export const Historico = mongoose.model("Historico", historicoSchema);
