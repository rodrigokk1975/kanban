import { useState } from 'react';
import { CardModal } from './components/CardModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { useKanbanBoard } from './hooks/useKanbanBoard';
import type { Card, CardInput, Column } from './types/kanban';

type CardModalState =
  | { isOpen: false }
  | { isOpen: true; mode: 'create'; columnId: string }
  | { isOpen: true; mode: 'edit'; columnId: string; card: Card };

type ConfirmState =
  | { isOpen: false }
  | { isOpen: true; kind: 'delete-column'; column: Column }
  | { isOpen: true; kind: 'delete-card'; card: Card; columnId: string }
  | { isOpen: true; kind: 'reset-board' };

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
    addCard,
    updateCard,
    deleteCard,
    resetBoard,
  } = useKanbanBoard();

  const [cardModal, setCardModal] = useState<CardModalState>({ isOpen: false });
  const [confirmState, setConfirmState] = useState<ConfirmState>({ isOpen: false });

  const orderedColumns = board.columnOrder
    .map((id) => board.columns[id])
    .filter((col): col is Column => Boolean(col));

  const handleQuickAddCard = (columnId: string, title: string) => {
    addCard(columnId, {
      title,
      description: '',
      priority: 'medium',
      tags: [],
    });
  };

  const handleSaveCard = (data: CardInput, targetColumnId: string) => {
    if (!cardModal.isOpen) return;

    if (cardModal.mode === 'create') {
      addCard(targetColumnId, data);
    } else {
      updateCard(cardModal.card.id, data, targetColumnId);
    }
  };

  const handleRequestDeleteColumn = (column: Column) => {
    if (column.cardIds.length === 0) {
      deleteColumn(column.id);
      return;
    }
    setConfirmState({ isOpen: true, kind: 'delete-column', column });
  };

  const handleConfirmAction = () => {
    if (!confirmState.isOpen) return;

    if (confirmState.kind === 'delete-column') {
      deleteColumn(confirmState.column.id);
    } else if (confirmState.kind === 'delete-card') {
      deleteCard(confirmState.card.id, confirmState.columnId);
      setCardModal({ isOpen: false });
    } else if (confirmState.kind === 'reset-board') {
      resetBoard();
    }

    setConfirmState({ isOpen: false });
  };

  const confirmCopy = (() => {
    if (!confirmState.isOpen) return null;
    if (confirmState.kind === 'delete-column') {
      return {
        title: `Excluir coluna "${confirmState.column.title}"?`,
        description: `Esta ação removerá permanentemente a coluna e ${confirmState.column.cardIds.length} ${
          confirmState.column.cardIds.length === 1 ? 'tarefa vinculada' : 'tarefas vinculadas'
        }.`,
        confirmLabel: 'Excluir coluna',
        variant: 'danger' as const,
      };
    }
    if (confirmState.kind === 'delete-card') {
      return {
        title: `Excluir "${confirmState.card.title}"?`,
        description: 'Esta tarefa será removida permanentemente do quadro.',
        confirmLabel: 'Excluir tarefa',
        variant: 'danger' as const,
      };
    }
    return {
      title: 'Restaurar quadro inicial?',
      description:
        'Todas as colunas e tarefas atuais serão substituídas pelos dados de demonstração.',
      confirmLabel: 'Restaurar quadro',
      variant: 'default' as const,
    };
  })();

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
        onResetBoard={() => setConfirmState({ isOpen: true, kind: 'reset-board' })}
      />

      <KanbanBoard
        board={board}
        isFiltered={isFiltered}
        matchesFilter={matchesFilter}
        onAddColumn={addColumn}
        onRenameColumn={updateColumn}
        onDeleteColumn={handleRequestDeleteColumn}
        onQuickAddCard={handleQuickAddCard}
        onOpenCreateModal={(columnId) =>
          setCardModal({ isOpen: true, mode: 'create', columnId })
        }
        onEditCard={(card, columnId) =>
          setCardModal({ isOpen: true, mode: 'edit', card, columnId })
        }
        onDeleteCard={(card, columnId) =>
          setConfirmState({ isOpen: true, kind: 'delete-card', card, columnId })
        }
      />

      {cardModal.isOpen && (
        <CardModal
          key={cardModal.mode === 'edit' ? cardModal.card.id : `new-${cardModal.columnId}`}
          isOpen={cardModal.isOpen}
          mode={cardModal.mode}
          initialColumnId={cardModal.columnId}
          initialCard={cardModal.mode === 'edit' ? cardModal.card : undefined}
          columns={orderedColumns}
          onClose={() => setCardModal({ isOpen: false })}
          onSave={handleSaveCard}
          onDelete={
            cardModal.mode === 'edit'
              ? (card) =>
                  setConfirmState({
                    isOpen: true,
                    kind: 'delete-card',
                    card,
                    columnId: cardModal.columnId,
                  })
              : undefined
          }
        />
      )}

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmCopy?.title ?? ''}
        description={confirmCopy?.description ?? ''}
        confirmLabel={confirmCopy?.confirmLabel}
        variant={confirmCopy?.variant}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmState({ isOpen: false })}
      />
    </div>
  );
}
