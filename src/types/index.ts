// Core type definitions for AppKnow

export interface Application {
  id: string;
  name: string;
  code: string;
  description: string;
  owner: string;
  team: string;
  status: 'active' | 'maintenance' | 'deprecated';
  criticality: 'high' | 'medium' | 'low';
  modules: Module[];
  upstreamSystems: string[];
  downstreamSystems: string[];
  techStack: string[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  version: string;
  components: string[];
}

export interface Document {
  id: string;
  applicationId: string;
  type: 'BRD' | 'PCR' | 'FSD' | 'TSD' | 'Test' | 'Deployment';
  title: string;
  projectCode: string;
  projectName: string; // New: Project/Initiative Name
  projectStatus: 'Requirement' | 'Development' | 'SIT/UAT Testing' | 'Ready for Deploy' | 'Implemented' | 'Maintenance/Enhancement'; // New: Project Status
  implementationDate?: string; // New: Go-Live / Implementation Date
  version: string;
  date: string;
  author: string;
  status: 'draft' | 'approved' | 'archived';
  tags: string[];
  attachmentUrl?: string;
  module?: string;
}

export interface ErrorCode {
  id: string;
  applicationId: string;
  code: string;
  module: string;
  description: string;
  causes: string[];
  rca?: string;
  solution: string;
  workaround?: string;
  pok?: string;
  relatedIncidents: string[];
  fixStatus: 'resolved' | 'recurring' | 'pending';
  fixedInVersion?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  frequency: number;
  transactionScenario?: string; // New: When it commonly occurs (transaction scenario)
  integrationSource?: string; // New: System/Integration Source (e.g., "Core Banking → BI-Fast")
  relatedLogs?: string; // New: Related logs or error patterns
  samplePayload?: string; // New: Sample payload or request/response example
}

export interface Incident {
  id: string;
  applicationId: string;
  ticketNumber: string;
  type: 'incident' | 'request' | 'problem' | 'knowledge';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  module?: string;
  errorCode?: string;
  createdDate: string;
  resolvedDate?: string;
  assignee: string;
  recurring?: boolean;
}

export interface TopologyNode {
  id: string;
  name: string;
  type: 'application' | 'database' | 'service' | 'external';
  status: 'healthy' | 'warning' | 'error';
}

export interface TopologyEdge {
  source: string;
  target: string;
  protocol: string;
  type: 'sync' | 'async';
}