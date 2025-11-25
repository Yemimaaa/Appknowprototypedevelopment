import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Layers, FileText, AlertCircle, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { Badge } from './ui/badge';
import { IncidentTrendsChart, ErrorFrequencyChart, DocumentLifecycleChart, ErrorHeatmap } from './VisualizationWidgets';

interface DashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    {
      title: 'Total Applications',
      value: '47',
      change: '+3 this month',
      trend: 'up',
      icon: Layers,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Documents',
      value: '1,247',
      change: '+89 this week',
      trend: 'up',
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Error Codes Cataloged',
      value: '342',
      change: '12 updated today',
      trend: 'neutral',
      icon: AlertCircle,
      color: 'bg-orange-500',
    },
    {
      title: 'Open Incidents',
      value: '23',
      change: '-5 from yesterday',
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  const recentApplications = [
    { id: '1', name: 'Customer Portal', status: 'active', criticality: 'high', incidents: 2 },
    { id: '2', name: 'Payment Gateway', status: 'active', criticality: 'high', incidents: 0 },
    { id: '3', name: 'Inventory Manager', status: 'maintenance', criticality: 'medium', incidents: 1 },
    { id: '4', name: 'Analytics Dashboard', status: 'active', criticality: 'low', incidents: 0 },
    { id: '5', name: 'Email Service', status: 'active', criticality: 'medium', incidents: 3 },
  ];

  const criticalErrors = [
    { code: 'ERR-PAY-001', app: 'Payment Gateway', module: 'Transaction', count: 15, severity: 'critical' },
    { code: 'ERR-CUS-042', app: 'Customer Portal', module: 'Authentication', count: 8, severity: 'high' },
    { code: 'ERR-INV-117', app: 'Inventory Manager', module: 'Stock Update', count: 12, severity: 'high' },
  ];

  const recentIncidents = [
    { id: 'INC-2025-1847', app: 'Customer Portal', severity: 'high', status: 'in-progress', age: '2h' },
    { id: 'INC-2025-1846', app: 'Payment Gateway', severity: 'critical', status: 'open', age: '4h' },
    { id: 'INC-2025-1845', app: 'Email Service', severity: 'medium', status: 'resolved', age: '6h' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-slate-600">Welcome to AppKnow - Your unified application knowledge hub</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="tracking-tight">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.change}</p>
                  </div>
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onNavigate('application-detail', { id: app.id })}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-slate-600" />
                    <div>
                      <p>{app.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={app.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {app.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {app.criticality}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {app.incidents > 0 && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{app.incidents}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Errors */}
        <Card>
          <CardHeader>
            <CardTitle>High Frequency Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalErrors.map((error) => (
                <div
                  key={error.code}
                  onClick={() => onNavigate('errors', { code: error.code })}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-slate-200 px-2 py-1 rounded">{error.code}</code>
                      <Badge
                        variant={error.severity === 'critical' ? 'destructive' : 'default'}
                        className="text-xs"
                      >
                        {error.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{error.app} - {error.module}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600">{error.count}</p>
                    <p className="text-xs text-slate-500">occurrences</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => onNavigate('incidents', { id: incident.id })}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm">{incident.id}</code>
                      <Badge
                        variant={
                          incident.severity === 'critical'
                            ? 'destructive'
                            : incident.severity === 'high'
                            ? 'default'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{incident.app}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={incident.status === 'resolved' ? 'outline' : 'default'}
                      className="text-xs"
                    >
                      {incident.status}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">{incident.age} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('errors')}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <p>View Error Repository</p>
                    <p className="text-xs text-blue-100">Browse all error codes and solutions</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => onNavigate('applications')}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5" />
                  <div>
                    <p>Explore Applications</p>
                    <p className="text-xs text-purple-100">View architecture and dependencies</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className="w-full p-4 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5" />
                  <div>
                    <p>Admin Panel</p>
                    <p className="text-xs text-slate-100">Manage metadata and sync data</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <IncidentTrendsChart />
        <ErrorFrequencyChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentLifecycleChart />
        <ErrorHeatmap />
      </div>
    </div>
  );
}