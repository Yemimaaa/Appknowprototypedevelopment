import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Grid, List, Search, Filter, Activity, AlertTriangle } from 'lucide-react';
import { Application } from '../types';

interface ApplicationsListProps {
  applications: Application[];
  onNavigate: (page: string, params?: any) => void;
}

export function ApplicationsList({ applications, onNavigate }: ApplicationsListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('all');

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesCriticality = criticalityFilter === 'all' || app.criticality === criticalityFilter;
    return matchesSearch && matchesStatus && matchesCriticality;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Applications</h1>
          <p className="text-slate-600">Manage and explore all registered applications</p>
        </div>
        <Button>Add Application</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Criticality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Criticality</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2 ml-auto">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing {filteredApps.length} of {applications.length} applications
        </p>
      </div>

      {/* Applications Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <Card
              key={app.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate('application-detail', { id: app.id })}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        app.criticality === 'high'
                          ? 'bg-red-100'
                          : app.criticality === 'medium'
                          ? 'bg-yellow-100'
                          : 'bg-green-100'
                      }`}
                    >
                      <Activity
                        className={`w-6 h-6 ${
                          app.criticality === 'high'
                            ? 'text-red-600'
                            : app.criticality === 'medium'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      />
                    </div>
                  </div>
                  <Badge
                    variant={app.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {app.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="truncate">{app.name}</h3>
                  <p className="text-sm text-slate-600 truncate">{app.code}</p>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2">{app.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Owner:</span>
                    <span>{app.owner}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Modules:</span>
                    <Badge variant="outline" className="text-xs">
                      {app.modules.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Criticality:</span>
                    <Badge
                      variant={app.criticality === 'high' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {app.criticality}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  {app.techStack.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {app.techStack.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{app.techStack.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onNavigate('application-detail', { id: app.id })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          app.criticality === 'high'
                            ? 'bg-red-100'
                            : app.criticality === 'medium'
                            ? 'bg-yellow-100'
                            : 'bg-green-100'
                        }`}
                      >
                        <Activity
                          className={`w-5 h-5 ${
                            app.criticality === 'high'
                              ? 'text-red-600'
                              : app.criticality === 'medium'
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3>{app.name}</h3>
                          <code className="text-sm text-slate-600">{app.code}</code>
                        </div>
                        <p className="text-sm text-slate-600">{app.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Owner</p>
                        <p className="text-sm">{app.owner}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-600">Modules</p>
                        <p className="text-sm">{app.modules.length}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Badge
                          variant={app.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {app.status}
                        </Badge>
                        <Badge
                          variant={app.criticality === 'high' ? 'destructive' : 'outline'}
                          className="text-xs"
                        >
                          {app.criticality}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
