import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddColumnFormProps {
  onAddColumn: (title: string) => void;
}

export function AddColumnForm({ onAddColumn }: AddColumnFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAddColumn(trimmed);
    setTitle('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-12 w-80 shrink-0 items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 text-sm font-medium text-slate-600 transition hover:border-indigo-400 hover:bg-white hover:text-indigo-600"
      >
        <Plus className="h-4 w-4" />
        Nova coluna
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-80 shrink-0 self-start rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
    >
      <label htmlFor="new-column-title" className="sr-only">
        Nome da nova coluna
      </label>
      <input
        id="new-column-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setTitle('');
            setIsOpen(false);
          }
        }}
        placeholder="Ex.: Em Revisão, Backlog..."
        autoFocus
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 focus:outline-none"
      />
      <div className="mt-2.5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setTitle('');
            setIsOpen(false);
          }}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-3.5 w-3.5" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Adicionar
        </button>
      </div>
    </form>
  );
}
