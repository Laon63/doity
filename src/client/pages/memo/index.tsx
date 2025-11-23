import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
} from '@mui/material';
import TabFilter from './components/TabFilter';
import MemoCard from './components/MemoCard';
import NewMemoCard from './components/NewMemoCard';
import { useMemosQuery } from 'client/hooks/queries/useMemosQuery';
import {
  useCreateMemoMutation,
  useToggleMemoPinMutation,
  useDeleteMemoMutation,
  useDeleteMultipleMemosMutation,
} from 'client/hooks/mutations/useMemoDutations';
import LoadingSpinner from 'client/components/LoadingSpinner';
import { Memo } from 'client/hooks/api/memos';

function MemoPage() {
  const [selectedTab, setSelectedTab] = useState('All');
  const [selectedMemos, setSelectedMemos] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: memos = [], isLoading } = useMemosQuery();
  const createMemoMutation = useCreateMemoMutation();
  const togglePinMutation = useToggleMemoPinMutation();
  const deleteMemoMutation = useDeleteMemoMutation();
  const deleteMultipleMemosMutation = useDeleteMultipleMemosMutation();

  const filteredMemos = useMemo(() => {
    if (selectedTab === 'All') {
      return memos;
    } else if (selectedTab === 'Pinned') {
      return memos.filter((memo) => memo.is_pinned);
    }
    return memos;
  }, [memos, selectedTab]);

  const handleSelectMemo = useCallback((memoId: string, isSelected: boolean) => {
    setSelectedMemos((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(memoId);
      } else {
        newSet.delete(memoId);
      }
      return newSet;
    });
  }, []);

  const handleCreateMemo = async (content: string) => {
    try {
      await createMemoMutation.mutateAsync(content);
    } catch (error) {
      console.error('Error creating memo:', error);
    }
  };

  const handleTogglePin = async (memo: Memo) => {
    try {
      await togglePinMutation.mutateAsync({
        memoId: memo.id,
        isPinned: memo.is_pinned,
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleDeleteMemo = async (memoId: string) => {
    try {
      await deleteMemoMutation.mutateAsync(memoId);
    } catch (error) {
      console.error('Error deleting memo:', error);
    }
  };

  const handleDeleteSelected = async () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteSelected = async () => {
    setDeleteDialogOpen(false);
    try {
      const memoIdsToDelete = Array.from(selectedMemos);
      await deleteMultipleMemosMutation.mutateAsync(memoIdsToDelete);
      setSelectedMemos(new Set());
    } catch (error) {
      console.error('Error deleting memos:', error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setSelectedMemos(new Set());
  };

  const isLoading_ =
    isLoading ||
    createMemoMutation.isPending ||
    togglePinMutation.isPending ||
    deleteMemoMutation.isPending ||
    deleteMultipleMemosMutation.isPending;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header with Tab Filter and Selection Info */}
      <Box
        sx={{
          pb: 2,
          borderBottom: selectedMemos.size > 0 ? '1px solid' : 'none',
          borderColor: 'divider',
        }}
      >
        <TabFilter selectedTab={selectedTab} setTab={handleTabChange} />

        {selectedMemos.size > 0 && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
              mt: 2,
              padding: '12px',
              bgcolor: '#f5f5f5',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {selectedMemos.size} selected
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleDeleteSelected}
              disabled={isLoading_}
            >
              Delete
            </Button>
          </Stack>
        )}
      </Box>

      {/* Memos Grid */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          pt: 2,
        }}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'flex-start',
              alignContent: 'flex-start',
            }}
          >
            {/* New Memo Card */}
            <NewMemoCard
              onSave={handleCreateMemo}
              isLoading={createMemoMutation.isPending}
            />

            {/* Existing Memos */}
            {filteredMemos.map((memo) => (
              <MemoCard
                key={memo.id}
                memo={memo}
                isSelected={selectedMemos.has(memo.id)}
                onSelect={handleSelectMemo}
                onTogglePin={handleTogglePin}
                onDelete={handleDeleteMemo}
              />
            ))}

            {/* Empty State */}
            {filteredMemos.length === 0 && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 4,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {selectedTab === 'Pinned'
                    ? 'No pinned memos yet'
                    : 'No memos yet. Create your first memo!'}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Memos</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedMemos.size} memo
            {selectedMemos.size !== 1 ? 's' : ''}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDeleteSelected}
            color="error"
            variant="contained"
            disabled={isLoading_}
          >
            {deleteMultipleMemosMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MemoPage;
