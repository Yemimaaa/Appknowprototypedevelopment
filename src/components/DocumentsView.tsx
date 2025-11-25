import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileText, Download, Eye, Search, Calendar, List, LayoutGrid } from 'lucide-react';
import { Document } from '../types';

interface DocumentsViewProps {
  documents: Document[];
  onNavigate?: (page: string, params?: any) => void;
}

export function DocumentsView({ documents, onNavigate }: DocumentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.projectCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Group by date for timeline view
  const groupedByDate = filteredDocs.reduce((acc, doc) => {
    const date = new Date(doc.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BRD':
        return 'bg-blue-100 text-blue-700';
      case 'PCR':
        return 'bg-purple-100 text-purple-700';
      case 'FSD':
        return 'bg-green-100 text-green-700';
      case 'TSD':
        return 'bg-orange-100 text-orange-700';
      case 'Test':
        return 'bg-yellow-100 text-yellow-700';
      case 'Deployment':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Project Documents</h1>
          <p className="text-slate-600">Browse and manage all project documentation from iServe</p>
        </div>
        <Button>Upload Document</Button>
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
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BRD">BRD</SelectItem>
                <SelectItem value="PCR">PCR</SelectItem>
                <SelectItem value="FSD">FSD</SelectItem>
                <SelectItem value="TSD">TSD</SelectItem>
                <SelectItem value="Test">Test</SelectItem>
                <SelectItem value="Deployment">Deployment</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2 ml-auto">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('timeline')}
              >
                <Calendar className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing {filteredDocs.length} of {documents.length} documents
        </p>
      </div>

      {/* Documents List View */}
      {viewMode === 'list' ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${getTypeColor(doc.type)}`}>
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3>{doc.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                          <Badge
                            variant={doc.status === 'approved' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {doc.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <span>Project: {doc.projectCode}</span>
                          <span>•</span>
                          <span>Version: {doc.version}</span>
                          <span>•</span>
                          <span>Author: {doc.author}</span>
                          <span>•</span>
                          <span>{new Date(doc.date).toLocaleDateString()}</span>
                        </div>
                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {doc.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Timeline View */
        <div className="space-y-8">
          {Object.entries(groupedByDate).map(([date, docs]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-slate-600" />
                <h2>{date}</h2>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="ml-8 space-y-4">
                {docs.map((doc, idx) => (
                  <div key={doc.id} className="relative">
                    {/* Timeline line */}
                    {idx !== docs.length - 1 && (
                      <div className="absolute left-0 top-12 bottom-0 w-0.5 bg-slate-200" />
                    )}

                    {/* Timeline dot */}
                    <div className="absolute left-0 top-6 w-3 h-3 bg-blue-500 rounded-full border-4 border-white" />

                    {/* Document card */}
                    <Card className="ml-8 hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${getTypeColor(doc.type)}`}>
                              <FileText className="w-4 h-4" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p>{doc.title}</p>
                                <Badge variant="outline" className="text-xs">
                                  {doc.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 mt-1">
                                {doc.projectCode} v{doc.version} • {doc.author}
                              </p>
                              {doc.tags && doc.tags.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                  {doc.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
