import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../types'; // We'll create this type definition next

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, is_completed: boolean) => void;
  onDelete: (id: string) => void;
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={task.is_completed}
          onChange={(e) => onToggle(task.id, e.target.checked)}
        />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            textDecoration: task.is_completed ? 'line-through' : 'none',
            color: task.is_completed ? 'text.secondary' : 'text.primary',
          }}
        >
          {task.title}
        </Typography>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(task.id)}
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}

export default TaskItem;
