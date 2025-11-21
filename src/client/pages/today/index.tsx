import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Container, Typography } from '@mui/material'; // Added Typography
import { Task } from 'client/types';
import DateNavigator from './components/DateNavigator';
import CategoryFilter from './components/CategoryFilter';
import TaskQuickAdd from './components/TaskQuickAdd';
import TaskList from './components/TaskList';
import { supabase } from 'client/lib/supabaseClient';
import useAuthStore from 'client/store/authStore';
import { useSearchParams } from 'react-router-dom'; // Changed useMatch to useSearchParams
import TaskDetailPage from 'client/pages/task-detail';
import LoadingSpinner from 'client/components/LoadingSpinner';
import { getRangeOfDay } from 'client/utils/date';

function TodayPage() {
  const session = useAuthStore((state) => state.session);
  const [searchParams, setSearchParams] = useSearchParams(); // New
  const taskId = searchParams.get('taskId'); // New

  const [tasks, setTasks] = useState<Task[]>([]);
  const [category, setCategory] = useState<string>('All');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);

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
      setSearchParams({ taskId: id }); // Changed navigation
    },
    [setSearchParams]
  );

  const handleCloseTaskDetail = useCallback(() => {
    setSearchParams({}); // Clear taskId query parameter
  }, [setSearchParams]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoadingTasks(true);
      if (!session) {
        setTasks([]); // Clear tasks if no session
        setLoadingTasks(false);
        return;
      }

      const [startOfDay, endOfDay] = getRangeOfDay(selectedDate);

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', startOfDay.toISOString()) // Filter by created_at >= start of selected day
        .lt('created_at', endOfDay.toISOString()) // Filter by created_at < end of selected day
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      } else {
        setTasks(data);
      }
      setLoadingTasks(false);
    };

    fetchTasks();
  }, [session, selectedDate]); // Add selectedDate to dependencies

  const filteredTasks = useMemo(() => {
    if (category === 'All') {
      return tasks;
    } else {
      return tasks.filter((task) => task.category === category);
    }
  }, [tasks, category]);

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
      setTasks((prev) => [data[0], ...prev]);
    }
  };

  const handleUpdateTask = async (id: string, newTitle: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ title: newTitle })
      .eq('id', id);
    if (error) {
      console.error('Error updating task:', error);
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, title: newTitle } : task
        )
      );
    }
  };

  const handleToggleTask = useCallback(
    async (id: string) => {
      const taskToToggle = tasks.find((task) => task.id === id);
      if (!taskToToggle) return;

      const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !taskToToggle.is_completed })
        .eq('id', id);

      if (error) {
        console.error('Error toggling task:', error);
      } else {
        setTasks(
          tasks.map((task) =>
            task.id === id
              ? { ...task, is_completed: !task.is_completed }
              : task
          )
        );
      }
    },
    [tasks]
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) {
        console.error('Error deleting task:', error);
      } else {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    },
    [tasks]
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
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Container
        maxWidth="sm" // Fixed width for the task list area
        onKeyDown={handleKeyDown}
        tabIndex={0}
        sx={{
          outline: 'none',
          flexShrink: 0,
          width: '100%', // Occupy full width within its flex item
          transition: 'width 0.3s ease-in-out',
        }}
      >
        <DateNavigator
          selectedDate={selectedDate}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onTodayClick={handleTodayClick}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          onDateChange={handleDateChange}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CategoryFilter
            selectedCategory={category}
            setCategory={setCategory}
          />
          <TaskQuickAdd onAddTask={handleAddTask} />
          {loadingTasks ? (
            <LoadingSpinner />
          ) : (
            <TaskList
              tasks={filteredTasks}
              focusedIndex={focusedIndex}
              onUpdateTask={handleUpdateTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onTaskClick={handleTaskClick}
            />
          )}
        </Box>
      </Container>
      <Box
        sx={{
          width: '350px', // Fixed width for the task detail area
          flexShrink: 0,
          borderLeft: '1px solid',
          borderColor: 'divider',
          overflowY: 'auto',
        }}
      >
        {taskId ? (
          <TaskDetailPage taskId={taskId} onClose={handleCloseTaskDetail} />
        ) : (
          <Typography sx={{ p: 2 }}>Select a task to see details</Typography>
        )}
      </Box>
    </Box>
  );
}

export default TodayPage;
