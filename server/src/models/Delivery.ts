import { Schema, model } from 'mongoose';
import { IDelivery } from '@/types/Delivery.types';

const DeliverySchema = new Schema<IDelivery>(
  {
    deliveryNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip association is required'],
    },
    consignee: {
      name: {
        type: String,
        required: [true, 'Consignee name is required'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Consignee phone is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Consignee email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      },
      address: {
        type: String,
        required: [true, 'Consignee delivery address is required'],
        trim: true,
      },
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    deliverySlot: {
      type: String,
      required: [true, 'Delivery slot is required'],
      enum: ['Morning', 'Afternoon', 'Evening'],
      default: 'Morning',
    },
    priority: {
      type: String,
      required: [true, 'Priority level is required'],
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      required: [true, 'Delivery status is required'],
      enum: ['pending', 'dispatched', 'out-for-delivery', 'delivered', 'failed'],
      default: 'pending',
    },
    proofOfDelivery: {
      recipientName: { type: String, trim: true },
      signatureObtained: { type: Boolean, default: false },
      notes: { type: String, trim: true },
      deliveredAt: { type: Date },
    },
    failureReason: {
      type: String,
      trim: true,
    },
    rescheduledDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate unique sequential delivery numbers in format: DEL-YYYYMMDD-XXX
DeliverySchema.pre('save', async function () {
  if (this.isNew && !this.deliveryNumber) {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const count = await model('Delivery').countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const seq = String(count + 1).padStart(3, '0');
    this.deliveryNumber = `DEL-${dateStr}-${seq}`;
  }
});

const Delivery = model<IDelivery>('Delivery', DeliverySchema);

export default Delivery;
