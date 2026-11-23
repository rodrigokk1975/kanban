# PRD — Kanban / Lista de Tarefas (ID 3)

## 1. Visão Geral

Aplicação web de quadro **Kanban / Lista de Tarefas** construída com **React**, **TypeScript** e **Tailwind CSS**, permitindo criar, editar, mover (Drag and Drop + teclado) e excluir colunas e cards, com persistência automática no navegador via `localStorage`.

### Objetivos Técnicos (Portfólio)
- Arquitetura de **componentes** reutilizáveis, responsivos e acessíveis;
- **Custom hooks** tipados com TypeScript;
- **Gerenciamento de estado** previsível com `useReducer` e estado normalizado;
- **Tipagem estrita** (discriminated unions, generics e versionamento de schema);
- **Drag and Drop** acessível e fluido com `@dnd-kit`;
- Histórico Git organizado com **1 commit semântico por etapa**.

---

## 2. Decisões Técnicas

| Tema | Escolha | Motivo |
| :--- | :--- | :--- |
| Build & Framework | Vite + React + TypeScript (`strict: true`) | Rápido, moderno e com verificação de tipos rigorosa |
| Estilização | Tailwind CSS | Consistência visual, produtividade e responsividade |
| Drag and Drop | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | Acessível (teclado + pointer), leve e bem tipado |
| Persistência | `localStorage` com hook tipado e versão de schema (`v1`) | Síncrono, simples e resiliente a dados corrompidos |
| Ícones | `lucide-react` | Consistência visual e tree-shaking |
| Testes | Vitest | Testes rápidos para regras de estado e persistência |

---

## 3. Requisitos Funcionais

### Colunas
- **RF01**: Listar colunas em layout horizontal com scroll suave e contagem de cards.
- **RF02**: Criar nova coluna com título obrigatório.
- **RF03**: Renomear coluna inline.
- **RF04**: Excluir coluna (com confirmação quando possuir cards).
- **RF05**: Reordenar colunas via Drag and Drop.

### Cards
- **RF06**: Criar card rapidamente inline na coluna ou via modal detalhado.
- **RF07**: Editar card via modal (título, descrição, prioridade, tags e coluna).
- **RF08**: Excluir card com confirmação.
- **RF09**: Mover cards dentro da mesma coluna e entre colunas (incluindo colunas vazias) via Drag and Drop.
- **RF10**: Suporte a movimentação acessível por teclado.

### Produtividade e Persistência
- **RF11**: Busca em tempo real (título, descrição e tags) e filtro por prioridade.
- **RF12**: Persistência automática no `localStorage` (`kanban_board_v1`) com restauração ao recarregar.
- **RF13**: Quadro inicial de demonstração na primeira visita e ação de restaurar padrão.

---

## 4. Requisitos Não Funcionais

- **RNF01**: `strict: true` no TypeScript, sem uso de `any`.
- **RNF02**: Interface responsiva para desktop e mobile com visual limpo de nível portfólio.
- **RNF03**: Acessibilidade básica (roles de diálogo, `Escape` para fechar modais, `KeyboardSensor` no DnD).
- **RNF04**: Tratamento de falhas de leitura/gravação no `localStorage` sem quebrar a aplicação.

---

## 5. Modelo de Dados (Normalizado)

```ts
type Priority = 'low' | 'medium' | 'high';

interface Card {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

interface BoardState {
  columnOrder: string[];
  columns: Record<string, Column>;
  cards: Record<string, Card>;
}
```

---

## 6. Etapas de Desenvolvimento (1 Etapa = 1 Commit)

1. **`docs: add project PRD and staged roadmap`** — Documentação do PRD e `.gitignore`.
2. **`chore: initialize Vite React TypeScript and Tailwind CSS setup`** — Bootstrap do projeto, dependências e scripts.
3. **`feat(types): define kanban domain models and seed data`** — Tipos de domínio, ações e dados iniciais.
4. **`feat(state): implement kanban reducer and typed localStorage persistence`** — Reducer, hooks de persistência/estado e testes unitários.
5. **`feat(ui): build board header, columns and card components`** — Layout principal, busca/filtro, colunas e cards.
6. **`feat(cards): add card creation, editing modal and deletion flow`** — CRUD completo de cards com modal e confirmação.
7. **`feat(dnd): integrate drag and drop for cards and columns with dnd-kit`** — Drag and drop de cards e colunas com overlay e teclado.
8. **`docs(polish): refine responsive UX, empty states and add README`** — Polimento final de UX, responsividade e documentação `README.md`.
