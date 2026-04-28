// ============================================================
//  PÁGINA: Histórico
//  Exibe o registro de todas as doses tomadas/ignoradas.
// ============================================================
import { useState, useEffect } from "react";
import { medicacaoService }    from "../../services/api";
import { TEMA }                from "../../styles/tema";

export function HistoricoPage() {
  const [historico,  setHistorico]  = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro,     setFiltro]     = useState("todos");
  const T = TEMA;

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try {
      const data = await medicacaoService.historico();
      setHistorico(data.historico || []);
    } catch (e) { console.error(e); }
    finally { setCarregando(false); }
  }

  const filtrados = historico.filter(h => filtro === "todos" || h.status === filtro);

  const totalTomadas  = historico.filter(h => h.status === "tomado").length;
  const totalIgnoradas = historico.filter(h => h.status === "ignorado").length;
  const aderencia     = historico.length > 0 ? Math.round((totalTomadas / historico.length) * 100) : 0;

  const STATUS = {
    tomado:   { label: "Tomado",   cor: "#16a34a", bg: "#f0fdf4", icon: "✅" },
    ignorado: { label: "Ignorado", cor: T.cinza,   bg: T.fundoPage, icon: "❌" },
    atrasado: { label: "Atrasado", cor: "#d97706", bg: "#fffbeb", icon: "⏰" },
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: T.preto, margin: 0, letterSpacing: -0.5 }}>Histórico</h1>
        <p style={{ fontSize: 14, color: T.cinza, marginTop: 4 }}>Registro completo das suas doses</p>
      </div>

      {/* Cards de resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Taxa de aderência", valor: `${aderencia}%`, cor: T.azul,    icon: "📊" },
          { label: "Doses tomadas",     valor: totalTomadas,    cor: "#16a34a", icon: "✅" },
          { label: "Doses ignoradas",   valor: totalIgnoradas,  cor: T.cinza,   icon: "❌" },
          { label: "Total registrado",  valor: historico.length, cor: T.preto,  icon: "📋" },
        ].map((c, i) => (
          <div key={i} style={{ background: T.branco, border: `1px solid ${T.borda}`, borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{c.icon}</div>
            <p style={{ fontSize: 11, color: T.cinza, margin: "0 0 4px" }}>{c.label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: c.cor, margin: 0, letterSpacing: -0.5 }}>{c.valor}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["todos","tomado","ignorado","atrasado"].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding: "7px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: filtro === f ? 600 : 400,
            background: filtro === f ? T.vermelho : T.branco,
            color:      filtro === f ? "#fff" : T.cinza,
            border:     `1px solid ${filtro === f ? T.vermelho : T.borda}`,
          }}>
            {f === "todos" ? "Todos" : STATUS[f]?.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ background: T.branco, border: `1px solid ${T.borda}`, borderRadius: 14, overflow: "hidden" }}>
        {carregando ? (
          <p style={{ color: T.cinza, textAlign: "center", padding: 40 }}>Carregando...</p>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p style={{ color: T.cinza, fontSize: 14 }}>Nenhum registro encontrado</p>
          </div>
        ) : (
          filtrados.map((h, i) => {
            const s = STATUS[h.status] || STATUS.tomado;
            const data = new Date(h.horarioProgramado);
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                borderBottom: i < filtrados.length - 1 ? `1px solid ${T.borda}` : "none",
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.fundoPage, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {h.medicacao?.icone || "💊"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: T.preto, margin: 0 }}>{h.medicacao?.nome || "Medicação removida"}</p>
                  <p style={{ fontSize: 12, color: T.cinza, margin: "2px 0 0" }}>{h.medicacao?.dosagem}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12, color: T.cinza, margin: 0 }}>
                    {data.toLocaleDateString("pt-BR")} às {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div style={{ background: s.bg, color: s.cor, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                  {s.icon} {s.label}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
