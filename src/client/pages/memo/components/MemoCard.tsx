import React, { useState, useRef } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { Memo } from 'client/hooks/api/memos';
import { formatDate } from 'client/utils/date';

interface MemoCardProps {
  memo: Memo;
  isSelected: boolean;
  onSelect: (memoId: string, isSelected: boolean) => void;
  onTogglePin: (memo: Memo) => void;
  onDelete: (memoId: string) => void;
  onUpdate?: (memoId: string, newContent: string) => void;
}

function MemoCard({
  memo,
  isSelected,
  onSelect,
  onTogglePin,
  onDelete,
  onUpdate,
}: MemoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(memo.content);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false);
    onDelete(memo.id);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditContent(memo.content);
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
      }
    }, 0);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && onUpdate) {
      onUpdate(memo.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(memo.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter로 저장
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    }
    // ESC로 취소
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const createdDate = new Date(memo.created_at);
  const formattedDate = formatDate(createdDate, 'MMM d, HH:mm');

  return (
    <>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (!isEditing) {
            handleStartEdit();
          }
        }}
        sx={{
          width: '250px',
          height: '300px',
          bgcolor: '#fffef0',
          borderRadius: 1,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          cursor: isEditing ? 'text' : 'pointer',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        }}
      >
        {/* Absolute 오버레이: Checkbox (좌측 상단) */}
        {isHovered && !isEditing && (
          <Checkbox
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(memo.id, e.target.checked);
            }}
            sx={{
              position: 'absolute',
              top: '4px',
              left: '2px',
              zIndex: 10,
              padding: '4px',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.05)',
              },
            }}
          />
        )}

        {/* Absolute 오버레이: Pin 버튼 (우측 상단) */}
        {isHovered && !isEditing && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(memo);
            }}
            sx={{
              position: 'absolute',
              top: '4px',
              right: '2px',
              zIndex: 10,
              padding: '4px',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            {memo.is_pinned ? (
              <PushPinIcon sx={{ fontSize: '20px' }} />
            ) : (
              <PushPinOutlinedIcon sx={{ fontSize: '20px' }} />
            )}
          </IconButton>
        )}

        {/* 메모 내용 - 원래 위치에 표시 */}
        {isEditing ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <TextField
              inputRef={textFieldRef}
              multiline
              maxRows={10}
              fullWidth
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                flex: 1,
                fontSize: '14px',
                '& .MuiInputBase-input': {
                  padding: 0,
                  fontSize: '14px',
                  color: '#333',
                },
                '& .MuiInputBase-input:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        ) : (
          <Typography
            component="div"
            sx={{
              flex: 1,
              fontSize: '14px',
              color: '#333',
              wordWrap: 'break-word',
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.4',
            }}
          >
            {memo.content}
          </Typography>
        )}

        {/* 하단 부분 */}
        {isEditing ? (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              marginTop: '8px',
              borderTop: '1px solid #eee',
              paddingTop: '8px',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              size="small"
              onClick={handleCancelEdit}
              sx={{ textTransform: 'none' }}
            >
              취소
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleSaveEdit}
              disabled={!editContent.trim()}
              sx={{ textTransform: 'none' }}
            >
              저장
            </Button>
          </Stack>
        ) : (
          <Typography
            variant="caption"
            sx={{
              fontSize: '12px',
              color: '#999',
              marginTop: '8px',
              borderTop: '1px solid #eee',
              paddingTop: '8px',
            }}
          >
            {formattedDate}
          </Typography>
        )}
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>메모 삭제</DialogTitle>
        <DialogContent>
          <Typography>이 메모를 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>취소</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MemoCard;
