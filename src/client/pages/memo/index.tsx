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
  useUpdateMemoMutation,
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
  const updateMemoMutation = useUpdateMemoMutation();

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
      console.error('메모 생성 오류:', error);
    }
  };

  const handleUpdateMemo = async (memoId: string, newContent: string) => {
    try {
      await updateMemoMutation.mutateAsync({
        memoId,
        payload: { content: newContent },
      });
    } catch (error) {
      console.error('메모 업데이트 오류:', error);
    }
  };

  const handleTogglePin = async (memo: Memo) => {
    try {
      await togglePinMutation.mutateAsync({
        memoId: memo.id,
        isPinned: memo.is_pinned,
      });
    } catch (error) {
      console.error('핀 토글 오류:', error);
    }
  };

  const handleDeleteMemo = async (memoId: string) => {
    try {
      await deleteMemoMutation.mutateAsync(memoId);
    } catch (error) {
      console.error('메모 삭제 오류:', error);
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
      console.error('메모 삭제 오류:', error);
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
    deleteMultipleMemosMutation.isPending ||
    updateMemoMutation.isPending;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* 헤더 - 탭 필터 */}
      <Box
        sx={{
          pb: 2,
        }}
      >
        <TabFilter selectedTab={selectedTab} setTab={handleTabChange} />
      </Box>

      {/* 선택 정보 표시 영역 - 고정 높이로 레이아웃 안정화 */}
      <Box
        sx={{
          minHeight: selectedMemos.size > 0 ? '60px' : '0px',
          transition: 'min-height 0.2s ease-in-out',
          borderBottom: selectedMemos.size > 0 ? '1px solid' : 'none',
          borderColor: 'divider',
        }}
      >
        {selectedMemos.size > 0 && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
              p: 1.5,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {selectedMemos.size}개 선택됨
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleDeleteSelected}
              disabled={isLoading_}
            >
              삭제
            </Button>
          </Stack>
        )}
      </Box>

      {/* 메모 그리드 */}
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
            {/* 새 메모 카드 */}
            <NewMemoCard
              onSave={handleCreateMemo}
              isLoading={createMemoMutation.isPending}
            />

            {/* 기존 메모들 */}
            {filteredMemos.map((memo) => (
              <MemoCard
                key={memo.id}
                memo={memo}
                isSelected={selectedMemos.has(memo.id)}
                onSelect={handleSelectMemo}
                onTogglePin={handleTogglePin}
                onDelete={handleDeleteMemo}
                onUpdate={handleUpdateMemo}
              />
            ))}

            {/* 빈 상태 표시 */}
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
                    ? '고정된 메모가 없습니다'
                    : '아직 메모가 없습니다. 첫 번째 메모를 작성해보세요!'}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>메모 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedMemos.size}개의 메모를 삭제하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>취소</Button>
          <Button
            onClick={handleConfirmDeleteSelected}
            color="error"
            variant="contained"
            disabled={isLoading_}
          >
            {deleteMultipleMemosMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              '삭제'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MemoPage;
