import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '@/config/db';
import User from '@/models/User';
import Vehicle from '@/models/Vehicle';
import Driver from '@/models/Driver';
import Trip from '@/models/Trip';
import Delivery from '@/models/Delivery';

dotenv.config();

const seed = async (): Promise<void> => {
  try {
    await connectDB();

    console.log('🧹 Wiping existing collections...');
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});
    await Trip.deleteMany({});
    await Delivery.deleteMany({});

    console.log('👤 Seeding Users...');
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'admin@transport.com',
        password: 'admin123',
        role: 'admin',
        isActive: true,
      },
      {
        name: 'Regional Manager',
        email: 'manager@transport.com',
        password: 'manager123',
        role: 'manager',
        isActive: true,
      },
      {
        name: 'Dispatcher Staff',
        email: 'dispatcher@transport.com',
        password: 'dispatch123',
        role: 'dispatcher',
        isActive: true,
      },
    ]);

    console.log('🚗 Seeding Vehicles...');
    const vehicles = await Vehicle.create([
      {
        registrationNumber: 'KA-01-ME-1234',
        type: 'truck',
        make: 'Tata',
        model: 'Prima 5530.S',
        year: 2022,
        capacity: { value: 25, unit: 'ton' },
        status: 'available',
        fuelType: 'diesel',
        currentLocation: { lat: 12.9716, lng: 77.5946, address: 'Bengaluru Logistics Hub', updatedAt: new Date() },
        mileage: 45200,
        insuranceExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Expres in 15 days (triggers alert)
        fitnessExpiry: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        permitExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
      {
        registrationNumber: 'DL-03-CA-5678',
        type: 'container',
        make: 'Mahindra',
        model: 'Blazo X 49',
        year: 2023,
        capacity: { value: 30, unit: 'ton' },
        status: 'available',
        fuelType: 'diesel',
        currentLocation: { lat: 28.7041, lng: 77.1025, address: 'Delhi Yard', updatedAt: new Date() },
        mileage: 18400,
        insuranceExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        fitnessExpiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Expires in 10 days (triggers alert)
        permitExpiry: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      },
      {
        registrationNumber: 'MH-12-PQ-9012',
        type: 'pickup',
        make: 'Ashok Leyland',
        model: 'Dost+',
        year: 2021,
        capacity: { value: 1.5, unit: 'ton' },
        status: 'maintenance',
        fuelType: 'cng',
        currentLocation: { lat: 18.5204, lng: 73.8567, address: 'Pune Workshop', updatedAt: new Date() },
        mileage: 62000,
        insuranceExpiry: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000),
        fitnessExpiry: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
        permitExpiry: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // Expires in 25 days (triggers alert)
      },
    ]);

    console.log('👨‍✈️ Seeding Drivers...');
    const drivers = await Driver.create([
      {
        name: 'Rajesh Kumar',
        licenseNumber: 'DL-1420180098765',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        licenseType: 'Transport',
        phone: '+919876543210',
        email: 'rajesh.k@gmail.com',
        address: 'Sector 15, Dwarka, New Delhi',
        status: 'available',
        experience: 12,
        rating: 4.8,
        emergencyContact: { name: 'Sunita Devi', phone: '+919876543211', relation: 'Spouse' },
      },
      {
        name: 'Amit Patel',
        licenseNumber: 'MH-1220150043210',
        licenseExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        licenseType: 'HMV',
        phone: '+918765432109',
        email: 'amit.p@gmail.com',
        address: 'Hinjewadi Phase 2, Pune',
        status: 'available',
        experience: 8,
        rating: 4.5,
        emergencyContact: { name: 'Vikram Patel', phone: '+918765432108', relation: 'Brother' },
      },
    ]);

    // Relate Driver 1 and Vehicle 1
    vehicles[0].assignedDriver = drivers[0]._id as mongoose.Types.ObjectId;
    await vehicles[0].save();
    drivers[0].assignedVehicle = vehicles[0]._id as mongoose.Types.ObjectId;
    await drivers[0].save();

    console.log('🗺️ Seeding Trips...');
    const trip = await Trip.create({
      vehicle: vehicles[0]._id,
      driver: drivers[0]._id,
      origin: { address: 'Bengaluru Logistics Hub', lat: 12.9716, lng: 77.5946 },
      destination: { address: 'Chennai Port Terminal', lat: 13.0827, lng: 80.2707 },
      scheduledDeparture: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      scheduledArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'scheduled',
      distance: 350,
      cargo: {
        description: 'Electronic components for export',
        weight: 12.5,
        value: 1500000,
        specialInstructions: 'Fragile. Keep dry.',
      },
      createdBy: users[1]._id,
    });

    console.log('📦 Seeding Deliveries...');
    await Delivery.create({
      trip: trip._id,
      consignee: {
        name: 'Global Exports Ltd',
        phone: '+919988776655',
        email: 'logistics@globalexports.com',
        address: 'Warehouse A3, Chennai Port, Chennai',
      },
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      deliverySlot: 'Morning',
      priority: 'high',
      status: 'pending',
    });

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error(`❌ Seeding Error: ${(error as Error).message}`);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
};

export default seed;

seed();

