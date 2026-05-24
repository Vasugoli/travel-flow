import { Router } from 'express';
import driverController from '@/controllers/driverController';
import protect from '@/middleware/auth';
import authorize from '@/middleware/roles';

const router = Router();

router.use(protect as any);

router.get('/', driverController.getDrivers);
router.get('/:id', driverController.getDriverById);

// Admin / Manager Only Routes
router.post('/', authorize('admin', 'manager') as any, driverController.createDriver);
router.put('/:id', authorize('admin', 'manager') as any, driverController.updateDriver);
router.patch('/:id/status', authorize('admin', 'manager') as any, driverController.updateDriverStatus);

// Admin Only Routes
router.delete('/:id', authorize('admin') as any, driverController.deleteDriver);

export default router;
