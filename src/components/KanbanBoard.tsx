import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { findColumnIdByCardId } from '../state/kanbanReducer';
import type { BoardState, Card, Column } from '../types/kanban';
import { AddColumnForm } from './AddColumnForm';
import { KanbanCard } from './KanbanCard';
import { KanbanColumn } from './KanbanColumn';
import { SortableColumn } from './SortableColumn';

interface KanbanBoardProps {
  board: BoardState;
  isFiltered: boolean;
  matchesFilter: (card: Card) => boolean;
  onAddColumn: (title: string) => void;
  onRenameColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (column: Column) => void;
  onMoveColumn: (fromIndex: number, toIndex: number) => void;
  onMoveCard: (
    cardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number,
  ) => void;
  onQuickAddCard: (columnId: string, title: string) => void;
  onOpenCreateModal: (columnId: string) => void;
  onEditCard: (card: Card, columnId: string) => void;
  onDeleteCard: (card: Card, columnId: string) => void;
}

type ActiveDragItem =
  | { type: 'card'; card: Card }
  | { type: 'column'; column: Column; accentIndex: number };

export function KanbanBoard({
  board,
  isFiltered,
  matchesFilter,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
  onMoveColumn,
  onMoveCard,
  onQuickAddCard,
  onOpenCreateModal,
  onEditCard,
  onDeleteCard,
}: KanbanBoardProps) {
  const [activeItem, setActiveItem] = useState<ActiveDragItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (!data) return;

    if (data.type === 'card' && data.card) {
      setActiveItem({ type: 'card', card: data.card as Card });
    } else if (data.type === 'column' && data.column) {
      const col = data.column as Column;
      const accentIndex = Math.max(0, board.columnOrder.indexOf(col.id));
      setActiveItem({ type: 'column', column: col, accentIndex });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    if (activeData?.type !== 'card') return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const sourceColumnId = findColumnIdByCardId(board, activeId);
    if (!sourceColumnId) return;

    const overData = over.data.current;
    const destinationColumnId =
      overData?.type === 'column' ? overId : findColumnIdByCardId(board, overId);

    if (!destinationColumnId || sourceColumnId === destinationColumnId) return;

    const destColumn = board.columns[destinationColumnId];
    if (!destColumn) return;

    const overIndex = destColumn.cardIds.indexOf(overId);
    const destinationIndex = overIndex >= 0 ? overIndex : destColumn.cardIds.length;

    onMoveCard(activeId, sourceColumnId, destinationColumnId, destinationIndex);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const activeData = active.data.current;
    if (activeData?.type === 'column') {
      const fromIndex = board.columnOrder.indexOf(activeId);
      const toIndex = board.columnOrder.indexOf(overId);
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        onMoveColumn(fromIndex, toIndex);
      }
      return;
    }

    if (activeData?.type === 'card') {
      const sourceColumnId = findColumnIdByCardId(board, activeId);
      if (!sourceColumnId) return;

      const overData = over.data.current;
      const destinationColumnId =
        overData?.type === 'column' ? overId : findColumnIdByCardId(board, overId);

      if (!destinationColumnId) return;

      const destColumn = board.columns[destinationColumnId];
      if (!destColumn) return;

      const overIndex = destColumn.cardIds.indexOf(overId);
      const destinationIndex = overIndex >= 0 ? overIndex : destColumn.cardIds.length;

      onMoveCard(activeId, sourceColumnId, destinationColumnId, destinationIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveItem(null)}
    >
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 items-start gap-5 overflow-x-auto px-4 py-6 sm:px-6">
        <SortableContext items={board.columnOrder} strategy={horizontalListSortingStrategy}>
          {board.columnOrder.map((columnId, index) => {
            const column = board.columns[columnId];
            if (!column) return null;

            const cards = column.cardIds
              .map((cardId) => board.cards[cardId])
              .filter((card): card is Card => Boolean(card) && matchesFilter(card));

            return (
              <SortableColumn
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
        </SortableContext>

        <AddColumnForm onAddColumn={onAddColumn} />
      </main>

      <DragOverlay>
        {activeItem?.type === 'card' ? (
          <KanbanCard card={activeItem.card} isOverlay />
        ) : activeItem?.type === 'column' ? (
          <KanbanColumn
            column={activeItem.column}
            cards={activeItem.column.cardIds
              .map((id) => board.cards[id])
              .filter((card): card is Card => Boolean(card) && matchesFilter(card))}
            accentIndex={activeItem.accentIndex}
            isFiltered={isFiltered}
            isOverlay
            onRenameColumn={() => {}}
            onDeleteColumn={() => {}}
            onQuickAddCard={() => {}}
            onOpenCreateModal={() => {}}
            onEditCard={() => {}}
            onDeleteCard={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
