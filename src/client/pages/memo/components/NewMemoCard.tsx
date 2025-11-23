import React, { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';

interface NewMemoCardProps {
  onSave: (content: string) => void;
  isLoading?: boolean;
}

function NewMemoCard({ onSave, isLoading = false }: NewMemoCardProps) {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <Box
      sx={{
        width: '200px',
        minHeight: '200px',
        bgcolor: '#fffef0',
        borderRadius: 1,
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '1px solid #e0e0e0',
      }}
    >
      <TextField
        multiline
        maxRows={6}
        fullWidth
        placeholder="Write a new memo..."
        value={content}
        onChange={handleInputChange}
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
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleSave}
            disabled={!content.trim() || isLoading}
            sx={{ textTransform: 'none' }}
          >
            Save
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export default NewMemoCard;
