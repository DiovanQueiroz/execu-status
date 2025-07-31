import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Blocker } from '@/types/report';
import { Plus, Trash2 } from 'lucide-react';

interface EditBlockersTabProps {
  blockers: Blocker[];
  onUpdate: (blockers: Blocker[]) => void;
}

export const EditBlockersTab = ({ blockers, onUpdate }: EditBlockersTabProps) => {
  const addBlocker = () => {
    const newBlocker: Blocker = {
      id: `blocker-${Date.now()}`,
      title: 'Novo Bloqueio',
      description: '',
      severity: 'medium',
      owner: '',
      estimatedResolution: new Date().toISOString().split('T')[0]
    };
    onUpdate([...blockers, newBlocker]);
  };

  const deleteBlocker = (blockerId: string) => {
    onUpdate(blockers.filter(b => b.id !== blockerId));
  };

  const updateBlocker = (blockerId: string, updates: Partial<Blocker>) => {
    onUpdate(blockers.map(b => b.id === blockerId ? { ...b, ...updates } : b));
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
          <Card key={blocker.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <Input
                  value={blocker.title}
                  onChange={(e) => updateBlocker(blocker.id, { title: e.target.value })}
                  className="text-base font-medium"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteBlocker(blocker.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`desc-${blocker.id}`}>Descrição</Label>
                  <Textarea
                    id={`desc-${blocker.id}`}
                    value={blocker.description}
                    onChange={(e) => updateBlocker(blocker.id, { description: e.target.value })}
                    rows={3}
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
          </Card>
        ))}
      </div>
    </div>
  );
};