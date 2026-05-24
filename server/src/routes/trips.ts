import { Router } from 'express';
import tripController from '@/controllers/tripController';
import protect from '@/middleware/auth';
import authorize from '@/middleware/roles';

const router = Router();

router.use(protect as any);

router.get('/', tripController.getTrips);
router.get('/:id', tripController.getTripById);

// Status updates can be triggered by Dispatcher as well
router.patch('/:id/status', tripController.updateTripStatus);

// Admin / Manager Only Routes
router.post('/', authorize('admin', 'manager') as any, tripController.createTrip);
router.put('/:id', authorize('admin', 'manager') as any, tripController.updateTrip);

// Admin Only Routes
router.delete('/:id', authorize('admin') as any, tripController.deleteTrip);

export default router;
