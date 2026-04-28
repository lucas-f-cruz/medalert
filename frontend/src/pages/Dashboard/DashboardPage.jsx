// ============================================================
//  PÁGINA: Dashboard
//  Tela principal do app após login.
//  Mostra medicações do dia, próximos horários e resumo.
// ============================================================
import { useState, useEffect } from "react";
import { useAuth }             from "../../context/AuthContext";
import { medicacaoService }    from "../../services/api";
import { TEMA }                from "../../styles/tema";

export function DashboardPage() {
  const { usuario }              = useAuth();
  const [medicacoes, setMedicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [horaAtual,  setHoraAtual]  = useState(new Date());
  const T = TEMA;

  useEffect(() => {
    carregarMedicacoes();
    const timer = setInterval(() => setHoraAtual(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  async function carregarMedicacoes() {
    try {
      const data = await medicacaoService.listar();
      setMedicacoes(data.medicacoes || []);
    } catch (error) {
      console.error("Erro ao carregar medicações:", error);
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarDose(medicacaoId, horario) {
    try {
      await medicacaoService.confirmarDose({ medicacaoId, horarioProgramado: new Date() });
      setMedicacoes(prev => prev.map(m =>
        m._id === medicacaoId
          ? { ...m, _confirmadas: [...(m._confirmadas || []), horario] }
          : m
      ));
    } catch (error) {
      console.error("Erro ao confirmar dose:", error);
    }
  }

  // Filtra medicações do horário atual e próximas
  const horaStr = `${String(horaAtual.getHours()).padStart(2,"0")}:${String(horaAtual.getMinutes()).padStart(2,"0")}`;

  const medicacoesHoje = medicacoes.flatMap(m =>
    m.horarios.map(h => ({ ...m, horarioAtual: h, atrasado: h < horaStr, agora: h === horaStr }))
  ).sort((a, b) => a.horarioAtual.localeCompare(b.horarioAtual));

  const tomadas   = medicacoesHoje.filter(m => m._confirmadas?.includes(m.horarioAtual)).length;
  const pendentes = medicacoesHoje.length - tomadas;

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: T.preto, margin: 0, letterSpacing: -0.5 }}>
          Olá, {usuario?.nome?.split(" ")[0]}! 👋
        </h1>
        <p style={{ fontSize: 14, color: T.cinza, marginTop: 4 }}>
          {horaAtual.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Cards de resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total hoje",  valor: medicacoesHoje.length, cor: T.azul,     bg: T.azulClaro,     icon: "💊" },
          { label: "Tomadas",     valor: tomadas,               cor: "#16a34a",  bg: "#f0fdf4",       icon: "✅" },
          { label: "Pendentes",   valor: pendentes,             cor: T.vermelho, bg: T.vermelhoClaro, icon: "⏰" },
        ].map((c, i) => (
          <div key={i} style={{ background: T.branco, border: `1px solid ${T.borda}`, borderRadius: 14, padding: "20px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 12, color: T.cinza, marginBottom: 6 }}>{c.label}</p>
                <p style={{ fontSize: 32, fontWeight: 800, color: c.cor, margin: 0, letterSpacing: -1 }}>{c.valor}</p>
              </div>
              <div style={{ width: 40, height: 40, background: c.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {c.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }} className="dash-grid">

        {/* Medicações do dia */}
        <div style={{ background: T.branco, border: `1px solid ${T.borda}`, borderRadius: 14, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.preto, margin: 0 }}>Medicações de hoje</h2>
            <span style={{ fontSize: 12, color: T.cinza }}>{horaStr}</span>
          </div>

          {carregando ? (
            <p style={{ color: T.cinza, fontSize: 14, textAlign: "center", padding: 32 }}>Carregando...</p>
          ) : medicacoesHoje.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <p style={{ color: T.cinza, fontSize: 14 }}>Nenhuma medicação cadastrada hoje!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {medicacoesHoje.map((med, i) => {
                const tomada = med._confirmadas?.includes(med.horarioAtual);
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", borderRadius: 12,
                    border: `1px solid ${med.agora ? T.vermelhoBorda : T.borda}`,
                    background: med.agora ? T.vermelhoClaro : T.branco,
                    opacity: tomada ? 0.6 : 1,
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: med.agora ? T.vermelho : T.fundoPage, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {med.icone || "💊"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: T.preto, margin: 0 }}>{med.nome}</p>
                      <p style={{ fontSize: 12, color: T.cinza, margin: "2px 0 0" }}>{med.dosagem}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: med.agora ? T.vermelho : T.cinza, margin: 0 }}>
                        {med.horarioAtual}
                      </p>
                      {med.agora && <p style={{ fontSize: 10, color: T.vermelho, margin: "2px 0 0" }}>AGORA!</p>}
                    </div>
                    <button onClick={() => !tomada && confirmarDose(med._id, med.horarioAtual)} style={{
                      width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${tomada ? "#16a34a" : T.borda}`,
                      background: tomada ? "#f0fdf4" : T.branco, cursor: tomada ? "default" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0,
                      color: tomada ? "#16a34a" : T.cinzaClaro,
                    }}>
                      {tomada ? "✓" : "○"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Próximas doses */}
        <div style={{ background: T.branco, border: `1px solid ${T.borda}`, borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: T.preto, margin: "0 0 20px" }}>Próximas doses</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {medicacoesHoje.filter(m => m.horarioAtual > horaStr).slice(0, 5).map((med, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${T.borda}` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.vermelho, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: T.preto, margin: 0 }}>{med.nome}</p>
                  <p style={{ fontSize: 11, color: T.cinza, margin: 0 }}>{med.dosagem}</p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.azul }}>{med.horarioAtual}</span>
              </div>
            ))}
            {medicacoesHoje.filter(m => m.horarioAtual > horaStr).length === 0 && (
              <p style={{ fontSize: 13, color: T.cinzaClaro, textAlign: "center", padding: 20 }}>
                Sem mais doses hoje 🎉
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width: 900px){ .dash-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
