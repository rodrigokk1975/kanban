import type { BoardState, Card, Column } from '../types/kanban';
import { AddColumnForm } from './AddColumnForm';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  board: BoardState;
  isFiltered: boolean;
  matchesFilter: (card: Card) => boolean;
  onAddColumn: (title: string) => void;
  onRenameColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (column: Column) => void;
  onQuickAddCard: (columnId: string, title: string) => void;
  onOpenCreateModal: (columnId: string) => void;
  onEditCard: (card: Card, columnId: string) => void;
  onDeleteCard: (card: Card, columnId: string) => void;
}

export function KanbanBoard({
  board,
  isFiltered,
  matchesFilter,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
  onQuickAddCard,
  onOpenCreateModal,
  onEditCard,
  onDeleteCard,
}: KanbanBoardProps) {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-1 items-start gap-5 overflow-x-auto px-4 py-6 sm:px-6">
      {board.columnOrder.map((columnId, index) => {
        const column = board.columns[columnId];
        if (!column) return null;

        const cards = column.cardIds
          .map((cardId) => board.cards[cardId])
          .filter((card): card is Card => Boolean(card) && matchesFilter(card));

        return (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={cards}
            accentIndex={index}
            isFiltered={isFiltered}
            onRenameColumn={onRenameColumn}
            onDeleteColumn={onDeleteColumn}
            onQuickAddCard={onQuickAddCard}
            onOpenCreateModal={onOpenCreateModal}
            onEditCard={onEditCard}
            onDeleteCard={onDeleteCard}
          />
        );
      })}

      <AddColumnForm onAddColumn={onAddColumn} />
    </main>
  );
}
