import { Request } from 'express';
import { IUser } from '@/types/User.types';

export interface AuthRequest extends Request {
  user?: IUser;
}
