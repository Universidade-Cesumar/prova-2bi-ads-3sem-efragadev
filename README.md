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

**`/movimentacoes`** *(Sprint 2)*
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
| Sprint 2 | Movimentações e Baixas | 🔄 Em breve |
| Sprint 3 | Relatórios e Finalização | 🔄 Em breve |

---

## 👩‍⚕️ Contexto

**Responsável pelo almoxarifado:** Camila (Enfermeira)  
**Instituição:** SENAC Zona Norte  
**Curso:** Técnico de Enfermagem  
**Disciplina:** Desenvolvimento Web  
