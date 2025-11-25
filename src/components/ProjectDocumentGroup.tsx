import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Calendar,
  Download,
  Eye
} from 'lucide-react';
import { Document } from '../types';

interface ProjectDocumentGroupProps {
  projectName: string;
  projectCode: string;
  projectStatus: string;
  implementationDate?: string;
  documents: Document[];
}

// Helper function to get status badge variant
const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status) {
    case 'Implemented':
    case 'Ready for Deploy':
      return 'default';
    case 'SIT/UAT Testing':
    case 'Development':
      return 'secondary';
    case 'Maintenance/Enhancement':
      return 'outline';
    default:
      return 'secondary';
  }
};

// Helper function to get document type color
const getDocTypeColor = (type: string): string => {
  switch (type) {
    case 'BRD':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'PCR':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'FSD':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'TSD':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Test':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Deployment':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export function ProjectDocumentGroup({
  projectName,
  projectCode,
  projectStatus,
  implementationDate,
  documents,
}: ProjectDocumentGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get unique document types
  const documentTypes = Array.from(new Set(documents.map(doc => doc.type))).sort();
  
  // Get the most recent update date
  const lastUpdated = documents.reduce((latest, doc) => {
    const docDate = new Date(doc.date);
    return docDate > latest ? docDate : latest;
  }, new Date(documents[0]?.date || Date.now()));

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
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg">{projectName}</CardTitle>
                <Badge variant={getStatusVariant(projectStatus)}>
                  {projectStatus}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {projectCode}
                </span>
                {implementationDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Implementation: {formatDate(implementationDate)}
                  </span>
                )}
                <span>
                  Last Updated: {formatDate(lastUpdated.toISOString())}
                </span>
              </div>
              <div className="flex gap-1 mt-2">
                {documentTypes.map(type => (
                  <Badge 
                    key={type} 
                    variant="outline" 
                    className={`text-xs ${getDocTypeColor(type)}`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="ml-2">
            {documents.length} {documents.length === 1 ? 'Document' : 'Documents'}
          </Badge>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border-t pt-4">
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getDocTypeColor(doc.type)}`}
                    >
                      {doc.type}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm">{doc.title}</p>
                      <div className="flex gap-3 mt-1 text-xs text-slate-600">
                        <span>v{doc.version}</span>
                        <span>•</span>
                        <span>{formatDate(doc.date)}</span>
                        <span>•</span>
                        <span>by {doc.author}</span>
                        {doc.module && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">{doc.module}</span>
                          </>
                        )}
                      </div>
                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
