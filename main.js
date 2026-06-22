const API_URL = "https://6a309701a7f8866418d628c5.mockapi.io/senac-almox/materiais";

// Limites para o status visual (barra lateral colorida)
const LIMITE_CRITICO = 5;
const LIMITE_BAIXO = 15;

// ELEMENTOS DO DOM
const form = document.getElementById("form-cadastro");
const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const inputUnidade = document.getElementById("input-unidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");
const feedbackMsg = document.getElementById("feedback-msg");
const btnAtualizar = document.getElementById("btn-atualizar");
const estadoVazio = document.getElementById("estado-vazio");
const estadoCarregando = document.getElementById("estado-carregando");
const totalItensEl = document.getElementById("total-itens");
const totalAlertaEl = document.getElementById("total-alerta");
const inputBusca = document.getElementById("input-busca");
const btnTema = document.getElementById("btn-tema");
const temaLabel = btnTema ? btnTema.querySelector(".theme-toggle-label") : null;
const modalConfirmacao = document.getElementById("modal-confirmacao");
const modalNomeItem = document.getElementById("modal-nome-item");
const modalCancelar = document.getElementById("modal-cancelar");
const modalConfirmar = document.getElementById("modal-confirmar");

// Guarda o id do material pendente de exclusão enquanto o modal está aberto
let idPendenteExclusao = null;
let materiaisCarregados = [];

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

function filtrarMateriaisPorBusca(materiais) {
  const termo = inputBusca ? inputBusca.value.trim().toLowerCase() : "";

  if (!termo) {
    return materiais;
  }

  return materiais.filter((material) =>
    String(material.nome ?? "").toLowerCase().includes(termo)
  );
}

// REGRA DE NEGÓCIO: VALIDAÇÃO DE RETIRADA
function validarRetirada(estoqueAtual, quantidadeRetirada) {
  const estoque = Number(estoqueAtual);
  const retirada = Number(quantidadeRetirada);

  if (!Number.isFinite(estoque) || !Number.isFinite(retirada)) {
    return false;
  }

  if (retirada <= 0) {
    return false;
  }

  if (retirada > estoque) {
    return false;
  }

  return true;
}

function validarCadastro(nome, quantidade, unidade) {
  const quantidadeNumero = Number(quantidade);

  return (
    nome.trim() !== "" &&
    quantidade !== "" &&
    Number.isFinite(quantidadeNumero) &&
    quantidadeNumero >= 0 &&
    unidade.trim() !== ""
  );
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

  materiais.forEach((material, indice) => {
    const quantidade = Number(material.quantidade) || 0;
    const status = classificarStatus(quantidade);

    const linha = document.createElement("tr");
    linha.className = `linha-status status-${status}`;
    linha.dataset.id = material.id;

    const celulaNome = document.createElement("td");
    celulaNome.className = "celula-nome";
    celulaNome.textContent = material.nome ?? "—";

    const celulaQuantidade = document.createElement("td");
    celulaQuantidade.className = "celula-quantidade";

    const badge = document.createElement("span");
    badge.className = `qtd-badge badge-${status}`;
    badge.textContent = quantidade;
    celulaQuantidade.appendChild(badge);

    const celulaUnidade = document.createElement("td");
    celulaUnidade.className = "celula-unidade";
    celulaUnidade.textContent = material.unidade ?? "--";

    const celulaStatus = document.createElement("td");
    celulaStatus.className = "celula-status-texto";
    const rotulos = {
      ok: "Em estoque",
      baixo: "Estoque baixo",
      critico: "Estoque crítico",
    };
    celulaStatus.textContent = rotulos[status];

    // Coluna de ações: input de retirada + botão baixar + botão excluir
    const celulaAcoes = document.createElement("td");
    celulaAcoes.className = "celula-acoes";

    const inputWrapper = document.createElement("div");
    inputWrapper.className = "input-retirada-wrapper";

    const inputRetirada = document.createElement("input");
    inputRetirada.type = "number";
    inputRetirada.id =
      indice === 0 ? "input-retirada" : `input-retirada-${material.id}`;
    inputRetirada.className = "input-retirada";
    inputRetirada.min = "1";
    inputRetirada.max = String(quantidade);
    inputRetirada.placeholder = "Qtd";
    inputRetirada.setAttribute("aria-label", `Quantidade a retirar de ${material.nome}`);

    inputWrapper.appendChild(inputRetirada);

    const btnBaixar = document.createElement("button");
    btnBaixar.type = "button";
    btnBaixar.className = "btn-baixar";
    btnBaixar.textContent = "Baixar";
    btnBaixar.dataset.id = material.id;

    btnBaixar.addEventListener("click", () => {
      tratarBaixaMaterial(material, inputRetirada);
    });

    const btnExcluir = document.createElement("button");
    btnExcluir.type = "button";
    btnExcluir.className = "btn-excluir";
    btnExcluir.textContent = "Excluir";
    btnExcluir.dataset.id = material.id;

    btnExcluir.addEventListener("click", () => {
      abrirModalExclusao(material);
    });

    celulaAcoes.appendChild(inputWrapper);
    celulaAcoes.appendChild(btnBaixar);
    celulaAcoes.appendChild(btnExcluir);

    linha.appendChild(celulaNome);
    linha.appendChild(celulaQuantidade);
    linha.appendChild(celulaUnidade);
    linha.appendChild(celulaStatus);
    linha.appendChild(celulaAcoes);

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
    materiaisCarregados = materiais;
    renderizarMateriais(filtrarMateriaisPorBusca(materiaisCarregados));
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

// PUT - Atualiza a quantidade em estoque (usado na baixa de materiais)
async function atualizarQuantidadeMaterial(id, novaQuantidade) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantidade: novaQuantidade }),
  });

  if (!resposta.ok) {
    throw new Error(`Erro HTTP: ${resposta.status}`);
  }

  return await resposta.json();
}

