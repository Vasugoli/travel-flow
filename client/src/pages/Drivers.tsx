import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import api from '@/utils/api';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import StatusBadge from '@/components/ui/StatusBadge';
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
    } catch {
      alert('Error saving driver profile.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to suspend and delete this driver?')) {
      try {
        await api.delete(`/drivers/${id}`);
        fetchDriversAndVehicles();
      } catch {
        alert('Failed to delete driver.');
      }
    }
  };

  const isExchangingAllowed = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  return (
    <div className="flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-3xl text-text-primary">Drivers</h1>
          <span className="bg-primary-muted text-primary text-xs font-bold px-2.5 py-1 rounded-full font-mono">
            {drivers.length}
          </span>
        </div>
        {isExchangingAllowed && (
          <Button onClick={openAddModal} className="h-9 gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Add Driver
          </Button>
        )}
      </div>

      {/* Table Wrapper Card with filter bar */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
        {/* Table header bar (search + actions) */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-elevated/20">
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44 text-xs h-9">
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="on-trip">On Trip</option>
              <option value="off-duty">Off Duty</option>
              <option value="suspended">Suspended</option>
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
                  <Table.Cell className="text-sm font-medium text-text-primary">{d.name}</Table.Cell>
                  <Table.Cell className="font-mono text-sm font-medium text-text-secondary">{d.licenseNumber}</Table.Cell>
                  <Table.Cell className="text-sm text-text-secondary capitalize">{d.licenseType}</Table.Cell>
                  <Table.Cell className="text-sm text-text-primary tabular-nums">{d.experience} Years</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1">
                      <Star size={13} className="fill-warning text-warning" />
                      <span className="text-xs font-bold text-text-primary tabular-nums">{d.rating.toFixed(1)}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={d.status} />
                  </Table.Cell>
                  <Table.Cell className="font-mono text-sm font-semibold text-text-secondary">
                    {d.assignedVehicle?.registrationNumber || <span className="text-xs text-text-tertiary font-normal">Unassigned</span>}
                  </Table.Cell>
                  {isExchangingAllowed && (
                    <Table.Cell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(d)} className="h-8 w-8 rounded-lg cursor-pointer">
                          <Edit2 className="h-4 w-4 text-text-secondary group-hover:text-text-primary" />
                        </Button>
                        {currentUser?.role === 'admin' && (
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(d._id)} className="h-8 w-8 rounded-lg cursor-pointer">
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
      </div>

      {/* Add / Edit dialog modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Driver Profile' : 'Register New Driver'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Driver Full Name <span className="text-danger">*</span></label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. John Doe" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Phone Contact <span className="text-danger">*</span></label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="e.g. +91 9876543210" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">License Number <span className="text-danger">*</span></label>
              <Input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} required placeholder="e.g. DL-123456789" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">License Expiry <span className="text-danger">*</span></label>
              <Input type="date" value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">License Class <span className="text-danger">*</span></label>
              <Select value={licenseType} onChange={(e) => setLicenseType(e.target.value)}>
                <option value="LMV">LMV</option>
                <option value="HMV">HMV</option>
                <option value="HPMV">HPMV</option>
                <option value="Transport">Transport</option>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Experience (yrs) <span className="text-danger">*</span></label>
              <Input type="number" value={experience} onChange={(e) => setExperience(Number(e.target.value))} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Status <span className="text-danger">*</span></label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="available">Available</option>
                <option value="on-trip">On Trip</option>
                <option value="off-duty">Off Duty</option>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">Email Address (Optional)</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john.doe@transport.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">Residential Address <span className="text-danger">*</span></label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Street address, City" />
          </div>
          {/* Emergency Contact Header */}
          <div className="border-t border-border pt-3">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Emergency Contact Details</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary">Name <span className="text-danger">*</span></label>
                <Input value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} required placeholder="Contact Name" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary">Phone <span className="text-danger">*</span></label>
                <Input value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} required placeholder="Contact Phone" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary">Relation <span className="text-danger">*</span></label>
                <Input value={emergencyContactRelation} onChange={(e) => setEmergencyContactRelation(e.target.value)} required placeholder="e.g. Spouse" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">Assign Vehicle</label>
            <Select value={assignedVehicle} onChange={(e) => setAssignedVehicle(e.target.value)}>
              <option value="">No Vehicle Assigned</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>{v.registrationNumber} ({v.type})</option>
              ))}
            </Select>
          </div>
          <Button type="submit" className="w-full mt-4 h-11">Save Driver Profile</Button>
        </form>
      </Dialog>
    </div>
  );
};

export default Drivers;
