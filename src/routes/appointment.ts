import express from 'express';
import { body } from 'express-validator';
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointment';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const appointmentValidation = [
  body('doctor').notEmpty().withMessage('Doctor is required'),
  body('dateTime').notEmpty().withMessage('Date and time are required'),
  body('type')
    .isIn(['in-person', 'telemedicine'])
    .withMessage('Invalid appointment type'),
  body('symptoms').optional().isArray().withMessage('Symptoms must be an array'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
];

// Apply protection to all routes
router.use(protect);

// Routes
router.route('/')
  .post(appointmentValidation, createAppointment)
  .get(getAppointments);

router.route('/:id')
  .get(getAppointment)
  .put(appointmentValidation, updateAppointment)
  .delete(deleteAppointment);

export default router; 