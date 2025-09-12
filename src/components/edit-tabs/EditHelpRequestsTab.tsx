import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpRequest } from '@/types/report';
import { Plus, Trash2 } from 'lucide-react';

interface EditHelpRequestsTabProps {
  helpRequests: HelpRequest[];
  onUpdate: (helpRequests: HelpRequest[]) => void;
}

export const EditHelpRequestsTab = ({ helpRequests, onUpdate }: EditHelpRequestsTabProps) => {
  const addHelpRequest = () => {
    const newHelpRequest: HelpRequest = {
      id: `help-${Date.now()}`,
      title: 'Nova Solicitação de Ajuda',
      description: '',
      department: '',
      urgency: 'medium',
      requestedBy: ''
    };
    onUpdate([...helpRequests, newHelpRequest]);
  };

  const deleteHelpRequest = (helpId: string) => {
    onUpdate(helpRequests.filter(h => h.id !== helpId));
  };

  const updateHelpRequest = (helpId: string, updates: Partial<HelpRequest>) => {
    onUpdate(helpRequests.map(h => h.id === helpId ? { ...h, ...updates } : h));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-primary">❓ Solicitações de Ajuda</h3>
        <Button onClick={addHelpRequest} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Solicitação
        </Button>
      </div>

      <div className="space-y-3">
        {helpRequests.map((helpRequest) => (
          <Card key={helpRequest.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <Input
                  value={helpRequest.title}
                  onChange={(e) => updateHelpRequest(helpRequest.id, { title: e.target.value })}
                  className="text-base font-medium"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteHelpRequest(helpRequest.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`desc-${helpRequest.id}`}>Descrição</Label>
                  <Textarea
                    id={`desc-${helpRequest.id}`}
                    value={helpRequest.description}
                    onChange={(e) => updateHelpRequest(helpRequest.id, { description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`department-${helpRequest.id}`}>Departamento</Label>
                    <Input
                      id={`department-${helpRequest.id}`}
                      value={helpRequest.department}
                      onChange={(e) => updateHelpRequest(helpRequest.id, { department: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`urgency-${helpRequest.id}`}>Urgência</Label>
                    <Select 
                      value={helpRequest.urgency} 
                      onValueChange={(value: 'low' | 'medium' | 'high') => updateHelpRequest(helpRequest.id, { urgency: value })}
                    >
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
                    <Label htmlFor={`requestedBy-${helpRequest.id}`}>Solicitado por</Label>
                    <Input
                      id={`requestedBy-${helpRequest.id}`}
                      value={helpRequest.requestedBy}
                      onChange={(e) => updateHelpRequest(helpRequest.id, { requestedBy: e.target.value })}
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