// ============================================================
//  SERVICE: api.js
//  Centraliza todas as chamadas ao backend.
//  Para mudar a URL da API: altere o VITE_API_URL no .env
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Pega o token salvo no localStorage
function getToken() {
  return localStorage.getItem("medalert_token");
}

// Headers padrão com autenticação
function headers(comAuth = true) {
  const h = { "Content-Type": "application/json" };
  if (comAuth) h["Authorization"] = `Bearer ${getToken()}`;
  return h;
}

// Função base para chamadas
async function req(method, rota, body = null, comAuth = true) {
  const res = await fetch(`${BASE_URL}${rota}`, {
    method,
    headers: headers(comAuth),
    body: body ? JSON.stringify(body) : null,
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || "Erro na requisição");
  return data;
}

// ── AUTH ────────────────────────────────────────────────────
export const authService = {
  cadastro:       (dados)          => req("POST", "/auth/cadastro",        dados,           false),
  login:          (dados)          => req("POST", "/auth/login",           dados,           false),
  perfil:         ()               => req("GET",  "/auth/perfil"),
  esqueceuSenha:  (email)          => req("POST", "/auth/esqueceu-senha",  { email },       false),
  redefinirSenha: (token, senha)   => req("POST", "/auth/redefinir-senha", { token, senha}, false),
};

// ── MEDICAÇÕES ───────────────────────────────────────────────
export const medicacaoService = {
  listar:         ()      => req("GET",    "/medicacoes"),
  criar:          (dados) => req("POST",   "/medicacoes",               dados),
  atualizar:      (id, d) => req("PUT",    `/medicacoes/${id}`,          d),
  deletar:        (id)    => req("DELETE", `/medicacoes/${id}`),
  confirmarDose:  (dados) => req("POST",   "/medicacoes/confirmar-dose", dados),
  historico:      ()      => req("GET",    "/medicacoes/historico"),
  salvarPush:     (sub)   => req("POST",   "/medicacoes/push-subscription", { subscription: sub }),
};
