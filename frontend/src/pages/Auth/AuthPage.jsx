// ============================================================
//  PÁGINA: Auth (Login + Cadastro)
//  Alterna entre Login e Cadastro na mesma tela.
//  Usa o AuthContext para autenticar o usuário.
// ============================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/api";
import { TEMA } from "../../styles/tema";

export function AuthPage() {
  const [modo,       setModo]       = useState("login"); // "login" | "cadastro" | "esqueci"
  const [carregando, setCarregando] = useState(false);
  const [erro,       setErro]       = useState("");
  const [sucesso,    setSucesso]    = useState("");
  const [form,       setForm]       = useState({ nome: "", email: "", senha: "", confirmarSenha: "" });

  const { login, cadastro } = useAuth();
  const navigate             = useNavigate();
  const T                    = TEMA;

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErro("");
    setSucesso("");
  }

  function trocarModo(novoModo) {
    setModo(novoModo);
    setErro("");
    setSucesso("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (modo === "esqueci") {
      if (!form.email) return setErro("Informe seu email");
      setCarregando(true);
      try {
        const dados = await authService.esqueceuSenha(form.email);
        setSucesso(dados.mensagem);
      } catch (error) {
        setErro(error.message || "Erro ao enviar email");
      } finally {
        setCarregando(false);
      }
      return;
    }

    if (modo === "cadastro") {
      if (!form.nome.trim()) return setErro("Informe seu nome");
      if (form.senha !== form.confirmarSenha) return setErro("As senhas não coincidem");
      if (form.senha.length < 6) return setErro("Senha deve ter no mínimo 6 caracteres");
    }

    setCarregando(true);
    try {
      if (modo === "login") {
        await login(form.email, form.senha);
      } else {
        await cadastro(form.nome, form.email, form.senha);
      }
      navigate("/dashboard");
    } catch (error) {
      setErro(error.message || "Erro ao autenticar");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: T.fundoPage, display: "flex", fontFamily: "'Inter', sans-serif" }}>

      {/* LADO ESQUERDO — Visual */}
      <div style={{
        flex: 1, background: T.vermelho, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 48,
      }} className="auth-left">
        <div style={{ maxWidth: 360, color: "#fff" }}>
          <div style={{ fontSize: 36, marginBottom: 24 }}>💊</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: -1 }}>
            Nunca mais esqueça<br />seu remédio
          </h1>
          <p style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.7, marginBottom: 40 }}>
            MedAlert cuida dos seus horários com alarmes inteligentes e lembretes personalizados para você e sua família.
          </p>

          {/* Depoimentos */}
          {[
            { texto: "Minha mãe nunca mais esqueceu os remédios dela!", nome: "Maria S." },
            { texto: "Simples de usar e muito eficiente. Recomendo!", nome: "João P." },
          ].map((d, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.12)", borderRadius: 12,
              padding: "14px 16px", marginBottom: 10,
            }}>
              <p style={{ fontSize: 13, opacity: 0.9, marginBottom: 6 }}>"{d.texto}"</p>
              <p style={{ fontSize: 11, opacity: 0.65, fontWeight: 600 }}>— {d.nome}</p>
            </div>
          ))}
        </div>
      </div>

      {/* LADO DIREITO — Formulário */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "40px 48px",
        background: T.branco,
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            <div style={{ width: 36, height: 36, background: T.vermelho, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: T.preto }}>Med<span style={{ color: T.vermelho }}>Alert</span></span>
          </div>

          {/* Título */}
          <h2 style={{ fontSize: 26, fontWeight: 800, color: T.preto, marginBottom: 6, letterSpacing: -0.5 }}>
            {modo === "esqueci" ? "Recuperar senha" : modo === "login" ? "Bem-vindo de volta!" : "Criar sua conta"}
          </h2>
          <p style={{ fontSize: 14, color: T.cinza, marginBottom: 28 }}>
            {modo === "esqueci"
              ? "Digite seu email e enviaremos as instruções"
              : modo === "login"
              ? "Entre para gerenciar suas medicações"
              : "Comece a cuidar da sua saúde hoje"}
          </p>

          {/* Tabs Login / Cadastro — oculta no modo esqueci */}
          {modo !== "esqueci" && (
            <div style={{ display: "flex", background: T.fundoPage, borderRadius: 10, padding: 4, marginBottom: 28 }}>
              {["login", "cadastro"].map(m => (
                <button key={m} onClick={() => trocarModo(m)} style={{
                  flex: 1, padding: "9px", border: "none", borderRadius: 8, cursor: "pointer",
                  background: modo === m ? T.branco : "transparent",
                  color:      modo === m ? T.preto : T.cinza,
                  fontWeight: modo === m ? 600 : 400,
                  fontSize: 13,
                  boxShadow: modo === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.2s",
                }}>
                  {m === "login" ? "Entrar" : "Criar conta"}
                </button>
              ))}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {modo === "cadastro" && (
              <Campo label="Nome completo" name="nome" type="text" placeholder="Lucas Cruz" value={form.nome} onChange={handleChange} />
            )}
            <Campo label="E-mail" name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} />
            {modo !== "esqueci" && (
              <Campo label="Senha" name="senha" type="password" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={handleChange} />
            )}
            {modo === "cadastro" && (
              <Campo label="Confirmar senha" name="confirmarSenha" type="password" placeholder="Repita a senha" value={form.confirmarSenha} onChange={handleChange} />
            )}

            {/* Erro */}
            {erro && (
              <div style={{ background: T.vermelhoClaro, border: `1px solid ${T.vermelhoBorda}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: T.vermelho }}>
                ⚠️ {erro}
              </div>
            )}

            {/* Sucesso */}
            {sucesso && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#16a34a" }}>
                ✅ {sucesso}
              </div>
            )}

            {/* Esqueci senha */}
            {modo === "login" && (
              <div style={{ textAlign: "right", marginTop: -4 }}>
                <span onClick={() => trocarModo("esqueci")} style={{ fontSize: 12, color: T.azul, cursor: "pointer" }}>
                  Esqueci minha senha
                </span>
              </div>
            )}

            {/* Botão */}
            {!sucesso && (
              <button type="submit" disabled={carregando} style={{
                background: T.vermelho, color: "#fff", border: "none",
                padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                cursor: carregando ? "not-allowed" : "pointer",
                opacity: carregando ? 0.7 : 1,
                marginTop: 4, transition: "opacity 0.2s",
              }}>
                {carregando ? "Aguarde..." : modo === "esqueci" ? "Enviar instruções" : modo === "login" ? "Entrar" : "Criar conta grátis"}
              </button>
            )}

            {/* Voltar ao login */}
            {modo === "esqueci" && (
              <button type="button" onClick={() => trocarModo("login")} style={{
                background: "transparent", border: `1.5px solid ${T.borda}`, color: T.cinzaEscuro,
                padding: "11px", borderRadius: 10, fontSize: 13, cursor: "pointer",
              }}>
                ← Voltar ao login
              </button>
            )}
          </form>

          {/* Rodapé */}
          <p style={{ textAlign: "center", fontSize: 12, color: T.cinzaClaro, marginTop: 24 }}>
            Ao continuar você concorda com os{" "}
            <span style={{ color: T.azul, cursor: "pointer" }}>Termos de Uso</span> e{" "}
            <span style={{ color: T.azul, cursor: "pointer" }}>Política de Privacidade</span>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        input:focus { outline: none; border-color: #e03131 !important; box-shadow: 0 0 0 3px rgba(224,49,49,0.1); }
        @media(max-width: 768px) { .auth-left { display: none !important; } }
      `}</style>
    </div>
  );
}

// Componente de campo de formulário
function Campo({ label, name, type, placeholder, value, onChange }) {
  const T = TEMA;
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 6 }}>{label}</label>
      <input
        name={name} type={type} placeholder={placeholder}
        value={value} onChange={onChange} required
        style={{
          width: "100%", padding: "11px 14px", border: `1.5px solid ${T.borda}`,
          borderRadius: 9, fontSize: 14, color: T.preto,
          background: T.branco, boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
      />
    </div>
  );
}
