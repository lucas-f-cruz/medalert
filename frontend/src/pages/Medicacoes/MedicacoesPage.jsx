// ============================================================
//  PÁGINA: Medicações
//  Lista, adiciona, edita e remove medicações do usuário.
// ============================================================
import { useState, useEffect } from "react";
import { medicacaoService } from "../../services/api";
import { TEMA } from "../../styles/tema";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function MedicacoesPage() {
  const [medicacoes, setMedicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState(formVazio());
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
    setForm(med
      ? { nome: med.nome, dosagem: med.dosagem, instrucoes: med.instrucoes || "", horarios: med.horarios, diasDaSemana: med.diasDaSemana || [], cor: med.cor || "#e03131", icone: med.icone || "💊" }
      : formVazio()
    );
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
    let v = valor.replace(/[^0-9]/g, "");
    if (v.length >= 3) v = v.slice(0, 2) + ":" + v.slice(2, 4);
    setForm(f => ({ ...f, horarios: f.horarios.map((h, idx) => idx === i ? v : h) }));
  }

  function removeHorario(i) {
    setForm(f => ({ ...f, horarios: f.horarios.filter((_, idx) => idx !== i) }));
  }

  return (
    <div>
      <style>{`
        .med-card {
          background: #ffffff;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
        }
        .med-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: var(--cor-card, #e03131);
          transition: height 0.25s ease;
        }
        .med-card:hover {
          border-color: var(--cor-card, #e03131);
          box-shadow: 0 8px 28px rgba(0,0,0,0.10), 0 2px 8px rgba(224,49,49,0.08);
          transform: translateY(-3px);
        }
        .med-card:hover::before { height: 6px; }
        .med-card:hover .med-nome { color: var(--cor-card, #e03131) !important; }
        .med-card:hover .med-dosagem { color: #374151 !important; }
        .med-card:hover .med-instrucoes { background: #eff6ff !important; color: #1d4ed8 !important; }
        .med-card:hover .horario-badge { background: #e03131; color: #fff; border-color: #e03131; }

        .btn-editar {
          background: #eff6ff; border: none; border-radius: 7px;
          padding: 5px 12px; cursor: pointer; font-size: 12px;
          font-weight: 500; color: #1d4ed8; transition: all 0.2s;
        }
        .btn-editar:hover { background: #1d4ed8; color: #fff; box-shadow: 0 2px 8px rgba(29,78,216,0.25); }

        .btn-remover {
          background: #fff0f0; border: none; border-radius: 7px;
          padding: 5px 12px; cursor: pointer; font-size: 12px;
          font-weight: 500; color: #e03131; transition: all 0.2s;
        }
        .btn-remover:hover { background: #e03131; color: #fff; box-shadow: 0 2px 8px rgba(224,49,49,0.25); }

        .horario-badge {
          background: #fff0f0; color: #e03131; font-size: 12px;
          font-weight: 600; padding: 4px 12px; border-radius: 20px;
          border: 1px solid #fecaca; transition: all 0.2s;
          display: inline-block;
        }

        .btn-adicionar-principal {
          background: #e03131; color: #fff; border: none;
          padding: 10px 22px; border-radius: 10px; font-size: 14px;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(224,49,49,0.2);
        }
        .btn-adicionar-principal:hover {
          background: #c92a2a;
          box-shadow: 0 4px 16px rgba(224,49,49,0.35);
          transform: translateY(-1px);
        }

        .modal-medalert input, .modal-medalert select {
          background: #ffffff !important;
          color: #0a1628 !important;
          color-scheme: light;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .modal-medalert input:focus, .modal-medalert select:focus {
          outline: none;
          border-color: #e03131 !important;
          box-shadow: 0 0 0 3px rgba(224,49,49,0.10);
        }
        .modal-medalert input:hover, .modal-medalert select:hover {
          border-color: #9ca3af !important;
        }
        .btn-modal-cancelar {
          flex: 1; padding: 11px;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          background: #fff; color: #6b7280;
          cursor: pointer; font-size: 14px; transition: all 0.2s;
        }
        .btn-modal-cancelar:hover {
          border-color: #e03131; color: #e03131;
          background: #fff0f0;
        }
        .btn-modal-salvar {
          flex: 2; padding: 11px;
          background: #e03131; border: none; border-radius: 10px;
          color: #fff; font-weight: 700; cursor: pointer; font-size: 14px;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(224,49,49,0.25);
        }
        .btn-modal-salvar:hover:not(:disabled) {
          background: #c92a2a;
          box-shadow: 0 4px 16px rgba(224,49,49,0.35);
          transform: translateY(-1px);
        }
        .btn-add-horario {
          background: #eff6ff; border: none; border-radius: 8px;
          padding: 8px 14px; cursor: pointer; color: #1d4ed8; font-size: 13px;
          transition: all 0.2s; font-weight: 500;
        }
        .btn-add-horario:hover {
          background: #1d4ed8; color: #fff;
          box-shadow: 0 2px 8px rgba(29,78,216,0.2);
        }
        .btn-dia {
          padding: 6px 12px; border-radius: 7px; font-size: 12px;
          font-weight: 500; cursor: pointer; transition: all 0.2s;
        }
        .btn-dia:hover { transform: translateY(-1px); box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
        .modal-header-close {
          background: none; border: none; font-size: 20px;
          cursor: pointer; color: #9ca3af; transition: all 0.2s;
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-header-close:hover { background: #fff0f0; color: #e03131; }
      `}</style>

      {/* Cabeçalho */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: T.preto, margin: 0, letterSpacing: -0.5 }}>Minhas Medicações</h1>
          <p style={{ fontSize: 14, color: T.cinza, marginTop: 4 }}>{medicacoes.length} medicação(ões) cadastrada(s)</p>
        </div>
        <button className="btn-adicionar-principal" onClick={() => abrirModal()}>+ Adicionar</button>
      </div>

      {/* Lista */}
      {carregando ? (
        <p style={{ color: T.cinza, textAlign: "center", padding: 40 }}>Carregando...</p>
      ) : medicacoes.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: T.branco, borderRadius: 14, border: `1px solid ${T.borda}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💊</div>
          <h3 style={{ color: T.preto, marginBottom: 8 }}>Nenhuma medicação cadastrada</h3>
          <p style={{ color: T.cinza, fontSize: 14 }}>Clique em "+ Adicionar" para cadastrar seu primeiro remédio</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {medicacoes.map(med => (
            <div key={med._id} className="med-card" style={{ "--cor-card": med.cor || T.vermelho }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: T.vermelhoClaro, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {med.icone || "💊"}
                  </div>
                  <div>
                    <p className="med-nome" style={{ fontSize: 15, fontWeight: 700, color: T.preto, margin: 0, transition: "color 0.25s" }}>{med.nome}</p>
                    <p className="med-dosagem" style={{ fontSize: 12, color: T.cinza, margin: "2px 0 0", transition: "color 0.25s" }}>{med.dosagem}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn-editar" onClick={() => abrirModal(med)}>Editar</button>
                  <button className="btn-remover" onClick={() => deletar(med._id)}>Remover</button>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {med.horarios.map((h, i) => (
                  <span key={i} className="horario-badge">⏰ {h}</span>
                ))}
              </div>
              {med.instrucoes && (
                <p className="med-instrucoes" style={{ fontSize: 12, color: T.cinza, marginTop: 10, padding: "8px 10px", background: T.fundoPage, borderRadius: 6, transition: "all 0.25s" }}>
                  📝 {med.instrucoes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalAberto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div className="modal-medalert" style={{ background: T.branco, borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: T.preto, margin: 0 }}>
                {editando ? "Editar medicação" : "Nova medicação"}
              </h2>
              <button onClick={() => setModalAberto(false)} className="modal-header-close">✕</button>
            </div>

            <form onSubmit={salvar} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Campo label="Nome do remédio *" value={form.nome} onChange={v => setForm(f => ({ ...f, nome: v }))} placeholder="Ex: Losartana" />
              <Campo label="Dosagem *" value={form.dosagem} onChange={v => setForm(f => ({ ...f, dosagem: v }))} placeholder="Ex: 50mg, 2 comprimidos" />
              <Campo label="Instruções" value={form.instrucoes} onChange={v => setForm(f => ({ ...f, instrucoes: v }))} placeholder="Ex: Tomar em jejum" />

              {/* Horários */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 4 }}>Horários *</label>
                <p style={{ fontSize: 11, color: T.cinzaClaro, marginBottom: 8 }}>Digite no formato 24h — Ex: 08:00, 14:30, 20:00</p>
                {form.horarios.map((h, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <div style={{ flex: 1, position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>⏰</span>
                      <input
                        type="text"
                        value={h}
                        placeholder="HH:MM"
                        maxLength={5}
                        onChange={e => updateHorario(i, e.target.value)}
                        style={{ width: "100%", padding: "9px 12px 9px 36px", border: `1.5px solid ${T.borda}`, borderRadius: 8, fontSize: 15, fontWeight: 600, background: T.branco, color: T.preto, boxSizing: "border-box", letterSpacing: 2 }}
                      />
                    </div>
                    {form.horarios.length > 1 && (
                      <button type="button" onClick={() => removeHorario(i)} style={{ background: T.vermelhoClaro, border: "none", borderRadius: 8, padding: "9px 12px", cursor: "pointer", color: T.vermelho, flexShrink: 0 }}>✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addHorario} className="btn-add-horario">+ Adicionar horário</button>
              </div>

              {/* Dias da semana */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 8 }}>Dias (vazio = todos os dias)</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {DIAS.map((dia, i) => (
                    <button key={i} type="button" onClick={() => toggleDia(i)} style={{
                      padding: "5px 10px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer",
                      background: form.diasDaSemana.includes(i) ? T.vermelho : T.fundoPage,
                      color: form.diasDaSemana.includes(i) ? "#fff" : T.cinza,
                      border: `1px solid ${form.diasDaSemana.includes(i) ? T.vermelho : T.borda}`,
                      transition: "all 0.2s",
                    }}>{dia}</button>
                  ))}
                </div>
              </div>

              {/* Ícone e cor */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 6 }}>Ícone</label>
                  <select value={form.icone} onChange={e => setForm(f => ({ ...f, icone: e.target.value }))}
                    style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${T.borda}`, borderRadius: 8, fontSize: 16, background: T.branco, color: T.preto }}>
                    {["💊", "💉", "🩺", "💚", "🔴", "🔵", "🟡", "🫀"].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: T.cinzaEscuro, display: "block", marginBottom: 6 }}>Cor</label>
                  <input type="color" value={form.cor} onChange={e => setForm(f => ({ ...f, cor: e.target.value }))}
                    style={{ width: "100%", height: 42, border: `1.5px solid ${T.borda}`, borderRadius: 8, cursor: "pointer", padding: 2 }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setModalAberto(false)} className="btn-modal-cancelar">Cancelar</button>
                <button type="submit" disabled={salvando} className="btn-modal-salvar" style={{ opacity: salvando ? 0.7 : 1 }}>
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
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", padding: "10px 14px", border: `1.5px solid #e5e7eb`, borderRadius: 9, fontSize: 14, color: "#0a1628", background: "#ffffff", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "#e03131"}
        onBlur={e => e.target.style.borderColor = "#e5e7eb"}
      />
    </div>
  );
}