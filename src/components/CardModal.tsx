import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { Card, CardInput, Column, Priority } from '../types/kanban';

interface CardModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialColumnId: string;
  initialCard?: Card;
  columns: Column[];
  onClose: () => void;
  onSave: (data: CardInput, columnId: string) => void;
  onDelete?: (card: Card) => void;
}

const PRIORITY_CHOICES: { value: Priority; label: string; activeClass: string }[] = [
  {
    value: 'low',
    label: 'Baixa',
    activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  },
  {
    value: 'medium',
    label: 'Média',
    activeClass: 'border-amber-500 bg-amber-50 text-amber-700',
  },
  {
    value: 'high',
    label: 'Alta',
    activeClass: 'border-rose-500 bg-rose-50 text-rose-700',
  },
];

export function CardModal({
  isOpen,
  mode,
  initialColumnId,
  initialCard,
  columns,
  onClose,
  onSave,
  onDelete,
}: CardModalProps) {
  const [title, setTitle] = useState(initialCard?.title ?? '');
  const [description, setDescription] = useState(initialCard?.description ?? '');
  const [priority, setPriority] = useState<Priority>(initialCard?.priority ?? 'medium');
  const [columnId, setColumnId] = useState(initialColumnId);
  const [tags, setTags] = useState<string[]>(initialCard?.tags ?? []);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const cleaned = tagInput.trim().replace(/^#/, '');
    if (!cleaned) return;
    if (!tags.some((t) => t.toLowerCase() === cleaned.toLowerCase())) {
      setTags((prev) => [...prev, cleaned]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const finalTags = tagInput.trim()
      ? Array.from(new Set([...tags, tagInput.trim().replace(/^#/, '')]))
      : tags;

    onSave(
      {
        title: trimmedTitle,
        description: description.trim(),
        priority,
        tags: finalTags,
      },
      columnId,
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id="card-modal-title" className="text-sm font-semibold text-slate-900">
            {mode === 'create' ? 'Nova tarefa' : 'Editar tarefa'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label
              htmlFor="card-title-input"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Título <span className="text-rose-500">*</span>
            </label>
            <input
              id="card-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Implementar autenticação OAuth"
              autoFocus
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="card-description-input"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Descrição
            </label>
            <textarea
              id="card-description-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes, critérios de aceite ou links úteis..."
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-xs font-medium text-slate-700">
                Prioridade
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {PRIORITY_CHOICES.map((choice) => {
                  const selected = priority === choice.value;
                  return (
                    <button
                      key={choice.value}
                      type="button"
                      onClick={() => setPriority(choice.value)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                        selected
                          ? choice.activeClass
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {choice.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="card-column-select"
                className="mb-1.5 block text-xs font-medium text-slate-700"
              >
                Coluna
              </label>
              <select
                id="card-column-select"
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 focus:outline-none"
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="card-tags-input"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Tags
            </label>
            <div className="flex gap-2">
              <input
                id="card-tags-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Digite uma tag e pressione Enter"
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remover tag ${tag}`}
                      className="rounded text-slate-400 hover:text-slate-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            {mode === 'edit' && initialCard && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(initialCard)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir tarefa
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {mode === 'create' ? 'Criar tarefa' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
