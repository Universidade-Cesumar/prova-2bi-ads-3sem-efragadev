const API_URL = "https://6a309701a7f8866418d628c5.mockapi.io/senac-almox/materiais";

// Limites para o status visual (barra lateral colorida)
const LIMITE_CRITICO = 5;
const LIMITE_BAIXO = 15;


// ELEMENTOS DO DOM
const form = document.getElementById("form-cadastro");
const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");
const feedbackMsg = document.getElementById("feedback-msg");
const btnAtualizar = document.getElementById("btn-atualizar");
const estadoVazio = document.getElementById("estado-vazio");
const estadoCarregando = document.getElementById("estado-carregando");
const totalItensEl = document.getElementById("total-itens");
const totalAlertaEl = document.getElementById("total-alerta");
const btnTema = document.getElementById("btn-tema");
const temaLabel = btnTema ? btnTema.querySelector(".theme-toggle-label") : null;

// FUNÇÕES AUXILIARES DE INTERFACE
function mostrarFeedback(mensagem, tipo) {
  feedbackMsg.textContent = mensagem;
  feedbackMsg.className = `feedback ${tipo}`;
  feedbackMsg.hidden = false;

  setTimeout(() => {
    feedbackMsg.hidden = true;
  }, 4000);
}

function alternarCarregando(mostrar) {
  estadoCarregando.hidden = !mostrar;
}

function alternarEstadoVazio(mostrar) {
  estadoVazio.hidden = !mostrar;
}

function alternarBotaoCadastrar(desabilitado) {
  btnCadastrar.disabled = desabilitado;
  btnCadastrar.innerHTML = desabilitado
    ? '<span class="btn-icon">⏳</span> Cadastrando...'
    : '<span class="btn-icon">+</span> Cadastrar material';
}

function classificarStatus(quantidade) {
  if (quantidade <= LIMITE_CRITICO) return "critico";
  if (quantidade <= LIMITE_BAIXO) return "baixo";
  return "ok";
}

// RENDERIZAÇÃO
function renderizarMateriais(materiais) {
  listaMateriais.innerHTML = "";

  if (!materiais || materiais.length === 0) {
    alternarEstadoVazio(true);
    atualizarResumo([]);
    return;
  }

  alternarEstadoVazio(false);

  materiais.forEach((material) => {
    const quantidade = Number(material.quantidade) || 0;
    const status = classificarStatus(quantidade);

    const linha = document.createElement("tr");
    linha.className = `linha-status status-${status}`;

    const celulaNome = document.createElement("td");
    celulaNome.className = "celula-nome";
    celulaNome.textContent = material.nome ?? "—";

    const celulaQuantidade = document.createElement("td");
    celulaQuantidade.className = "celula-quantidade";

    const badge = document.createElement("span");
    badge.className = `qtd-badge badge-${status}`;
    badge.textContent = quantidade;
    celulaQuantidade.appendChild(badge);

    const celulaStatus = document.createElement("td");
    celulaStatus.className = "celula-status-texto";
    const rotulos = {
      ok: "Em estoque",
      baixo: "Estoque baixo",
      critico: "Estoque crítico",
    };
    celulaStatus.textContent = rotulos[status];

    linha.appendChild(celulaNome);
    linha.appendChild(celulaQuantidade);
    linha.appendChild(celulaStatus);

    listaMateriais.appendChild(linha);
  });

  atualizarResumo(materiais);
}

function atualizarResumo(materiais) {
  if (!totalItensEl || !totalAlertaEl) return;

  const total = materiais.length;
  const emAlerta = materiais.filter((m) => {
    const status = classificarStatus(Number(m.quantidade) || 0);
    return status === "baixo" || status === "critico";
  }).length;

  totalItensEl.textContent = total;
  totalAlertaEl.textContent = emAlerta;
}

// REQUISIÇÕES À API
async function carregarMateriais() {
  alternarCarregando(true);
  alternarEstadoVazio(false);
  listaMateriais.innerHTML = "";

  try {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const materiais = await resposta.json();
    renderizarMateriais(materiais);
  } catch (erro) {
    console.error("Erro ao carregar materiais:", erro);
    mostrarFeedback(
      "Não foi possível carregar o inventário. Verifique a conexão ou a configuração da API.",
      "erro"
    );
    alternarEstadoVazio(true);
  } finally {
    alternarCarregando(false);
  }
}

async function cadastrarMaterial(novoMaterial) {
  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(novoMaterial),
  });

  if (!resposta.ok) {
    throw new Error(`Erro HTTP: ${resposta.status}`);
  }

  return await resposta.json();
}

// TEMA (claro / escuro)
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);

  if (temaLabel) {
    temaLabel.textContent = tema === "dark" ? "Modo claro" : "Modo escuro";
  }

  if (btnTema) {
    btnTema.setAttribute(
      "aria-pressed",
      tema === "dark" ? "true" : "false"
    );
  }
}

function alternarTema() {
  const temaAtual = document.documentElement.getAttribute("data-theme") || "light";
  const novoTema = temaAtual === "dark" ? "light" : "dark";
  aplicarTema(novoTema);
}

if (btnTema) {
  btnTema.addEventListener("click", alternarTema);
}

// EVENTOS
form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = inputNome.value.trim();
  const quantidade = inputQuantidade.value;

  if (!nome) {
    mostrarFeedback("Informe o nome do material.", "erro");
    inputNome.focus();
    return;
  }

  if (quantidade === "" || Number(quantidade) < 0) {
    mostrarFeedback("Informe uma quantidade válida.", "erro");
    inputQuantidade.focus();
    return;
  }

  const novoMaterial = {
    nome: nome,
    quantidade: Number(quantidade),
  };

  alternarBotaoCadastrar(true);

  try {
    await cadastrarMaterial(novoMaterial);
    mostrarFeedback(`"${nome}" cadastrado com sucesso.`, "sucesso");
    form.reset();
    inputNome.focus();
    await carregarMateriais();
  } catch (erro) {
    console.error("Erro ao cadastrar material:", erro);
    mostrarFeedback(
      "Não foi possível cadastrar o material. Tente novamente.",
      "erro"
    );
  } finally {
    alternarBotaoCadastrar(false);
  }
});

btnAtualizar.addEventListener("click", () => {
  carregarMateriais();
});

// INICIALIZAÇÃO
    document.addEventListener("DOMContentLoaded", () => {
  aplicarTema("light");
  carregarMateriais();
});
