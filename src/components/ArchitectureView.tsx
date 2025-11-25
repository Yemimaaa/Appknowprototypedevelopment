import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowLeft, Database, Server, Cloud, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Application, TopologyNode } from '../types';

interface ArchitectureViewProps {
  application: Application;
  onNavigate: (page: string, params?: any) => void;
}

export function ArchitectureView({ application, onNavigate }: ArchitectureViewProps) {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Mock topology data
  const nodes: TopologyNode[] = [
    { id: 'app', name: application.name, type: 'application', status: 'healthy' },
    { id: 'db1', name: 'Primary DB', type: 'database', status: 'healthy' },
    { id: 'db2', name: 'Cache DB', type: 'database', status: 'healthy' },
    { id: 'api1', name: 'Auth Service', type: 'service', status: 'healthy' },
    { id: 'api2', name: 'Payment API', type: 'service', status: 'warning' },
    { id: 'ext1', name: 'External Provider', type: 'external', status: 'healthy' },
  ];

  const connections = [
    { from: 'app', to: 'db1', label: 'SQL', type: 'sync' },
    { from: 'app', to: 'db2', label: 'Redis', type: 'sync' },
    { from: 'app', to: 'api1', label: 'REST', type: 'sync' },
    { from: 'app', to: 'api2', label: 'REST', type: 'async' },
    { from: 'api2', to: 'ext1', label: 'HTTPS', type: 'sync' },
  ];

  const getNodeColor = (type: string, status: string) => {
    if (status === 'error') return 'bg-red-100 border-red-500';
    if (status === 'warning') return 'bg-yellow-100 border-yellow-500';
    
    switch (type) {
      case 'application':
        return 'bg-blue-100 border-blue-500';
      case 'database':
        return 'bg-purple-100 border-purple-500';
      case 'service':
        return 'bg-green-100 border-green-500';
      case 'external':
        return 'bg-orange-100 border-orange-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return Database;
      case 'service':
        return Server;
      case 'external':
        return Cloud;
      default:
        return Server;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('application-detail', { id: application.id })}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1>Architecture Topology</h1>
            <p className="text-slate-600 mt-1">{application.name} - System Integration Map</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-slate-600 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Diagram */}
        <Card className="lg:col-span-3">
          <CardContent className="p-8">
            <div
              className="relative bg-slate-50 rounded-lg p-12 min-h-[600px] overflow-auto"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            >
              {/* Central Application Node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                  className={`relative p-6 rounded-xl border-2 ${getNodeColor('application', 'healthy')} cursor-pointer transition-all hover:shadow-lg ${
                    selectedNode === 'app' ? 'ring-4 ring-blue-300' : ''
                  }`}
                  onClick={() => setSelectedNode('app')}
                >
                  <Server className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-center">{application.name}</p>
                  <Badge variant="outline" className="text-xs mt-2">
                    Main App
                  </Badge>
                </div>
              </div>

              {/* Database Nodes - Top */}
              <div className="absolute left-1/4 top-20 -translate-x-1/2">
                <div
                  className={`p-4 rounded-xl border-2 ${getNodeColor('database', 'healthy')} cursor-pointer transition-all hover:shadow-lg ${
                    selectedNode === 'db1' ? 'ring-4 ring-purple-300' : ''
                  }`}
                  onClick={() => setSelectedNode('db1')}
                >
                  <Database className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-center">Primary DB</p>
                </div>
                {/* Connection line */}
                <svg className="absolute left-1/2 top-full w-1 h-32" style={{ zIndex: -1 }}>
                  <line x1="0" y1="0" x2="0" y2="128" stroke="#9333ea" strokeWidth="2" strokeDasharray="5,5" />
                </svg>
              </div>

              <div className="absolute left-3/4 top-20 -translate-x-1/2">
                <div
                  className={`p-4 rounded-xl border-2 ${getNodeColor('database', 'healthy')} cursor-pointer transition-all hover:shadow-lg ${
                    selectedNode === 'db2' ? 'ring-4 ring-purple-300' : ''
                  }`}
                  onClick={() => setSelectedNode('db2')}
                >
                  <Database className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-center">Cache DB</p>
                </div>
              </div>

              {/* Service Nodes - Bottom Left */}
              <div className="absolute left-1/4 bottom-20 -translate-x-1/2">
                <div
                  className={`p-4 rounded-xl border-2 ${getNodeColor('service', 'healthy')} cursor-pointer transition-all hover:shadow-lg ${
                    selectedNode === 'api1' ? 'ring-4 ring-green-300' : ''
                  }`}
                  onClick={() => setSelectedNode('api1')}
                >
                  <Server className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-center">Auth Service</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    REST
                  </Badge>
                </div>
              </div>

              {/* Service Nodes - Bottom Right */}
              <div className="absolute right-1/4 bottom-32 translate-x-1/2">
                <div
                  className={`p-4 rounded-xl border-2 ${getNodeColor('service', 'warning')} cursor-pointer transition-all hover:shadow-lg ${
                    selectedNode === 'api2' ? 'ring-4 ring-yellow-300' : ''
                  }`}
                  onClick={() => setSelectedNode('api2')}
                >
                  <Server className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-center">Payment API</p>
                  <Badge variant="outline" className="text-xs mt-1 bg-yellow-50">
                    Warning
                  </Badge>
                </div>
              </div>

              {/* External Node - Far Right */}
              <div className="absolute right-12 bottom-12">
                <div
                  className={`p-4 rounded-xl border-2 ${getNodeColor('external', 'healthy')} cursor-pointer transition-all hover:shadow-lg ${
                    selectedNode === 'ext1' ? 'ring-4 ring-orange-300' : ''
                  }`}
                  onClick={() => setSelectedNode('ext1')}
                >
                  <Cloud className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-center">External Provider</p>
                </div>
              </div>

              {/* Connection Labels */}
              <div className="absolute left-1/4 top-64 -translate-x-1/2">
                <Badge variant="secondary" className="text-xs">
                  SQL
                </Badge>
              </div>
              <div className="absolute left-3/4 top-64 -translate-x-1/2">
                <Badge variant="secondary" className="text-xs">
                  Redis
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend & Details */}
        <div className="space-y-6">
          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 border-2 border-blue-500 rounded" />
                <span className="text-sm">Application</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 border-2 border-purple-500 rounded" />
                <span className="text-sm">Database</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded" />
                <span className="text-sm">Service</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 border-2 border-orange-500 rounded" />
                <span className="text-sm">External</span>
              </div>
            </CardContent>
          </Card>

          {/* Connection Types */}
          <Card>
            <CardHeader>
              <CardTitle>Protocols</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {connections.map((conn, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <Badge variant="secondary" className="text-xs">
                    {conn.label}
                  </Badge>
                  <span className="text-slate-600">{conn.type}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dependencies */}
          <Card>
            <CardHeader>
              <CardTitle>Dependencies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-slate-600 mb-2">Upstream</p>
                {application.upstreamSystems.slice(0, 3).map((sys) => (
                  <div key={sys} className="flex items-center gap-2 py-1">
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-sm">{sys}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <p className="text-sm text-slate-600 mb-2">Downstream</p>
                {application.downstreamSystems.slice(0, 3).map((sys) => (
                  <div key={sys} className="flex items-center gap-2 py-1">
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-sm">{sys}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Node Details */}
          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle>Node Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {nodes.find((n) => n.id === selectedNode)?.name}
                </p>
                <Badge variant="outline" className="text-xs mt-2">
                  {nodes.find((n) => n.id === selectedNode)?.type}
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
