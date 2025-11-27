import React from 'react';
import { Task } from 'client/types';
import Scrollable from 'client/components/Scrollable';
import TodoItem from 'client/pages/todo/components/TodoItem';

interface TodoListProps {
  tasks: Task[];

  focusedIndex: number;

  selectedTaskId: string | null; // Added

  onUpdateTask: (id: string, newTitle: string) => void;

  onToggleTask: (id: string) => void;

  onDeleteTask: (id: string) => void;

  onTaskClick: (id: string) => void;
}

function TodoList({
  tasks,

  focusedIndex,

  selectedTaskId, // Added

  onUpdateTask,

  onToggleTask,

  onDeleteTask,

  onTaskClick,
}: TodoListProps) {
  return (
    <Scrollable sx={{ flex: 1, minHeight: 0, pr: 1 }}>
      {tasks.map((task, index) => (
        <TodoItem
          key={task.id}
          task={task}
          isFocused={index === focusedIndex}
          isSelected={task.id === selectedTaskId} // Added
          onUpdateTask={onUpdateTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onTaskClick={onTaskClick}
        />
      ))}
    </Scrollable>
  );
}

export default TodoList;
