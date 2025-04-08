import { Request, Response } from 'express';
import Task from '../models/Task';

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, dueDate, category } = req.body;
    const userId = (req as any).user.userId; // From auth middleware

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      category,
      userId
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

// Get all tasks for a user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { status, priority, category, search } = req.query;

    let query: any = { userId };

    // Add filters if provided
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query).sort({ dueDate: 1, priority: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Get a single task
export const getTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const userId = (req as any).user.userId;

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const userId = (req as any).user.userId;
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const userId = (req as any).user.userId;

    const task = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
}; 