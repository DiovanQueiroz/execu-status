import { HelpCircle, Building2, AlertCircle, User } from 'lucide-react';
import { HelpRequest } from '@/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HelpRequestsSectionProps {
  helpRequests: HelpRequest[];
}

export const HelpRequestsSection = ({ helpRequests }: HelpRequestsSectionProps) => {
  const getUrgencyConfig = (urgency: HelpRequest['urgency']) => {
    switch (urgency) {
      case 'urgent':
        return {
          color: 'text-status-red',
          bg: 'bg-status-red-light',
          border: 'border-status-red',
          label: 'Urgente'
        };
      case 'high':
        return {
          color: 'text-status-yellow',
          bg: 'bg-status-yellow-light',
          border: 'border-status-yellow', 
          label: 'Alta'
        };
      case 'normal':
        return {
          color: 'text-status-green',
          bg: 'bg-status-green-light',
          border: 'border-status-green',
          label: 'Normal'
        };
    }
  };

  const getDepartmentIcon = (department: string) => {
    const dept = department.toLowerCase();
    if (dept.includes('infra')) return '🔧';
    if (dept.includes('comercial') || dept.includes('vendas')) return '💼';
    if (dept.includes('design') || dept.includes('ux')) return '🎨';
    if (dept.includes('marketing')) return '📢';
    if (dept.includes('juridico') || dept.includes('legal')) return '⚖️';
    if (dept.includes('financeiro')) return '💰';
    return '🏢';
  };

  const sortedRequests = [...helpRequests].sort((a, b) => {
    const urgencyOrder = { urgent: 0, high: 1, normal: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <HelpCircle className="h-6 w-6 text-primary" />
          Pedidos de Ajuda ({helpRequests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedRequests.length > 0 ? (
            sortedRequests.map((request) => {
              const urgencyConfig = getUrgencyConfig(request.urgency);
              
              return (
                <Card key={request.id} className={`border-2 ${urgencyConfig.border} hover:shadow-md transition-all duration-200`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${urgencyConfig.bg}`}>
                        <HelpCircle className={`h-6 w-6 ${urgencyConfig.color}`} />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-lg">{request.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${urgencyConfig.bg} ${urgencyConfig.color}`}>
                            {urgencyConfig.label}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {request.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Departamento:</span>
                              <span className="text-lg">{getDepartmentIcon(request.department)}</span>
                              <span className="text-sm font-medium">{request.department}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground">Solicitado por:</span>
                              <span className="ml-1 text-sm font-medium">{request.requestedBy}</span>
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
              <HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Nenhum pedido de ajuda pendente</p>
              <p className="text-sm">A equipe está autossuficiente!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};