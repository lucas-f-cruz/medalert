// ============================================================
//  COMPONENTE: Layout
//  Sidebar de navegação + área de conteúdo.
//  Usado em todas as páginas internas do app.
// ============================================================
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { TEMA } from "../../styles/tema";

const MENU = [
  { icon: "🏠", label: "Dashboard",  path: "/dashboard"  },
  { icon: "💊", label: "Medicações", path: "/medicacoes" },
  { icon: "📊", label: "Histórico",  path: "/historico"  },
  { icon: "👤", label: "Perfil",     path: "/perfil"     },
];

export function Layout({ children }) {
  const [menuMobile, setMenuMobile] = useState(false);
  const { usuario, logout }          = useAuth();
  const navigate                     = useNavigate();
  const location                     = useLocation();
  const T                            = TEMA;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: T.fundoPage }}>

      {/* SIDEBAR DESKTOP */}
      <aside style={{
        width: 240, background: T.branco, borderRight: `1px solid ${T.borda}`,
        display: "flex", flexDirection: "column", padding: "24px 0",
        position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50,
      }} className="sidebar-desk">

        {/* Logo */}
        <div style={{ padding: "0 20px 24px", borderBottom: `1px solid ${T.borda}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: T.vermelho, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>M</div>
            <span style={{ fontSize: 17, fontWeight: 700, color: T.preto }}>Med<span style={{ color: T.vermelho }}>Alert</span></span>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {MENU.map(item => {
            const ativo = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", border: "none", borderRadius: 9, cursor: "pointer",
                background:  ativo ? T.vermelhoClaro : "transparent",
                color:       ativo ? T.vermelho : T.cinzaEscuro,
                fontWeight:  ativo ? 600 : 400,
                fontSize: 14, marginBottom: 4,
                transition: "all 0.15s",
              }}
                onMouseEnter={e => { if (!ativo) e.currentTarget.style.background = T.fundoPage; }}
                onMouseLeave={e => { if (!ativo) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
                {ativo && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: T.vermelho }} />}
              </button>
            );
          })}
        </nav>

        {/* Usuário + Logout */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.borda}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.vermelhoClaro, border: `1.5px solid ${T.vermelhoBorda}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.vermelho }}>
              {usuario?.nome?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.preto, margin: 0 }}>{usuario?.nome}</p>
              <p style={{ fontSize: 11, color: T.cinzaClaro, margin: 0 }}>{usuario?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "8px", border: `1px solid ${T.borda}`,
            borderRadius: 8, background: "transparent", color: T.cinza,
            fontSize: 13, cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = T.vermelhoClaro; e.currentTarget.style.color = T.vermelho; e.currentTarget.style.borderColor = T.vermelhoBorda; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.cinza; e.currentTarget.style.borderColor = T.borda; }}
          >
            Sair da conta
          </button>
        </div>
      </aside>

      {/* NAVBAR MOBILE */}
      <header style={{
        display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: T.branco, borderBottom: `1px solid ${T.borda}`,
        padding: "14px 20px", alignItems: "center", justifyContent: "space-between",
      }} className="navbar-mobile">
        <span style={{ fontSize: 16, fontWeight: 700, color: T.preto }}>Med<span style={{ color: T.vermelho }}>Alert</span></span>
        <button onClick={() => setMenuMobile(!menuMobile)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>☰</button>
      </header>

      {/* Menu mobile expandido */}
      {menuMobile && (
        <div style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 49, background: T.branco, borderBottom: `1px solid ${T.borda}`, padding: "12px 16px" }}>
          {MENU.map(item => (
            <button key={item.path} onClick={() => { navigate(item.path); setMenuMobile(false); }} style={{
              display: "block", width: "100%", textAlign: "left", padding: "10px 12px",
              border: "none", background: "transparent", fontSize: 14, color: T.cinzaEscuro, cursor: "pointer",
            }}>{item.icon} {item.label}</button>
          ))}
        </div>
      )}

      {/* CONTEÚDO */}
      <main style={{ flex: 1, marginLeft: 240, padding: "32px", minHeight: "100vh" }} className="main-content">
        {children}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @media(max-width: 768px) {
          .sidebar-desk  { display: none !important; }
          .navbar-mobile { display: flex !important; }
          .main-content  { margin-left: 0 !important; padding: 80px 16px 24px !important; }
        }
      `}</style>
    </div>
  );
}
