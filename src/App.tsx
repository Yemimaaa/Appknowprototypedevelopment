import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ApplicationsList } from './components/ApplicationsList';
import { ApplicationDetail } from './components/ApplicationDetail';
import { ArchitectureView } from './components/ArchitectureView';
import { DocumentsView } from './components/DocumentsView';
import { ErrorRepository } from './components/ErrorRepository';
import { IncidentsView } from './components/IncidentsView';
import { AdminPanel } from './components/AdminPanel';
import { SearchResults } from './components/SearchResults';
import { mockApplications, mockDocuments, mockErrors, mockIncidents } from './data/mockData';

type Page =
  | 'dashboard'
  | 'applications'
  | 'application-detail'
  | 'architecture'
  | 'documents'
  | 'errors'
  | 'incidents'
  | 'admin'
  | 'search';

interface PageState {
  page: Page;
  params?: any;
}

export default function App() {
  const [pageState, setPageState] = useState<PageState>({ page: 'dashboard' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (page: Page, params?: any) => {
    setPageState({ page, params });
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    handleNavigate('search');
  };

  const renderPage = () => {
    switch (pageState.page) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;

      case 'applications':
        return <ApplicationsList applications={mockApplications} onNavigate={handleNavigate} />;

      case 'application-detail': {
        const app = mockApplications.find((a) => a.id === pageState.params?.id);
        if (!app) return <div className="p-6">Application not found</div>;
        return (
          <ApplicationDetail
            application={app}
            onNavigate={handleNavigate}
            onViewArchitecture={() => handleNavigate('architecture', { id: app.id })}
            onViewDocuments={() => handleNavigate('documents')}
            onViewErrors={() => handleNavigate('errors')}
            onViewIncidents={() => handleNavigate('incidents')}
          />
        );
      }

      case 'architecture': {
        const app = mockApplications.find((a) => a.id === pageState.params?.id);
        if (!app) return <div className="p-6">Application not found</div>;
        return <ArchitectureView application={app} onNavigate={handleNavigate} />;
      }

      case 'documents':
        return <DocumentsView documents={mockDocuments} onNavigate={handleNavigate} />;

      case 'errors':
        return <ErrorRepository errors={mockErrors} onNavigate={handleNavigate} />;

      case 'incidents':
        return <IncidentsView incidents={mockIncidents} onNavigate={handleNavigate} />;

      case 'admin':
        return <AdminPanel onNavigate={handleNavigate} />;

      case 'search':
        return (
          <SearchResults
            query={searchQuery}
            applications={mockApplications}
            documents={mockDocuments}
            errors={mockErrors}
            incidents={mockIncidents}
            onNavigate={handleNavigate}
          />
        );

      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout
      currentPage={pageState.page}
      onNavigate={handleNavigate}
      onSearch={handleSearch}
    >
      {renderPage()}
    </Layout>
  );
}
