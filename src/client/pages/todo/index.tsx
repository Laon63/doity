import React, { useState, useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import TodoDateNavigator from './components/TodoDateNavigator';
import TodoCategoryFilter from './components/TodoCategoryFilter';
import TodoTaskQuickAdd from './components/TodoTaskQuickAdd';
import TodoList from './components/TodoList';
import { supabase } from 'client/lib/supabaseClient';
import useAuthStore from 'client/store/authStore';
import { useSearchParams, useLocation } from 'react-router-dom';
import TaskDetailPage from 'client/pages/task-detail';
import LoadingSpinner from 'client/components/LoadingSpinner';
import { useUncompletedTasksQuery } from 'client/hooks/queries/useUncompletedTasksQuery';
import { useQueryClient } from '@tanstack/react-query';
import {
  useToggleTaskMutation,
  useUpdateTaskTitleMutation,
} from 'client/hooks/mutations/useTaskMutations';
import { useTranslation } from 'react-i18next'; // Import useTranslation

function TodoPage() {
  const { t } = useTranslation('common'); // Initialize useTranslation
  const session = useAuthStore((state) => state.session);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');
  const location = useLocation();

  const [category, setCategory] = useState<string>('all');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const state = location.state as { selectedDate?: Date } | null;
    if (state?.selectedDate) {
      return new Date(state.selectedDate);
    }
    return new Date();
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // No useEffect here for selectedDate from location.state, as it's handled by useState initializer
  // and subsequent changes are handled by internal navigation.

  const { data: tasks = [], isLoading: loadingTasks } =
    useUncompletedTasksQuery();

  const handlePreviousDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  const handleTodayClick = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const handleDateChange = useCallback((date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
    }
  }, []);

  const handleTaskClick = useCallback(
    (id: string) => {
      setSearchParams({ taskId: id });
    },
    [setSearchParams]
  );

  const handleCloseTaskDetail = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const filteredTasks = useMemo(() => {
    if (category === 'all') {
      return tasks;
    } else {
      return tasks.filter((task) => task.category === category);
    }
  }, [tasks, category]);

  React.useEffect(() => {
    if (
      taskId &&
      !loadingTasks &&
      !filteredTasks.some((task) => task.id === taskId)
    ) {
      handleCloseTaskDetail();
    }
  }, [taskId, filteredTasks, loadingTasks, handleCloseTaskDetail]);

  const handleAddTask = async (title: string) => {
    if (!session) {
      return;
    }
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          user_id: session.user.id,
          category: 'personal',
        },
      ])
      .select();

    if (error) {
      console.error('Error adding task:', error);
    } else if (data) {
                const newTask = data[0];
                queryClient.invalidateQueries({ queryKey: ['uncompletedTasks'] });      setSearchParams({ taskId: newTask.id });
    }
  };

  const updateTaskTitleMutation = useUpdateTaskTitleMutation();

  const handleUpdateTask = useCallback(
    (id: string, newTitle: string) => {
      updateTaskTitleMutation.mutate({ taskId: id, newTitle });
    },
    [updateTaskTitleMutation]
  );

  const toggleTaskMutation = useToggleTaskMutation();

  const handleToggleTask = useCallback(
    (id: string) => {
      const taskToToggle = tasks.find((task) => task.id === id);
      if (!taskToToggle) return;

      toggleTaskMutation.mutate({
        taskId: id,
        isCompleted: !taskToToggle.is_completed,
      });
    },
    [tasks, toggleTaskMutation]
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) {
        console.error('Error deleting task:', error);
      } else {
                  queryClient.invalidateQueries({ queryKey: ['uncompletedTasks'] });      }
    },
    [queryClient]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, filteredTasks.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === ' ' && focusedIndex !== -1) {
        e.preventDefault();
        handleToggleTask(filteredTasks[focusedIndex].id);
      } else if (e.key.toLowerCase() === 'e' && focusedIndex !== -1) {
        // This is handled in TaskItem now
      } else if (e.key === 'Delete' && focusedIndex !== -1) {
        e.preventDefault();
        handleDeleteTask(filteredTasks[focusedIndex].id);
      }
    },
    [filteredTasks, focusedIndex, handleToggleTask, handleDeleteTask]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        justifyContent: 'flex-start',
      }}
    >
      <Box
        onKeyDown={handleKeyDown}
        tabIndex={0}
        sx={{
          outline: 'none',
          flex: 1,
          minWidth: 0, // Allow flex item to shrink
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease-in-out',
          mr: 3,
        }}
      >
        <Box sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TodoDateNavigator
            selectedDate={selectedDate}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            onTodayClick={handleTodayClick}
            isCalendarOpen={isCalendarOpen}
            setIsCalendarOpen={setIsCalendarOpen}
            onDateChange={handleDateChange}
          />
        </Box>

        <Box sx={{ py: 2.5 }}>
          <TodoCategoryFilter
            selectedCategory={category}
            setCategory={setCategory}
          />
          <Box sx={{ mt: 1.5 }}>
            <TodoTaskQuickAdd onAddTask={handleAddTask} />
          </Box>
        </Box>

        {loadingTasks ? (
          <LoadingSpinner />
        ) : (
          <TodoList
            tasks={filteredTasks}
            focusedIndex={focusedIndex}
            selectedTaskId={taskId}
            onUpdateTask={handleUpdateTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onTaskClick={handleTaskClick}
          />
        )}
      </Box>

      <Box
        sx={{
          width: '360px',
          flexShrink: 0,
          borderRadius: 1,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        {taskId ? (
          <TaskDetailPage
            taskId={taskId}
            onClose={handleCloseTaskDetail}
            onToggleTask={handleToggleTask}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', textAlign: 'center' }}
            >
              {t('selectTaskToViewDetails')}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default TodoPage;
