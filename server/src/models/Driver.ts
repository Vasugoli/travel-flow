import { Schema, model } from 'mongoose';
import { IDriver } from '@/types/Driver.types';

const DriverSchema = new Schema<IDriver>(
  {
    name: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    licenseExpiry: {
      type: Date,
      required: [true, 'License expiry date is required'],
    },
    licenseType: {
      type: String,
      required: [true, 'License type is required'],
      enum: ['LMV', 'HMV', 'HPMV', 'Transport'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['available', 'on-trip', 'off-duty', 'suspended'],
      default: 'available',
    },
    experience: {
      type: Number,
      required: [true, 'Experience years are required'],
      min: [0, 'Experience cannot be negative'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 5,
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, 'Emergency contact name is required'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Emergency contact phone is required'],
        trim: true,
      },
      relation: {
        type: String,
        required: [true, 'Emergency contact relation is required'],
        trim: true,
      },
    },
    assignedVehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Driver = model<IDriver>('Driver', DriverSchema);

export default Driver;
