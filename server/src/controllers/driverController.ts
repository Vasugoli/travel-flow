import { Request, Response } from 'express';
import Driver from '@/models/Driver';

const getDrivers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const query: Record<string, any> = {};

    if (status) query.status = status;

    const drivers = await Driver.find(query).populate('assignedVehicle', 'registrationNumber type make model');

    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const getDriverById = async (req: Request, res: Response): Promise<void> => {
  try {
    const driver = await Driver.findById(req.params.id).populate('assignedVehicle', 'registrationNumber type make model');

    if (!driver) {
      res.status(404).json({ success: false, message: 'Driver not found' });
      return;
    }

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const createDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

const updateDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!driver) {
      res.status(404).json({ success: false, message: 'Driver not found' });
      return;
    }

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

const updateDriverStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!['available', 'on-trip', 'off-duty', 'suspended'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status value' });
      return;
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!driver) {
      res.status(404).json({ success: false, message: 'Driver not found' });
      return;
    }

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

const deleteDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      res.status(404).json({ success: false, message: 'Driver not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const driverController = {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  updateDriverStatus,
  deleteDriver,
};

export default driverController;
