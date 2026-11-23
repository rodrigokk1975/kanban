import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card, Column } from '../types/kanban';
import { KanbanColumn } from './KanbanColumn';

interface SortableColumnProps {
  column: Column;
  cards: Card[];
  accentIndex: number;
  isFiltered: boolean;
  onRenameColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (column: Column) => void;
  onQuickAddCard: (columnId: string, title: string) => void;
  onOpenCreateModal: (columnId: string) => void;
  onEditCard: (card: Card, columnId: string) => void;
  onDeleteCard: (card: Card, columnId: string) => void;
}

export function SortableColumn(props: SortableColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: props.column.id,
    data: {
      type: 'column',
      column: props.column,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-40' : ''}
    >
      <KanbanColumn
        {...props}
        isOver={isOver}
        dragHandleAttributes={attributes}
        dragHandleListeners={listeners}
      />
    </div>
  );
}
