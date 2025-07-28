import { useState } from 'react';
import { ExecutiveSummary } from '@/components/ExecutiveSummary';
import { TimelineSection } from '@/components/TimelineSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { HighlightsSection } from '@/components/HighlightsSection';
import { BlockersSection } from '@/components/BlockersSection';
import { HelpRequestsSection } from '@/components/HelpRequestsSection';
import { ActionsSection } from '@/components/ActionsSection';
import { sampleReport } from '@/data/sampleData';
import { ProjectReport } from '@/types/report';

const Index = () => {
  const [currentReport] = useState<ProjectReport>(sampleReport);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Executive Summary */}
        <ExecutiveSummary report={currentReport} />
        
        {/* Timeline Macro */}
        <TimelineSection 
          timeline={currentReport.timeline} 
          features={currentReport.features} 
        />
        
        {/* Features */}
        <FeaturesSection features={currentReport.features} />
        
        {/* Highlights e Lowlights */}
        <HighlightsSection highlights={currentReport.highlights} />
        
        {/* Bloqueios */}
        <BlockersSection blockers={currentReport.blockers} />
        
        {/* Pedidos de Ajuda */}
        <HelpRequestsSection helpRequests={currentReport.helpRequests} />
        
        {/* Próximas Ações */}
        <ActionsSection actions={currentReport.actions} />
      </div>
    </div>
  );
};

export default Index;
