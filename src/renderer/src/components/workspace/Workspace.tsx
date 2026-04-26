import Sidebar from './Sidebar';
import Header from './Header';
import StepProgress from './StepProgress';
import CollectionConfig from './CollectionConfig';
import BrowserPreview from './BrowserPreview';
import AIAnalysisPanel from './AIAnalysisPanel';
import ProductTable from './ProductTable';
import CompetitorAnalysis from './CompetitorAnalysis';
import KeywordLibrary from './KeywordLibrary';

export default function Workspace() {
  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 overflow-hidden">
        <Header />
        <StepProgress />
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          <div className="flex gap-4 mb-4">
            <CollectionConfig />
            <BrowserPreview />
            <AIAnalysisPanel />
          </div>
          <div className="flex gap-4 mb-4">
            <ProductTable />
            <CompetitorAnalysis />
            <KeywordLibrary />
          </div>
        </div>
      </main>
    </div>
  );
}
