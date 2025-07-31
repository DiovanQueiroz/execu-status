import { useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { EpicsSection } from '@/components/EpicsSection';
import { EditMode } from '@/components/EditMode';
import { VersionHistory } from '@/components/VersionHistory';
import { sampleReport } from '@/data/sampleData';
import { ProjectReport, ReportVersion } from '@/types/report';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateReport } from '@/hooks/useReports';
import { 
  TrendingUp, TrendingDown, CheckCircle, AlertTriangle, 
  Package, Clock, User, Calendar, Shield, HelpCircle 
} from 'lucide-react';

const Index = () => {
  const [currentReport, setCurrentReport] = useState<ProjectReport>(sampleReport);
  const [reportId, setReportId] = useState<string>('sample-report-id');
  const [viewingVersion, setViewingVersion] = useState<ReportVersion | null>(null);
  const createReportMutation = useCreateReport();

  // Determina qual relatório está sendo visualizado
  const displayReport = viewingVersion?.report || currentReport;

  // Função para alternar entre versões
  const handleSelectVersion = (version: ReportVersion) => {
    setViewingVersion(version);
  };

  // Função para voltar à versão atual
  const handleBackToCurrent = () => {
    setViewingVersion(null);
  };

  // Calcular métricas baseadas no relatório sendo visualizado
  const totalEpics = displayReport.epics.length;
  const epicsOnTrack = displayReport.epics.filter(f => f.status === 'green').length;
  const epicsAtRisk = displayReport.epics.filter(f => f.status === 'yellow').length;
  const epicsCritical = displayReport.epics.filter(f => f.status === 'red').length;
  const phases = Object.values(displayReport.timeline);
  const overallProgress = Math.round(phases.reduce((sum, phase) => sum + phase.progress, 0) / phases.length);
  const bugResolutionRate = Math.round((displayReport.bugs.resolved / displayReport.bugs.total) * 100);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1400px] mx-auto space-y-4">
        
        {/* Header + Métricas */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <h1 className="text-2xl font-bold text-foreground">{displayReport.projectName}</h1>
            <div className="text-sm text-muted-foreground">
              PO: {displayReport.productOwner} | {formatDate(displayReport.reportDate)}
              {viewingVersion && (
                <span className="ml-2 text-blue-600 font-medium">
                  [v{viewingVersion.version}]
                </span>
              )}
            </div>
          </div>
          <div className="col-span-3 flex items-center gap-2">
            {viewingVersion ? (
              <button
                onClick={handleBackToCurrent}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                ← Voltar à Atual
              </button>
            ) : (
              <>
                <EditMode 
                  report={currentReport} 
                  reportId={reportId}
                  onSuccess={handleBackToCurrent}
                />
                <VersionHistory 
                  reportId={reportId}
                  currentVersion={currentReport.version}
                  onSelectVersion={handleSelectVersion}
                />
              </>
            )}
          </div>
          <div className="col-span-6 grid grid-cols-5 gap-3">
            <Card className="text-center">
              <CardContent className="p-3">
                <div className="text-xl font-bold text-status-green">{displayReport.bugs.resolved}</div>
                <div className="text-xs text-muted-foreground">Bugs Resolvidos</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3">
                <div className="text-xl font-bold text-status-green">{epicsOnTrack}</div>
                <div className="text-xs text-muted-foreground">No Track</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3">
                <div className="text-xl font-bold text-status-yellow">{epicsAtRisk}</div>
                <div className="text-xs text-muted-foreground">Atenção</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3">
                <div className="text-xl font-bold text-status-red">{epicsCritical}</div>
                <div className="text-xs text-muted-foreground">Críticas</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3">
                <div className="text-xl font-bold text-primary">{overallProgress}%</div>
                <div className="text-xs text-muted-foreground">Progresso</div>
              </CardContent>
            </Card>
          </div>
        </div>


        {/* Épicos Section */}
        <EpicsSection epics={displayReport.epics} />

        {/* Bottom Section - 4 columns */}
        <div className="grid grid-cols-4 gap-4">
          
          {/* Highlights */}
          <Card>
            <CardContent className="p-4">
              <div className="font-semibold text-sm mb-3 text-status-green">✓ Highlights</div>
              <div className="space-y-2">
                {displayReport.highlights.filter(h => h.type === 'positive').map((highlight) => (
                  <div key={highlight.id} className="text-xs p-2 bg-status-green-light rounded">
                    <div className="font-medium">{highlight.title}</div>
                    <div className="text-muted-foreground">{highlight.description.slice(0, 60)}...</div>
                  </div>
                ))}
              </div>
              
              <div className="font-semibold text-sm mb-3 mt-4 text-status-red">⚠ Lowlights</div>
              <div className="space-y-2">
                {displayReport.highlights.filter(h => h.type === 'negative').map((highlight) => (
                  <div key={highlight.id} className="text-xs p-2 bg-status-red-light rounded">
                    <div className="font-medium">{highlight.title}</div>
                    <div className="text-muted-foreground">{highlight.description.slice(0, 60)}...</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blockers */}
          <Card>
            <CardContent className="p-4">
              <div className="font-semibold text-sm mb-3 text-status-red">🚫 Bloqueios</div>
              <div className="space-y-2">
                {displayReport.blockers.map((blocker) => (
                  <div key={blocker.id} className="text-xs p-2 bg-status-red-light rounded">
                    <div className="font-medium">{blocker.title}</div>
                    <div className="text-muted-foreground">{blocker.severity} - {blocker.owner}</div>
                    <div className="text-muted-foreground">{formatDate(blocker.estimatedResolution)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help Requests */}
          <Card>
            <CardContent className="p-4">
              <div className="font-semibold text-sm mb-3 text-primary">❓ Ajuda</div>
              <div className="space-y-2">
                {displayReport.helpRequests.map((help) => (
                  <div key={help.id} className="text-xs p-2 bg-primary/10 rounded">
                    <div className="font-medium">{help.title}</div>
                    <div className="text-muted-foreground">{help.department} - {help.urgency}</div>
                    <div className="text-muted-foreground">{help.requestedBy}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="font-semibold text-sm mb-3 text-status-blue">📋 Ações</div>
              <div className="space-y-2">
                {displayReport.actions.map((action) => (
                  <div key={action.id} className="text-xs p-2 bg-status-blue-light rounded">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-muted-foreground">{action.owner} - {action.priority}</div>
                    <div className="text-muted-foreground">{formatDate(action.dueDate)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Index;
