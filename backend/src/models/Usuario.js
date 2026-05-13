// ============================================================
//  MODEL: Usuario
// ============================================================
import mongoose from "mongoose";
import bcrypt   from "bcryptjs";

const usuarioSchema = new mongoose.Schema({
  nome: {
    type:     String,
    required: [true, "Nome é obrigatório"],
    trim:     true,
  },
  email: {
    type:      String,
    required:  [true, "Email é obrigatório"],
    unique:    true,
    lowercase: true,
    trim:      true,
  },
  senha: {
    type:      String,
    required:  [true, "Senha é obrigatória"],
    minlength: 6,
    select:    false,
  },
  pacientes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:  "Usuario",
  }],
  pushSubscription: {
    type:    Object,
    default: null,
  },
  ativo: {
    type:    Boolean,
    default: true,
  },
  resetPasswordToken: {
    type:   String,
    select: false,
  },
  resetPasswordExpires: {
    type:   Date,
    select: false,
  },
}, { timestamps: true });

// Criptografa a senha antes de salvar
usuarioSchema.pre("save", async function () {
  if (!this.isModified("senha")) return;
  this.senha = await bcrypt.hash(this.senha, 12);
});

// Método para comparar senhas no login
usuarioSchema.methods.compararSenha = async function (senhaInformada) {
  return bcrypt.compare(senhaInformada, this.senha);
};

export const Usuario = mongoose.model("Usuario", usuarioSchema);