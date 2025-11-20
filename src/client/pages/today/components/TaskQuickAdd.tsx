import React, { useState } from 'react';
import { TextField, IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface TaskQuickAddProps {
  onAddTask: (title: string) => void;
}

function TaskQuickAdd({ onAddTask }: TaskQuickAddProps) {
  const [title, setTitle] = useState('');

  const handleAddTask = () => {
    if (title.trim()) {
      onAddTask(title.trim());
      setTitle('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        borderRadius: '99px', // Make it fully rounded
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a new task..."
        variant="standard"
        fullWidth
        sx={{ ml: 2, flex: 1 }}
        InputProps={{
          disableUnderline: true,
        }}
      />
      <IconButton
        sx={{
          p: '10px',
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
        aria-label="add task"
        onClick={handleAddTask}
      >
        <AddIcon />
      </IconButton>
    </Paper>
  );
}

export default TaskQuickAdd;
