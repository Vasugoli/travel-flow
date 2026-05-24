import { Schema, model } from 'mongoose';
import { ITrip } from '@/types/Trip.types';

const TripSchema = new Schema<ITrip>(
  {
    tripNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver is required'],
    },
    origin: {
      address: {
        type: String,
        required: [true, 'Origin address is required'],
        trim: true,
      },
      lat: {
        type: Number,
        required: [true, 'Origin latitude is required'],
      },
      lng: {
        type: Number,
        required: [true, 'Origin longitude is required'],
      },
    },
    destination: {
      address: {
        type: String,
        required: [true, 'Destination address is required'],
        trim: true,
      },
      lat: {
        type: Number,
        required: [true, 'Destination latitude is required'],
      },
      lng: {
        type: Number,
        required: [true, 'Destination longitude is required'],
      },
    },
    scheduledDeparture: {
      type: Date,
      required: [true, 'Scheduled departure date is required'],
    },
    scheduledArrival: {
      type: Date,
      required: [true, 'Scheduled arrival date is required'],
    },
    actualDeparture: {
      type: Date,
    },
    actualArrival: {
      type: Date,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['scheduled', 'loading', 'in-transit', 'delivered', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    distance: {
      type: Number,
      required: [true, 'Distance in km is required'],
      min: [0, 'Distance cannot be negative'],
    },
    cargo: {
      description: {
        type: String,
        required: [true, 'Cargo description is required'],
        trim: true,
      },
      weight: {
        type: Number,
        required: [true, 'Cargo weight is required'],
        min: [0, 'Cargo weight cannot be negative'],
      },
      value: {
        type: Number,
        required: [true, 'Cargo valuation is required'],
        min: [0, 'Cargo value cannot be negative'],
      },
      specialInstructions: {
        type: String,
        trim: true,
      },
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator user ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate unique sequential trip numbers in format: TRP-YYYYMMDD-XXX
TripSchema.pre('save', async function () {
  if (this.isNew && !this.tripNumber) {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const count = await model('Trip').countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const seq = String(count + 1).padStart(3, '0');
    this.tripNumber = `TRP-${dateStr}-${seq}`;
  }
});

const Trip = model<ITrip>('Trip', TripSchema);

export default Trip;
