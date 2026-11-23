import { Pencil, Trash2 } from 'lucide-react';
import type { Card, Priority } from '../types/kanban';

interface KanbanCardProps {
  card: Card;
  onEdit?: (card: Card) => void;
  onDelete?: (card: Card) => void;
  isOverlay?: boolean;
}

const PRIORITY_STYLES: Record<Priority, { label: string; badge: string; dot: string }> = {
  high: {
    label: 'Alta',
    badge: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/15',
    dot: 'bg-rose-500',
  },
  medium: {
    label: 'Média',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/15',
    dot: 'bg-amber-500',
  },
  low: {
    label: 'Baixa',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15',
    dot: 'bg-emerald-500',
  },
};

export function KanbanCard({ card, onEdit, onDelete, isOverlay = false }: KanbanCardProps) {
  const priority = PRIORITY_STYLES[card.priority];

  return (
    <article
      onDoubleClick={() => onEdit?.(card)}
      className={`group relative rounded-xl border bg-white p-3.5 transition ${
        isOverlay
          ? 'rotate-1 border-indigo-300 shadow-lg ring-2 ring-indigo-500/20'
          : 'border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${priority.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(card);
                }}
                aria-label={`Editar ${card.title}`}
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(card);
                }}
                aria-label={`Excluir ${card.title}`}
                className="rounded-md p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium leading-snug text-slate-900">{card.title}</h3>

      {card.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {card.description}
        </p>
      )}

      {card.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
