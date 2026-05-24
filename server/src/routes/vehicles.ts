import { Router } from 'express';
import vehicleController from '@/controllers/vehicleController';
import protect from '@/middleware/auth';
import authorize from '@/middleware/roles';

const router = Router();

router.use(protect as any);

router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Admin / Manager Only Routes
router.post('/', authorize('admin', 'manager') as any, vehicleController.createVehicle);
router.put('/:id', authorize('admin', 'manager') as any, vehicleController.updateVehicle);
router.patch('/:id/status', authorize('admin', 'manager') as any, vehicleController.updateVehicleStatus);

// Admin Only Routes
router.delete('/:id', authorize('admin') as any, vehicleController.deleteVehicle);

export default router;
