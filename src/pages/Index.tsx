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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header compacto */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{currentReport.projectName}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>PO: {currentReport.productOwner}</span>
            <span>Data: {new Date(currentReport.reportDate).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Layout em grade */}
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
          {/* Coluna esquerda - Métricas e Timeline */}
          <div className="col-span-4 space-y-4 overflow-y-auto">
            <ExecutiveSummary report={currentReport} />
            <TimelineSection 
              timeline={currentReport.timeline} 
              features={currentReport.features} 
            />
          </div>
          
          {/* Coluna central - Features */}
          <div className="col-span-5 overflow-y-auto">
            <FeaturesSection features={currentReport.features} />
          </div>
          
          {/* Coluna direita - Highlights, Blockers, etc */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            <HighlightsSection highlights={currentReport.highlights} />
            <BlockersSection blockers={currentReport.blockers} />
            <HelpRequestsSection helpRequests={currentReport.helpRequests} />
            <ActionsSection actions={currentReport.actions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
