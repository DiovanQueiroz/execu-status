import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Blocker } from '@/types/report';
import { Plus, Trash2, Edit3 } from 'lucide-react';

interface EditBlockersTabProps {
  blockers: Blocker[];
  onUpdate: (blockers: Blocker[]) => void;
}

export const EditBlockersTab = ({ blockers, onUpdate }: EditBlockersTabProps) => {
  const [editingBlocker, setEditingBlocker] = useState<string | null>(null);
  const [editingBlockerTitle, setEditingBlockerTitle] = useState('');
  const [expandedBlockers, setExpandedBlockers] = useState<Set<string>>(new Set());
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

  const addBlocker = () => {
    const newBlockerId = `blocker-${Date.now()}`;
    const newBlocker: Blocker = {
      id: newBlockerId,
      title: 'Novo Bloqueio',
      description: '',
      severity: 'medium',
      owner: '',
      estimatedResolution: new Date().toISOString().split('T')[0]
    };
    
    onUpdate([...blockers, newBlocker]);
    
    // Expande automaticamente o novo blocker
    setExpandedBlockers(prev => new Set(prev).add(newBlockerId));
    
    // Marca como recém-criado
    setNewlyCreated(prev => new Set(prev).add(newBlockerId));
    
    // Coloca em modo de edição
    setEditingBlocker(newBlockerId);
    setEditingBlockerTitle('');
  };

  const deleteBlocker = (blockerId: string) => {
    onUpdate(blockers.filter(b => b.id !== blockerId));
  };

  const updateBlocker = (blockerId: string, updates: Partial<Blocker>) => {
    onUpdate(blockers.map(b => b.id === blockerId ? { ...b, ...updates } : b));
  };

  const toggleBlockerExpansion = (blockerId: string) => {
    const newExpanded = new Set(expandedBlockers);
    if (newExpanded.has(blockerId)) {
      newExpanded.delete(blockerId);
    } else {
      newExpanded.add(blockerId);
    }
    setExpandedBlockers(newExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-status-red">🚫 Bloqueios</h3>
        <Button onClick={addBlocker} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Bloqueio
        </Button>
      </div>

      <div className="space-y-3">
        {blockers.map((blocker) => (
          <Card 
            key={blocker.id} 
            className={`transition-all duration-300 ${
              newlyCreated.has(blocker.id) 
                ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' 
                : ''
            }`}
          >
            <Collapsible 
              open={expandedBlockers.has(blocker.id)} 
              onOpenChange={() => toggleBlockerExpansion(blocker.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="text-base flex items-center justify-between">
                    {editingBlocker === blocker.id ? (
                      <Input
                        value={editingBlockerTitle}
                        onChange={(e) => setEditingBlockerTitle(e.target.value)}
                        onBlur={() => {
                          updateBlocker(blocker.id, { title: editingBlockerTitle });
                          setEditingBlocker(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateBlocker(blocker.id, { title: editingBlockerTitle });
                            setEditingBlocker(null);
                          }
                          if (e.key === 'Escape') {
                            setEditingBlocker(null);
                            setEditingBlockerTitle(blocker.title);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mr-2"
                        autoFocus
                      />
                    ) : (
                      <span>{blocker.title}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBlocker(blocker.id);
                          setEditingBlockerTitle(blocker.title);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlocker(blocker.id);
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
                      <Label htmlFor={`description-${blocker.id}`}>Descrição</Label>
                      <Textarea
                        id={`description-${blocker.id}`}
                        value={blocker.description}
                        onChange={(e) => updateBlocker(blocker.id, { description: e.target.value })}
                        rows={3}
                        placeholder="Descreva este bloqueio..."
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`severity-${blocker.id}`}>Severidade</Label>
                        <Select 
                          value={blocker.severity} 
                          onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => updateBlocker(blocker.id, { severity: value })}
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
                        <Label htmlFor={`owner-${blocker.id}`}>Responsável</Label>
                        <Input
                          id={`owner-${blocker.id}`}
                          value={blocker.owner}
                          onChange={(e) => updateBlocker(blocker.id, { owner: e.target.value })}
                          placeholder="Nome do responsável"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`resolution-${blocker.id}`}>Previsão de Resolução</Label>
                        <Input
                          id={`resolution-${blocker.id}`}
                          type="date"
                          value={blocker.estimatedResolution}
                          onChange={(e) => updateBlocker(blocker.id, { estimatedResolution: e.target.value })}
                        />
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