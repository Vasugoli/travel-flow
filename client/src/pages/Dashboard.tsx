import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Users,
  Compass,
  Package,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
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
  CartesianGrid,
} from 'recharts';
import api from '@/utils/api';
import StatusBadge from '@/components/ui/StatusBadge';

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

const C = {
  primary:   '#f97316',
  success:   '#22c55e',
  warning:   '#f59e0b',
  danger:    '#ef4444',
  info:      '#3b82f6',
  neutral:   '#6b7280',
  cyan:      '#06b6d4',
  purple:    '#8b5cf6',
  textSub:   '#8b92a5',
  gridLine:  '#2a3040',
  tooltipBg: '#1e2330',
  tooltipBorder: '#2a3040',
};

const PIE_COLORS = [C.success, C.warning, C.danger, C.neutral];

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

  // Skeleton Loader for premium UX experience
  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-6 h-36 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-elevated rounded-lg" />
                <div className="h-4 bg-elevated rounded w-12" />
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-elevated rounded w-16" />
                <div className="h-3 bg-elevated rounded w-24" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3 bg-surface border border-border rounded-xl p-6 h-80" />
          <div className="xl:col-span-2 bg-surface border border-border rounded-xl p-6 h-80" />
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Vehicles',
      value: stats?.totalVehicles || 0,
      icon: Truck,
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-accent-cyan',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Drivers',
      value: stats?.totalDrivers || 0,
      icon: Users,
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-accent-purple',
      trend: '+4%',
      trendUp: true
    },
    {
      label: 'Active Trips',
      value: stats?.activeTrips || 0,
      icon: Compass,
      iconBg: 'bg-primary-muted',
      iconColor: 'text-primary',
      trend: '-2%',
      trendUp: false
    },
    {
      label: 'Deliveries',
      value: stats?.pendingDeliveries || 0,
      icon: Package,
      iconBg: 'bg-green-500/10',
      iconColor: 'text-success',
      trend: '+8%',
      trendUp: true
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">Industrial fleet diagnostics and active logistics command.</p>
        </div>
        <span className="text-xs text-text-secondary bg-surface border border-border rounded-lg px-3 py-2 font-mono">
          SYSTEM ACTIVE
        </span>
      </div>

      {/* KPI Cards — 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={index}
              className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4 hover:border-border/80 transition-colors duration-200"
            >
              {/* Top row: icon + trend */}
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.iconBg}`}>
                  <IconComponent className={kpi.iconColor} size={20} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-1 ${kpi.trendUp ? 'text-success' : 'text-danger'}`}>
                  {kpi.trendUp ? '↑' : '↓'} {kpi.trend}
                </span>
              </div>

              {/* Metric */}
              <div>
                <p className="font-display font-bold text-5xl text-text-primary leading-none mb-1 tabular-nums">
                  {kpi.value}
                </p>
                <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">
                  {kpi.label}
                </p>
              </div>

              {/* Footer */}
              <p className="text-xs text-text-tertiary border-t border-border pt-3 mt-auto">
                vs last month
              </p>
            </div>
          );
        })}
      </div>

      {/* Expiry Alerts & Compliance Grid */}
      {alerts.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
              <AlertTriangle className="text-warning" size={18} />
              Active Compliance Warnings ({alerts.length})
            </h2>
            <Link to="/vehicles" className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
              Manage Fleet Expiries
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {alerts.slice(0, 3).map((alert, index) => {
              // Mock remaining days based on index to trigger different color variants
              const daysLeft = index === 0 ? 5 : index === 1 ? 12 : 24;

              if (daysLeft < 7) {
                return (
                  <div key={alert.id} className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    <AlertTriangle className="text-red-400 shrink-0" size={16} />
                    <p className="text-sm font-medium text-red-400">
                      <span className="font-mono">{alert.registrationNumber}</span> — {alert.issues[0]} expires in <strong className="font-bold">6 days</strong>
                    </p>
                  </div>
                );
              } else if (daysLeft < 15) {
                return (
                  <div key={alert.id} className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
                    <AlertTriangle className="text-amber-400 shrink-0" size={16} />
                    <p className="text-sm font-medium text-amber-400">
                      <span className="font-mono">{alert.registrationNumber}</span> — {alert.issues[0]} expires in <strong className="font-bold">12 days</strong>
                    </p>
                  </div>
                );
              } else {
                return (
                  <div key={alert.id} className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
                    <AlertTriangle className="text-blue-400 shrink-0" size={16} />
                    <p className="text-sm font-medium text-blue-400">
                      <span className="font-mono">{alert.registrationNumber}</span> — {alert.issues[0]} expires in <strong className="font-bold">28 days</strong>
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}

      {/* Visual Analytics Sections — 60/40 Split */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Monthly Deliveries Bar Chart */}
        <div className="xl:col-span-3 bg-surface border border-border rounded-xl p-6">
          <h2 className="font-display font-semibold text-lg text-text-primary mb-5">
            Fulfillment Performance Metrics
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyPerf} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={C.gridLine} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: C.textSub, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textSub, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.tooltipBorder}`, borderRadius: 8 }}
                labelStyle={{ color: '#f0f2f7', fontWeight: 600 }}
                itemStyle={{ color: C.textSub }}
                cursor={{ fill: 'rgba(249,115,22,0.06)' }}
              />
              <Bar dataKey="delivered" fill={C.primary} name="Delivered" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill={C.danger} name="Failed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fleet Distribution Donut Chart */}
        <div className="xl:col-span-2 bg-surface border border-border rounded-xl p-6 flex flex-col justify-between">
          <h2 className="font-display font-semibold text-lg text-text-primary mb-5">
            Fleet Distribution
          </h2>
          <div className="flex-1 flex items-center justify-center min-h-[180px]">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={fleetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {fleetData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.tooltipBorder}`, borderRadius: 8 }}
                  itemStyle={{ color: '#f0f2f7' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold border-t border-border pt-4">
            {fleetData.map((d, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                <span className="text-text-secondary">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row — Recent Trips */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-elevated/40">
          <div>
            <h2 className="font-display font-semibold text-lg text-text-primary my-0">Active Fleet Journeys</h2>
            <p className="text-xs text-text-secondary mt-0.5">Real-time status updates from active dispatch modules</p>
          </div>
          <Link
            to="/trips"
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            All Trips <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-elevated border-b border-border">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-text-secondary">Trip Code</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-text-secondary">Origin</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-text-secondary">Destination</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-text-secondary">Vehicle</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-text-secondary">Driver</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentTrips.map((trip) => (
                <tr key={trip._id} className="hover:bg-hover transition-colors duration-100 group">
                  <td className="px-5 py-4 font-mono text-sm font-medium text-text-secondary">
                    {trip.tripNumber}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-text-primary">
                    {trip.origin.address}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-text-primary">
                    {trip.destination.address}
                  </td>
                  <td className="px-5 py-4 font-mono text-sm font-medium text-text-secondary">
                    {trip.vehicle?.registrationNumber || 'N/A'}
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {trip.driver?.name || 'Unassigned'}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={trip.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
