import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { useKanbanBoard } from './hooks/useKanbanBoard';
import type { Column } from './types/kanban';

export default function App() {
  const {
    board,
    filter,
    isFiltered,
    stats,
    matchesFilter,
    setSearch,
    setPriorityFilter,
    clearFilters,
    addColumn,
    updateColumn,
    deleteColumn,
    resetBoard,
  } = useKanbanBoard();

  const handleDeleteColumn = (column: Column) => {
    if (
      column.cardIds.length > 0 &&
      !window.confirm(
        `Excluir a coluna "${column.title}" e seus ${column.cardIds.length} cards?`,
      )
    ) {
      return;
    }
    deleteColumn(column.id);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header
        filter={filter}
        isFiltered={isFiltered}
        totalCards={stats.totalCards}
        visibleCards={stats.visibleCards}
        totalColumns={stats.totalColumns}
        onSearchChange={setSearch}
        onPriorityChange={setPriorityFilter}
        onClearFilters={clearFilters}
        onResetBoard={resetBoard}
      />

      <KanbanBoard
        board={board}
        isFiltered={isFiltered}
        matchesFilter={matchesFilter}
        onAddColumn={addColumn}
        onRenameColumn={updateColumn}
        onDeleteColumn={handleDeleteColumn}
      />
    </div>
  );
}
