import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Checkbox,
} from '@mui/material';
import { Task } from 'client/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from 'client/utils/date';
import { useTheme } from '@mui/material';
import { getCategoryColor, getCategoryLightColor } from 'client/utils/colors';

interface TodoItemProps {
  task: Task;
  isFocused: boolean;
  isSelected: boolean;
  onUpdateTask: (id: string, newTitle: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onTaskClick: (id: string) => void;
}

function TodoItem({
  task,
  isFocused,
  isSelected,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onTaskClick,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  const handleUpdate = () => {
    if (title.trim() && title !== task.title) {
      onUpdateTask(task.id, title);
    }
    setIsEditing(false);
  };

  return (
    <Box
      onClick={() => onTaskClick(task.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        mb: 1.5,
        height: '48px',
        bgcolor: isFocused
          ? getCategoryLightColor(task.category)
          : 'background.paper',
        borderRadius: 1,
        border: isSelected
          ? `2px solid ${(theme.palette.primary as any).border}`
          : `1px solid ${theme.palette.divider}`,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        position: 'relative', // Added for absolute positioning context
        minWidth: 0, // Allow flex item to shrink
        '&:hover': {
          bgcolor: 'primary.lightest',
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
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
          <Box sx={{ minWidth: 0, mr: 1 }}>
            <Typography
              sx={{
                textDecoration: task.is_completed ? 'line-through' : 'none',
                color: task.is_completed ? 'text.secondary' : 'text.primary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {task.title}
            </Typography>
          </Box>
          {task.due_date && (
            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
              {formatDate(task.due_date, 'MMM d')}
            </Typography>
          )}
        </Box>
      )}
      {(isHovered || isFocused) && !isEditing && (
        <Box
          sx={{
            position: 'absolute', // Absolute positioning
            right: 8, // Adjust as needed
            top: 8, // Adjust as needed
            opacity: isHovered ? 1 : 0.3, // Slightly visible when not hovered
            transition: 'opacity 0.2s ease', // Smooth transition
            zIndex: 1, // Ensure it's above other content if necessary
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id);
            }}
            size="small"
            sx={{ color: 'text.secondary', p: 0.5 }} // Added padding
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default TodoItem;
