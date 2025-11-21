import React, { useState, useEffect } from 'react';
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
import { supabase } from 'client/lib/supabaseClient';
import { Task } from 'client/types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingSpinner from 'client/components/LoadingSpinner';
import { formatDate } from 'client/utils/date';

interface TaskDetailPageProps {
  taskId: string | null;
  onClose: () => void; // New prop
}

function TaskDetailPage({ taskId, onClose }: TaskDetailPageProps) {
  // Accepted onClose
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const categoryOptions = ['personal', 'work', 'other'];
  const [category, setCategory] = useState<string>('personal');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isImportant, setIsImportant] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      if (!taskId) {
        // Use taskId prop
        setError('Task ID is missing.');
        setLoading(false);
        setTask(null); // Clear task if no ID
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId) // Use taskId prop
        .single();

      if (fetchError) {
        setError(fetchError.message);
        console.error('Error fetching task:', fetchError);
        setTask(null);
      } else if (data) {
        setTask(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setCategory(data.category || 'personal');
        setDueDate(data.due_date ? new Date(data.due_date) : null);
        setIsImportant(data.is_important || false);
        setIsCompleted(data.is_completed || false);
      } else {
        setError('Task not found.');
        setTask(null);
      }
      setLoading(false);
    };

    fetchTask();
  }, [taskId]); // Changed dependency to taskId

  const handleClose = () => {
    onClose(); // Call the onClose prop
  };

  const handleUpdateTask = async () => {
    if (!task) return;

    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        title,
        description,
        category,
        due_date: dueDate ? formatDate(dueDate, 'yyyy-MM-dd') : null,
        is_important: isImportant,
        is_completed: isCompleted,
      })
      .eq('id', task.id);

    if (updateError) {
      console.error('Error updating task:', updateError);
      setError(updateError.message);
    } else {
      // Optionally, refresh tasks in TodayPage or show a success message
      console.log('Task updated successfully!');
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;

    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', task.id);

    if (deleteError) {
      console.error('Error deleting task:', deleteError);
      setError(deleteError.message);
    } else {
      console.log('Task deleted successfully!');
      handleClose(); // Close the detail page after deletion
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
        <Button onClick={handleClose}>Close</Button>
      </Box>
    );
  }

  if (!task) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Task not found.</Typography>
        <Button onClick={handleClose}>Close</Button>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: 'background.paper',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 600, fontSize: '1.1rem' }}
          >
            Task Details
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2, px: 0 }}>
          {/* Title Section */}
          <Box sx={{ mb: 2.5 }}>
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
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
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
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.8, display: 'block' }}>
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

          {/* Important Flag */}
          <Box sx={{ mb: 1.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">Mark as important</Typography>
              }
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            mt: 'auto',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateTask}
            fullWidth
            size="small"
            sx={{ fontWeight: 500 }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteTask}
            fullWidth
            size="small"
            sx={{ fontWeight: 500 }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default TaskDetailPage;
