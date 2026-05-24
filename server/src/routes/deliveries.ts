import { Router } from 'express';
import deliveryController from '@/controllers/deliveryController';
import protect from '@/middleware/auth';
import authorize from '@/middleware/roles';

const router = Router();

router.use(protect as any);

router.get('/', deliveryController.getDeliveries);
router.get('/:id', deliveryController.getDeliveryById);

// Dispatchers/all logged in users can update delivery status
router.patch('/:id/status', deliveryController.updateDeliveryStatus);

// Admin / Manager Only Routes
router.post('/', authorize('admin', 'manager') as any, deliveryController.createDelivery);
router.put('/:id', authorize('admin', 'manager') as any, deliveryController.updateDelivery);

// Admin Only Routes
router.delete('/:id', authorize('admin') as any, deliveryController.deleteDelivery);

export default router;
