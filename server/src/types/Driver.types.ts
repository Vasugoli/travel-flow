import { Types } from 'mongoose';

export interface IDriver {
  name: string;
  licenseNumber: string;
  licenseExpiry: Date;
  licenseType: 'LMV' | 'HMV' | 'HPMV' | 'Transport';
  phone: string;
  email?: string;
  address: string;
  status: 'available' | 'on-trip' | 'off-duty' | 'suspended';
  experience: number;
  rating: number;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  assignedVehicle?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
