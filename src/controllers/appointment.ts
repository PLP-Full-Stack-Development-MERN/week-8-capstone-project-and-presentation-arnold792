import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Appointment, { IAppointment } from '../models/Appointment';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctor, dateTime, type, symptoms, notes } = req.body;

    // Verify doctor exists and is a doctor
    const doctorUser = await User.findOne({ _id: doctor, role: 'doctor' });
    if (!doctorUser) {
      return res.status(400).json({ message: 'Invalid doctor selected' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      dateTime,
      type,
      symptoms,
      notes,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error in createAppointment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all appointments for a user (patient or doctor)
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.user.role === 'doctor' 
      ? { doctor: req.user._id }
      : { patient: req.user._id };

    const appointments = await Appointment.find(query)
      .populate('doctor', 'firstName lastName')
      .populate('patient', 'firstName lastName')
      .sort({ dateTime: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error in getAppointments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'firstName lastName')
      .populate('patient', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission to view this appointment
    if (
      appointment.patient.toString() !== req.user._id.toString() &&
      appointment.doctor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error in getAppointment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission to update this appointment
    if (
      appointment.patient.toString() !== req.user._id.toString() &&
      appointment.doctor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate('doctor', 'firstName lastName')
      .populate('patient', 'firstName lastName');

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error in updateAppointment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission to delete this appointment
    if (
      appointment.patient.toString() !== req.user._id.toString() &&
      appointment.doctor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }

    await appointment.remove();
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    console.error('Error in deleteAppointment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 