import { CheckSquare, Clock, User, Calendar } from 'lucide-react';
import { Action } from '@/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActionsSectionProps {
  actions: Action[];
}

export const ActionsSection = ({ actions }: ActionsSectionProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getPriorityConfig = (priority: Action['priority']) => {
    switch (priority) {
      case 'high':
        return {
          color: 'text-status-red',
          bg: 'bg-status-red-light',
          border: 'border-status-red',
          label: 'Alta'
        };
      case 'medium':
        return {
          color: 'text-status-yellow',
          bg: 'bg-status-yellow-light',
          border: 'border-status-yellow',
          label: 'Média'
        };
      case 'low':
        return {
          color: 'text-status-green',
          bg: 'bg-status-green-light',
          border: 'border-status-green',
          label: 'Baixa'
        };
    }
  };

  const getStatusConfig = (status: Action['status']) => {
    switch (status) {
      case 'completed':
        return {
          color: 'text-status-green',
          bg: 'bg-status-green-light',
          label: 'Concluída',
          icon: '✅'
        };
      case 'in-progress':
        return {
          color: 'text-status-blue',
          bg: 'bg-status-blue-light',
          label: 'Em Andamento',
          icon: '🔄'
        };
      case 'pending':
        return {
          color: 'text-muted-foreground',
          bg: 'bg-muted',
          label: 'Pendente',
          icon: '⏳'
        };
    }
  };

  const sortedActions = [...actions].sort((a, b) => {
    // Primeiro por status (pendentes e em andamento primeiro)
    const statusOrder = { pending: 0, 'in-progress': 1, completed: 2 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    
    // Depois por prioridade
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Por último por data
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CheckSquare className="h-6 w-6 text-primary" />
          Próximas Ações ({actions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedActions.length > 0 ? (
            sortedActions.map((action) => {
              const priorityConfig = getPriorityConfig(action.priority);
              const statusConfig = getStatusConfig(action.status);
              const overdue = isOverdue(action.dueDate) && action.status !== 'completed';
              
              return (
                <Card key={action.id} className={`border-2 ${action.status === 'completed' ? 'opacity-75' : ''} hover:shadow-md transition-all duration-200`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${statusConfig.bg}`}>
                        <CheckSquare className={`h-6 w-6 ${statusConfig.color}`} />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-semibold text-lg ${action.status === 'completed' ? 'line-through' : ''}`}>
                            {action.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color}`}>
                              {priorityConfig.label}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                              {statusConfig.icon} {statusConfig.label}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {action.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground">Responsável:</span>
                              <span className="ml-1 text-sm font-medium">{action.owner}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground">Data limite:</span>
                              <span className={`ml-1 text-sm font-medium ${overdue ? 'text-status-red' : ''}`}>
                                {formatDate(action.dueDate)}
                                {overdue && ' ⚠️'}
                              </span>
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
              <CheckSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Nenhuma ação pendente</p>
              <p className="text-sm">Todas as tarefas estão concluídas!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};