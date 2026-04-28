// ============================================================
//  CONTEXT: AuthContext
//  Gerencia o estado de autenticação em todo o app.
//  Uso: const { usuario, login, logout } = useAuth()
// ============================================================
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario,    setUsuario]    = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Verifica se já tem sessão salva ao carregar o app
  useEffect(() => {
    const token = localStorage.getItem("medalert_token");
    if (token) {
      authService.perfil()
        .then(data => setUsuario(data.usuario))
        .catch(() => localStorage.removeItem("medalert_token"))
        .finally(() => setCarregando(false));
    } else {
      setCarregando(false);
    }
  }, []);

  async function login(email, senha) {
    const data = await authService.login({ email, senha });
    localStorage.setItem("medalert_token", data.token);
    setUsuario(data.usuario);
    return data;
  }

  async function cadastro(nome, email, senha) {
    const data = await authService.cadastro({ nome, email, senha });
    localStorage.setItem("medalert_token", data.token);
    setUsuario(data.usuario);
    return data;
  }

  function logout() {
    localStorage.removeItem("medalert_token");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, cadastro, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
