// ============================================================
//  PÁGINA: LandingPage
//  Página inicial pública do MedAlert.
//  Todos os botões "Começar grátis" levam para /auth
// ============================================================
import { useNavigate } from "react-router-dom";
import { TEMA } from "../../styles/tema";

export function LandingPage() {
  const navigate = useNavigate();
  const T = TEMA;

  function irParaAuth() {
    navigate("/auth");
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", color: T.preto, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow-x: hidden; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(224,49,49,0.3)} 60%{box-shadow:0 0 0 10px rgba(224,49,49,0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @media(max-width:768px){
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .feat-grid  { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: repeat(2,1fr) !important; }
          .plan-grid  { grid-template-columns: 1fr !important; }
          .cta-grid   { grid-template-columns: 1fr !important; }
          .band-form  { flex-direction: column !important; }
        }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 5%", borderBottom: `1px solid ${T.borda}`,
        position: "sticky", top: 0, background: "#fff", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: T.vermelho, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>M</div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Med<span style={{ color: T.vermelho }}>Alert</span></span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="desk">
          {["Funcionalidades","Como funciona","Planos"].map(l => (
            <span key={l} style={{ fontSize: 13, color: T.cinza, cursor: "pointer" }}>{l}</span>
          ))}
          <button onClick={irParaAuth} style={{ background: T.vermelho, color: "#fff", border: "none", padding: "9px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Começar grátis
          </button>
        </div>
        <button onClick={irParaAuth} style={{ display: "none", background: T.vermelho, color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }} className="ham">
          Entrar
        </button>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ padding: "72px 5% 56px" }}>
        <div className="hero-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>

          {/* Esquerda */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.vermelhoClaro, border: `1px solid ${T.vermelhoBorda}`, borderRadius: 20, padding: "5px 14px", fontSize: 11, color: T.vermelho, fontWeight: 600, marginBottom: 20, letterSpacing: 0.5 }}>
              💊 Secretária eletrônica de medicações
            </div>
            <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, lineHeight: 1.1, color: T.preto, marginBottom: 16, letterSpacing: -1 }}>
              Nunca mais esqueça<br />de tomar seu <span style={{ color: T.vermelho }}>remédio</span>
            </h1>
            <p style={{ fontSize: 15, color: T.cinza, lineHeight: 1.8, maxWidth: 420, marginBottom: 32, fontWeight: 300 }}>
              MedAlert cuida dos seus horários de medicação com alarmes inteligentes, lembretes personalizados e controle completo para você e sua família.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
              <button onClick={irParaAuth} style={{ background: T.vermelho, color: "#fff", border: "none", padding: "13px 30px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Criar conta grátis
              </button>
              <button onClick={irParaAuth} style={{ background: "#fff", color: T.preto, border: `1.5px solid ${T.borda}`, padding: "13px 30px", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>
                ▶ Ver demonstração
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex" }}>
                {["#e03131","#1d4ed8","#0a1628","#7c3aed"].map((c, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "2px solid #fff", marginLeft: i === 0 ? 0 : -6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                    {["M","J","A","R"][i]}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: T.cinzaClaro }}>
                <strong style={{ color: T.preto }}>+12.000 pessoas</strong> já usam o MedAlert
              </p>
            </div>
          </div>

          {/* Direita — mockup do app */}
          <div className="hero-right" style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            {/* Notificação flutuante */}
            <div style={{ position: "absolute", top: -16, right: 0, background: "#fff", borderRadius: 14, padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: `1px solid ${T.borda}`, width: 180, animation: "float 3s ease infinite" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.vermelho, animation: "pulse 2s ease infinite" }} />
                <span style={{ fontSize: 9, color: T.cinzaClaro, fontWeight: 500 }}>MedAlert · Agora</span>
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.preto }}>⏰ Hora da Losartana 50mg!</p>
            </div>

            {/* Phone mock */}
            <div style={{ background: T.preto, borderRadius: 32, padding: 4, width: 230, boxShadow: "0 32px 64px rgba(10,22,40,0.15)" }}>
              <div style={{ background: T.fundoPage, borderRadius: 28, overflow: "hidden" }}>
                <div style={{ background: T.vermelho, padding: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Minhas Medicações</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", margin: "2px 0 0" }}>
                    {new Date().toLocaleDateString("pt-BR", { weekday: "long" })}
                  </p>
                </div>
                <div style={{ padding: 12 }}>
                  {[
                    { icon: "💊", nome: "Losartana 50mg",   dose: "1 comprimido", hora: "08:00", feito: true  },
                    { icon: "💉", nome: "Metformina 500mg", dose: "2 comprimidos", hora: "Agora!", feito: false, agora: true },
                    { icon: "🩺", nome: "Vitamina D",       dose: "1 cápsula",    hora: "14:00", feito: false },
                    { icon: "💚", nome: "Ômega 3",          dose: "1 cápsula",    hora: "20:00", feito: false },
                  ].map((m, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 10px",
                      background: m.agora ? T.vermelhoClaro : "#fff",
                      border: `1px solid ${m.agora ? T.vermelhoBorda : T.borda}`,
                      borderRadius: 10, marginBottom: 6, opacity: m.feito ? 0.55 : 1,
                    }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: m.agora ? T.vermelho : T.fundoPage, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{m.icon}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 10, fontWeight: 600, color: T.preto, margin: 0 }}>{m.nome}</p>
                        <p style={{ fontSize: 9, color: T.cinzaClaro, margin: 0 }}>{m.dose}</p>
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: m.agora ? T.vermelho : T.cinzaClaro }}>{m.hora}</span>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${m.feito ? "#16a34a" : T.borda}`, background: m.feito ? "#f0fdf4" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#16a34a" }}>
                        {m.feito ? "✓" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Badge segurança */}
            <div style={{ position: "absolute", bottom: -10, left: 0, background: T.azul, borderRadius: 12, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 24px rgba(29,78,216,0.25)` }}>
              <span style={{ fontSize: 16 }}>🛡️</span>
              <div>
                <p style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", margin: 0 }}>Proteção total</p>
                <p style={{ fontSize: 10, color: "#fff", fontWeight: 700, margin: 0 }}>100% Criptografado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${T.borda}`, borderBottom: `1px solid ${T.borda}` }}>
        <div className="stats-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[
            { num: "12k+",  label: "Usuários ativos"  },
            { num: "98%",   label: "Taxa de aderência" },
            { num: "4.9★",  label: "Avaliação média"   },
            { num: "0%",    label: "Esquecimentos"     },
          ].map((s, i) => (
            <div key={i} style={{ padding: "28px 20px", textAlign: "center", borderRight: i < 3 ? `1px solid ${T.borda}` : "none" }}>
              <p style={{ fontSize: 30, fontWeight: 800, color: T.vermelho, margin: 0, letterSpacing: -1 }}>{s.num}</p>
              <p style={{ fontSize: 11, color: T.cinzaClaro, marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FUNCIONALIDADES ────────────────────────────────── */}
      <section style={{ padding: "72px 5%", background: T.fundoPage }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 11, color: T.vermelho, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Funcionalidades</p>
          <h2 style={{ textAlign: "center", fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, color: T.preto, marginBottom: 8, letterSpacing: -0.5 }}>Tudo que você precisa</h2>
          <p style={{ textAlign: "center", fontSize: 14, color: T.cinzaClaro, marginBottom: 48 }}>Simples para idosos, completo para cuidadores</p>
          <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { icon: "🔔", titulo: "Alarmes inteligentes",    desc: "Notificações com som e vibração até você confirmar que tomou." },
              { icon: "💊", titulo: "Cadastro fácil",          desc: "Adicione remédios com nome, dosagem, horário e frequência." },
              { icon: "👨‍👩‍👧", titulo: "Modo cuidador",         desc: "Gerencie medicações de idosos e familiares remotamente." },
              { icon: "📊", titulo: "Histórico e relatórios",  desc: "Registro completo para compartilhar com seu médico." },
              { icon: "📱", titulo: "Web + App em breve",      desc: "Acesse pelo navegador agora. Android e iOS chegando em breve." },
              { icon: "🔒", titulo: "Privacidade total",       desc: "Seus dados de saúde protegidos com criptografia ponta a ponta." },
            ].map((f, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${T.borda}`, borderRadius: 16, padding: 24, transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.vermelho}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.borda}
              >
                <div style={{ width: 44, height: 44, background: T.vermelhoClaro, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: T.preto, marginBottom: 8 }}>{f.titulo}</h3>
                <p style={{ fontSize: 12, color: T.cinzaClaro, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ──────────────────────────────────── */}
      <section style={{ padding: "72px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 11, color: T.vermelho, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Como funciona</p>
          <h2 style={{ textAlign: "center", fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, color: T.preto, marginBottom: 8, letterSpacing: -0.5 }}>4 passos simples</h2>
          <p style={{ textAlign: "center", fontSize: 14, color: T.cinzaClaro, marginBottom: 48 }}>Comece em menos de 2 minutos</p>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, position: "relative" }}>
            <div style={{ position: "absolute", top: 22, left: "12%", right: "12%", height: 1, background: `repeating-linear-gradient(90deg,${T.vermelho} 0,${T.vermelho} 8px,transparent 8px,transparent 16px)`, zIndex: 0 }} />
            {[
              { n: "1", titulo: "Crie sua conta",     desc: "Cadastro rápido e gratuito." },
              { n: "2", titulo: "Adicione remédios",  desc: "Nome, dose e horário de cada medicação." },
              { n: "3", titulo: "Receba alertas",     desc: "Notificações no momento certo." },
              { n: "4", titulo: "Confirme e registre",desc: "Um toque para confirmar. Tudo salvo." },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: 44, height: 44, background: T.vermelho, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", margin: "0 auto 14px" }}>{s.n}</div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: T.preto, marginBottom: 6 }}>{s.titulo}</h4>
                <p style={{ fontSize: 11, color: T.cinzaClaro, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ─────────────────────────────────────────── */}
      <section style={{ padding: "72px 5%", background: T.fundoPage }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 11, color: T.vermelho, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Planos</p>
          <h2 style={{ textAlign: "center", fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, color: T.preto, marginBottom: 8, letterSpacing: -0.5 }}>Comece de graça</h2>
          <p style={{ textAlign: "center", fontSize: 14, color: T.cinzaClaro, marginBottom: 48 }}>Sem cartão de crédito necessário</p>
          <div className="plan-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              { tier: "GRATUITO", preco: "0",  desc: "Perfeito para começar",       feats: ["Até 3 medicações","Alarmes básicos","Histórico de 7 dias"],             destaque: false },
              { tier: "PRO",      preco: "19", desc: "Para você e sua família",     feats: ["Medicações ilimitadas","Modo cuidador","Histórico completo","Relatório para médico"], destaque: true  },
              { tier: "CLÍNICA",  preco: "79", desc: "Para clínicas e cuidadores",  feats: ["Múltiplos pacientes","Painel administrativo","Suporte prioritário"],      destaque: false },
            ].map((p, i) => (
              <div key={i} style={{ background: "#fff", border: `1.5px solid ${p.destaque ? T.vermelho : T.borda}`, borderRadius: 20, padding: 28, position: "relative", background: p.destaque ? T.vermelhoClaro : "#fff" }}>
                {p.destaque && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: T.vermelho, color: "#fff", padding: "4px 16px", borderRadius: 20, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>MAIS POPULAR</div>}
                <p style={{ fontSize: 10, fontWeight: 700, color: T.cinzaClaro, letterSpacing: 2, marginBottom: 14 }}>{p.tier}</p>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.preto }}>R$</span>
                  <span style={{ fontSize: 40, fontWeight: 800, color: T.preto, letterSpacing: -1 }}>{p.preco}</span>
                  <span style={{ fontSize: 13, color: T.cinzaClaro }}>/mês</span>
                </div>
                <p style={{ fontSize: 12, color: T.cinzaClaro, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${T.borda}` }}>{p.desc}</p>
                {p.feats.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.vermelho, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: T.cinzaEscuro }}>{f}</span>
                  </div>
                ))}
                <button onClick={irParaAuth} style={{
                  display: "block", width: "100%", padding: 11, borderRadius: 10,
                  fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 20,
                  background: p.destaque ? T.vermelho : "#fff",
                  color:      p.destaque ? "#fff" : T.preto,
                  border:     `1.5px solid ${p.destaque ? T.vermelho : T.borda}`,
                }}>
                  {p.tier === "CLÍNICA" ? "Falar com vendas" : "Começar agora"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────── */}
      <section style={{ background: T.azul, padding: "56px 5%" }}>
        <div className="cta-grid" style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: -0.5 }}>Comece a cuidar da sua saúde hoje</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>Cadastre-se gratuitamente e receba acesso imediato</p>
          </div>
          <div className="band-form" style={{ display: "flex", gap: 8 }}>
            <input placeholder="Seu melhor e-mail" style={{
              background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)",
              color: "#fff", padding: "12px 16px", borderRadius: 10, fontSize: 13, width: 220,
            }} />
            <button onClick={irParaAuth} style={{ background: "#fff", color: T.azul, border: "none", padding: "12px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              Começar grátis →
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ padding: "24px 5%", borderTop: `1px solid ${T.borda}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: T.preto }}>Med<span style={{ color: T.vermelho }}>Alert</span></span>
        <p style={{ fontSize: 11, color: T.cinzaClaro }}>© {new Date().getFullYear()} MedAlert · Todos os direitos reservados</p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Termos de Uso","Privacidade","Contato"].map(l => (
            <span key={l} style={{ fontSize: 12, color: T.cinzaClaro, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
