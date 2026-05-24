import React, { useEffect, useState } from 'react';
import { Plus, Play, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '@/utils/api';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
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
    } catch (err) {
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
    } catch (err) {
      alert('Failed to update trip progression.');
    }
  };

  const isDispatcherOrAbove = currentUser?.role === 'admin' || currentUser?.role === 'manager' || currentUser?.role === 'dispatcher';

  return (
    <div className="space-y-6">
      {/* Action and Filtering Headers */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40 h-9 text-xs">
          <option value="">All Journeys</option>
          <option value="scheduled">Scheduled</option>
          <option value="loading">Loading</option>
          <option value="in-transit">In-Transit</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
        </Select>

        {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
          <Button onClick={openAddModal} className="h-9 gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Schedule New Trip
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Trip Number</Table.Head>
              <Table.Head>Vehicle / Driver</Table.Head>
              <Table.Head>Route Summary</Table.Head>
              <Table.Head>Scheduled Offset</Table.Head>
              <Table.Head>Cargo details</Table.Head>
              <Table.Head>Status</Table.Head>
              {isDispatcherOrAbove && <Table.Head className="text-right">Dispatch Control</Table.Head>}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {trips.map((t) => (
              <Table.Row key={t._id}>
                <Table.Cell className="font-bold text-gray-900 dark:text-white">{t.tripNumber}</Table.Cell>
                <Table.Cell>
                  <p className="font-bold text-gray-800 dark:text-gray-200 m-0">{t.vehicle?.registrationNumber || 'N/A'}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase mt-0.5">{t.driver?.name || 'N/A'}</p>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-semibold">{t.origin.address}</span>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                    <span className="font-semibold">{t.destination.address}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">Est. Distance: {t.distance} km</p>
                </Table.Cell>
                <Table.Cell className="text-xs">
                  <p className="font-semibold">Dep: {new Date(t.scheduledDeparture).toLocaleString()}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">Arr: {new Date(t.scheduledArrival).toLocaleString()}</p>
                </Table.Cell>
                <Table.Cell>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 m-0">{t.cargo.description}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">Payload: {t.cargo.weight} tons</p>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={t.status === 'completed' ? 'success' : t.status === 'in-transit' ? 'default' : t.status === 'loading' ? 'warning' : 'secondary'}>
                    {t.status}
                  </Badge>
                </Table.Cell>
                {isDispatcherOrAbove && (
                  <Table.Cell className="text-right">
                    {t.status !== 'completed' && t.status !== 'cancelled' && (
                      <Button variant="outline" size="sm" onClick={() => handleProgressStatus(t._id, t.status)} className="h-8 gap-1 border-purple-500/20 text-purple-600 hover:bg-purple-500/5 dark:text-purple-400">
                        {t.status === 'scheduled' ? <Play className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        <span className="capitalize">{t.status === 'scheduled' ? 'Start Loading' : t.status === 'loading' ? 'Dispatch' : t.status === 'in-transit' ? 'Delivered' : 'Complete'}</span>
                      </Button>
                    )}
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Add Dialog Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Logistical Journey">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Select Available Vehicle</label>
              <Select value={vehicle} onChange={(e) => setVehicle(e.target.value)} required>
                <option value="">Choose Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>{v.registrationNumber} ({v.type})</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Select Available Driver</label>
              <Select value={driver} onChange={(e) => setDriver(e.target.value)} required>
                <option value="">Choose Driver</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>{d.name} (License: {d.licenseType})</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Origin Depot</label>
              <Input value={originAddress} onChange={(e) => setOriginAddress(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Destination address</label>
              <Input value={destAddress} onChange={(e) => setDestAddress(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Departure Offset</label>
              <Input type="datetime-local" value={scheduledDeparture} onChange={(e) => setScheduledDeparture(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Arrival Offset</label>
              <Input type="datetime-local" value={scheduledArrival} onChange={(e) => setScheduledArrival(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Est. Distance (km)</label>
              <Input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} required />
            </div>
          </div>
          {/* Cargo particulars */}
          <div className="border-t border-gray-200/50 pt-3 dark:border-gray-800/50">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Cargo Particulars</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Cargo description</label>
                <Input value={cargoDesc} onChange={(e) => setCargoDesc(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Payload (tons)</label>
                <Input type="number" value={cargoWeight} onChange={(e) => setCargoWeight(Number(e.target.value))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Valuation ($)</label>
                <Input type="number" value={cargoVal} onChange={(e) => setCargoVal(Number(e.target.value))} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Special Instructions</label>
                <Input value={cargoInstructions} onChange={(e) => setCargoInstructions(e.target.value)} />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full mt-4">Generate Journey & Schedule</Button>
        </form>
      </Dialog>
    </div>
  );
};

export default Trips;
