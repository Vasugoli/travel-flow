import { Router } from 'express';
import dashboardController from '@/controllers/dashboardController';
import protect from '@/middleware/auth';

const router = Router();

router.use(protect as any);

router.get('/stats', dashboardController.getStats);
router.get('/fleet-status', dashboardController.getFleetStatus);
router.get('/recent-trips', dashboardController.getRecentTrips);
router.get('/compliance-alerts', dashboardController.getComplianceAlerts);
router.get('/monthly-performance', dashboardController.getMonthlyPerformance);

export default router;
