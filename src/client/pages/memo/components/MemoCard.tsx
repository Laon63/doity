import React, { useState } from 'react';
import { Box, Checkbox, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
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
}

function MemoCard({
  memo,
  isSelected,
  onSelect,
  onTogglePin,
  onDelete,
}: MemoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const createdDate = new Date(memo.created_at);
  const formattedDate = formatDate(createdDate, 'MMM d, HH:mm');

  return (
    <>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          width: '200px',
          height: '200px',
          bgcolor: '#fffef0',
          borderRadius: 1,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        }}
      >
        {isHovered && (
          <>
            <Checkbox
              checked={isSelected}
              onChange={(e) => onSelect(memo.id, e.target.checked)}
              sx={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                zIndex: 10,
              }}
            />
            <IconButton
              size="small"
              onClick={() => onTogglePin(memo)}
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 10,
              }}
            >
              {memo.is_pinned ? (
                <PushPinIcon sx={{ fontSize: '20px' }} />
              ) : (
                <PushPinOutlinedIcon sx={{ fontSize: '20px' }} />
              )}
            </IconButton>
          </>
        )}

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
      </Box>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Memo</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this memo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MemoCard;
