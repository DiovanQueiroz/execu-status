import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Action } from '@/types/report';
import { Plus, Trash2 } from 'lucide-react';

interface EditActionsTabProps {
  actions: Action[];
  onUpdate: (actions: Action[]) => void;
}

export const EditActionsTab = ({ actions, onUpdate }: EditActionsTabProps) => {
  const addAction = () => {
    const newAction: Action = {
      id: `action-${Date.now()}`,
      title: 'Nova Ação',
      description: '',
      owner: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      status: 'pending'
    };
    onUpdate([...actions, newAction]);
  };

  const deleteAction = (actionId: string) => {
    onUpdate(actions.filter(a => a.id !== actionId));
  };

  const updateAction = (actionId: string, updates: Partial<Action>) => {
    onUpdate(actions.map(a => a.id === actionId ? { ...a, ...updates } : a));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-status-blue">📋 Ações</h3>
        <Button onClick={addAction} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Ação
        </Button>
      </div>

      <div className="space-y-3">
        {actions.map((action) => (
          <Card key={action.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <Input
                  value={action.title}
                  onChange={(e) => updateAction(action.id, { title: e.target.value })}
                  className="text-base font-medium"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAction(action.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`desc-${action.id}`}>Descrição</Label>
                  <Textarea
                    id={`desc-${action.id}`}
                    value={action.description}
                    onChange={(e) => updateAction(action.id, { description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <Label htmlFor={`owner-${action.id}`}>Responsável</Label>
                    <Input
                      id={`owner-${action.id}`}
                      value={action.owner}
                      onChange={(e) => updateAction(action.id, { owner: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`dueDate-${action.id}`}>Data de Entrega</Label>
                    <Input
                      id={`dueDate-${action.id}`}
                      type="date"
                      value={action.dueDate}
                      onChange={(e) => updateAction(action.id, { dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`priority-${action.id}`}>Prioridade</Label>
                    <Select 
                      value={action.priority} 
                      onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => updateAction(action.id, { priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="critical">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`status-${action.id}`}>Status</Label>
                    <Select 
                      value={action.status} 
                      onValueChange={(value: 'pending' | 'in-progress' | 'completed') => updateAction(action.id, { status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in-progress">Em Progresso</SelectItem>
                        <SelectItem value="completed">Completa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};