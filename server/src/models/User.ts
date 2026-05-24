import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '@/types/User.types';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'dispatcher'],
      default: 'dispatcher',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving using a Promise-based async hook
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = (await bcrypt.hash(this.password, salt)) as string;
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (passwordEntered: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(passwordEntered, this.password);
};

const User = model<IUser>('User', UserSchema);

export default User;
