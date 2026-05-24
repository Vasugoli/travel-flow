import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import api from '@/utils/api';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Table from '@/components/ui/table';
import Dialog from '@/components/ui/dialog';
import Select from '@/components/ui/select';

const Drivers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Dialog Modals State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');

  // Form Fields
  const [name, setName] = useState<string>('');
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [licenseExpiry, setLicenseExpiry] = useState<string>('');
  const [licenseType, setLicenseType] = useState<string>('Transport');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('available');
  const [experience, setExperience] = useState<number>(5);
  const [rating, setRating] = useState<number>(5);
  const [emergencyContactName, setEmergencyContactName] = useState<string>('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState<string>('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState<string>('');
  const [assignedVehicle, setAssignedVehicle] = useState<string>('');

  const fetchDriversAndVehicles = async () => {
    try {
      const statusParam = statusFilter ? `?status=${statusFilter}` : '';
      const [driversRes, vehiclesRes] = await Promise.all([
        api.get(`/drivers${statusParam}`),
        api.get('/vehicles?status=available'),
      ]);

      if (driversRes.data.success) setDrivers(driversRes.data.data);
      if (vehiclesRes.data.success) setVehicles(vehiclesRes.data.data);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriversAndVehicles();
  }, [statusFilter]);

  const openAddModal = () => {
    setIsEditMode(false);
    setName('');
    setLicenseNumber('');
    setLicenseExpiry('');
    setLicenseType('Transport');
    setPhone('');
    setEmail('');
    setAddress('');
    setStatus('available');
    setExperience(5);
    setRating(5);
    setEmergencyContactName('');
    setEmergencyContactPhone('');
    setEmergencyContactRelation('');
    setAssignedVehicle('');
    setIsModalOpen(true);
  };

  const openEditModal = (driver: any) => {
    setIsEditMode(true);
    setSelectedId(driver._id);
    setName(driver.name);
    setLicenseNumber(driver.licenseNumber);
    setLicenseExpiry(driver.licenseExpiry.slice(0, 10));
    setLicenseType(driver.licenseType);
    setPhone(driver.phone);
    setEmail(driver.email || '');
    setAddress(driver.address);
    setStatus(driver.status);
    setExperience(driver.experience);
    setRating(driver.rating);
    setEmergencyContactName(driver.emergencyContact.name);
    setEmergencyContactPhone(driver.emergencyContact.phone);
    setEmergencyContactRelation(driver.emergencyContact.relation);
    setAssignedVehicle(driver.assignedVehicle?._id || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      licenseNumber,
      licenseExpiry,
      licenseType,
      phone,
      email: email || undefined,
      address,
      status,
      experience,
      rating,
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone,
        relation: emergencyContactRelation,
      },
      assignedVehicle: assignedVehicle || null,
    };

    try {
      if (isEditMode) {
        await api.put(`/drivers/${selectedId}`, payload);
      } else {
        await api.post('/drivers', payload);
      }
      setIsModalOpen(false);
      fetchDriversAndVehicles();
    } catch (err) {
      alert('Error saving driver profile.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to suspend and delete this driver?')) {
      try {
        await api.delete(`/drivers/${id}`);
        fetchDriversAndVehicles();
      } catch (err) {
        alert('Failed to delete driver.');
      }
    }
  };

  const isExchangingAllowed = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Filtering and Actions Headers */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40 h-9 text-xs">
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="on-trip">On-Trip</option>
          <option value="off-duty">Off-Duty</option>
          <option value="suspended">Suspended</option>
        </Select>

        {isExchangingAllowed && (
          <Button onClick={openAddModal} className="h-9 gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Add New Driver
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
              <Table.Head>Driver Name</Table.Head>
              <Table.Head>License Number</Table.Head>
              <Table.Head>License Type</Table.Head>
              <Table.Head>Experience</Table.Head>
              <Table.Head>Rating</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Vehicle</Table.Head>
              {isExchangingAllowed && <Table.Head className="text-right">Actions</Table.Head>}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {drivers.map((d) => (
              <Table.Row key={d._id}>
                <Table.Cell className="font-bold text-gray-900 dark:text-white">{d.name}</Table.Cell>
                <Table.Cell className="font-semibold">{d.licenseNumber}</Table.Cell>
                <Table.Cell>{d.licenseType}</Table.Cell>
                <Table.Cell>{d.experience} Years</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-xs">{d.rating.toFixed(1)}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={d.status === 'available' ? 'success' : d.status === 'on-trip' ? 'default' : 'warning'}>
                    {d.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="font-semibold text-gray-800 dark:text-gray-200">
                  {d.assignedVehicle?.registrationNumber || <span className="text-xs text-gray-400 font-normal">Unassigned</span>}
                </Table.Cell>
                {isExchangingAllowed && (
                  <Table.Cell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(d)} className="h-8 w-8 rounded-lg">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {currentUser?.role === 'admin' && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(d._id)} className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-500/10">
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
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Driver Profile' : 'Register New Driver'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Driver Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Phone Contact</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">License Number</label>
              <Input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">License Expiry</label>
              <Input type="date" value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">License Class</label>
              <Select value={licenseType} onChange={(e) => setLicenseType(e.target.value)}>
                <option value="LMV">LMV</option>
                <option value="HMV">HMV</option>
                <option value="HPMV">HPMV</option>
                <option value="Transport">Transport</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Experience (yrs)</label>
              <Input type="number" value={experience} onChange={(e) => setExperience(Number(e.target.value))} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="available">Available</option>
                <option value="on-trip">On-Trip</option>
                <option value="off-duty">Off-Duty</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email Address (Optional)</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Residential Address</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          {/* Emergency Contact Header */}
          <div className="border-t border-gray-200/50 pt-3 dark:border-gray-800/50">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Emergency Contact Details</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</label>
                <Input value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Phone</label>
                <Input value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Relation</label>
                <Input value={emergencyContactRelation} onChange={(e) => setEmergencyContactRelation(e.target.value)} required />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Assign Vehicle</label>
            <Select value={assignedVehicle} onChange={(e) => setAssignedVehicle(e.target.value)}>
              <option value="">No Vehicle Assigned</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>{v.registrationNumber} ({v.type})</option>
              ))}
            </Select>
          </div>
          <Button type="submit" className="w-full mt-4">Save Driver Profile</Button>
        </form>
      </Dialog>
    </div>
  );
};

export default Drivers;
