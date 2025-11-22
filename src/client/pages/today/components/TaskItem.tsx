import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Checkbox,
} from '@mui/material';
import { Task } from 'client/types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from 'client/utils/date';

interface TaskItemProps {
  task: Task;
  isFocused: boolean;
  onUpdateTask: (id: string, newTitle: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onTaskClick: (id: string) => void;
}

function TaskItem({
  task,
  isFocused,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onTaskClick,
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
        return '#8FE3CD';
      case 'work':
        return '#64748B';
      case 'other':
        return '#F59E0B';
      default:
        return '#CBD5E1';
    }
  };

  const getCategoryLightColor = (category?: string) => {
    switch (category) {
      case 'personal':
        return '#E0F9F5';
      case 'work':
        return '#F1F5F9';
      case 'other':
        return '#FFFBEB';
      default:
        return '#F1F5F9';
    }
  };

  return (
    <Box
      onClick={() => onTaskClick(task.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1.5,
        mb: 1.5,
        bgcolor: isFocused
          ? getCategoryLightColor(task.category)
          : 'background.paper',
        borderRadius: 1,
        border: isFocused
          ? `2px solid ${getCategoryColor(task.category)}`
          : '2px solid transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          bgcolor: getCategoryLightColor(task.category),
        },
      }}
    >
      <Checkbox
        checked={task.is_completed}
        onChange={(e) => {
          e.stopPropagation();
          onToggleTask(task.id);
        }}
        sx={{
          p: 0,
          mr: 1.5,
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
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <Box sx={{ flexGrow: 1 }}>
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
              {formatDate(task.due_date, 'MMM d')}
            </Typography>
          )}
        </Box>
      )}
      {(isHovered || isFocused) && !isEditing && (
        <Box sx={{ display: 'flex', gap: 0.5, height: '24px' }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            size="small"
            sx={{
              color: 'text.secondary',
              p: '4px',
              height: '24px',
              width: '24px',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <EditIcon fontSize="small" sx={{ width: '18px', height: '18px' }} />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id);
            }}
            size="small"
            sx={{
              color: 'text.secondary',
              p: '4px',
              height: '24px',
              width: '24px',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <DeleteIcon fontSize="small" sx={{ width: '18px', height: '18px' }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default TaskItem;
