// ============================================================
//  PÁGINA: Medicações
//  Lista, adiciona, edita e remove medicações do usuário.
// ============================================================
import { useState, useEffect } from "react";
import { medicacaoService }    from "../../services/api";
import { TEMA }                from "../../styles/tema";

const DIAS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

export function MedicacoesPage() {
  const [medicacoes,  setMedicacoes]  = useState([]);
  const [carregando,  setCarregando]  = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando,    setEditando]    = useState(null);
  const [salvando,    setSalvando]    = useState(false);
  const [form,        setForm]        = useState(formVazio());
  const T = TEMA;

  function formVazio() {
    return { nome: "", dosagem: "", instrucoes: "", horarios: ["08:00"], diasDaSemana: [], cor: "#e03131", icone: "💊" };
  }

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try {
      const data = await medicacaoService.listar();
      setMedicacoes(data.medicacoes || []);
    } catch (e) { console.error(e); }
    finally { setCarregando(false); }
  }

  function abrirModal(med = null) {
    setEditando(med);
    setForm(med ? { nome: med.nome, dosagem: med.dosagem, instrucoes: med.instrucoes || "", horarios: med.horarios, diasDaSemana: med.diasDaSemana || [], cor: med.cor || "#e03131", icone: med.icone || "💊" } : formVazio());
    setModalAberto(true);
  }

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      if (editando) {
        await medicacaoService.atualizar(editando._id, form);
      } else {
        await medicacaoService.criar(form);
      }
      await carregar();
      setModalAberto(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function deletar(id) {
    if (!confirm("Remover esta medicação?")) return;
    await medicacaoService.deletar(id);
    carregar();
  }

  function toggleDia(dia) {
    setForm(f => ({
      ...f,
      diasDaSemana: f.diasDaSemana.includes(dia)
        ? f.diasDaSemana.filter(d => d !== dia)
        : [...f.diasDaSemana, dia],
    }));
  }

  function addHorario() {
    setForm(f => ({ ...f, horarios: [...f.horarios, "08:00"] }));
  }

  function updateHorario(i, valor) {
    setForm(f => ({ ...f, horarios: f.horarios.map((h, idx) => idx === i ? valor : h) }));
  }

  function removeHorario(i) {
    setForm(f => ({ ...f, horarios: f.horarios.filter((_, idx) => idx !== i) }));
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: T.preto, margin: 0, letterSpacing: -0.5 }}>Minhas Medicações</h1>
          <p style={{ fontSize: 14, color: T.cinza, marginTop: 4 }}>{medicacoes.length} medicação(ões) cadastrada(s)</p>
        </div>
        <button onClick={() => abrirModal()} style={{
          background: T.vermelho, color: "#fff", border: "none",
          padding: "10px 22px", borderRadius: 10, fontSize: 14,
          fontWeight: 600, cursor: "pointer",
        }}>+ Adicionar</button>
      </div>

      {/* Lista */}
      {carregando ? (
        <p style={{ color: T.cinza, textAlign: "center", padding: 40 }}>Carregando...</p>
      ) : medicacoes.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: T.branco, borderRadius: 14, border: `1px solid ${T.borda}` }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💊</div>
          <h3 style={{ color: T.preto, marginBottom: 8 }}>Nenhuma medicação cadastrada</h3>
          <p style={{ color: T.cinza, fontSize: 14 }}>Clique em "+ Adicionar" para cadastrar seu primeiro remédio</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {medicacoes.map(med => (
            <div key={med._id} style={{ background: T.branco, border: `1px solid ${T.borda}`, borderRadius: 14, padding: 20, borderTop: `3px solid ${med.cor || T.vermelho}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{med.icone || "💊"}</span>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: T.preto, margin: 0 }}>{med.nome}</p>
                    <p style={{ fontSize: 12, color: T.cinza, margin: 0 }}>{med.dosagem}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => abrirModal(med)} style={{ background: T.azulClaro, border: "none", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 12, color: T.azul }}>Editar</button>
                  <button onClick={() => deletar(med._id)} style={{ background: T.vermelhoClaro, border: "none", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 12, color: T.vermelho }}>Remover</button>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {med.horarios.map((h, i) => (
                  <span key={i} style={{ background: T.vermelhoClaro, color: T.vermelho, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>⏰ {h}</span>
                ))}
              </div>
              {med.instrucoes && (
                <p style={{ fontSize: 12, color: T.cinza, marginTop: 10, padding: "8px", background: T.fundoPage, borderRadius: 6 }}>
                  📝 {med.instrucoes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalAberto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: T.branco, borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: T.preto, margin: 0 }}>
                {editando ? "Editar medicação" : "Nova medicação"}
              </h2>
              <button onClick={() => setModalAberto(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: T.cinza }}>✕</button>
            </div>

            <form onSubmit={salvar} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Campo label="Nome do remédio *" value={form.nome} onChange={v => setForm(f => ({...f, nome: v}))} placeholder="Ex: Losartana" />
              <Campo label="Dosagem *" value={form.dosagem} onChange={v => setForm(f => ({...f, dosagem: v}))} placeholder="Ex: 50mg, 2 comprimidos" />
              <Campo label="Instruções" value={form.instrucoes} onChange={v => setForm(f => ({...f, instrucoes: v}))} placeholder="Ex: Tomar em jejum" />

              {/* Horários */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 8 }}>Horários *</label>
                {form.horarios.map((h, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input type="time" value={h} onChange={e => updateHorario(i, e.target.value)}
                      style={{ flex: 1, padding: "9px 12px", border: `1.5px solid ${T.borda}`, borderRadius: 8, fontSize: 14 }} />
                    {form.horarios.length > 1 && (
                      <button type="button" onClick={() => removeHorario(i)} style={{ background: T.vermelhoClaro, border: "none", borderRadius: 8, padding: "9px 12px", cursor: "pointer", color: T.vermelho }}>✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addHorario} style={{ background: T.azulClaro, border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", color: T.azul, fontSize: 13 }}>
                  + Adicionar horário
                </button>
              </div>

              {/* Dias da semana */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 8 }}>Dias (vazio = todos os dias)</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {DIAS.map((dia, i) => (
                    <button key={i} type="button" onClick={() => toggleDia(i)} style={{
                      padding: "5px 10px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer",
                      background: form.diasDaSemana.includes(i) ? T.vermelho : T.fundoPage,
                      color:      form.diasDaSemana.includes(i) ? "#fff" : T.cinza,
                      border:     `1px solid ${form.diasDaSemana.includes(i) ? T.vermelho : T.borda}`,
                    }}>{dia}</button>
                  ))}
                </div>
              </div>

              {/* Ícone e cor */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 6 }}>Ícone</label>
                  <select value={form.icone} onChange={e => setForm(f => ({...f, icone: e.target.value}))}
                    style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${T.borda}`, borderRadius: 8, fontSize: 16 }}>
                    {["💊","💉","🩺","💚","🔴","🔵","🟡","🫀"].map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 6 }}>Cor</label>
                  <input type="color" value={form.cor} onChange={e => setForm(f => ({...f, cor: e.target.value}))}
                    style={{ width: "100%", height: 42, border: `1.5px solid ${T.borda}`, borderRadius: 8, cursor: "pointer", padding: 2 }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setModalAberto(false)} style={{ flex: 1, padding: "11px", border: `1.5px solid ${T.borda}`, borderRadius: 10, background: T.branco, color: T.cinza, cursor: "pointer", fontSize: 14 }}>
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} style={{ flex: 2, padding: "11px", background: T.vermelho, border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, opacity: salvando ? 0.7 : 1 }}>
                  {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar medicação"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({ label, value, onChange, placeholder }) {
  const T = TEMA;
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 6 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${T.borda}`, borderRadius: 9, fontSize: 14, color: T.preto, boxSizing: "border-box" }} />
    </div>
  );
}
