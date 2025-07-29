import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { ProjectReport } from '@/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimelineSectionProps {
  timeline: ProjectReport['timeline'];
  epics: ProjectReport['epics'];
}

export const TimelineSection = ({ timeline, epics }: TimelineSectionProps) => {
  const phases = [
    { key: 'requirements', phase: timeline.requirements },
    { key: 'development', phase: timeline.development },
    { key: 'qa', phase: timeline.qa }
  ];

  const getPhaseEpics = (phaseKey: string) => {
    return epics.filter(epic => epic.phase === phaseKey);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {phases.map(({ key, phase }, index) => {
            const phaseEpics = getPhaseEpics(key);
            const criticalEpics = phaseEpics.filter(f => f.status === 'red');
            
            return (
              <div key={key} className="border rounded-lg p-3 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold">{phase.name}</div>
                  <StatusBadge status={phase.status} size="sm" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Progresso</span>
                    <span className="text-xs font-medium">{phase.progress}%</span>
                  </div>
                  <ProgressBar 
                    value={phase.progress} 
                    variant={phase.status === 'green' ? 'success' : phase.status === 'yellow' ? 'warning' : 'danger'}
                    size="sm"
                    showValue={false}
                  />

                  <div className="text-xs text-muted-foreground">
                    {phaseEpics.length} épicos
                    {criticalEpics.length > 0 && (
                      <span className="text-status-red font-medium ml-2">
                        ({criticalEpics.length} críticos)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};