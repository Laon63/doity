import React from 'react';
import { Box } from '@mui/material';
import { Task } from 'client/types';
import TaskItem from 'client/pages/today/components/TaskItem';

interface TaskListProps {
  tasks: Task[];
  focusedIndex: number;
  onUpdateTask: (id: string, newTitle: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onTaskClick: (id: string) => void;
}

function TaskList({
  tasks,
  focusedIndex,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onTaskClick,
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
          onTaskClick={onTaskClick}
        />
      ))}
    </Box>
  );
}

export default TaskList;
