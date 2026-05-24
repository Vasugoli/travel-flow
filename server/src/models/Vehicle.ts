import { Schema, model } from 'mongoose';
import { IVehicle } from '@/types/Vehicle.types';

const VehicleSchema = new Schema<IVehicle>(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: ['truck', 'van', 'trailer', 'pickup', 'tanker', 'container'],
    },
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1990, 'Year must be after 1990'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    capacity: {
      value: {
        type: Number,
        required: [true, 'Capacity value is required'],
        min: [0, 'Capacity cannot be negative'],
      },
      unit: {
        type: String,
        required: [true, 'Capacity unit is required'],
        default: 'ton',
        trim: true,
      },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['available', 'in-transit', 'maintenance', 'retired'],
      default: 'available',
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['diesel', 'petrol', 'cng', 'electric'],
    },
    currentLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
      address: { type: String, default: 'Garage', trim: true },
      updatedAt: { type: Date, default: Date.now },
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage cannot be negative'],
      default: 0,
    },
    lastServiceDate: {
      type: Date,
    },
    nextServiceDue: {
      type: Date,
    },
    insuranceExpiry: {
      type: Date,
      required: [true, 'Insurance expiry date is required'],
    },
    fitnessExpiry: {
      type: Date,
      required: [true, 'Fitness certificate expiry date is required'],
    },
    permitExpiry: {
      type: Date,
      required: [true, 'Route permit expiry date is required'],
    },
    assignedDriver: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = model<IVehicle>('Vehicle', VehicleSchema);

export default Vehicle;
