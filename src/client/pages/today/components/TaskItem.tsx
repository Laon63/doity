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
import { getCategoryColor, getCategoryLightColor, lightenColor } from 'client/utils/colors';
import useThemeStore from 'client/store/themeStore';

interface TaskItemProps {
  task: Task;
  isFocused: boolean;
  isSelected: boolean; // Added
  onUpdateTask: (id: string, newTitle: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onTaskClick: (id: string) => void;
}

function TaskItem({
  task,
  isFocused,
  isSelected, // Added
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onTaskClick,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const hoverBgColor = lightenColor(primaryColor, 0.20);

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
        border: isSelected // Changed
          ? `2px solid ${getCategoryColor(task.category)}`
          : `1px solid ${theme.palette.divider}`,
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
        <Box
          sx={{ flexGrow: 1 }}
          onClick={() => {
            // 임시제거. TODO: history (undo redo) 구축 후 작업
            // setIsEditing(true);
          }}
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
              {formatDate(task.due_date, 'MMM d')}
            </Typography>
          )}
        </Box>
      )}
      {(isHovered || isFocused) && !isEditing && (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id);
            }}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default TaskItem;
