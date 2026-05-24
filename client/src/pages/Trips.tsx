import React, { useEffect, useState } from 'react';
import { Plus, Play, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '@/utils/api';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import StatusBadge from '@/components/ui/StatusBadge';
import Table from '@/components/ui/table';
import Dialog from '@/components/ui/dialog';
import Select from '@/components/ui/select';

const Trips: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form Fields
  const [vehicle, setVehicle] = useState<string>('');
  const [driver, setDriver] = useState<string>('');
  const [originAddress, setOriginAddress] = useState<string>('');
  const [destAddress, setDestAddress] = useState<string>('');
  const [scheduledDeparture, setScheduledDeparture] = useState<string>('');
  const [scheduledArrival, setScheduledArrival] = useState<string>('');
  const [distance, setDistance] = useState<number>(0);
  const [cargoDesc, setCargoDesc] = useState<string>('');
  const [cargoWeight, setCargoWeight] = useState<number>(0);
  const [cargoVal, setCargoVal] = useState<number>(0);
  const [cargoInstructions, setCargoInstructions] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const fetchTripsData = async () => {
    try {
      const statusParam = statusFilter ? `?status=${statusFilter}` : '';
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        api.get(`/trips${statusParam}`),
        api.get('/vehicles?status=available'),
        api.get('/drivers?status=available'),
      ]);

      if (tripsRes.data.success) setTrips(tripsRes.data.data);
      if (vehiclesRes.data.success) setVehicles(vehiclesRes.data.data);
      if (driversRes.data.success) setDrivers(driversRes.data.data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripsData();
  }, [statusFilter]);

  const openAddModal = () => {
    setVehicle('');
    setDriver('');
    setOriginAddress('');
    setDestAddress('');
    setScheduledDeparture('');
    setScheduledArrival('');
    setDistance(0);
    setCargoDesc('');
    setCargoWeight(0);
    setCargoVal(0);
    setCargoInstructions('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      vehicle,
      driver,
      origin: { address: originAddress, lat: 12.97, lng: 77.59 },
      destination: { address: destAddress, lat: 13.08, lng: 80.27 },
      scheduledDeparture,
      scheduledArrival,
      distance,
      cargo: {
        description: cargoDesc,
        weight: cargoWeight,
        value: cargoVal,
        specialInstructions: cargoInstructions,
      },
      notes,
    };

    try {
      await api.post('/trips', payload);
      setIsModalOpen(false);
      fetchTripsData();
    } catch {
      alert('Error creating trip schedules.');
    }
  };

  const handleProgressStatus = async (id: string, currentStatus: string) => {
    let nextStatus = '';
    if (currentStatus === 'scheduled') nextStatus = 'loading';
    else if (currentStatus === 'loading') nextStatus = 'in-transit';
    else if (currentStatus === 'in-transit') nextStatus = 'delivered';
    else if (currentStatus === 'delivered') nextStatus = 'completed';

    if (!nextStatus) return;

    try {
      await api.patch(`/trips/${id}/status`, { status: nextStatus });
      fetchTripsData();
    } catch {
      alert('Failed to update trip progression.');
    }
  };

  const isDispatcherOrAbove = currentUser?.role === 'admin' || currentUser?.role === 'manager' || currentUser?.role === 'dispatcher';

  return (
    <div className="flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-3xl text-text-primary">Trips</h1>
          <span className="bg-primary-muted text-primary text-xs font-bold px-2.5 py-1 rounded-full font-mono">
            {trips.length}
          </span>
        </div>
        {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
          <Button onClick={openAddModal} className="h-9 gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Schedule Trip
          </Button>
        )}
      </div>

      {/* Table Wrapper Card with filter bar */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-elevated/20">
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44 text-xs h-9">
              <option value="">All Journeys</option>
              <option value="scheduled">Scheduled</option>
              <option value="loading">Loading</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
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
                <Table.Head>Trip Number</Table.Head>
                <Table.Head>Vehicle / Driver</Table.Head>
                <Table.Head>Route Summary</Table.Head>
                <Table.Head>Scheduled Offset</Table.Head>
                <Table.Head>Cargo Details</Table.Head>
                <Table.Head>Status</Table.Head>
                {isDispatcherOrAbove && <Table.Head className="text-right">Dispatch Control</Table.Head>}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {trips.map((t) => (
                <Table.Row key={t._id}>
                  <Table.Cell className="font-mono text-sm font-medium text-text-secondary">{t.tripNumber}</Table.Cell>
                  <Table.Cell>
                    <p className="font-mono text-sm font-semibold text-text-primary m-0">{t.vehicle?.registrationNumber || 'N/A'}</p>
                    <p className="text-[10px] text-text-secondary font-semibold uppercase mt-0.5">{t.driver?.name || 'N/A'}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1 text-xs text-text-primary font-medium">
                      <span>{t.origin.address}</span>
                      <ChevronRight size={12} className="text-text-tertiary" />
                      <span>{t.destination.address}</span>
                    </div>
                    <p className="text-[10px] text-text-tertiary font-bold mt-0.5">Distance: {t.distance} km</p>
                  </Table.Cell>
                  <Table.Cell className="text-xs text-text-secondary">
                    <p className="font-semibold text-text-primary">Dep: {new Date(t.scheduledDeparture).toLocaleString()}</p>
                    <p className="mt-0.5">Arr: {new Date(t.scheduledArrival).toLocaleString()}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="text-xs font-bold text-text-primary m-0">{t.cargo.description}</p>
                    <p className="text-[10px] text-text-secondary font-bold mt-0.5">Payload: {t.cargo.weight} tons</p>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={t.status} />
                  </Table.Cell>
                  {isDispatcherOrAbove && (
                    <Table.Cell className="text-right">
                      {t.status !== 'completed' && t.status !== 'cancelled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProgressStatus(t._id, t.status)}
                          className="h-8 gap-1.5 text-xs cursor-pointer"
                        >
                          {t.status === 'scheduled' ? <Play size={12} /> : <CheckCircle2 size={12} />}
                          <span className="capitalize">
                            {t.status === 'scheduled' ? 'Start Loading' : t.status === 'loading' ? 'Dispatch' : t.status === 'in-transit' ? 'Delivered' : 'Complete'}
                          </span>
                        </Button>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {/* Add Dialog Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Logistical Journey">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Select Available Vehicle <span className="text-danger">*</span></label>
              <Select value={vehicle} onChange={(e) => setVehicle(e.target.value)} required>
                <option value="">Choose Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>{v.registrationNumber} ({v.type})</option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Select Available Driver <span className="text-danger">*</span></label>
              <Select value={driver} onChange={(e) => setDriver(e.target.value)} required>
                <option value="">Choose Driver</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>{d.name} (License: {d.licenseType})</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Origin Depot <span className="text-danger">*</span></label>
              <Input value={originAddress} onChange={(e) => setOriginAddress(e.target.value)} required placeholder="Origin address" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Destination Address <span className="text-danger">*</span></label>
              <Input value={destAddress} onChange={(e) => setDestAddress(e.target.value)} required placeholder="Destination address" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Departure Offset <span className="text-danger">*</span></label>
              <Input type="datetime-local" value={scheduledDeparture} onChange={(e) => setScheduledDeparture(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Arrival Offset <span className="text-danger">*</span></label>
              <Input type="datetime-local" value={scheduledArrival} onChange={(e) => setScheduledArrival(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Est. Distance (km) <span className="text-danger">*</span></label>
              <Input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} required />
            </div>
          </div>
          {/* Cargo particulars */}
          <div className="border-t border-border pt-3">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Cargo Particulars</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary">Cargo Description <span className="text-danger">*</span></label>
                <Input value={cargoDesc} onChange={(e) => setCargoDesc(e.target.value)} required placeholder="e.g. Steel Sheets" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary">Payload (tons) <span className="text-danger">*</span></label>
                <Input type="number" value={cargoWeight} onChange={(e) => setCargoWeight(Number(e.target.value))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary">Valuation ($) <span className="text-danger">*</span></label>
                <Input type="number" value={cargoVal} onChange={(e) => setCargoVal(Number(e.target.value))} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary">Special Instructions</label>
                <Input value={cargoInstructions} onChange={(e) => setCargoInstructions(e.target.value)} placeholder="Fragile, rush delivery" />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full mt-4 h-11">Generate Journey & Schedule</Button>
        </form>
      </Dialog>
    </div>
  );
};

export default Trips;
