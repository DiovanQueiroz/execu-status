import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calendar, User } from 'lucide-react';
import { ProjectReport } from '@/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExecutiveSummaryProps {
  report: ProjectReport;
}

export const ExecutiveSummary = ({ report }: ExecutiveSummaryProps) => {
  // Calcular métricas do projeto
  const totalFeatures = report.features.length;
  const featuresOnTrack = report.features.filter(f => f.status === 'green').length;
  const featuresAtRisk = report.features.filter(f => f.status === 'yellow').length;
  const featuresCritical = report.features.filter(f => f.status === 'red').length;
  
  const totalBlockers = report.blockers.length;
  const criticalBlockers = report.blockers.filter(b => b.severity === 'critical').length;
  
  const phases = Object.values(report.timeline);
  const overallProgress = Math.round(phases.reduce((sum, phase) => sum + phase.progress, 0) / phases.length);
  
  const healthScore = Math.round(
    ((featuresOnTrack * 3 + featuresAtRisk * 1.5) / (totalFeatures * 3)) * 100
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Health Score */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{healthScore}%</div>
            <div className="text-sm text-muted-foreground">Health Score</div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-status-green-light rounded-lg">
                <CheckCircle className="h-6 w-6 text-status-green" />
              </div>
              <div>
                <div className="text-2xl font-bold text-status-green">{featuresOnTrack}</div>
                <div className="text-xs text-muted-foreground">Features No Track</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-status-yellow-light rounded-lg">
                <AlertTriangle className="h-6 w-6 text-status-yellow" />
              </div>
              <div>
                <div className="text-2xl font-bold text-status-yellow">{featuresAtRisk}</div>
                <div className="text-xs text-muted-foreground">Features Atenção</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-status-red-light rounded-lg">
                <TrendingDown className="h-6 w-6 text-status-red" />
              </div>
              <div>
                <div className="text-2xl font-bold text-status-red">{featuresCritical}</div>
                <div className="text-xs text-muted-foreground">Features Críticas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
                <div className="text-xs text-muted-foreground">Progresso Geral</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status de alta prioridade */}
      {(criticalBlockers > 0 || featuresCritical > 0) && (
        <Card className="shadow-card border-status-red bg-status-red-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-status-red">
              <AlertTriangle className="h-5 w-5" />
              Itens que Requerem Atenção Imediata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalBlockers > 0 && (
                <div className="text-sm">
                  <span className="font-semibold">{criticalBlockers} bloqueio(s) crítico(s)</span> impedem o progresso
                </div>
              )}
              {featuresCritical > 0 && (
                <div className="text-sm">
                  <span className="font-semibold">{featuresCritical} feature(s) crítica(s)</span> fora do cronograma
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};