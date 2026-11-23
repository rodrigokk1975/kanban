import { LayoutGrid, RotateCcw, Search, X } from 'lucide-react';
import type { BoardFilter, Priority } from '../types/kanban';

interface HeaderProps {
  filter: BoardFilter;
  isFiltered: boolean;
  totalCards: number;
  visibleCards: number;
  totalColumns: number;
  onSearchChange: (value: string) => void;
  onPriorityChange: (priority: Priority | 'all') => void;
  onClearFilters: () => void;
  onResetBoard: () => void;
}

const PRIORITY_OPTIONS: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
];

export function Header({
  filter,
  isFiltered,
  totalCards,
  visibleCards,
  totalColumns,
  onSearchChange,
  onPriorityChange,
  onClearFilters,
  onResetBoard,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <LayoutGrid className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base font-semibold tracking-tight text-slate-900">
                  KanbanFlow
                </h1>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {isFiltered ? `${visibleCards} de ${totalCards}` : totalCards}{' '}
                  {totalCards === 1 ? 'tarefa' : 'tarefas'} · {totalColumns}{' '}
                  {totalColumns === 1 ? 'coluna' : 'colunas'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Salvo automaticamente no navegador
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetBoard}
            title="Restaurar quadro inicial"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 lg:hidden"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filter.search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar tarefas ou tags..."
              aria-label="Buscar tarefas ou tags"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-1.5 pr-8 pl-8.5 text-xs text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 focus:outline-none"
            />
            {filter.search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Limpar busca"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            role="group"
            aria-label="Filtrar por prioridade"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100/70 p-0.5"
          >
            {PRIORITY_OPTIONS.map((option) => {
              const active = filter.priority === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPriorityChange(option.value)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Limpar filtros
            </button>
          )}

          <button
            type="button"
            onClick={onResetBoard}
            title="Restaurar quadro inicial"
            className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 lg:inline-flex"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar
          </button>
        </div>
      </div>
    </header>
  );
}
