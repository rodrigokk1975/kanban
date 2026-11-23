# KanbanFlow — Quadro Kanban & Lista de Tarefas

Aplicação web de gerenciamento de tarefas no estilo **Kanban**, construída com **React**, **TypeScript**, **Tailwind CSS** e **`@dnd-kit`**, com persistência automática no navegador via `localStorage`.

> O planejamento técnico e os requisitos completos estão documentados em [`PRD.md`](./PRD.md).

## Funcionalidades

- **Colunas**: criar, renomear inline, reordenar por Drag and Drop e excluir (com confirmação quando há cards).
- **Cards**: criação rápida inline ou detalhada via modal (título, descrição, prioridade, tags e coluna), edição (botão ou duplo clique) e exclusão com confirmação.
- **Drag and Drop acessível**: reordenação de cards na mesma coluna, movimentação entre colunas (incluindo colunas vazias) e reordenação de colunas com `DragOverlay` e suporte a teclado (`@dnd-kit`).
- **Busca e filtros**: filtro instantâneo por texto (título, descrição e tags) e por prioridade (`Todas`, `Alta`, `Média`, `Baixa`).
- **Persistência no navegador**: custom hook `useLocalStorage` tipado com versionamento de schema (`kanban_board_v1`), fallback seguro contra JSON corrompido e sincronização entre abas.

## Stack

- **React 19** + **TypeScript** (`strict: true`)
- **Vite** + **Tailwind CSS v4**
- **`@dnd-kit/core`**, **`@dnd-kit/sortable`**, **`@dnd-kit/utilities`**
- **Lucide React** (ícones)
- **Vitest** (testes unitários do reducer) + **ESLint**

## Arquitetura

```text
src/
├── types/kanban.ts           # Modelos de domínio e ações discriminadas (KanbanAction)
├── data/initialBoard.ts      # Estado inicial normalizado e constantes de persistência
├── state/
│   ├── kanbanReducer.ts      # Reducer puro para todas as mutações do quadro
│   └── kanbanReducer.test.ts # Testes unitários de colunas, cards e movimentação
├── hooks/
│   ├── useLocalStorage.ts    # Hook genérico com versionamento de schema e sync entre abas
│   └── useKanbanBoard.ts     # Orquestração de estado, ações e filtros
└── components/               # Header, Board, Columns, Cards, Modals e wrappers Sortable
```

O estado utiliza **estrutura normalizada** (`columnOrder`, `columns`, `cards`), garantindo lookup em $O(1)$ durante interações de Drag and Drop e evitando duplicação de dados.

## Como executar

```bash
npm install
npm run dev
```

### Scripts disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Checa tipos (tsc) e gera build de produção
npm run test     # Executa testes unitários com Vitest
npm run lint     # Executa verificação ESLint
```
