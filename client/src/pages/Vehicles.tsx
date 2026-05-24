import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '@/utils/api';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Table from '@/components/ui/table';
import Dialog from '@/components/ui/dialog';
import Select from '@/components/ui/select';

const Vehicles: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Dialog Modals State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');

  // Form Fields
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [type, setType] = useState<string>('truck');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [year, setYear] = useState<number>(2023);
  const [capacityVal, setCapacityVal] = useState<number>(10);
  const [capacityUnit, setCapacityUnit] = useState<string>('ton');
  const [status, setStatus] = useState<string>('available');
  const [fuelType, setFuelType] = useState<string>('diesel');
  const [mileage, setMileage] = useState<number>(0);
  const [insuranceExpiry, setInsuranceExpiry] = useState<string>('');
  const [fitnessExpiry, setFitnessExpiry] = useState<string>('');
  const [permitExpiry, setPermitExpiry] = useState<string>('');
  const [assignedDriver, setAssignedDriver] = useState<string>('');

  const fetchVehiclesAndDrivers = async () => {
    try {
      const typeParam = typeFilter ? `?type=${typeFilter}` : '';
      const statusParam = statusFilter ? `${typeFilter ? '&' : '?'}status=${statusFilter}` : '';
      const [vehiclesRes, driversRes] = await Promise.all([
        api.get(`/vehicles${typeParam}${statusParam}`),
        api.get('/drivers?status=available'),
      ]);

      if (vehiclesRes.data.success) setVehicles(vehiclesRes.data.data);
      if (driversRes.data.success) setDrivers(driversRes.data.data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiclesAndDrivers();
  }, [typeFilter, statusFilter]);

  const openAddModal = () => {
    setIsEditMode(false);
    setRegistrationNumber('');
    setType('truck');
    setMake('');
    setModel('');
    setYear(2023);
    setCapacityVal(10);
    setCapacityUnit('ton');
    setStatus('available');
    setFuelType('diesel');
    setMileage(0);
    setInsuranceExpiry('');
    setFitnessExpiry('');
    setPermitExpiry('');
    setAssignedDriver('');
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: any) => {
    setIsEditMode(true);
    setSelectedId(vehicle._id);
    setRegistrationNumber(vehicle.registrationNumber);
    setType(vehicle.type);
    setMake(vehicle.make);
    setModel(vehicle.model);
    setYear(vehicle.year);
    setCapacityVal(vehicle.capacity.value);
    setCapacityUnit(vehicle.capacity.unit);
    setStatus(vehicle.status);
    setFuelType(vehicle.fuelType);
    setMileage(vehicle.mileage);
    setInsuranceExpiry(vehicle.insuranceExpiry.slice(0, 10));
    setFitnessExpiry(vehicle.fitnessExpiry.slice(0, 10));
    setPermitExpiry(vehicle.permitExpiry.slice(0, 10));
    setAssignedDriver(vehicle.assignedDriver?._id || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      registrationNumber,
      type,
      make,
      model,
      year,
      capacity: { value: capacityVal, unit: capacityUnit },
      status,
      fuelType,
      mileage,
      insuranceExpiry,
      fitnessExpiry,
      permitExpiry,
      assignedDriver: assignedDriver || null,
    };

    try {
      if (isEditMode) {
        await api.put(`/vehicles/${selectedId}`, payload);
      } else {
        await api.post('/vehicles', payload);
      }
      setIsModalOpen(false);
      fetchVehiclesAndDrivers();
    } catch (err) {
      alert('Error saving vehicle records.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to retire and delete this vehicle?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehiclesAndDrivers();
      } catch (err) {
        alert('Failed to delete vehicle.');
      }
    }
  };

  const isExchangingAllowed = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Filtering and Actions Headers */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-40 h-9 text-xs">
            <option value="">All Vehicle Types</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="trailer">Trailer</option>
            <option value="pickup">Pickup</option>
            <option value="container">Container</option>
          </Select>

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40 h-9 text-xs">
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="in-transit">In-Transit</option>
            <option value="maintenance">Maintenance</option>
          </Select>
        </div>

        {isExchangingAllowed && (
          <Button onClick={openAddModal} className="h-9 gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Add New Vehicle
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
              <Table.Head>Registration</Table.Head>
              <Table.Head>Type</Table.Head>
              <Table.Head>Make/Model</Table.Head>
              <Table.Head>Capacity</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Assigned Driver</Table.Head>
              {isExchangingAllowed && <Table.Head className="text-right">Actions</Table.Head>}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {vehicles.map((v) => (
              <Table.Row key={v._id}>
                <Table.Cell className="font-bold tracking-wide text-gray-900 dark:text-white">
                  {v.registrationNumber}
                </Table.Cell>
                <Table.Cell className="capitalize">{v.type}</Table.Cell>
                <Table.Cell>{v.make} {v.model} ({v.year})</Table.Cell>
                <Table.Cell>{v.capacity.value} {v.capacity.unit}</Table.Cell>
                <Table.Cell>
                  <Badge variant={v.status === 'available' ? 'success' : v.status === 'in-transit' ? 'default' : 'warning'}>
                    {v.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="font-semibold text-gray-800 dark:text-gray-200">
                  {v.assignedDriver?.name || <span className="text-xs text-gray-400 font-normal">Unassigned</span>}
                </Table.Cell>
                {isExchangingAllowed && (
                  <Table.Cell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(v)} className="h-8 w-8 rounded-lg">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {currentUser?.role === 'admin' && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(v._id)} className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Add / Edit dialog modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Vehicle Records' : 'Register New Fleet Vehicle'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Plates Registration</label>
              <Input value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Vehicle Type</label>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="trailer">Trailer</option>
                <option value="pickup">Pickup</option>
                <option value="container">Container</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Make Manufacturer</label>
              <Input value={make} onChange={(e) => setMake(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Model Name</label>
              <Input value={model} onChange={(e) => setModel(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Year</label>
              <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Capacity</label>
              <Input type="number" value={capacityVal} onChange={(e) => setCapacityVal(Number(e.target.value))} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Unit</label>
              <Select value={capacityUnit} onChange={(e) => setCapacityUnit(e.target.value)}>
                <option value="ton">Tons</option>
                <option value="kg">kg</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Fuel Type</label>
              <Select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="cng">CNG</option>
                <option value="electric">Electric</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Mileage (km)</label>
              <Input type="number" value={mileage} onChange={(e) => setMileage(Number(e.target.value))} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="available">Available</option>
                <option value="in-transit">In-Transit</option>
                <option value="maintenance">Maintenance</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Insurance Expiry</label>
              <Input type="date" value={insuranceExpiry} onChange={(e) => setInsuranceExpiry(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Fitness Expiry</label>
              <Input type="date" value={fitnessExpiry} onChange={(e) => setFitnessExpiry(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Permit Expiry</label>
              <Input type="date" value={permitExpiry} onChange={(e) => setPermitExpiry(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Assign Driver</label>
            <Select value={assignedDriver} onChange={(e) => setAssignedDriver(e.target.value)}>
              <option value="">No Driver Assigned</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>{d.name} (Exp: {d.experience}y)</option>
              ))}
            </Select>
          </div>
          <Button type="submit" className="w-full mt-4">Save Vehicle Info</Button>
        </form>
      </Dialog>
    </div>
  );
};

export default Vehicles;
