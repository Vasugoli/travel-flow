import { Types } from 'mongoose';

export interface IVehicle {
  registrationNumber: string;
  type: 'truck' | 'van' | 'trailer' | 'pickup' | 'tanker' | 'container';
  make: string;
  model: string;
  year: number;
  capacity: {
    value: number;
    unit: string;
  };
  status: 'available' | 'in-transit' | 'maintenance' | 'retired';
  fuelType: 'diesel' | 'petrol' | 'cng' | 'electric';
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
    updatedAt: Date;
  };
  mileage: number;
  lastServiceDate?: Date;
  nextServiceDue?: Date;
  insuranceExpiry: Date;
  fitnessExpiry: Date;
  permitExpiry: Date;
  assignedDriver?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
