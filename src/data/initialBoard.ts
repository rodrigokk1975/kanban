import type { BoardState } from '../types/kanban';

export const BOARD_STORAGE_KEY = 'kanban_board_v1';
export const BOARD_SCHEMA_VERSION = 1;

const BASE_TIMESTAMP = '2026-11-20T12:00:00.000Z';

export function createInitialBoard(): BoardState {
  return {
    columnOrder: ['col-todo', 'col-progress', 'col-done'],
    columns: {
      'col-todo': {
        id: 'col-todo',
        title: 'A Fazer',
        cardIds: ['card-1', 'card-2', 'card-3'],
      },
      'col-progress': {
        id: 'col-progress',
        title: 'Em Progresso',
        cardIds: ['card-4', 'card-5'],
      },
      'col-done': {
        id: 'col-done',
        title: 'Concluído',
        cardIds: ['card-6'],
      },
    },
    cards: {
      'card-1': {
        id: 'card-1',
        title: 'Definir arquitetura de tokens de design',
        description:
          'Padronizar cores neutras, espaçamentos e estados de foco para manter consistência visual em todo o app.',
        priority: 'high',
        tags: ['UI', 'Design'],
        createdAt: BASE_TIMESTAMP,
        updatedAt: BASE_TIMESTAMP,
      },
      'card-2': {
        id: 'card-2',
        title: 'Adicionar atalhos de teclado no modal',
        description:
          'Garantir fechamento com Escape, foco inicial no título e submissão rápida ao salvar tarefas.',
        priority: 'medium',
        tags: ['A11y', 'UX'],
        createdAt: BASE_TIMESTAMP,
        updatedAt: BASE_TIMESTAMP,
      },
      'card-3': {
        id: 'card-3',
        title: 'Revisar textos dos estados vazios',
        description:
          'Escrever mensagens claras quando uma coluna estiver vazia ou quando a busca não retornar cards.',
        priority: 'low',
        tags: ['Copy'],
        createdAt: BASE_TIMESTAMP,
        updatedAt: BASE_TIMESTAMP,
      },
      'card-4': {
        id: 'card-4',
        title: 'Implementar arrastar e soltar entre colunas',
        description:
          'Integrar @dnd-kit para reordenar cards na mesma coluna, mover entre colunas vazias e reordenar colunas.',
        priority: 'high',
        tags: ['React', 'DnD'],
        createdAt: BASE_TIMESTAMP,
        updatedAt: BASE_TIMESTAMP,
      },
      'card-5': {
        id: 'card-5',
        title: 'Persistir estado no localStorage',
        description:
          'Criar custom hook tipado com versionamento de schema e recuperação segura em caso de JSON inválido.',
        priority: 'medium',
        tags: ['Hooks', 'Storage'],
        createdAt: BASE_TIMESTAMP,
        updatedAt: BASE_TIMESTAMP,
      },
      'card-6': {
        id: 'card-6',
        title: 'Estruturar projeto com Vite + TypeScript',
        description:
          'Configurar TypeScript em modo strict, Tailwind CSS, ESLint e Vitest para validação contínua.',
        priority: 'low',
        tags: ['Setup'],
        createdAt: BASE_TIMESTAMP,
        updatedAt: BASE_TIMESTAMP,
      },
    },
  };
}
