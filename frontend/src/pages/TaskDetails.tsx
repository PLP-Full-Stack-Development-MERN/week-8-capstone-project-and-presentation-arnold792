import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/tasks/${id}`);
        setTask(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch task details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleEditTask = () => {
    navigate('/', { state: { editTask: task } });
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await axios.delete(`/api/tasks/${id}`);
      navigate('/');
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Tasks
        </Button>
        <Alert severity="error">{error || 'Task not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Tasks
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h4" gutterBottom>
            {task.title}
          </Typography>
          <Box>
            <Button
              startIcon={<EditIcon />}
              onClick={handleEditTask}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              onClick={handleDeleteTask}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 2, mb: 3 }}>
          <Chip
            label={task.status.replace('-', ' ')}
            color={getStatusColor(task.status) as any}
            sx={{ mr: 1 }}
          />
          <Chip
            label={task.priority}
            color={getPriorityColor(task.priority) as any}
            sx={{ mr: 1 }}
          />
          {task.category && <Chip label={task.category} variant="outlined" />}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {task.description || 'No description provided'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Due Date
            </Typography>
            <Typography variant="body1">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date set'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Created
            </Typography>
            <Typography variant="body1">
              {new Date(task.createdAt).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Last Updated
            </Typography>
            <Typography variant="body1">
              {new Date(task.updatedAt).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TaskDetails; 