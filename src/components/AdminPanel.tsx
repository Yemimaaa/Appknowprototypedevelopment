import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Settings,
  RefreshCw,
  Database,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Upload,
  Download,
} from 'lucide-react';

interface AdminPanelProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [syncing, setSyncing] = useState<string | null>(null);

  const syncSources = [
    {
      id: 'architecture',
      name: 'Architecture Repository',
      description: 'Topology diagrams and architecture metadata',
      lastSync: '2 hours ago',
      status: 'synced',
      recordCount: 47,
    },
    {
      id: 'iserve',
      name: 'iServe Documents',
      description: 'BRD, PCR, FSD, TSD, and deployment documents',
      lastSync: '30 minutes ago',
      status: 'synced',
      recordCount: 1247,
    },
    {
      id: 'incidents',
      name: 'iServe Tickets',
      description: 'Incidents, Requests, Problems, and Knowledge Articles',
      lastSync: '5 minutes ago',
      status: 'syncing',
      recordCount: 342,
    },
    {
      id: 'errors',
      name: 'Error Repository',
      description: 'Error codes, RCA, and solutions',
      lastSync: '1 day ago',
      status: 'pending',
      recordCount: 289,
    },
  ];

  const recentActivities = [
    { action: 'Error code ERR-PAY-001 updated', user: 'John Doe', time: '5 minutes ago', type: 'update' },
    { action: 'Architecture sync completed', user: 'System', time: '2 hours ago', type: 'sync' },
    { action: 'New application added: Analytics Dashboard', user: 'Jane Smith', time: '3 hours ago', type: 'create' },
    { action: 'Document metadata sync failed', user: 'System', time: '4 hours ago', type: 'error' },
    { action: '125 new documents imported from iServe', user: 'System', time: '6 hours ago', type: 'sync' },
  ];

  const systemHealth = [
    { component: 'Database', status: 'healthy', uptime: '99.9%' },
    { component: 'API Gateway', status: 'healthy', uptime: '99.8%' },
    { component: 'Sync Service', status: 'warning', uptime: '98.5%' },
    { component: 'Search Index', status: 'healthy', uptime: '100%' },
  ];

  const handleSync = (sourceId: string) => {
    setSyncing(sourceId);
    setTimeout(() => {
      setSyncing(null);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Admin Panel</h1>
          <p className="text-slate-600">Manage system settings, sync data sources, and monitor health</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {systemHealth.map((component) => (
          <Card key={component.component}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600">{component.component}</p>
                  <p className="text-sm mt-1">{component.uptime}</p>
                </div>
                {component.status === 'healthy' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                )}
              </div>
              <Badge
                variant={component.status === 'healthy' ? 'default' : 'secondary'}
                className="text-xs mt-2"
              >
                {component.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sync">
        <TabsList>
          <TabsTrigger value="sync">Data Sync</TabsTrigger>
          <TabsTrigger value="errors">Error Management</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Data Sync Tab */}
        <TabsContent value="sync" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {syncSources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        source.status === 'synced'
                          ? 'bg-green-100'
                          : source.status === 'syncing'
                          ? 'bg-blue-100'
                          : 'bg-orange-100'
                      }`}
                    >
                      <Database
                        className={`w-6 h-6 ${
                          source.status === 'synced'
                            ? 'text-green-600'
                            : source.status === 'syncing'
                            ? 'text-blue-600'
                            : 'text-orange-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p>{source.name}</p>
                        <Badge
                          variant={
                            source.status === 'synced'
                              ? 'default'
                              : source.status === 'syncing'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="text-xs"
                        >
                          {source.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{source.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>Last sync: {source.lastSync}</span>
                        <span>•</span>
                        <span>{source.recordCount} records</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={syncing === source.id}
                    onClick={() => handleSync(source.id)}
                  >
                    {syncing === source.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync Now
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Error Management Tab */}
        <TabsContent value="errors" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Error Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600">Error Code</label>
                  <Input placeholder="ERR-APP-XXX" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Application</label>
                  <Input placeholder="Select application" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Module</label>
                  <Input placeholder="Module name" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Description</label>
                  <Input placeholder="Brief description" className="mt-1" />
                </div>
                <Button className="w-full">Add Error Code</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Import</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-600 mb-2">Drop CSV or Excel file here</p>
                  <p className="text-xs text-slate-500 mb-4">or click to browse</p>
                  <Button variant="outline">Choose File</Button>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Download the template file to ensure proper formatting
                  </p>
                  <Button variant="link" className="text-xs mt-2 p-0 h-auto">
                    Download Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'error'
                          ? 'bg-red-100'
                          : activity.type === 'sync'
                          ? 'bg-blue-100'
                          : activity.type === 'create'
                          ? 'bg-green-100'
                          : 'bg-orange-100'
                      }`}
                    >
                      {activity.type === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      ) : activity.type === 'sync' ? (
                        <RefreshCw className="w-4 h-4 text-blue-600" />
                      ) : activity.type === 'create' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Settings className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2">Sync Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm">Auto-sync enabled</p>
                      <p className="text-xs text-slate-600">Automatically sync data sources every hour</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm">Email notifications</p>
                      <p className="text-xs text-slate-600">Send email when sync fails or errors occur</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2">Data Retention</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Keep documents for</label>
                    <Input type="number" defaultValue="365" className="w-24" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Keep closed incidents for</label>
                    <Input type="number" defaultValue="180" className="w-24" />
                  </div>
                </div>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
