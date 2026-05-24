import React, { useEffect, useState } from 'react';
import {
  Truck,
  Users,
  Compass,
  Package,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import api from '@/utils/api';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';

interface KPIStats {
  totalVehicles: number;
  activeTrips: number;
  pendingDeliveries: number;
  totalDrivers: number;
}

interface ComplianceAlert {
  id: string;
  registrationNumber: string;
  issues: string[];
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<KPIStats | null>(null);
  const [fleetData, setFleetData] = useState<any[]>([]);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [monthlyPerf, setMonthlyPerf] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, fleetRes, tripsRes, alertsRes, perfRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/fleet-status'),
          api.get('/dashboard/recent-trips'),
          api.get('/dashboard/compliance-alerts'),
          api.get('/dashboard/monthly-performance'),
        ]);

        if (statsRes.data.success) setStats(statsRes.data.data);
        if (fleetRes.data.success) setFleetData(fleetRes.data.data);
        if (tripsRes.data.success) setRecentTrips(tripsRes.data.data);
        if (alertsRes.data.success) setAlerts(alertsRes.data.data);
        if (perfRes.data.success) setMonthlyPerf(perfRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  const kpis = [
    { title: 'Total Vehicles', value: stats?.totalVehicles || 0, icon: Truck, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'Active Trips', value: stats?.activeTrips || 0, icon: Compass, color: 'text-purple-500 bg-purple-500/10' },
    { title: 'Pending Orders', value: stats?.pendingDeliveries || 0, icon: Package, color: 'text-amber-500 bg-amber-500/10' },
    { title: 'Active Drivers', value: stats?.totalDrivers || 0, icon: Users, color: 'text-green-500 bg-green-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="flex items-center justify-between p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {kpi.title}
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white my-1">
                {kpi.value}
              </h2>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${kpi.color}`}>
              <kpi.icon className="h-6 w-6" />
            </div>
          </Card>
        ))}
      </div>

      {/* Expiry Alerts Grid Panel */}
      {alerts.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 my-0">
                Urgent Vehicle Compliance Warnings ({alerts.length})
              </h3>
              <p className="text-xs text-amber-700/80 dark:text-amber-500/80 mt-1">
                Expiring route permits or registrations detected. Assets must be updated within 30 days to avoid operating penalties.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {alerts.map((alert) => (
                  <Badge key={alert.id} variant="warning" className="cursor-pointer">
                    {alert.registrationNumber}: {alert.issues[0]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Visual Analytics Sections */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Fleet Distribution Chart */}
        <Card className="flex flex-col p-6 col-span-1">
          <Card.Header className="p-0 pb-4">
            <Card.Title className="text-base font-bold">Fleet Utilization</Card.Title>
            <Card.Description className="text-xs">Active vehicle allocations</Card.Description>
          </Card.Header>
          <div className="flex-1 flex items-center justify-center min-h-60">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={fleetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fleetData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs font-semibold">
            {fleetData.map((d, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Performance Aggregates */}
        <Card className="flex flex-col p-6 col-span-2">
          <Card.Header className="p-0 pb-4">
            <Card.Title className="text-base font-bold">Delivery Performance Metrics</Card.Title>
            <Card.Description className="text-xs">Fulfillment status overview</Card.Description>
          </Card.Header>
          <div className="flex-1 flex items-center justify-center min-h-60">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyPerf}>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                <Bar dataKey="delivered" fill="#8b5cf6" name="Delivered" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" fill="#ef4444" name="Failed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Trips Feed */}
      <Card className="p-6">
        <div className="flex items-center justify-between border-b border-gray-200/50 pb-4 dark:border-gray-800/50">
          <div>
            <h3 className="text-base font-bold my-0">Active / Recent Journeys</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Live tracking logs for your fleet dispatch</p>
          </div>
          <Link to="/trips" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline dark:text-purple-400">
            View All Trips <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
          {recentTrips.map((trip) => (
            <div key={trip._id} className="flex items-center justify-between py-4 first:pt-4 last:pb-0">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white my-0">
                    {trip.tripNumber}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {trip.origin.address} &rarr; {trip.destination.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    {trip.vehicle?.registrationNumber || 'N/A'}
                  </p>
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase mt-0.5">
                    Driver: {trip.driver?.name || 'Unassigned'}
                  </p>
                </div>
                <Badge
                  variant={
                    trip.status === 'completed' ? 'success' :
                    trip.status === 'in-transit' ? 'default' :
                    trip.status === 'loading' ? 'warning' : 'secondary'
                  }
                >
                  {trip.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
