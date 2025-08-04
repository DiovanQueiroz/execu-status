import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Action } from '@/types/report';
import { Plus, Trash2, Edit3 } from 'lucide-react';

interface EditActionsTabProps {
  actions: Action[];
  onUpdate: (actions: Action[]) => void;
}

export const EditActionsTab = ({ actions, onUpdate }: EditActionsTabProps) => {
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [editingActionTitle, setEditingActionTitle] = useState('');
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
  const [newlyCreated, setNewlyCreated] = useState<Set<string>>(new Set());

  // Remove destaque de itens recém-criados após 3 segundos
  useEffect(() => {
    if (newlyCreated.size > 0) {
      const timer = setTimeout(() => {
        setNewlyCreated(new Set());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [newlyCreated]);

  const addAction = () => {
    const newActionId = `action-${Date.now()}`;
    const newAction: Action = {
      id: newActionId,
      title: 'Nova Ação',
      description: '',
      owner: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      status: 'pending'
    };
    
    onUpdate([...actions, newAction]);
    
    // Expande automaticamente a nova ação
    setExpandedActions(prev => new Set(prev).add(newActionId));
    
    // Marca como recém-criada
    setNewlyCreated(prev => new Set(prev).add(newActionId));
    
    // Coloca em modo de edição
    setEditingAction(newActionId);
    setEditingActionTitle('');
  };

  const deleteAction = (actionId: string) => {
    onUpdate(actions.filter(a => a.id !== actionId));
  };

  const updateAction = (actionId: string, updates: Partial<Action>) => {
    onUpdate(actions.map(a => a.id === actionId ? { ...a, ...updates } : a));
  };

  const toggleActionExpansion = (actionId: string) => {
    const newExpanded = new Set(expandedActions);
    if (newExpanded.has(actionId)) {
      newExpanded.delete(actionId);
    } else {
      newExpanded.add(actionId);
    }
    setExpandedActions(newExpanded);
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
          <Card 
            key={action.id} 
            className={`transition-all duration-300 ${
              newlyCreated.has(action.id) 
                ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' 
                : ''
            }`}
          >
            <Collapsible 
              open={expandedActions.has(action.id)} 
              onOpenChange={() => toggleActionExpansion(action.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="text-base flex items-center justify-between">
                    {editingAction === action.id ? (
                      <Input
                        value={editingActionTitle}
                        onChange={(e) => setEditingActionTitle(e.target.value)}
                        onBlur={() => {
                          updateAction(action.id, { title: editingActionTitle });
                          setEditingAction(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateAction(action.id, { title: editingActionTitle });
                            setEditingAction(null);
                          }
                          if (e.key === 'Escape') {
                            setEditingAction(null);
                            setEditingActionTitle(action.title);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mr-2"
                        autoFocus
                      />
                    ) : (
                      <span>{action.title}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAction(action.id);
                          setEditingActionTitle(action.title);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAction(action.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`description-${action.id}`}>Descrição</Label>
                      <Textarea
                        id={`description-${action.id}`}
                        value={action.description}
                        onChange={(e) => updateAction(action.id, { description: e.target.value })}
                        rows={3}
                        placeholder="Descreva a ação a ser realizada..."
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <Label htmlFor={`owner-${action.id}`}>Responsável</Label>
                        <Input
                          id={`owner-${action.id}`}
                          value={action.owner}
                          onChange={(e) => updateAction(action.id, { owner: e.target.value })}
                          placeholder="Nome do responsável"
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
                        <Select value={action.priority} onValueChange={(value: Action['priority']) => updateAction(action.id, { priority: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`status-${action.id}`}>Status</Label>
                        <Select value={action.status} onValueChange={(value: Action['status']) => updateAction(action.id, { status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="in-progress">Em Progresso</SelectItem>
                            <SelectItem value="completed">Concluída</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};