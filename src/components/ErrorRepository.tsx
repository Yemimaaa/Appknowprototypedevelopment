import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Search, AlertCircle, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { ErrorCode } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface ErrorRepositoryProps {
  errors: ErrorCode[];
  onNavigate?: (page: string, params?: any) => void;
}

export function ErrorRepository({ errors, onNavigate }: ErrorRepositoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedError, setSelectedError] = useState<ErrorCode | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredErrors = errors.filter((error) => {
    const matchesSearch =
      error.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.module.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || error.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || error.fixStatus === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'recurring':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Error Repository</h1>
          <p className="text-slate-600">Comprehensive catalog of error codes, causes, and solutions</p>
        </div>
        <Button>Add Error Code</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Total Errors</p>
            <p className="mt-1">{errors.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Critical</p>
            <p className="mt-1 text-red-600">
              {errors.filter((e) => e.severity === 'critical').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Resolved</p>
            <p className="mt-1 text-green-600">
              {errors.filter((e) => e.fixStatus === 'resolved').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Recurring</p>
            <p className="mt-1 text-orange-600">
              {errors.filter((e) => e.fixStatus === 'recurring').length}
            </p>
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
                  placeholder="Search by error code, description, or module..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

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
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing {filteredErrors.length} of {errors.length} error codes
        </p>
      </div>

      {/* Error Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Error Code</TableHead>
                <TableHead>Application</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredErrors.map((error) => (
                <TableRow key={error.id} className="cursor-pointer hover:bg-slate-50">
                  <TableCell>
                    <code className="text-sm bg-slate-100 px-2 py-1 rounded">{error.code}</code>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">App #{error.applicationId}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {error.module}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-1 max-w-[300px]">{error.description}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(error.severity)} className="text-xs">
                      {error.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{error.frequency}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStatusColor(error.fixStatus)}`}>
                      {error.fixStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedError(error)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Error Detail Modal */}
      <Dialog open={!!selectedError} onOpenChange={() => setSelectedError(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedError && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <code className="text-lg bg-slate-100 px-3 py-1 rounded">{selectedError.code}</code>
                  <Badge variant={getSeverityColor(selectedError.severity)}>
                    {selectedError.severity}
                  </Badge>
                  <Badge className={getStatusColor(selectedError.fixStatus)}>
                    {selectedError.fixStatus}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {selectedError.module} module • Application #{selectedError.applicationId}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Description */}
                <div>
                  <h3 className="mb-2">Description</h3>
                  <p className="text-slate-600">{selectedError.description}</p>
                </div>

                {/* Causes */}
                <div>
                  <h3 className="mb-2">Possible Causes</h3>
                  <ul className="space-y-2">
                    {selectedError.causes.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* RCA */}
                {selectedError.rca && (
                  <div>
                    <h3 className="mb-2">Root Cause Analysis</h3>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <p className="text-sm text-slate-700">{selectedError.rca}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Solution */}
                <div>
                  <h3 className="mb-2">Solution</h3>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-slate-700">{selectedError.solution}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Workaround */}
                {selectedError.workaround && (
                  <div>
                    <h3 className="mb-2">Workaround</h3>
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardContent className="p-4">
                        <p className="text-sm text-slate-700">{selectedError.workaround}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* POK */}
                {selectedError.pok && (
                  <div>
                    <h3 className="mb-2">Proof of Knowledge (POK)</h3>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-slate-600">{selectedError.pok}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Fix Status */}
                {selectedError.fixedInVersion && (
                  <div>
                    <h3 className="mb-2">Fix Information</h3>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">
                        Fixed in version <Badge variant="outline">{selectedError.fixedInVersion}</Badge>
                      </span>
                    </div>
                  </div>
                )}

                {/* Related Incidents */}
                {selectedError.relatedIncidents.length > 0 && (
                  <div>
                    <h3 className="mb-2">Related Incidents ({selectedError.relatedIncidents.length})</h3>
                    <div className="space-y-2">
                      {selectedError.relatedIncidents.map((incident) => (
                        <div
                          key={incident}
                          className="flex items-center justify-between p-2 bg-slate-50 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <code className="text-sm">{incident}</code>
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Frequency</p>
                      <p className="mt-1">{selectedError.frequency} occurrences</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Error Code</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm">{selectedError.code}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(selectedError.code)}
                        >
                          {copied ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
