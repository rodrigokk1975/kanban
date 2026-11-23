import { describe, expect, it } from 'vitest';
import { createInitialBoard } from '../data/initialBoard';
import { kanbanReducer } from './kanbanReducer';
import type { Card } from '../types/kanban';

describe('kanbanReducer', () => {
  it('adds, renames, reorders, and deletes columns while cleaning up orphan cards', () => {
    let state = createInitialBoard();

    state = kanbanReducer(state, {
      type: 'ADD_COLUMN',
      payload: { id: 'col-qa', title: 'Revisão' },
    });
    expect(state.columnOrder).toContain('col-qa');
    expect(state.columns['col-qa']?.title).toBe('Revisão');

    state = kanbanReducer(state, {
      type: 'UPDATE_COLUMN',
      payload: { columnId: 'col-qa', title: 'QA & Revisão' },
    });
    expect(state.columns['col-qa']?.title).toBe('QA & Revisão');

    state = kanbanReducer(state, {
      type: 'MOVE_COLUMN',
      payload: { fromIndex: 3, toIndex: 1 },
    });
    expect(state.columnOrder[1]).toBe('col-qa');

    // Deleting a column with cards removes its cards from state.cards
    state = kanbanReducer(state, {
      type: 'DELETE_COLUMN',
      payload: { columnId: 'col-done' },
    });
    expect(state.columns['col-done']).toBeUndefined();
    expect(state.cards['card-6']).toBeUndefined();
  });

  it('adds, updates, moves across columns, and deletes cards', () => {
    let state = createInitialBoard();

    const newCard: Card = {
      id: 'card-new',
      title: 'Escrever testes do reducer',
      description: 'Validar todas as transições de estado',
      priority: 'high',
      tags: ['Test'],
      createdAt: '2026-11-23T12:00:00.000Z',
      updatedAt: '2026-11-23T12:00:00.000Z',
    };

    state = kanbanReducer(state, {
      type: 'ADD_CARD',
      payload: { columnId: 'col-todo', card: newCard },
    });
    expect(state.cards['card-new']?.title).toBe('Escrever testes do reducer');
    expect(state.columns['col-todo']?.cardIds).toContain('card-new');

    // Update card and move to another column via modal
    state = kanbanReducer(state, {
      type: 'UPDATE_CARD',
      payload: {
        cardId: 'card-new',
        updates: { title: 'Testes do reducer concluídos', priority: 'low' },
        targetColumnId: 'col-done',
        updatedAt: '2026-11-23T13:00:00.000Z',
      },
    });
    expect(state.cards['card-new']?.priority).toBe('low');
    expect(state.columns['col-todo']?.cardIds).not.toContain('card-new');
    expect(state.columns['col-done']?.cardIds).toContain('card-new');

    state = kanbanReducer(state, {
      type: 'DELETE_CARD',
      payload: { cardId: 'card-new', columnId: 'col-done' },
    });
    expect(state.cards['card-new']).toBeUndefined();
    expect(state.columns['col-done']?.cardIds).not.toContain('card-new');
  });

  it('reorders cards within the same column and moves cards to an empty column', () => {
    let state = createInitialBoard();

    // Reorder within col-todo: move card-1 (index 0) to index 2
    state = kanbanReducer(state, {
      type: 'MOVE_CARD',
      payload: {
        cardId: 'card-1',
        sourceColumnId: 'col-todo',
        destinationColumnId: 'col-todo',
        destinationIndex: 2,
      },
    });
    expect(state.columns['col-todo']?.cardIds).toEqual(['card-2', 'card-3', 'card-1']);

    // Add empty column and move card-1 into it
    state = kanbanReducer(state, {
      type: 'ADD_COLUMN',
      payload: { id: 'col-empty', title: 'Backlog' },
    });
    state = kanbanReducer(state, {
      type: 'MOVE_CARD',
      payload: {
        cardId: 'card-1',
        sourceColumnId: 'col-todo',
        destinationColumnId: 'col-empty',
        destinationIndex: 0,
      },
    });
    expect(state.columns['col-todo']?.cardIds).toEqual(['card-2', 'card-3']);
    expect(state.columns['col-empty']?.cardIds).toEqual(['card-1']);
  });
});
