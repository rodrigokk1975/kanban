import { useState } from 'react';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Check, GripVertical, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { Card, Column } from '../types/kanban';
import { SortableCard } from './SortableCard';

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  accentIndex: number;
  isFiltered: boolean;
  isOver?: boolean;
  isOverlay?: boolean;
  dragHandleAttributes?: DraggableAttributes;
  dragHandleListeners?: SyntheticListenerMap;
  onRenameColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (column: Column) => void;
  onQuickAddCard: (columnId: string, title: string) => void;
  onOpenCreateModal: (columnId: string) => void;
  onEditCard: (card: Card, columnId: string) => void;
  onDeleteCard: (card: Card, columnId: string) => void;
}

const COLUMN_ACCENTS = [
  'bg-indigo-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-rose-500',
];

export function KanbanColumn({
  column,
  cards,
  accentIndex,
  isFiltered,
  isOver = false,
  isOverlay = false,
  dragHandleAttributes,
  dragHandleListeners,
  onRenameColumn,
  onDeleteColumn,
  onQuickAddCard,
  onOpenCreateModal,
  onEditCard,
  onDeleteCard,
}: KanbanColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(column.title);

  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');

  const accentColor = COLUMN_ACCENTS[accentIndex % COLUMN_ACCENTS.length];
  const cardIds = cards.map((card) => card.id);

  const handleSaveTitle = () => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setDraftTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setDraftTitle(column.title);
    setIsEditingTitle(false);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickTitle.trim();
    if (!trimmed) return;
    onQuickAddCard(column.id, trimmed);
    setQuickTitle('');
    setIsQuickAdding(false);
  };

  return (
    <section
      aria-label={`Coluna ${column.title}`}
      className={`flex max-h-[calc(100vh-8.5rem)] w-80 shrink-0 flex-col rounded-2xl border p-3 transition-colors ${
        isOverlay
          ? 'border-indigo-300 bg-slate-100 shadow-xl ring-2 ring-indigo-500/20'
          : isOver
            ? 'border-indigo-300 bg-indigo-50/45'
            : 'border-slate-200/80 bg-slate-100/75'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        {isEditingTitle ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveTitle();
            }}
            className="flex flex-1 items-center gap-1"
          >
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleCancelTitle();
              }}
              autoFocus
              aria-label="Novo nome da coluna"
              className="w-full rounded-md border border-indigo-400 bg-white px-2 py-1 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Salvar nome da coluna"
              className="rounded-md p-1 text-emerald-600 hover:bg-emerald-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleCancelTitle}
              aria-label="Cancelar edição"
              className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-1.5">
              <button
                type="button"
                {...dragHandleAttributes}
                {...dragHandleListeners}
                aria-label={`Arrastar coluna ${column.title}`}
                className="cursor-grab touch-none rounded p-0.5 text-slate-400 transition hover:bg-slate-200/80 hover:text-slate-600 active:cursor-grabbing"
              >
                <GripVertical className="h-3.5 w-3.5" />
              </button>
              <span className={`h-2 w-2 shrink-0 rounded-full ${accentColor}`} />
              <h2 className="truncate text-sm font-semibold text-slate-800">{column.title}</h2>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200/80 px-1.5 text-[11px] font-semibold text-slate-600">
                {cards.length}
              </span>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => onOpenCreateModal(column.id)}
                title="Nova tarefa com detalhes"
                aria-label={`Nova tarefa em ${column.title}`}
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftTitle(column.title);
                  setIsEditingTitle(true);
                }}
                aria-label={`Renomear coluna ${column.title}`}
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteColumn(column)}
                aria-label={`Excluir coluna ${column.title}`}
                className="rounded-md p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-[4rem] flex-1 flex-col gap-2.5 overflow-y-auto pr-0.5">
          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/80 bg-white/40 px-4 py-8 text-center">
              <p className="text-xs font-medium text-slate-500">
                {isFiltered ? 'Nenhum card corresponde ao filtro' : 'Arraste ou adicione um card'}
              </p>
            </div>
          ) : (
            cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                columnId={column.id}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
              />
            ))
          )}
        </div>
      </SortableContext>

      <div className="mt-3 pt-1">
        {isQuickAdding ? (
          <form
            onSubmit={handleQuickAddSubmit}
            className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs"
          >
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setQuickTitle('');
                  setIsQuickAdding(false);
                }
              }}
              placeholder="Título da tarefa..."
              autoFocus
              aria-label="Título rápido da tarefa"
              className="w-full rounded-md bg-transparent px-1 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuickTitle('');
                  setIsQuickAdding(false);
                  onOpenCreateModal(column.id);
                }}
                className="text-[11px] font-medium text-indigo-600 hover:underline"
              >
                Mais detalhes
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setQuickTitle('');
                    setIsQuickAdding(false);
                  }}
                  className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!quickTitle.trim()}
                  className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-40"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsQuickAdding(true)}
            className="flex w-full items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-200/70 hover:text-slate-900"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar tarefa
          </button>
        )}
      </div>
    </section>
  );
}
