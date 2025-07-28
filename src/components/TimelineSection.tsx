import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { ProjectReport } from '@/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimelineSectionProps {
  timeline: ProjectReport['timeline'];
  features: ProjectReport['features'];
}

export const TimelineSection = ({ timeline, features }: TimelineSectionProps) => {
  const phases = [
    { key: 'requirements', phase: timeline.requirements },
    { key: 'development', phase: timeline.development },
    { key: 'qa', phase: timeline.qa }
  ];

  const getPhaseFeatures = (phaseKey: string) => {
    return features.filter(feature => feature.phase === phaseKey);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="h-6 w-6 text-primary" />
          Timeline Macro do Projeto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {phases.map(({ key, phase }, index) => {
            const phaseFeatures = getPhaseFeatures(key);
            const criticalFeatures = phaseFeatures.filter(f => f.status === 'red');
            
            return (
              <div key={key} className="relative">
                {/* Connector line */}
                {index < phases.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-6 h-0.5 bg-border translate-x-3" />
                )}
                
                <Card className="h-full border-2 hover:shadow-elevated transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{phase.name}</CardTitle>
                      <StatusBadge status={phase.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progresso</span>
                        <span className="text-sm text-muted-foreground">{phase.progress}%</span>
                      </div>
                      <ProgressBar 
                        value={phase.progress} 
                        variant={phase.status === 'green' ? 'success' : phase.status === 'yellow' ? 'warning' : 'danger'}
                        showValue={false}
                      />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {phase.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">
                        Features ({phaseFeatures.length})
                      </h4>
                      <div className="space-y-2">
                        {phaseFeatures.slice(0, 3).map(feature => (
                          <div key={feature.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-xs truncate flex-1">{feature.name}</span>
                            <StatusBadge status={feature.status} size="sm" />
                          </div>
                        ))}
                        {phaseFeatures.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center py-1">
                            +{phaseFeatures.length - 3} mais
                          </div>
                        )}
                      </div>
                    </div>

                    {criticalFeatures.length > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-status-red-light rounded">
                        <AlertCircle className="h-4 w-4 text-status-red" />
                        <span className="text-xs text-status-red font-medium">
                          {criticalFeatures.length} feature(s) crítica(s)
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};