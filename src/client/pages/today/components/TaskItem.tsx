import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Checkbox,
} from '@mui/material';
import { Task } from '../../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TaskItemProps {
  task: Task;
  isFocused: boolean;
  onUpdateTask: (id: string, newTitle: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

function TaskItem({
  task,
  isFocused,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isHovered, setIsHovered] = useState(false);

  const handleUpdate = () => {
    if (title.trim()) {
      onUpdateTask(task.id, title);
      setIsEditing(false);
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'personal':
        return 'primary.main';
      case 'work':
        return 'secondary.main';
      case 'other':
        return 'warning.main';
      default:
        return 'grey.500';
    }
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1.5,
        mb: 1,
        bgcolor: 'background.paper',
        borderRadius: 2,
        borderLeft: '4px solid',
        borderColor: getCategoryColor(task.category),
        backgroundColor: isFocused ? 'action.hover' : 'background.paper',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <Checkbox
        checked={task.is_completed}
        onChange={() => onToggleTask(task.id)}
        sx={{
          p: 0,
          mr: 1.5,
          borderRadius: 1, // Square checkbox
          '&.Mui-checked': {
            color: getCategoryColor(task.category),
          },
        }}
      />
      {isEditing ? (
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
          variant="standard"
          fullWidth
          autoFocus
          InputProps={{ disableUnderline: true }}
        />
      ) : (
        <Box
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => onToggleTask(task.id)}
        >
          <Typography
            sx={{
              textDecoration: task.is_completed ? 'line-through' : 'none',
              color: task.is_completed ? 'text.secondary' : 'text.primary',
            }}
          >
            {task.title}
          </Typography>
          {task.due_date && (
            <Typography variant="caption" color="text.secondary">
              {new Date(task.due_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
          )}
        </Box>
      )}
      {(isHovered || isFocused) && !isEditing && (
        <Box>
          <IconButton onClick={() => setIsEditing(true)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => onDeleteTask(task.id)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default TaskItem;
