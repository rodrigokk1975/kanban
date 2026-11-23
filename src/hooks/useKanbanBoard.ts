import { useCallback, useMemo, useState } from 'react';
import {
  BOARD_SCHEMA_VERSION,
  BOARD_STORAGE_KEY,
  createInitialBoard,
} from '../data/initialBoard';
import { kanbanReducer } from '../state/kanbanReducer';
import type { BoardFilter, BoardState, Card, CardInput, KanbanAction, Priority } from '../types/kanban';
import { useLocalStorage } from './useLocalStorage';

function isValidBoardState(value: unknown): value is BoardState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.columnOrder) &&
    typeof candidate.columns === 'object' &&
    candidate.columns !== null &&
    typeof candidate.cards === 'object' &&
    candidate.cards !== null
  );
}

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function useKanbanBoard() {
  const [board, setBoard] = useLocalStorage<BoardState>(BOARD_STORAGE_KEY, createInitialBoard, {
    version: BOARD_SCHEMA_VERSION,
    isValid: isValidBoardState,
  });

  const [filter, setFilter] = useState<BoardFilter>({
    search: '',
    priority: 'all',
  });

  const dispatch = useCallback(
    (action: KanbanAction) => {
      setBoard((prev) => kanbanReducer(prev, action));
    },
    [setBoard],
  );

  const addColumn = useCallback(
    (title: string) => {
      dispatch({
        type: 'ADD_COLUMN',
        payload: { id: generateId('col'), title },
      });
    },
    [dispatch],
  );

  const updateColumn = useCallback(
    (columnId: string, title: string) => {
      dispatch({
        type: 'UPDATE_COLUMN',
        payload: { columnId, title },
      });
    },
    [dispatch],
  );

  const deleteColumn = useCallback(
    (columnId: string) => {
      dispatch({
        type: 'DELETE_COLUMN',
        payload: { columnId },
      });
    },
    [dispatch],
  );

  const moveColumn = useCallback(
    (fromIndex: number, toIndex: number) => {
      dispatch({
        type: 'MOVE_COLUMN',
        payload: { fromIndex, toIndex },
      });
    },
    [dispatch],
  );

  const addCard = useCallback(
    (columnId: string, input: CardInput) => {
      const now = new Date().toISOString();
      const card: Card = {
        id: generateId('card'),
        title: input.title,
        description: input.description,
        priority: input.priority,
        tags: input.tags,
        createdAt: now,
        updatedAt: now,
      };
      dispatch({
        type: 'ADD_CARD',
        payload: { columnId, card },
      });
    },
    [dispatch],
  );

  const updateCard = useCallback(
    (cardId: string, updates: Partial<CardInput>, targetColumnId?: string) => {
      dispatch({
        type: 'UPDATE_CARD',
        payload: {
          cardId,
          updates,
          targetColumnId,
          updatedAt: new Date().toISOString(),
        },
      });
    },
    [dispatch],
  );

  const deleteCard = useCallback(
    (cardId: string, columnId: string) => {
      dispatch({
        type: 'DELETE_CARD',
        payload: { cardId, columnId },
      });
    },
    [dispatch],
  );

  const moveCard = useCallback(
    (
      cardId: string,
      sourceColumnId: string,
      destinationColumnId: string,
      destinationIndex: number,
    ) => {
      dispatch({
        type: 'MOVE_CARD',
        payload: {
          cardId,
          sourceColumnId,
          destinationColumnId,
          destinationIndex,
        },
      });
    },
    [dispatch],
  );

  const resetBoard = useCallback(() => {
    dispatch({
      type: 'RESET_BOARD',
      payload: createInitialBoard(),
    });
    setFilter({ search: '', priority: 'all' });
  }, [dispatch]);

  const setSearch = useCallback((search: string) => {
    setFilter((prev) => ({ ...prev, search }));
  }, []);

  const setPriorityFilter = useCallback((priority: Priority | 'all') => {
    setFilter((prev) => ({ ...prev, priority }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilter({ search: '', priority: 'all' });
  }, []);

  const isFiltered = filter.search.trim().length > 0 || filter.priority !== 'all';

  const matchesFilter = useCallback(
    (card: Card): boolean => {
      if (filter.priority !== 'all' && card.priority !== filter.priority) {
        return false;
      }

      const query = filter.search.trim().toLowerCase();
      if (!query) return true;

      return (
        card.title.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query) ||
        card.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    },
    [filter],
  );

  const stats = useMemo(() => {
    const allCards = Object.values(board.cards);
    const visibleCards = allCards.filter(matchesFilter);
    return {
      totalCards: allCards.length,
      visibleCards: visibleCards.length,
      totalColumns: board.columnOrder.length,
    };
  }, [board.cards, board.columnOrder.length, matchesFilter]);

  return {
    board,
    filter,
    isFiltered,
    stats,
    matchesFilter,
    setSearch,
    setPriorityFilter,
    clearFilters,
    addColumn,
    updateColumn,
    deleteColumn,
    moveColumn,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    resetBoard,
  };
}
