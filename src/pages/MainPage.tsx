import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import useAuthStore from '../store/authStore';
import { Task } from '../types';
import TaskList from '../components/TaskList';

function MainPage() {
  const session = useAuthStore((state) => state.session);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

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

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newTaskTitle.trim()) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title: newTaskTitle, user_id: session.user.id }])
      .select();

    if (error) {
      console.error('Error adding task:', error);
    } else if (data) {
      setTasks([data[0], ...tasks]);
      setNewTaskTitle('');
    }
  };

  const handleToggleTask = async (id: string, is_completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed })
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, is_completed } : task
        )
      );
    }
  };

  const handleDeleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Today's Tasks
      </Typography>

      <Box component="form" onSubmit={handleAddTask} sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="새로운 할 일 추가"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ whiteSpace: 'nowrap' }}>
          추가
        </Button>
      </Box>

      <TaskList tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
    </Box>
  );
}

export default MainPage;
