export type Priority = 'low' | 'medium' | 'high';

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CardInput {
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardState {
  columnOrder: string[];
  columns: Record<string, Column>;
  cards: Record<string, Card>;
}

export interface PersistedBoard {
  version: number;
  data: BoardState;
}

export interface BoardFilter {
  search: string;
  priority: Priority | 'all';
}

export type KanbanAction =
  | { type: 'ADD_COLUMN'; payload: { id: string; title: string } }
  | { type: 'UPDATE_COLUMN'; payload: { columnId: string; title: string } }
  | { type: 'DELETE_COLUMN'; payload: { columnId: string } }
  | { type: 'MOVE_COLUMN'; payload: { fromIndex: number; toIndex: number } }
  | {
      type: 'ADD_CARD';
      payload: {
        columnId: string;
        card: Card;
      };
    }
  | {
      type: 'UPDATE_CARD';
      payload: {
        cardId: string;
        updates: Partial<CardInput>;
        targetColumnId?: string;
        updatedAt: string;
      };
    }
  | { type: 'DELETE_CARD'; payload: { cardId: string; columnId: string } }
  | {
      type: 'MOVE_CARD';
      payload: {
        cardId: string;
        sourceColumnId: string;
        destinationColumnId: string;
        destinationIndex: number;
      };
    }
  | { type: 'RESET_BOARD'; payload: BoardState };
