import React, { useEffect, useState } from 'react';
import { Plus, PenTool } from 'lucide-react';
import api from '@/utils/api';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import StatusBadge from '@/components/ui/StatusBadge';
import Table from '@/components/ui/table';
import Dialog from '@/components/ui/dialog';
import Select from '@/components/ui/select';

const Deliveries: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Dialog Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isPoDModalOpen, setIsPoDModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');

  // Form Fields (Add)
  const [trip, setTrip] = useState<string>('');
  const [consigneeName, setConsigneeName] = useState<string>('');
  const [consigneePhone, setConsigneePhone] = useState<string>('');
  const [consigneeEmail, setConsigneeEmail] = useState<string>('');
  const [consigneeAddress, setConsigneeAddress] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [deliverySlot, setDeliverySlot] = useState<string>('Morning');
  const [priority, setPriority] = useState<string>('medium');

  // PoD Fields (Fulfillment)
  const [podStatus, setPodStatus] = useState<string>('delivered');
  const [recipientName, setRecipientName] = useState<string>('');
  const [signatureObtained, setSignatureObtained] = useState<boolean>(false);
  const [podNotes, setPodNotes] = useState<string>('');
  const [failureReason, setFailureReason] = useState<string>('');
  const [rescheduledDate, setRescheduledDate] = useState<string>('');

  const fetchDeliveriesAndTrips = async () => {
    try {
      const statusParam = statusFilter ? `?status=${statusFilter}` : '';
      const [delRes, tripsRes] = await Promise.all([
        api.get(`/deliveries${statusParam}`),
        api.get('/trips'),
      ]);

      if (delRes.data.success) setDeliveries(delRes.data.data);
      if (tripsRes.data.success) setTrips(tripsRes.data.data.filter((t: any) => t.status !== 'completed' && t.status !== 'cancelled'));
    } catch (err) {
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveriesAndTrips();
  }, [statusFilter]);

  const openAddModal = () => {
    setTrip('');
    setConsigneeName('');
    setConsigneePhone('');
    setConsigneeEmail('');
    setConsigneeAddress('');
    setScheduledDate('');
    setDeliverySlot('Morning');
    setPriority('medium');
    setIsAddModalOpen(true);
  };

  const openPoDModal = (id: string, name: string) => {
    setSelectedId(id);
    setPodStatus('delivered');
    setRecipientName(name);
    setSignatureObtained(false);
    setPodNotes('');
    setFailureReason('');
    setRescheduledDate('');
    setIsPoDModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      trip,
      consignee: { name: consigneeName, phone: consigneePhone, email: consigneeEmail, address: consigneeAddress },
      scheduledDate,
      deliverySlot,
      priority,
    };

    try {
      await api.post('/deliveries', payload);
      setIsAddModalOpen(false);
      fetchDeliveriesAndTrips();
    } catch {
      alert('Error creating delivery order.');
    }
  };

  const handlePoDSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      status: podStatus,
      proofOfDelivery: podStatus === 'delivered' ? { recipientName, signatureObtained, notes: podNotes } : undefined,
      failureReason: podStatus === 'failed' ? failureReason : undefined,
      rescheduledDate: podStatus === 'failed' && rescheduledDate ? rescheduledDate : undefined,
    };

    try {
      await api.patch(`/deliveries/${selectedId}/status`, payload);
      setIsPoDModalOpen(false);
      fetchDeliveriesAndTrips();
    } catch {
      alert('Failed to log Proof of Delivery.');
    }
  };

  const handleDispatch = async (id: string) => {
    try {
      await api.patch(`/deliveries/${id}/status`, { status: 'dispatched' });
      fetchDeliveriesAndTrips();
    } catch {
      alert('Failed to dispatch order.');
    }
  };

  const isExchangingAllowed = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  return (
    <div className="flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-3xl text-text-primary">Deliveries</h1>
          <span className="bg-primary-muted text-primary text-xs font-bold px-2.5 py-1 rounded-full font-mono">
            {deliveries.length}
          </span>
        </div>
        {isExchangingAllowed && (
          <Button onClick={openAddModal} className="h-9 gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Create Delivery Order
          </Button>
        )}
      </div>

      {/* Table Wrapper Card with filter bar */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-elevated/20">
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44 text-xs h-9">
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="dispatched">Dispatched</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Order Code</Table.Head>
                <Table.Head>Consignee Details</Table.Head>
                <Table.Head>Delivery Window</Table.Head>
                <Table.Head>Priority</Table.Head>
                <Table.Head>Linked Trip</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head className="text-right">Fulfillment</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {deliveries.map((d) => (
                <Table.Row key={d._id}>
                  <Table.Cell className="font-mono text-sm font-medium text-text-secondary">{d.deliveryNumber}</Table.Cell>
                  <Table.Cell>
                    <p className="font-bold text-text-primary m-0">{d.consignee.name}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">{d.consignee.address}</p>
                  </Table.Cell>
                  <Table.Cell className="text-xs text-text-secondary font-semibold">
                    {new Date(d.scheduledDate).toLocaleDateString()} ({d.deliverySlot})
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={d.priority} />
                  </Table.Cell>
                  <Table.Cell className="font-mono text-xs font-semibold text-text-secondary">{d.trip?.tripNumber || 'N/A'}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={d.status} />
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="inline-flex gap-2">
                      {d.status === 'pending' && (
                        <Button variant="outline" size="sm" onClick={() => handleDispatch(d._id)} className="h-8 text-xs cursor-pointer">
                          Dispatch
                        </Button>
                      )}
                      {d.status !== 'delivered' && d.status !== 'failed' && d.status !== 'pending' && (
                        <Button variant="default" size="sm" onClick={() => openPoDModal(d._id, d.consignee.name)} className="h-8 text-xs gap-1.5 cursor-pointer">
                          <PenTool size={12} /> PoD Verification
                        </Button>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {/* Add Dialog Modal */}
      <Dialog isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Delivery Dispatch Order">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">Link to Active Trip / Route <span className="text-danger">*</span></label>
            <Select value={trip} onChange={(e) => setTrip(e.target.value)} required>
              <option value="">Select Linked Trip</option>
              {trips.map((t) => (
                <option key={t._id} value={t._id}>{t.tripNumber}: {t.origin.address} &rarr; {t.destination.address}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Consignee Name <span className="text-danger">*</span></label>
              <Input value={consigneeName} onChange={(e) => setConsigneeName(e.target.value)} required placeholder="Client name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Consignee Phone <span className="text-danger">*</span></label>
              <Input value={consigneePhone} onChange={(e) => setConsigneePhone(e.target.value)} required placeholder="Client phone" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">Consignee Email <span className="text-danger">*</span></label>
            <Input type="email" value={consigneeEmail} onChange={(e) => setConsigneeEmail(e.target.value)} required placeholder="client@corporate.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">Delivery Address <span className="text-danger">*</span></label>
            <Input value={consigneeAddress} onChange={(e) => setConsigneeAddress(e.target.value)} required placeholder="Street address, City" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Scheduled Date <span className="text-danger">*</span></label>
              <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Delivery Slot <span className="text-danger">*</span></label>
              <Select value={deliverySlot} onChange={(e) => setDeliverySlot(e.target.value)}>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Priority <span className="text-danger">*</span></label>
              <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full mt-4 h-11">Generate Dispatch Order</Button>
        </form>
      </Dialog>

      {/* PoD Fulfillment Modal */}
      <Dialog isOpen={isPoDModalOpen} onClose={() => setIsPoDModalOpen(false)} title="Fulfill Proof of Delivery (PoD)">
        <form onSubmit={handlePoDSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">Fulfillment Status <span className="text-danger">*</span></label>
            <Select value={podStatus} onChange={(e) => setPodStatus(e.target.value)}>
              <option value="delivered">Delivered Successfully</option>
              <option value="failed">Delivery Failed</option>
            </Select>
          </div>

          {podStatus === 'delivered' ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary">Recipient Name <span className="text-danger">*</span></label>
                <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required placeholder="Who signed for it?" />
              </div>
              <div className="flex items-center gap-2.5 py-2">
                <input
                  type="checkbox"
                  id="sigCheck"
                  checked={signatureObtained}
                  onChange={(e) => setSignatureObtained(e.target.checked)}
                  className="h-5 w-5 text-primary border-border bg-elevated rounded cursor-pointer transition-colors"
                />
                <label htmlFor="sigCheck" className="text-sm font-semibold text-text-primary cursor-pointer select-none">Recipient Signature Verification Obtained</label>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary">Notes / Remarks</label>
                <Input value={podNotes} onChange={(e) => setPodNotes(e.target.value)} placeholder="e.g. Left with reception desk" />
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary">Failure Reason / Remarks <span className="text-danger">*</span></label>
                <Input value={failureReason} onChange={(e) => setFailureReason(e.target.value)} required placeholder="e.g. Consignee closed" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary">Reschedule Date (Optional)</label>
                <Input type="date" value={rescheduledDate} onChange={(e) => setRescheduledDate(e.target.value)} />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full mt-4 h-11">Commit PoD Records</Button>
        </form>
      </Dialog>
    </div>
  );
};

export default Deliveries;
