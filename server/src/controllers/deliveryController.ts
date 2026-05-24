import { Request, Response } from 'express';
import Delivery from '@/models/Delivery';

const getDeliveries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, priority } = req.query;
    const query: Record<string, any> = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const deliveries = await Delivery.find(query).populate({
      path: 'trip',
      populate: [
        { path: 'vehicle', select: 'registrationNumber type' },
        { path: 'driver', select: 'name phone' },
      ],
    });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const getDeliveryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate({
      path: 'trip',
      populate: [
        { path: 'vehicle', select: 'registrationNumber type' },
        { path: 'driver', select: 'name phone' },
      ],
    });

    if (!delivery) {
      res.status(404).json({ success: false, message: 'Delivery not found' });
      return;
    }

    res.status(200).json({ success: true, data: delivery });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const createDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const delivery = await Delivery.create(req.body);
    res.status(201).json({ success: true, data: delivery });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

const updateDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!delivery) {
      res.status(404).json({ success: false, message: 'Delivery not found' });
      return;
    }

    res.status(200).json({ success: true, data: delivery });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

const updateDeliveryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, proofOfDelivery, failureReason, rescheduledDate } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      res.status(404).json({ success: false, message: 'Delivery not found' });
      return;
    }

    delivery.status = status;

    if (status === 'delivered') {
      delivery.proofOfDelivery = {
        recipientName: proofOfDelivery?.recipientName || delivery.consignee.name,
        signatureObtained: proofOfDelivery?.signatureObtained || true,
        notes: proofOfDelivery?.notes || '',
        deliveredAt: new Date(),
      };
      delivery.failureReason = undefined;
    } else if (status === 'failed') {
      delivery.failureReason = failureReason || 'Unknown delivery failure';
      if (rescheduledDate) {
        delivery.rescheduledDate = new Date(rescheduledDate);
      }
    }

    await delivery.save();

    res.status(200).json({ success: true, data: delivery });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

const deleteDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!delivery) {
      res.status(404).json({ success: false, message: 'Delivery not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const deliveryController = {
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  updateDeliveryStatus,
  deleteDelivery,
};

export default deliveryController;
