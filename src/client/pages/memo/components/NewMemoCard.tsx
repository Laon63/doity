import React, { useState, useRef } from 'react';
import { Box, TextField, Button, Stack, useTheme } from '@mui/material';

interface NewMemoCardProps {
  onSave: (content: string) => void;
  isLoading?: boolean;
}

function NewMemoCard({ onSave, isLoading = false }: NewMemoCardProps) {
  const theme = useTheme();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // IME composition state
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
      setContent('');
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setIsEditing(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>
  ) => {
    // Ctrl/Cmd + Enter로 저장 (IME 조합 중이 아닐 때)
    if (!isComposing && (e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    // ESC로 취소
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBoxClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
      setIsEditing(true);
    }
  };

  return (
    <Box
      onClick={handleBoxClick}
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
        border: '1px solid #e0e0e0',
        cursor: 'text',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        },
      }}
    >
      <TextField
        inputRef={textFieldRef}
        multiline
        maxRows={10}
        fullWidth
        placeholder="새 메모를 작성하세요..."
        value={content}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
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
            '&::placeholder': {
              color: '#999',
              opacity: 1,
            },
          },
          '& .MuiInputBase-input:focus': {
            outline: 'none',
          },
        }}
      />

      {isEditing && (
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
            onClick={handleCancel}
            disabled={isLoading}
            sx={{ textTransform: 'none' }}
          >
            취소
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleSave}
            disabled={!content.trim() || isLoading}
            sx={{ textTransform: 'none' }}
          >
            저장
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export default NewMemoCard;
