import { Shield, AlertTriangle, Clock, User } from 'lucide-react';
import { Blocker } from '@/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BlockersSectionProps {
  blockers: Blocker[];
}

export const BlockersSection = ({ blockers }: BlockersSectionProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getSeverityConfig = (severity: Blocker['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          color: 'text-status-red',
          bg: 'bg-status-red-light',
          border: 'border-status-red',
          label: 'Crítico'
        };
      case 'high':
        return {
          color: 'text-status-yellow',
          bg: 'bg-status-yellow-light', 
          border: 'border-status-yellow',
          label: 'Alto'
        };
      case 'medium':
        return {
          color: 'text-status-blue',
          bg: 'bg-status-blue-light',
          border: 'border-status-blue', 
          label: 'Médio'
        };
    }
  };

  const sortedBlockers = [...blockers].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Shield className="h-6 w-6 text-status-red" />
          Bloqueios e Impedimentos ({blockers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedBlockers.length > 0 ? (
            sortedBlockers.map((blocker) => {
              const severityConfig = getSeverityConfig(blocker.severity);
              
              return (
                <Card key={blocker.id} className={`border-2 ${severityConfig.border} hover:shadow-md transition-all duration-200`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${severityConfig.bg}`}>
                        <AlertTriangle className={`h-6 w-6 ${severityConfig.color}`} />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-lg">{blocker.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${severityConfig.bg} ${severityConfig.color}`}>
                            {severityConfig.label}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {blocker.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground">Responsável:</span>
                              <span className="ml-1 text-sm font-medium">{blocker.owner}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground">Resolução esperada:</span>
                              <span className="ml-1 text-sm font-medium">{formatDate(blocker.estimatedResolution)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Nenhum bloqueio ativo</p>
              <p className="text-sm">O projeto está livre de impedimentos!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};