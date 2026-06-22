# ⚕️ Almoxarifado de Saúde — SENAC Zona Norte

> Sistema web de controle de materiais para o curso Técnico de Enfermagem.

---
## Link do Projeto 
https://universidade-cesumar.github.io/prova-2bi-ads-3sem-efragadev/


## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte do desafio prático proposto em aula, com o objetivo de modernizar a rotina da Camila — enfermeira responsável pelo almoxarifado de itens de saúde do SENAC Zona Norte.

Atualmente, o controle de materiais como seringas, luvas e outros insumos é feito em uma planilha que não suporta o volume de movimentações. Esta aplicação substitui essa planilha por uma interface web completa, integrada a uma API REST real.

---

## 🎯 Objetivo

Substituir o controle manual em planilha por uma aplicação web que permita:

- Cadastrar materiais do almoxarifado
- Listar o inventário em tempo real
- Registrar baixas diárias de materiais retirados pelos professores
- Excluir materiais do inventário
- Validar regras de negócio (impedir retiradas inválidas)
- Visualizar o histórico de movimentações

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Função |
|---|---|
| HTML5 | Estrutura da interface |
| CSS3 | Estilização e temas (light/dark) |
| JavaScript (ES6+) | Lógica e requisições assíncronas |
| Fetch API / async-await | Comunicação com a API REST |
| MockAPI.io | Banco de dados simulado (API REST) |

---

## 🌐 MockAPI.io — Banco de Dados Simulado

O **MockAPI.io** é uma ferramenta que simula um banco de dados e fornece uma API REST para testes e desenvolvimento. Com ela é possível criar, listar, buscar, editar e excluir registros sem precisar configurar um banco de dados real.

A plataforma gera endpoints automaticamente e armazena os dados em seus servidores. A aplicação consome esses dados via requisições HTTP (`GET`, `POST`, `PUT` e `DELETE`) usando `fetch`.

### Por que o MockAPI.io?

Com a API REST do MockAPI.io, os dados passam a ser acessados e manipulados em tempo real pela aplicação web, eliminando a necessidade de atualização manual da planilha. Os dados são retornados em formato **JSON**, tornando a aplicação funcional de ponta a ponta.

### Recursos criados no MockAPI.io

**`/materiais`**
Responsável por armazenar o cadastro dos itens do almoxarifado:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador único (gerado automaticamente) |
| `nome` | String | Nome do produto |
| `quantidade` | Number | Quantidade em estoque |
| `unidade` | String | Unidade de medida (ex: Unidade, Caixa, Pacote, Frasco) |

**`/movimentacoes`** *(não implementado neste projeto)*
Recurso planejado para registrar o histórico detalhado de baixas, incluindo responsável, setor e motivo da retirada.

---

## 🔄 Sprint 2 — Regras de Negócio e Saídas

A Sprint 2 adicionou o módulo de **retirada (baixa de estoque)** e **exclusão de materiais**, com validação para garantir que o sistema não aceite operações inconsistentes.

### Funcionalidades adicionadas

- **Retirada de materiais (PUT):** cada item da lista possui um campo de quantidade a retirar e um botão "Baixar". Ao confirmar, o sistema valida a operação e, se aprovada, atualiza a quantidade em estoque diretamente no MockAPI.
- **Exclusão de materiais (DELETE):** cada item possui um botão "Excluir", que abre um modal de confirmação antes de remover o registro definitivamente do MockAPI e da tela.
- **Validação de regras de negócio:** nenhuma retirada é enviada à API sem passar primeiro pela validação local.

### Função `validarRetirada(estoqueAtual, quantidadeRetirada)`

Função pura responsável por aplicar a regra de negócio da retirada, retornando `true` quando a operação é permitida e `false` quando não é. A retirada é considerada **inválida** quando:

- a quantidade informada é negativa ou igual a zero;
- a quantidade informada é maior do que o estoque disponível;
- o valor informado não é um número válido.

Essa função foi testada isoladamente com múltiplos cenários (retirada normal, retirada maior que o estoque, valores negativos, zero, estoque zerado e valores não numéricos), garantindo que a regra de negócio funcione de forma independente da interface.

### Fluxo de uma baixa de estoque

