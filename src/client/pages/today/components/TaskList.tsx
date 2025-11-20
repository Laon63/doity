import React from 'react';
import { Box } from '@mui/material';
import { Task } from '../../../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  focusedIndex: number;
  onUpdateTask: (id: string, newTitle: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

function TaskList({
  tasks,
  focusedIndex,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) {
  return (
    <Box>
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          isFocused={index === focusedIndex}
          onUpdateTask={onUpdateTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </Box>
  );
}

export default TaskList;
