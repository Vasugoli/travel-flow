import { Response } from 'express';
import { AuthRequest } from '@/types/AuthRequest.types';
import Trip from '@/models/Trip';
import Vehicle from '@/models/Vehicle';
import Driver from '@/models/Driver';

const getTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const query: Record<string, any> = {};

    if (status) query.status = status;

    const trips = await Trip.find(query)
      .populate('vehicle', 'registrationNumber type make model')
      .populate('driver', 'name phone licenseNumber')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const getTripById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicle', 'registrationNumber type make model')
      .populate('driver', 'name phone licenseNumber')
      .populate('createdBy', 'name email');

    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found' });
      return;
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const createTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { vehicle: vehicleId, driver: driverId } = req.body;

    // Check if vehicle is available
    const vehicleObj = await Vehicle.findById(vehicleId);
    if (!vehicleObj || vehicleObj.status !== 'available') {
      res.status(400).json({ success: false, message: 'Assigned vehicle is not available' });
      return;
    }

    // Check if driver is available
    const driverObj = await Driver.findById(driverId);
    if (!driverObj || driverObj.status !== 'available') {
      res.status(400).json({ success: false, message: 'Assigned driver is not available' });
      return;
    }

    const tripData = {
      ...req.body,
      createdBy: req.user?._id,
    };

    const trip = await Trip.create(tripData);

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

const updateTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found' });
      return;
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

const updateTripStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found' });
      return;
    }

    trip.status = status;

    if (status === 'in-transit') {
      trip.actualDeparture = new Date();
      // Lock vehicle & driver
      await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'in-transit' });
      await Driver.findByIdAndUpdate(trip.driver, { status: 'on-trip' });
    } else if (status === 'delivered') {
      trip.actualArrival = new Date();
    } else if (status === 'completed' || status === 'cancelled') {
      if (status === 'completed' && !trip.actualArrival) {
        trip.actualArrival = new Date();
      }
      // Release vehicle & driver
      await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'available' });
      await Driver.findByIdAndUpdate(trip.driver, { status: 'available' });
    }

    await trip.save();

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

const deleteTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found' });
      return;
    }

    // Free resources before deleting
    await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'available' });
    await Driver.findByIdAndUpdate(trip.driver, { status: 'available' });

    await Trip.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Trip cancelled and deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const tripController = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  updateTripStatus,
  deleteTrip,
};

export default tripController;
