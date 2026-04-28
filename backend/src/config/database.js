// ============================================================
//  CONFIG: Conexão com MongoDB
//  Usa a URI do .env para conectar ao banco de dados
// ============================================================
import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
}
