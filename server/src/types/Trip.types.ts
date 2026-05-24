import { Types } from 'mongoose';

export interface ITrip {
  tripNumber: string;
  vehicle: Types.ObjectId;
  driver: Types.ObjectId;
  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  scheduledDeparture: Date;
  scheduledArrival: Date;
  actualDeparture?: Date;
  actualArrival?: Date;
  status: 'scheduled' | 'loading' | 'in-transit' | 'delivered' | 'completed' | 'cancelled';
  distance: number;
  cargo: {
    description: string;
    weight: number;
    value: number;
    specialInstructions?: string;
  };
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
