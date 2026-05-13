// ============================================================
//  MEDALERT — APP PRINCIPAL
//  Define todas as rotas e protege as páginas internas.
//
//  Rotas públicas:  /  (landing) | /auth (login/cadastro)
//  Rotas privadas:  /dashboard | /medicacoes | /historico | /perfil
// ============================================================
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout }          from "./components/Layout/Layout";
import { LandingPage }     from "./pages/Landing/LandingPage";
import { AuthPage }             from "./pages/Auth/AuthPage";
import { ResetPasswordPage }   from "./pages/Auth/ResetPasswordPage";
import { DashboardPage }   from "./pages/Dashboard/DashboardPage";
import { MedicacoesPage }  from "./pages/Medicacoes/MedicacoesPage";
import { HistoricoPage }   from "./pages/Historico/HistoricoPage";

// Protege rotas privadas — redireciona para /auth se não logado
function RotaPrivada({ children }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "Inter,sans-serif", color: "#6b7280" }}>Carregando...</div>;
  return usuario ? children : <Navigate to="/auth" replace />;
}

// Redireciona para dashboard se já logado
function RotaPublica({ children }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return null;
  return usuario ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/"               element={<RotaPublica><LandingPage /></RotaPublica>} />
      <Route path="/auth"           element={<RotaPublica><AuthPage /></RotaPublica>} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Privadas — todas dentro do Layout (sidebar) */}
      <Route path="/dashboard"  element={<RotaPrivada><Layout><DashboardPage  /></Layout></RotaPrivada>} />
      <Route path="/medicacoes" element={<RotaPrivada><Layout><MedicacoesPage /></Layout></RotaPrivada>} />
      <Route path="/historico"  element={<RotaPrivada><Layout><HistoricoPage  /></Layout></RotaPrivada>} />

      {/* Rota não encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
