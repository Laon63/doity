import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Container } from '@mui/material';
import { Task } from '../../types';
import DateNavigator from './components/DateNavigator';
import CategoryFilter from './components/CategoryFilter';
import TaskQuickAdd from './components/TaskQuickAdd';
import TaskList from './components/TaskList';
import { supabase } from '../../lib/supabaseClient';
import useAuthStore from '../../store/authStore';

function TodayPage() {
  const session = useAuthStore((state) => state.session);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [category, setCategory] = useState<string>('All');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  useEffect(() => {
    const fetchTasks = async () => {
      if (!session) return;
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data);
      }
    };

    fetchTasks();
  }, [session]);

  const filteredTasks = useMemo(() => {
    if (category === 'All') {
      return tasks;
    } else {
      return tasks.filter((task) => task.category === category);
    }
  }, [tasks, category]);

  const handleAddTask = async (title: string) => {
    if (!session) return;
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, user_id: session.user.id, category: 'personal' }])
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
            task.id === id ? { ...task, is_completed: !task.is_completed } : task
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
    <Container
      maxWidth="md"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      sx={{ outline: 'none' }}
    >
      <DateNavigator
        selectedDate={selectedDate}
        onPreviousDay={handlePreviousDay}
        onNextDay={handleNextDay}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <CategoryFilter selectedCategory={category} setCategory={setCategory} />
        <TaskQuickAdd onAddTask={handleAddTask} />
      </Box>
      <TaskList
        tasks={filteredTasks}
        focusedIndex={focusedIndex}
        onUpdateTask={handleUpdateTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />
    </Container>
  );
}

export default TodayPage;