1. O usuário informa a quantidade no campo `input-retirada` da linha do material.
2. Ao clicar em `.btn-baixar`, a função `validarRetirada()` é executada antes de qualquer chamada à API.
3. Se a validação falhar, a operação é bloqueada e uma mensagem de erro é exibida (ex: *"Não é possível retirar 100. Estoque disponível: 3."*).
4. Se a validação passar, o sistema calcula o novo saldo (`estoqueAtual - quantidadeRetirada`) e envia um `PUT` ao MockAPI atualizando o registro.
5. A lista é recarregada para refletir o novo saldo em tempo real.

### Fluxo de uma exclusão

1. O usuário clica em `.btn-excluir` na linha do material desejado.
2. Um modal de confirmação é exibido, mostrando o nome do item a ser excluído.
3. Ao confirmar, o sistema envia um `DELETE` ao MockAPI removendo o registro.
4. A lista e os indicadores (KPIs) são atualizados automaticamente.

### Melhorias adicionadas na versão final

Além das funcionalidades do contrato técnico, a versão final da Sprint 2 incluiu:

- **Campo de unidade de medida** no formulário de cadastro (`select` com opções como Unidade, Caixa, Pacote, Frasco etc.), exibido como coluna adicional na tabela de inventário.
- **Função `validarCadastro(nome, quantidade, unidade)`** que verifica se todos os campos obrigatórios estão preenchidos antes de enviar o POST à API.
- **Destaques visuais de alerta** nas linhas de estoque baixo e crítico: fundo e borda vermelhos, tornando imediata a identificação dos itens que precisam de reposição.

---

## 🔍 Sprint 3 — Busca e Publicação

A Sprint 3 finalizou o projeto com a implementação de **busca em tempo real** no inventário e a **publicação do sistema na web** via GitHub Pages.

### Funcionalidades adicionadas

- **Busca de materiais:** campo `#input-busca` acima da tabela permite filtrar os itens pelo nome em tempo real, sem recarregar dados da API. A filtragem é feita localmente sobre o array `materiaisCarregados`, mantendo o desempenho mesmo com grandes volumes de dados.
- **Publicação online:** o sistema foi hospedado via GitHub Pages, tornando-o acessível pelo navegador sem necessidade de servidor local.

### Como funciona a busca

O array `materiaisCarregados` é preenchido uma vez ao carregar a página (GET na API). A cada keystroke no campo de busca, a função `filtrarMateriaisPorBusca()` filtra esse array localmente — sem fazer novas chamadas à API — e repassa o resultado para `renderizarMateriais()`, atualizando a tabela instantaneamente.

```javascript
function filtrarMateriaisPorBusca(materiais) {
  const termo = inputBusca.value.trim().toLowerCase();
  if (!termo) return materiais;
  return materiais.filter((material) =>
    String(material.nome ?? "").toLowerCase().includes(termo)
  );
}
```

Isso garante que a busca seja rápida e não sobrecarregue a API com requisições desnecessárias.

### Publicação via GitHub Pages

O projeto foi publicado diretamente pelo repositório do GitHub, sem necessidade de servidor back-end ou build. Como é uma aplicação estática (HTML + CSS + JS), o GitHub Pages serve os arquivos diretamente ao navegador.

**Passos para publicar:**
1. Acesse o repositório no GitHub
2. Vá em **Settings → Pages**
3. Em *Source*, selecione o branch `master` (ou `main`) e a pasta raiz `/`
4. Clique em **Save** — o GitHub gera automaticamente uma URL pública

---

## 📁 Estrutura do Projeto

```
almoxarifado-saude/
├── index.html      # Página principal
├── main.js         # Lógica da aplicação e integração com a API
├── style.css       # Estilos + suporte a light/dark mode
├── img/
│   └── diamante.png  # Favicon do sistema
└── README.md       # Documentação do projeto
```

---

## 🚀 Sprints

| Sprint | Tema | Status |
|---|---|---|
| Sprint 1 | Fundação, API e Inventário | ✅ Concluída |
| Sprint 2 | Regras de Negócio e Saídas | ✅ Concluída |
| Sprint 3 | Busca e Publicação | ✅ Concluída |

---