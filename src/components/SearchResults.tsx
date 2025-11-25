import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Layers, FileText, AlertCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Application, Document, ErrorCode, Incident } from '../types';

interface SearchResultsProps {
  query: string;
  applications: Application[];
  documents: Document[];
  errors: ErrorCode[];
  incidents: Incident[];
  onNavigate: (page: string, params?: any) => void;
}

export function SearchResults({
  query,
  applications,
  documents,
  errors,
  incidents,
  onNavigate,
}: SearchResultsProps) {
  // Filter results based on query
  const filteredApps = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.code.toLowerCase().includes(query.toLowerCase()) ||
      app.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.projectCode.toLowerCase().includes(query.toLowerCase()) ||
      doc.type.toLowerCase().includes(query.toLowerCase())
  );

  const filteredErrors = errors.filter(
    (error) =>
      error.code.toLowerCase().includes(query.toLowerCase()) ||
      error.description.toLowerCase().includes(query.toLowerCase()) ||
      error.module.toLowerCase().includes(query.toLowerCase())
  );

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.ticketNumber.toLowerCase().includes(query.toLowerCase()) ||
      incident.title.toLowerCase().includes(query.toLowerCase()) ||
      incident.description.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults =
    filteredApps.length + filteredDocs.length + filteredErrors.length + filteredIncidents.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Search Results</h1>
        <p className="text-slate-600 mt-1">
          Found {totalResults} results for <span className="italic">"{query}"</span>
        </p>
      </div>

      {/* No results */}
      {totalResults === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-slate-600">No results found. Try a different search term.</p>
          </CardContent>
        </Card>
      )}

      {/* Results Tabs */}
      {totalResults > 0 && (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
            <TabsTrigger value="applications">Applications ({filteredApps.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({filteredDocs.length})</TabsTrigger>
            <TabsTrigger value="errors">Errors ({filteredErrors.length})</TabsTrigger>
            <TabsTrigger value="incidents">Incidents ({filteredIncidents.length})</TabsTrigger>
          </TabsList>

          {/* All Results */}
          <TabsContent value="all" className="space-y-6 mt-6">
            {filteredApps.length > 0 && (
              <div>
                <h2 className="mb-4">Applications</h2>
                <div className="space-y-3">
                  {filteredApps.slice(0, 3).map((app) => (
                    <ApplicationResult key={app.id} app={app} onNavigate={onNavigate} />
                  ))}
                </div>
                {filteredApps.length > 3 && (
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => onNavigate('applications')}
                  >
                    View all {filteredApps.length} applications →
                  </Button>
                )}
              </div>
            )}

            {filteredDocs.length > 0 && (
              <div>
                <h2 className="mb-4">Documents</h2>
                <div className="space-y-3">
                  {filteredDocs.slice(0, 3).map((doc) => (
                    <DocumentResult key={doc.id} doc={doc} onNavigate={onNavigate} />
                  ))}
                </div>
                {filteredDocs.length > 3 && (
                  <Button variant="link" className="mt-2" onClick={() => onNavigate('documents')}>
                    View all {filteredDocs.length} documents →
                  </Button>
                )}
              </div>
            )}

            {filteredErrors.length > 0 && (
              <div>
                <h2 className="mb-4">Error Codes</h2>
                <div className="space-y-3">
                  {filteredErrors.slice(0, 3).map((error) => (
                    <ErrorResult key={error.id} error={error} onNavigate={onNavigate} />
                  ))}
                </div>
                {filteredErrors.length > 3 && (
                  <Button variant="link" className="mt-2" onClick={() => onNavigate('errors')}>
                    View all {filteredErrors.length} errors →
                  </Button>
                )}
              </div>
            )}

            {filteredIncidents.length > 0 && (
              <div>
                <h2 className="mb-4">Incidents</h2>
                <div className="space-y-3">
                  {filteredIncidents.slice(0, 3).map((incident) => (
                    <IncidentResult key={incident.id} incident={incident} onNavigate={onNavigate} />
                  ))}
                </div>
                {filteredIncidents.length > 3 && (
                  <Button variant="link" className="mt-2" onClick={() => onNavigate('incidents')}>
                    View all {filteredIncidents.length} incidents →
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-3 mt-6">
            {filteredApps.map((app) => (
              <ApplicationResult key={app.id} app={app} onNavigate={onNavigate} />
            ))}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-3 mt-6">
            {filteredDocs.map((doc) => (
              <DocumentResult key={doc.id} doc={doc} onNavigate={onNavigate} />
            ))}
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors" className="space-y-3 mt-6">
            {filteredErrors.map((error) => (
              <ErrorResult key={error.id} error={error} onNavigate={onNavigate} />
            ))}
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="space-y-3 mt-6">
            {filteredIncidents.map((incident) => (
              <IncidentResult key={incident.id} incident={incident} onNavigate={onNavigate} />
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function ApplicationResult({
  app,
  onNavigate,
}: {
  app: Application;
  onNavigate: (page: string, params?: any) => void;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div
          className="flex items-start justify-between"
          onClick={() => onNavigate('application-detail', { id: app.id })}
        >
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p>{app.name}</p>
                <code className="text-sm text-slate-600">{app.code}</code>
                <Badge variant={app.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {app.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mt-1">{app.description}</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentResult({
  doc,
  onNavigate,
}: {
  doc: Document;
  onNavigate: (page: string, params?: any) => void;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between" onClick={() => onNavigate('documents')}>
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p>{doc.title}</p>
                <Badge variant="outline" className="text-xs">
                  {doc.type}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {doc.projectCode} • v{doc.version} • {new Date(doc.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorResult({
  error,
  onNavigate,
}: {
  error: ErrorCode;
  onNavigate: (page: string, params?: any) => void;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between" onClick={() => onNavigate('errors')}>
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <code className="text-sm bg-slate-100 px-2 py-1 rounded">{error.code}</code>
                <Badge variant={error.severity === 'critical' ? 'destructive' : 'default'} className="text-xs">
                  {error.severity}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {error.module}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mt-1">{error.description}</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function IncidentResult({
  incident,
  onNavigate,
}: {
  incident: Incident;
  onNavigate: (page: string, params?: any) => void;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between" onClick={() => onNavigate('incidents')}>
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <code className="text-sm">{incident.ticketNumber}</code>
                <Badge variant={incident.severity === 'critical' ? 'destructive' : 'default'} className="text-xs">
                  {incident.severity}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {incident.type}
                </Badge>
              </div>
              <p className="text-sm mt-1">{incident.title}</p>
              <p className="text-sm text-slate-600 mt-1">{incident.description}</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
        </div>
      </CardContent>
    </Card>
  );
}
