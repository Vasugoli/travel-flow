import { Types } from 'mongoose';

export interface IDelivery {
  deliveryNumber: string;
  trip: Types.ObjectId;
  consignee: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  scheduledDate: Date;
  deliverySlot: 'Morning' | 'Afternoon' | 'Evening';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'dispatched' | 'out-for-delivery' | 'delivered' | 'failed';
  proofOfDelivery?: {
    recipientName?: string;
    signatureObtained?: boolean;
    notes?: string;
    deliveredAt?: Date;
  };
  failureReason?: string;
  rescheduledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
