import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctorProfile extends Document {
  user: mongoose.Types.ObjectId;
  specialization: string;
  qualifications: string[];
  experience: number; // in years
  availableSlots: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  consultationFee: number;
  rating: number;
  reviews: {
    patient: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    date: Date;
  }[];
  about: string;
  languages: string[];
  acceptingNewPatients: boolean;
}

const doctorProfileSchema = new Schema<IDoctorProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    qualifications: [{
      type: String,
      required: true,
      trim: true,
    }],
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    availableSlots: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    }],
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [{
      patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }],
    about: {
      type: String,
      trim: true,
    },
    languages: [{
      type: String,
      trim: true,
    }],
    acceptingNewPatients: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
doctorProfileSchema.index({ specialization: 1 });
doctorProfileSchema.index({ rating: -1 });

export default mongoose.model<IDoctorProfile>('DoctorProfile', doctorProfileSchema); 