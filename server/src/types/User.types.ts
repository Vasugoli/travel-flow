export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'dispatcher';
  isActive: boolean;
  comparePassword(passwordEntered: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}
