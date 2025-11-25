import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Incident } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface IncidentsViewProps {
  incidents: Incident[];
  onNavigate?: (page: string, params?: any) => void;
}

export function IncidentsView({ incidents, onNavigate }: IncidentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesType = typeFilter === 'all' || incident.type === typeFilter;
    return matchesSearch && matchesSeverity && matchesStatus && matchesType;
  });

  const groupedByType = {
    incident: filteredIncidents.filter((i) => i.type === 'incident'),
    request: filteredIncidents.filter((i) => i.type === 'request'),
    problem: filteredIncidents.filter((i) => i.type === 'problem'),
    knowledge: filteredIncidents.filter((i) => i.type === 'knowledge'),
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-orange-100 text-orange-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const calculateAge = (dateStr: string) => {
    const now = new Date();
    const created = new Date(dateStr);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Incidents & Requests</h1>
          <p className="text-slate-600">Track and manage all incidents, problems, requests, and knowledge articles</p>
        </div>
        <Button>Create Ticket</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Open</p>
                <p className="mt-1">
                  {incidents.filter((i) => i.status === 'open').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">In Progress</p>
                <p className="mt-1">
                  {incidents.filter((i) => i.status === 'in-progress').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Resolved</p>
                <p className="mt-1">
                  {incidents.filter((i) => i.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Recurring</p>
                <p className="mt-1 text-red-600">
                  {incidents.filter((i) => i.recurring).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Search by ticket number, title, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
                <SelectItem value="request">Request</SelectItem>
                <SelectItem value="problem">Problem</SelectItem>
                <SelectItem value="knowledge">Knowledge</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing {filteredIncidents.length} of {incidents.length} tickets
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({filteredIncidents.length})</TabsTrigger>
          <TabsTrigger value="incident">Incidents ({groupedByType.incident.length})</TabsTrigger>
          <TabsTrigger value="request">Requests ({groupedByType.request.length})</TabsTrigger>
          <TabsTrigger value="problem">Problems ({groupedByType.problem.length})</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge ({groupedByType.knowledge.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <IncidentTable incidents={filteredIncidents} />
        </TabsContent>
        <TabsContent value="incident" className="mt-6">
          <IncidentTable incidents={groupedByType.incident} />
        </TabsContent>
        <TabsContent value="request" className="mt-6">
          <IncidentTable incidents={groupedByType.request} />
        </TabsContent>
        <TabsContent value="problem" className="mt-6">
          <IncidentTable incidents={groupedByType.problem} />
        </TabsContent>
        <TabsContent value="knowledge" className="mt-6">
          <IncidentTable incidents={groupedByType.knowledge} />
        </TabsContent>
      </Tabs>
    </div>
  );

  function IncidentTable({ incidents }: { incidents: Incident[] }) {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Application</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id} className="cursor-pointer hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm">{incident.ticketNumber}</code>
                      {incident.recurring && (
                        <Badge variant="destructive" className="text-xs">
                          Recurring
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {incident.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-1 max-w-[300px]">{incident.title}</p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">App #{incident.applicationId}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(incident.status)}
                      <Badge className={`text-xs ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{incident.assignee}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{calculateAge(incident.createdDate)}</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
}
