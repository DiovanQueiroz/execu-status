import { useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { EpicsSection } from '@/components/EpicsSection';
import { sampleReport } from '@/data/sampleData';
import { ProjectReport } from '@/types/report';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, TrendingDown, CheckCircle, AlertTriangle, 
  Package, Clock, User, Calendar, Shield, HelpCircle 
} from 'lucide-react';

const Index = () => {
  const [currentReport] = useState<ProjectReport>(sampleReport);

  // Calcular métricas
  const totalEpics = currentReport.epics.length;
  const epicsOnTrack = currentReport.epics.filter(f => f.status === 'green').length;
  const epicsAtRisk = currentReport.epics.filter(f => f.status === 'yellow').length;
  const epicsCritical = currentReport.epics.filter(f => f.status === 'red').length;
  const phases = Object.values(currentReport.timeline);
  const overallProgress = Math.round(phases.reduce((sum, phase) => sum + phase.progress, 0) / phases.length);
  const healthScore = Math.round(((epicsOnTrack * 3 + epicsAtRisk * 1.5) / (totalEpics * 3)) * 100);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1400px] mx-auto space-y-4">
        
        {/* Header + Métricas */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <h1 className="text-2xl font-bold text-foreground">{currentReport.projectName}</h1>
            <div className="text-sm text-muted-foreground">
              PO: {currentReport.productOwner} | {formatDate(currentReport.reportDate)}
            </div>
          </div>
          <div className="col-span-6 grid grid-cols-5 gap-3">
            <Card className="text-center">
              <CardContent className="p-3">
                <div className="text-xl font-bold text-primary">{healthScore}%</div>
                <div className="text-xs text-muted-foreground">Health</div>
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
        <EpicsSection epics={currentReport.epics} />

        {/* Bottom Section - 4 columns */}
        <div className="grid grid-cols-4 gap-4">
          
          {/* Highlights */}
          <Card>
            <CardContent className="p-4">
              <div className="font-semibold text-sm mb-3 text-status-green">✓ Highlights</div>
              <div className="space-y-2">
                {currentReport.highlights.filter(h => h.type === 'positive').map((highlight) => (
                  <div key={highlight.id} className="text-xs p-2 bg-status-green-light rounded">
                    <div className="font-medium">{highlight.title}</div>
                    <div className="text-muted-foreground">{highlight.description.slice(0, 60)}...</div>
                  </div>
                ))}
              </div>
              
              <div className="font-semibold text-sm mb-3 mt-4 text-status-red">⚠ Lowlights</div>
              <div className="space-y-2">
                {currentReport.highlights.filter(h => h.type === 'negative').map((highlight) => (
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
                {currentReport.blockers.map((blocker) => (
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
                {currentReport.helpRequests.map((help) => (
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
                {currentReport.actions.map((action) => (
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
