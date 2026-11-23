import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from '../types/kanban';
import { KanbanCard } from './KanbanCard';

interface SortableCardProps {
  card: Card;
  columnId: string;
  onEdit: (card: Card, columnId: string) => void;
  onDelete: (card: Card, columnId: string) => void;
}

export function SortableCard({ card, columnId, onEdit, onDelete }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      columnId,
      card,
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
      {...attributes}
      {...listeners}
      className={`cursor-grab touch-none active:cursor-grabbing ${
        isDragging ? 'opacity-35' : ''
      }`}
    >
      <KanbanCard
        card={card}
        onEdit={(item) => onEdit(item, columnId)}
        onDelete={(item) => onDelete(item, columnId)}
      />
    </div>
  );
}
