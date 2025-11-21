import React from 'react';
import { Task } from 'client/types';
import Scrollable from 'client/components/Scrollable';
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
    <Scrollable sx={{ flex: 1, minHeight: 0 }}>
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
    </Scrollable>
  );
}

export default TaskList;
