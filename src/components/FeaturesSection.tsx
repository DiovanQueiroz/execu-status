import { Package, Calendar, User, AlertCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { Feature } from '@/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeaturesSectionProps {
  features: Feature[];
}

export const FeaturesSection = ({ features }: FeaturesSectionProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getPhaseLabel = (phase: Feature['phase']) => {
    const phaseLabels = {
      requirements: 'Requirements',
      development: 'Development', 
      qa: 'QA & Testing'
    };
    return phaseLabels[phase];
  };

  const sortedFeatures = [...features].sort((a, b) => {
    // Ordenar por status (críticas primeiro) e depois por data
    const statusOrder = { red: 0, yellow: 1, green: 2 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Package className="h-6 w-6 text-primary" />
          Features do Projeto ({features.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedFeatures.map((feature) => (
            <Card key={feature.id} className="border-2 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* Nome e Status */}
                  <div className="lg:col-span-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1">{feature.name}</h3>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={feature.status} size="sm" />
                          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                            {getPhaseLabel(feature.phase)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progresso */}
                  <div className="lg:col-span-2">
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Progresso</span>
                      <ProgressBar 
                        value={feature.progress} 
                        variant={feature.status === 'green' ? 'success' : feature.status === 'yellow' ? 'warning' : 'danger'}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Responsável */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{feature.owner}</span>
                    </div>
                  </div>

                  {/* Data de Entrega */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={`text-sm ${isOverdue(feature.dueDate) && feature.status !== 'green' ? 'text-status-red font-semibold' : ''}`}>
                        {formatDate(feature.dueDate)}
                      </span>
                      {isOverdue(feature.dueDate) && feature.status !== 'green' && (
                        <AlertCircle className="h-4 w-4 text-status-red" />
                      )}
                    </div>
                  </div>

                  {/* Concerns */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-end">
                      {feature.concerns && (
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded max-w-xs">
                          <div className="flex items-start gap-1">
                            <AlertCircle className="h-3 w-3 mt-0.5 text-status-yellow flex-shrink-0" />
                            <span className="line-clamp-2">{feature.concerns}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Concerns expandidas em mobile */}
                <div className="lg:hidden mt-3">
                  {feature.concerns && (
                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-status-yellow flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Pontos de atenção:</span>
                          <p className="mt-1">{feature.concerns}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};