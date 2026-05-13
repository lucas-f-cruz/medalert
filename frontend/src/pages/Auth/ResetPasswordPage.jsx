import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { TEMA } from "../../styles/tema";

export function ResetPasswordPage() {
  const [searchParams]              = useSearchParams();
  const token                        = searchParams.get("token");
  const [senha,       setSenha]      = useState("");
  const [confirmar,   setConfirmar]  = useState("");
  const [carregando,  setCarregando] = useState(false);
  const [erro,        setErro]       = useState("");
  const [sucesso,     setSucesso]    = useState("");
  const navigate                     = useNavigate();
  const T                            = TEMA;

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (senha !== confirmar) return setErro("As senhas não coincidem");
    if (senha.length < 6)    return setErro("Senha deve ter no mínimo 6 caracteres");
    if (!token)              return setErro("Link inválido. Solicite um novo email de recuperação.");

    setCarregando(true);
    try {
      const dados = await authService.redefinirSenha(token, senha);
      setSucesso(dados.mensagem);
      setTimeout(() => navigate("/auth"), 3000);
    } catch (error) {
      setErro(error.message || "Erro ao redefinir senha");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: T.fundoPage, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: T.vermelho, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>M</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: T.preto }}>Med<span style={{ color: T.vermelho }}>Alert</span></span>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, color: T.preto, marginBottom: 6, letterSpacing: -0.5 }}>Nova senha</h2>
        <p style={{ fontSize: 14, color: T.cinza, marginBottom: 28 }}>Escolha uma senha segura para sua conta</p>

        {!sucesso ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 6 }}>Nova senha</label>
              <input
                type="password" placeholder="Mínimo 6 caracteres"
                value={senha} onChange={e => { setSenha(e.target.value); setErro(""); }} required
                style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${T.borda}`, borderRadius: 9, fontSize: 14, color: T.preto, background: T.branco, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 6 }}>Confirmar nova senha</label>
              <input
                type="password" placeholder="Repita a nova senha"
                value={confirmar} onChange={e => { setConfirmar(e.target.value); setErro(""); }} required
                style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${T.borda}`, borderRadius: 9, fontSize: 14, color: T.preto, background: T.branco, boxSizing: "border-box" }}
              />
            </div>

            {erro && (
              <div style={{ background: T.vermelhoClaro, border: `1px solid ${T.vermelhoBorda}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: T.vermelho }}>
                ⚠️ {erro}
              </div>
            )}

            <button type="submit" disabled={carregando} style={{
              background: T.vermelho, color: "#fff", border: "none",
              padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 700,
              cursor: carregando ? "not-allowed" : "pointer",
              opacity: carregando ? 0.7 : 1, marginTop: 4,
            }}>
              {carregando ? "Aguarde..." : "Redefinir senha"}
            </button>

            <button type="button" onClick={() => navigate("/auth")} style={{
              background: "transparent", border: `1.5px solid ${T.borda}`, color: T.cinzaEscuro,
              padding: "11px", borderRadius: 10, fontSize: 13, cursor: "pointer",
            }}>
              ← Voltar ao login
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <p style={{ fontSize: 15, color: "#16a34a", fontWeight: 600, marginBottom: 8 }}>{sucesso}</p>
            <p style={{ fontSize: 13, color: T.cinzaClaro }}>Redirecionando para o login...</p>
          </div>
        )}
      </div>

      <style>{`input:focus { outline: none; border-color: #e03131 !important; box-shadow: 0 0 0 3px rgba(224,49,49,0.1); }`}</style>
    </div>
  );
}
