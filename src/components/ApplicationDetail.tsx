import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Activity, GitBranch, ExternalLink } from 'lucide-react';
import { Application } from '../types';
import { ProjectDocumentGroup } from './ProjectDocumentGroup';
import { ModuleErrorGroup } from './ModuleErrorGroup';
import { mockDocuments, mockErrors } from '../data/mockData';

interface ApplicationDetailProps {
  application: Application;
  onNavigate: (page: string, params?: any) => void;
  onViewArchitecture: () => void;
  onViewDocuments: () => void;
  onViewErrors: () => void;
  onViewIncidents: () => void;
}

export function ApplicationDetail({
  application,
  onNavigate,
  onViewArchitecture,
  onViewDocuments,
  onViewErrors,
  onViewIncidents,
}: ApplicationDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Filter and group documents by project for this application
  const appDocuments = mockDocuments.filter(doc => doc.applicationId === application.id);
  
  // Group documents by project
  const projectGroups = appDocuments.reduce((groups, doc) => {
    const key = doc.projectCode;
    if (!groups[key]) {
      groups[key] = {
        projectName: doc.projectName,
        projectCode: doc.projectCode,
        projectStatus: doc.projectStatus,
        implementationDate: doc.implementationDate,
        documents: [],
      };
    }
    groups[key].documents.push(doc);
    return groups;
  }, {} as Record<string, {
    projectName: string;
    projectCode: string;
    projectStatus: string;
    implementationDate?: string;
    documents: typeof appDocuments;
  }>);

  // Convert to array and sort by implementation date (most recent first)
  const projectGroupsArray = Object.values(projectGroups).sort((a, b) => {
    const dateA = a.implementationDate ? new Date(a.implementationDate).getTime() : 0;
    const dateB = b.implementationDate ? new Date(b.implementationDate).getTime() : 0;
    return dateB - dateA; // Most recent first
  });

  // Filter and group errors by module for this application
  const appErrors = mockErrors.filter(error => error.applicationId === application.id);
  
  // Group errors by module name
  const moduleErrorGroups = appErrors.reduce((groups, error) => {
    const moduleName = error.module;
    if (!groups[moduleName]) {
      groups[moduleName] = [];
    }
    groups[moduleName].push(error);
    return groups;
  }, {} as Record<string, typeof appErrors>);

  // Convert to array and sort by module name
  const moduleErrorGroupsArray = Object.entries(moduleErrorGroups)
    .map(([moduleName, errors]) => ({ moduleName, errors }))
    .sort((a, b) => a.moduleName.localeCompare(b.moduleName));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="sm" onClick={() => onNavigate('applications')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1>{application.name}</h1>
              <Badge variant={application.status === 'active' ? 'default' : 'secondary'}>
                {application.status}
              </Badge>
              <Badge variant={application.criticality === 'high' ? 'destructive' : 'outline'}>
                {application.criticality} criticality
              </Badge>
            </div>
            <p className="text-slate-600 mt-1">
              {application.code} • Owned by {application.owner} ({application.team} team)
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Modules</p>
            <p className="mt-1">{application.modules.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Upstream Systems</p>
            <p className="mt-1">{application.upstreamSystems.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Downstream Systems</p>
            <p className="mt-1">{application.downstreamSystems.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Tech Stack</p>
            <p className="mt-1">{application.techStack.length} technologies</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Description</p>
                <p className="mt-1">{application.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Owner</p>
                  <p className="mt-1">{application.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Team</p>
                  <p className="mt-1">{application.team}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <Badge variant={application.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                    {application.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Criticality</p>
                  <Badge
                    variant={application.criticality === 'high' ? 'destructive' : 'outline'}
                    className="mt-1"
                  >
                    {application.criticality}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modules */}
            <Card>
              <CardHeader>
                <CardTitle>Modules ({application.modules.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application.modules.map((module) => (
                  <div key={module.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p>{module.name}</p>
                      <Badge variant="outline" className="text-xs">
                        v{module.version}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{module.description}</p>
                    <div className="flex gap-2 mt-2">
                      {module.components.slice(0, 3).map((comp) => (
                        <Badge key={comp} variant="secondary" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                      {module.components.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{module.components.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {application.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upstream Systems */}
            <Card>
              <CardHeader>
                <CardTitle>Upstream Systems</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {application.upstreamSystems.map((system) => (
                  <div
                    key={system}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-slate-600" />
                      <span className="text-sm">{system}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Downstream Systems */}
            <Card>
              <CardHeader>
                <CardTitle>Downstream Systems</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {application.downstreamSystems.map((system) => (
                  <div
                    key={system}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-slate-600" />
                      <span className="text-sm">{system}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">View architecture topology and system integration flows</p>
              <Button onClick={onViewArchitecture}>View Architecture Diagram</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <div className="space-y-4">
            {projectGroupsArray.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl">Project Documents</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      {projectGroupsArray.length} {projectGroupsArray.length === 1 ? 'project' : 'projects'} • {appDocuments.length} total documents
                    </p>
                  </div>
                </div>
                {projectGroupsArray.map((group) => (
                  <ProjectDocumentGroup
                    key={group.projectCode}
                    projectName={group.projectName}
                    projectCode={group.projectCode}
                    projectStatus={group.projectStatus}
                    implementationDate={group.implementationDate}
                    documents={group.documents}
                  />
                ))}
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-slate-600">No documents available for this application</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="mt-6">
          <div className="space-y-4">
            {moduleErrorGroupsArray.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl">Module Errors</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      {moduleErrorGroupsArray.length} {moduleErrorGroupsArray.length === 1 ? 'module' : 'modules'} • {appErrors.length} total errors
                    </p>
                  </div>
                </div>
                {moduleErrorGroupsArray.map((group) => (
                  <ModuleErrorGroup
                    key={group.moduleName}
                    moduleName={group.moduleName}
                    errors={group.errors}
                  />
                ))}
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-slate-600">No errors available for this application</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-600 mb-4">View incidents, problems, and requests</p>
              <Button onClick={onViewIncidents}>View Incidents</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}