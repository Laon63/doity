import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingSpinner from 'client/components/LoadingSpinner';
import { formatDate } from 'client/utils/date';
import { useTaskQuery } from 'client/hooks/queries/useTaskQuery';
import { Task } from 'client/types';
import {
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from 'client/hooks/mutations/useTaskMutations';
import { useQueryClient } from '@tanstack/react-query';

// New Inner Form Component
function TaskDetailForm({
  task,
  onClose,
  onToggleTask,
}: {
  task: Task;
  onClose: () => void;
  onToggleTask: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const categoryOptions = ['personal', 'work', 'other'];
  const [category, setCategory] = useState(task.category || 'personal');
  const [dueDate, setDueDate] = useState<Date | null>(
    task.due_date ? new Date(task.due_date) : null
  );

  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const handleUpdateTask = () => {
    updateTaskMutation.mutate({
      taskId: task.id,
      payload: {
        title,
        description,
        category,
        due_date: dueDate ? formatDate(dueDate, 'yyyy-MM-dd') : null,
      },
    });
  };

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate(task.id, {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
    });
  };

  const handleToggleCompleted = () => {
    onToggleTask(task.id);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: 'background.paper',
          borderRadius: 1,
          gap: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 600, fontSize: '1rem' }}
          >
            Details
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pt: 1 }}>
          {/* Title Section */}
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ bgcolor: 'background.default', borderRadius: 1 }}
            />
          </Box>

          {/* Category & Due Date Row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              mb: 2,
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value as string)}
                sx={{ bgcolor: 'background.default', borderRadius: 1 }}
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                  sx: { bgcolor: 'background.default', borderRadius: 1 },
                },
              }}
            />
          </Box>

          {/* Description Section */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                mb: 0.6,
                display: 'block',
                fontWeight: 500,
              }}
            >
              Description
            </Typography>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              size="small"
              placeholder="Add notes, details, or context..."
              sx={{ bgcolor: 'background.default', borderRadius: 1 }}
            />
          </Box>

          {/* Completed Flag */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={task.is_completed}
                  onChange={handleToggleCompleted}
                  size="small"
                />
              }
              label={<Typography variant="body2">Mark as completed</Typography>}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateTask}
            fullWidth
            size="small"
            sx={{ fontWeight: 500 }}
            disabled={updateTaskMutation.isPending}
          >
            {updateTaskMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteTask}
            fullWidth
            size="small"
            sx={{ fontWeight: 500 }}
            disabled={deleteTaskMutation.isPending}
          >
            {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

// Wrapper Component
interface TaskDetailPageProps {
  taskId: string | null;
  onClose: () => void;
  onToggleTask: (id: string) => void;
}

function TaskDetailPage({
  taskId,
  onClose,
  onToggleTask,
}: TaskDetailPageProps) {
  const { data: task, isLoading, isError, error } = useTaskQuery(taskId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error?.message}</Typography>
        <Button onClick={onClose}>Close</Button>
      </Box>
    );
  }

  if (!task) {
    // This can happen if the query is disabled or if it returns no data
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Select a task to view details.</Typography>
      </Box>
    );
  }

  return (
    <TaskDetailForm
      key={taskId}
      task={task}
      onClose={onClose}
      onToggleTask={onToggleTask}
    />
  );
}

export default TaskDetailPage;
