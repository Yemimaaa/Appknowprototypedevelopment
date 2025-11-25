import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  ChevronDown, 
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Code,
  FileText
} from 'lucide-react';
import { ErrorCode } from '../types';

interface ModuleErrorGroupProps {
  moduleName: string;
  errors: ErrorCode[];
}

// Helper function to get severity badge variant and icon
const getSeverityConfig = (severity: string): { 
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  icon: any;
  color: string;
} => {
  switch (severity) {
    case 'critical':
      return { variant: 'destructive', icon: AlertTriangle, color: 'text-red-600' };
    case 'high':
      return { variant: 'destructive', icon: AlertCircle, color: 'text-orange-600' };
    case 'medium':
      return { variant: 'outline', icon: AlertCircle, color: 'text-yellow-600' };
    case 'low':
      return { variant: 'secondary', icon: AlertCircle, color: 'text-blue-600' };
    default:
      return { variant: 'secondary', icon: AlertCircle, color: 'text-slate-600' };
  }
};

// Helper function to get fix status badge
const getFixStatusConfig = (status: string): {
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  icon: any;
  label: string;
} => {
  switch (status) {
    case 'resolved':
      return { variant: 'default', icon: CheckCircle2, label: 'Resolved' };
    case 'recurring':
      return { variant: 'destructive', icon: AlertTriangle, label: 'Recurring' };
    case 'pending':
      return { variant: 'secondary', icon: Clock, label: 'Pending' };
    default:
      return { variant: 'secondary', icon: Clock, label: 'Unknown' };
  }
};

export function ModuleErrorGroup({ moduleName, errors }: ModuleErrorGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());

  const toggleErrorExpansion = (errorId: string) => {
    const newSet = new Set(expandedErrors);
    if (newSet.has(errorId)) {
      newSet.delete(errorId);
    } else {
      newSet.add(errorId);
    }
    setExpandedErrors(newSet);
  };

  // Count errors by severity
  const severityCounts = errors.reduce((acc, error) => {
    acc[error.severity] = (acc[error.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div 
          className="flex items-start justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start gap-3 flex-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </Button>
            <div className="flex-1">
              <CardTitle className="text-lg">Module: {moduleName}</CardTitle>
              <div className="flex gap-2 mt-2">
                {severityCounts.critical && (
                  <Badge variant="destructive" className="text-xs">
                    {severityCounts.critical} Critical
                  </Badge>
                )}
                {severityCounts.high && (
                  <Badge variant="destructive" className="text-xs bg-orange-600">
                    {severityCounts.high} High
                  </Badge>
                )}
                {severityCounts.medium && (
                  <Badge variant="outline" className="text-xs">
                    {severityCounts.medium} Medium
                  </Badge>
                )}
                {severityCounts.low && (
                  <Badge variant="secondary" className="text-xs">
                    {severityCounts.low} Low
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="ml-2">
            {errors.length} {errors.length === 1 ? 'Error' : 'Errors'}
          </Badge>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border-t pt-4">
            <div className="space-y-3">
              {errors.map((error) => {
                const isErrorExpanded = expandedErrors.has(error.id);
                const severityConfig = getSeverityConfig(error.severity);
                const fixStatusConfig = getFixStatusConfig(error.fixStatus);
                const SeverityIcon = severityConfig.icon;
                const FixStatusIcon = fixStatusConfig.icon;

                return (
                  <div
                    key={error.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    {/* Error Header */}
                    <div
                      className="flex items-start justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => toggleErrorExpansion(error.id)}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-5 w-5 mt-0.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleErrorExpansion(error.id);
                          }}
                        >
                          {isErrorExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {error.code}
                            </Badge>
                            <Badge variant={severityConfig.variant} className="text-xs">
                              <SeverityIcon className="w-3 h-3 mr-1" />
                              {error.severity.toUpperCase()}
                            </Badge>
                            <Badge variant={fixStatusConfig.variant} className="text-xs">
                              <FixStatusIcon className="w-3 h-3 mr-1" />
                              {fixStatusConfig.label}
                            </Badge>
                            {error.frequency && (
                              <Badge variant="secondary" className="text-xs">
                                {error.frequency} occurrences
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{error.description}</p>
                          {error.transactionScenario && (
                            <p className="text-xs text-slate-600 mt-1">
                              <span className="font-medium">Scenario:</span> {error.transactionScenario}
                            </p>
                          )}
                          {error.integrationSource && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                              <ArrowRight className="w-3 h-3" />
                              <span className="font-medium">{error.integrationSource}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Error Details (Expanded) */}
                    {isErrorExpanded && (
                      <div className="p-4 space-y-4 bg-white border-t">
                        {/* Root Cause */}
                        {error.rca && (
                          <div>
                            <p className="text-sm text-slate-600 mb-1">Root Cause Analysis</p>
                            <p className="text-sm bg-amber-50 border border-amber-200 rounded p-3">
                              {error.rca}
                            </p>
                          </div>
                        )}

                        {/* Causes */}
                        {error.causes && error.causes.length > 0 && (
                          <div>
                            <p className="text-sm text-slate-600 mb-2">Common Causes</p>
                            <ul className="space-y-1">
                              {error.causes.map((cause, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <span className="text-red-500 mt-0.5">•</span>
                                  <span>{cause}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Solution */}
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Recommended Resolution</p>
                          <p className="text-sm bg-green-50 border border-green-200 rounded p-3">
                            {error.solution}
                          </p>
                        </div>

                        {/* Workaround */}
                        {error.workaround && (
                          <div>
                            <p className="text-sm text-slate-600 mb-1">Temporary Workaround</p>
                            <p className="text-sm bg-blue-50 border border-blue-200 rounded p-3">
                              {error.workaround}
                            </p>
                          </div>
                        )}

                        {/* Related Logs */}
                        {error.relatedLogs && (
                          <div>
                            <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Related Logs
                            </p>
                            <pre className="text-xs bg-slate-900 text-slate-100 rounded p-3 overflow-x-auto">
                              {error.relatedLogs}
                            </pre>
                          </div>
                        )}

                        {/* Sample Payload */}
                        {error.samplePayload && (
                          <div>
                            <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              Sample Payload
                            </p>
                            <pre className="text-xs bg-slate-900 text-slate-100 rounded p-3 overflow-x-auto">
                              {error.samplePayload}
                            </pre>
                          </div>
                        )}

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                          {error.fixedInVersion && (
                            <div>
                              <p className="text-xs text-slate-600">Fixed In Version</p>
                              <Badge variant="outline" className="mt-1">
                                v{error.fixedInVersion}
                              </Badge>
                            </div>
                          )}
                          {error.pok && (
                            <div>
                              <p className="text-xs text-slate-600">POK/Ticket</p>
                              <Badge variant="secondary" className="mt-1">
                                {error.pok}
                              </Badge>
                            </div>
                          )}
                          {error.relatedIncidents && error.relatedIncidents.length > 0 && (
                            <div className="col-span-2">
                              <p className="text-xs text-slate-600 mb-1">Related Incidents</p>
                              <div className="flex flex-wrap gap-1">
                                {error.relatedIncidents.map((incident) => (
                                  <Badge key={incident} variant="outline" className="text-xs">
                                    {incident}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
