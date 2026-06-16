# ⚕️ Almoxarifado de Saúde — SENAC Zona Norte

> Sistema web de controle de materiais para o curso Técnico de Enfermagem.

---

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

**`/movimentacoes`** *(planejado para Sprint 3)*
Responsável por registrar as baixas diárias:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador único (gerado automaticamente) |
| `dataSaida` | String | Data da retirada |
| `quantidadeRetirada` | Number | Quantidade retirada |
| `responsavel` | String | Nome do professor/responsável |
| `setor` | String | Destino/setor |
| `motivo` | String | Motivo da retirada |

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

---

## 📁 Estrutura do Projeto

```
almoxarifado-saude/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos + suporte a light/dark mode
├── js/
│   └── script.js       # Lógica da aplicação e integração com API
└── README.md           # Documentação do projeto
```

---

## ⚙️ Como Executar

1. Clone ou baixe este repositório
2. Acesse [mockapi.io](https://mockapi.io) e crie um projeto com o recurso `materiais`
3. Copie a URL gerada pelo MockAPI (ex: `https://SEU_ID.mockapi.io/api/v1/materiais`)
4. Abra o arquivo `js/script.js` e substitua na linha 6:
   ```javascript
   const API_URL = "https://SEU_ID.mockapi.io/api/v1/materiais";
   ```
5. Abra o `index.html` com o **Live Server** do VS Code

---

## 🚀 Sprints

| Sprint | Tema | Status |
|---|---|---|
| Sprint 1 | Fundação, API e Inventário | ✅ Concluída |
| Sprint 2 | Regras de Negócio e Saídas | ✅ Concluída |
| Sprint 3 | Relatórios e Finalização | 🔄 Em breve |

---

## 👩‍⚕️ Contexto

**Responsável pelo almoxarifado:** Camila (Enfermeira)  
**Instituição:** SENAC Zona Norte  
**Curso:** Técnico de Enfermagem  
**Disciplina:** Desenvolvimento Web  