// DELETE - Remove um material do inventário
async function excluirMaterial(id) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!resposta.ok) {
    throw new Error(`Erro HTTP: ${resposta.status}`);
  }

  return await resposta.json();
}

// BAIXA DE ESTOQUE (PUT)
async function tratarBaixaMaterial(material, inputRetirada) {
  const estoqueAtual = Number(material.quantidade) || 0;
  const quantidadeRetirada = Number(inputRetirada.value);

  if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
    if (!inputRetirada.value || Number(inputRetirada.value) <= 0) {
      mostrarFeedback("Informe uma quantidade válida para retirar.", "erro");
    } else {
      mostrarFeedback(
        `Não é possível retirar ${inputRetirada.value}. Estoque disponível: ${estoqueAtual}.`,
        "erro"
      );
    }
    inputRetirada.focus();
    return;
  }

  const linha = listaMateriais.querySelector(`tr[data-id="${material.id}"]`);
  const botoesDaLinha = linha ? linha.querySelectorAll("button") : [];
  botoesDaLinha.forEach((botao) => (botao.disabled = true));

  try {
    const novaQuantidade = estoqueAtual - quantidadeRetirada;
    await atualizarQuantidadeMaterial(material.id, novaQuantidade);
    mostrarFeedback(
      `Baixa de ${quantidadeRetirada} em "${material.nome}" registrada com sucesso.`,
      "sucesso"
    );
    await carregarMateriais();
  } catch (erro) {
    console.error("Erro ao registrar baixa:", erro);
    mostrarFeedback(
      "Não foi possível registrar a baixa. Tente novamente.",
      "erro"
    );
    botoesDaLinha.forEach((botao) => (botao.disabled = false));
  }
}

// EXCLUSÃO DE MATERIAL (DELETE) — com modal de confirmação
function abrirModalExclusao(material) {
  idPendenteExclusao = material.id;
  modalNomeItem.textContent = material.nome ?? "este item";
  modalConfirmacao.hidden = false;
  modalConfirmar.focus();
}

function fecharModalExclusao() {
  idPendenteExclusao = null;
  modalConfirmacao.hidden = true;
}

async function confirmarExclusao() {
  if (!idPendenteExclusao) {
    fecharModalExclusao();
    return;
  }

  const idParaExcluir = idPendenteExclusao;
  modalConfirmar.disabled = true;
  modalConfirmar.textContent = "Excluindo...";

  try {
    await excluirMaterial(idParaExcluir);
    mostrarFeedback("Material excluído do inventário.", "sucesso");
    fecharModalExclusao();
    await carregarMateriais();
  } catch (erro) {
    console.error("Erro ao excluir material:", erro);
    mostrarFeedback(
      "Não foi possível excluir o material. Tente novamente.",
      "erro"
    );
  } finally {
    modalConfirmar.disabled = false;
    modalConfirmar.textContent = "Excluir";
  }
}

modalCancelar.addEventListener("click", fecharModalExclusao);
modalConfirmar.addEventListener("click", confirmarExclusao);
modalConfirmacao.addEventListener("click", (evento) => {
  if (evento.target === modalConfirmacao) {
    fecharModalExclusao();
  }
});
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && !modalConfirmacao.hidden) {
    fecharModalExclusao();
  }
});

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
  const unidade = inputUnidade.value;

  if (!validarCadastro(nome, quantidade, unidade)) {
    mostrarFeedback(
      "Preencha nome, quantidade e unidade antes de cadastrar.",
      "erro"
    );

    if (!nome) {
      inputNome.focus();
    } else if (quantidade === "" || Number(quantidade) < 0) {
      inputQuantidade.focus();
    } else {
      inputUnidade.focus();
    }

    alert("Preencha nome, quantidade e unidade antes de cadastrar.");
    return;
  }

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
    unidade: unidade,
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

if (inputBusca) {
  inputBusca.addEventListener("input", () => {
    renderizarMateriais(filtrarMateriaisPorBusca(materiaisCarregados));
  });
}

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  aplicarTema("light");
  carregarMateriais();
});
