import { Request, Response } from 'express';
import Vehicle from '@/models/Vehicle';
import Driver from '@/models/Driver';
import Trip from '@/models/Trip';
import Delivery from '@/models/Delivery';

const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalVehicles, activeTrips, pendingDeliveries, totalDrivers] = await Promise.all([
      Vehicle.countDocuments({ status: { $ne: 'retired' } }),
      Trip.countDocuments({ status: { $in: ['loading', 'in-transit', 'delivered'] } }),
      Delivery.countDocuments({ status: 'pending' }),
      Driver.countDocuments({ status: { $ne: 'suspended' } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVehicles,
        activeTrips,
        pendingDeliveries,
        totalDrivers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const getFleetStatus = async (_req: Request, res: Response): Promise<void> => {
  try {
    const statuses: ('available' | 'in-transit' | 'maintenance' | 'retired')[] = [
      'available',
      'in-transit',
      'maintenance',
      'retired',
    ];
    const counts = await Promise.all(
      statuses.map((status) => Vehicle.countDocuments({ status }))
    );

    const data = statuses.map((status, index) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: counts[index],
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const getRecentTrips = async (_req: Request, res: Response): Promise<void> => {
  try {
    const trips = await Trip.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('vehicle', 'registrationNumber type')
      .populate('driver', 'name phone');

    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const getComplianceAlerts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const vehicles = await Vehicle.find({
      status: { $ne: 'retired' },
      $or: [
        { insuranceExpiry: { $lte: thirtyDaysFromNow } },
        { fitnessExpiry: { $lte: thirtyDaysFromNow } },
        { permitExpiry: { $lte: thirtyDaysFromNow } },
      ],
    }).select('registrationNumber insuranceExpiry fitnessExpiry permitExpiry');

    const alerts = vehicles.map((vehicle) => {
      const issues: string[] = [];
      const now = new Date();

      if (vehicle.insuranceExpiry <= thirtyDaysFromNow) {
        issues.push(`Insurance expires in ${Math.ceil((vehicle.insuranceExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days`);
      }
      if (vehicle.fitnessExpiry <= thirtyDaysFromNow) {
        issues.push(`Fitness certificate expires in ${Math.ceil((vehicle.fitnessExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days`);
      }
      if (vehicle.permitExpiry <= thirtyDaysFromNow) {
        issues.push(`Route permit expires in ${Math.ceil((vehicle.permitExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days`);
      }

      return {
        id: vehicle._id,
        registrationNumber: vehicle.registrationNumber,
        issues,
      };
    });

    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const getMonthlyPerformance = async (_req: Request, res: Response): Promise<void> => {
  try {
    const monthlyStats = await Delivery.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'failed'] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = monthlyStats.reduce((acc: any[], item: any) => {
      const monthLabel = `${months[item._id.month - 1]} ${item._id.year}`;
      let monthObj = acc.find((m) => m.month === monthLabel);

      if (!monthObj) {
        monthObj = { month: monthLabel, delivered: 0, failed: 0 };
        acc.push(monthObj);
      }

      if (item._id.status === 'delivered') {
        monthObj.delivered = item.count;
      } else if (item._id.status === 'failed') {
        monthObj.failed = item.count;
      }

      return acc;
    }, []);

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const dashboardController = {
  getStats,
  getFleetStatus,
  getRecentTrips,
  getComplianceAlerts,
  getMonthlyPerformance,
};

export default dashboardController;
