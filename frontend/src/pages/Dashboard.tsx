import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import axios from 'axios';

// Task interface
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

// New task form state interface
interface TaskFormData {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
}

// Filter state interface
interface FilterData {
  status: string;
  priority: string;
  category: string;
  search: string;
}

const Dashboard: React.FC = () => {
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Task form modal state
  const [openTaskModal, setOpenTaskModal] = useState<boolean>(false);
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    category: '',
  });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  // Delete confirmation modal state
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Filters state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterData>({
    status: '',
    priority: '',
    category: '',
    search: '',
  });
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      
      const response = await axios.get(`/api/tasks?${queryParams.toString()}`);
      setTasks(response.data);
      
      // Extract unique categories from tasks
      const uniqueCategories = Array.from(
        new Set(response.data.map((task: Task) => task.category).filter(Boolean))
      );
      setCategories(uniqueCategories as string[]);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskFormData({
      ...taskFormData,
      [name]: value,
    });
  };

  // Handle select input changes
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setTaskFormData({
      ...taskFormData,
      [name]: value,
    });
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Open task form modal for creating a new task
  const handleOpenCreateModal = () => {
    setTaskFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
      category: '',
    });
    setEditMode(false);
    setCurrentTaskId(null);
    setOpenTaskModal(true);
  };

  // Open task form modal for editing a task
  const handleOpenEditModal = (task: Task) => {
    setTaskFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
      category: task.category,
    });
    setEditMode(true);
    setCurrentTaskId(task._id);
    setOpenTaskModal(true);
  };

  // Close task form modal
  const handleCloseTaskModal = () => {
    setOpenTaskModal(false);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (taskId: string) => {
    setTaskToDelete(taskId);
    setOpenDeleteModal(true);
  };

  // Close delete confirmation modal
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setTaskToDelete(null);
  };

  // Handle form submission for creating/editing a task
  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && currentTaskId) {
        // Update existing task
        await axios.put(`/api/tasks/${currentTaskId}`, taskFormData);
      } else {
        // Create new task
        await axios.post('/api/tasks', taskFormData);
      }
      // Close modal and refresh tasks
      handleCloseTaskModal();
      fetchTasks();
    } catch (err) {
      console.error('Failed to save task:', err);
      setError('Failed to save task');
    }
  };

  // Handle task deletion
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await axios.delete(`/api/tasks/${taskToDelete}`);
      handleCloseDeleteModal();
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task');
    }
  };

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Tasks</Typography>
        <Box>
          <IconButton 
            onClick={() => setShowFilters(!showFilters)} 
            color={showFilters ? 'primary' : 'default'}
            sx={{ mr: 1 }}
          >
            <FilterIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  label="Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={filters.priority}
                  label="Priority"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={filters.category}
                  label="Category"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No tasks found
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Get started by adding your first task
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
            sx={{ mt: 2 }}
          >
            Add Task
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" noWrap sx={{ maxWidth: '70%' }}>
                      {task.title}
                    </Typography>
                    <Box>
                      <Chip
                        label={task.priority}
                        size="small"
                        color={getPriorityColor(task.priority) as any}
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={task.status.replace('-', ' ')}
                        size="small"
                        color={getStatusColor(task.status) as any}
                      />
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                    }}
                  >
                    {task.description}
                  </Typography>
                  {task.dueDate && (
                    <Typography variant="body2" color="textSecondary">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                  )}
                  {task.category && (
                    <Chip
                      label={task.category}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={RouterLink}
                    to={`/tasks/${task._id}`}
                  >
                    View Details
                  </Button>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton size="small" onClick={() => handleOpenEditModal(task)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDeleteModal(task._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Task Form Dialog */}
      <Dialog open={openTaskModal} onClose={handleCloseTaskModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <form onSubmit={handleSubmitTask}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              label="Task Title"
              type="text"
              fullWidth
              required
              value={taskFormData.title}
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={taskFormData.description}
              onChange={handleFormChange}
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Status</InputLabel>
                  <Select
                    id="status"
                    name="status"
                    value={taskFormData.status}
                    label="Status"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    id="priority"
                    name="priority"
                    value={taskFormData.priority}
                    label="Priority"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  id="dueDate"
                  name="dueDate"
                  label="Due Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={taskFormData.dueDate}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  id="category"
                  name="category"
                  label="Category"
                  fullWidth
                  value={taskFormData.category}
                  onChange={handleFormChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTaskModal}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button onClick={handleDeleteTask} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 