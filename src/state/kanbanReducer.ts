import type { BoardState, KanbanAction } from '../types/kanban';

export function findColumnIdByCardId(state: BoardState, cardId: string): string | undefined {
  return state.columnOrder.find((colId) => state.columns[colId]?.cardIds.includes(cardId));
}

function arrayMove<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  if (moved === undefined) return next;
  next.splice(toIndex, 0, moved);
  return next;
}

export function kanbanReducer(state: BoardState, action: KanbanAction): BoardState {
  switch (action.type) {
    case 'ADD_COLUMN': {
      const title = action.payload.title.trim();
      if (!title || state.columns[action.payload.id]) return state;

      return {
        ...state,
        columnOrder: [...state.columnOrder, action.payload.id],
        columns: {
          ...state.columns,
          [action.payload.id]: {
            id: action.payload.id,
            title,
            cardIds: [],
          },
        },
      };
    }

    case 'UPDATE_COLUMN': {
      const title = action.payload.title.trim();
      const existing = state.columns[action.payload.columnId];
      if (!title || !existing || existing.title === title) return state;

      return {
        ...state,
        columns: {
          ...state.columns,
          [action.payload.columnId]: {
            ...existing,
            title,
          },
        },
      };
    }

    case 'DELETE_COLUMN': {
      const target = state.columns[action.payload.columnId];
      if (!target) return state;

      const remainingColumns = { ...state.columns };
      delete remainingColumns[action.payload.columnId];

      const remainingCards = { ...state.cards };
      for (const cardId of target.cardIds) {
        delete remainingCards[cardId];
      }

      return {
        columnOrder: state.columnOrder.filter((id) => id !== action.payload.columnId),
        columns: remainingColumns,
        cards: remainingCards,
      };
    }

    case 'MOVE_COLUMN': {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.columnOrder.length ||
        toIndex >= state.columnOrder.length
      ) {
        return state;
      }

      return {
        ...state,
        columnOrder: arrayMove(state.columnOrder, fromIndex, toIndex),
      };
    }

    case 'ADD_CARD': {
      const { columnId, card } = action.payload;
      const column = state.columns[columnId];
      const title = card.title.trim();
      if (!column || !title) return state;

      const normalizedCard = { ...card, title };

      return {
        ...state,
        cards: {
          ...state.cards,
          [normalizedCard.id]: normalizedCard,
        },
        columns: {
          ...state.columns,
          [columnId]: {
            ...column,
            cardIds: [...column.cardIds, normalizedCard.id],
          },
        },
      };
    }

    case 'UPDATE_CARD': {
      const { cardId, updates, targetColumnId, updatedAt } = action.payload;
      const existing = state.cards[cardId];
      if (!existing) return state;

      const nextTitle = updates.title !== undefined ? updates.title.trim() : existing.title;
      if (!nextTitle) return state;

      const updatedCard = {
        ...existing,
        ...updates,
        title: nextTitle,
        updatedAt,
      };

      const nextState: BoardState = {
        ...state,
        cards: {
          ...state.cards,
          [cardId]: updatedCard,
        },
      };

      if (targetColumnId && state.columns[targetColumnId]) {
        const currentColumnId = findColumnIdByCardId(state, cardId);
        if (currentColumnId && currentColumnId !== targetColumnId) {
          const sourceCol = state.columns[currentColumnId];
          const destCol = state.columns[targetColumnId];
          return {
            ...nextState,
            columns: {
              ...nextState.columns,
              [currentColumnId]: {
                ...sourceCol,
                cardIds: sourceCol.cardIds.filter((id) => id !== cardId),
              },
              [targetColumnId]: {
                ...destCol,
                cardIds: [...destCol.cardIds, cardId],
              },
            },
          };
        }
      }

      return nextState;
    }

    case 'DELETE_CARD': {
      const { cardId, columnId } = action.payload;
      const column = state.columns[columnId];
      if (!column || !state.cards[cardId]) return state;

      const remainingCards = { ...state.cards };
      delete remainingCards[cardId];

      return {
        ...state,
        cards: remainingCards,
        columns: {
          ...state.columns,
          [columnId]: {
            ...column,
            cardIds: column.cardIds.filter((id) => id !== cardId),
          },
        },
      };
    }

    case 'MOVE_CARD': {
      const { cardId, sourceColumnId, destinationColumnId, destinationIndex } = action.payload;
      const sourceCol = state.columns[sourceColumnId];
      const destCol = state.columns[destinationColumnId];
      if (!sourceCol || !destCol || !state.cards[cardId]) return state;

      const sourceIndex = sourceCol.cardIds.indexOf(cardId);
      if (sourceIndex === -1) return state;

      if (sourceColumnId === destinationColumnId) {
        const clampedIndex = Math.max(0, Math.min(destinationIndex, sourceCol.cardIds.length - 1));
        if (sourceIndex === clampedIndex) return state;

        return {
          ...state,
          columns: {
            ...state.columns,
            [sourceColumnId]: {
              ...sourceCol,
              cardIds: arrayMove(sourceCol.cardIds, sourceIndex, clampedIndex),
            },
          },
        };
      }

      const nextSourceIds = sourceCol.cardIds.filter((id) => id !== cardId);
      const nextDestIds = destCol.cardIds.filter((id) => id !== cardId);
      const clampedIndex = Math.max(0, Math.min(destinationIndex, nextDestIds.length));
      nextDestIds.splice(clampedIndex, 0, cardId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [sourceColumnId]: {
            ...sourceCol,
            cardIds: nextSourceIds,
          },
          [destinationColumnId]: {
            ...destCol,
            cardIds: nextDestIds,
          },
        },
      };
    }

    case 'RESET_BOARD':
      return action.payload;

    default:
      return state;
  }
}
