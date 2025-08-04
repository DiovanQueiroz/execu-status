import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { HelpRequest } from '@/types/report';
import { Plus, Trash2, Edit3 } from 'lucide-react';

interface EditHelpRequestsTabProps {
  helpRequests: HelpRequest[];
  onUpdate: (helpRequests: HelpRequest[]) => void;
}

export const EditHelpRequestsTab = ({ helpRequests, onUpdate }: EditHelpRequestsTabProps) => {
  const [editingHelpRequest, setEditingHelpRequest] = useState<string | null>(null);
  const [editingHelpRequestTitle, setEditingHelpRequestTitle] = useState('');
  const [expandedHelpRequests, setExpandedHelpRequests] = useState<Set<string>>(new Set());
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

  const addHelpRequest = () => {
    const newHelpRequestId = `help-${Date.now()}`;
    const newHelpRequest: HelpRequest = {
      id: newHelpRequestId,
      title: 'Nova Solicitação de Ajuda',
      description: '',
      department: '',
      urgency: 'medium',
      requestedBy: ''
    };
    
    onUpdate([...helpRequests, newHelpRequest]);
    
    // Expande automaticamente a nova solicitação
    setExpandedHelpRequests(prev => new Set(prev).add(newHelpRequestId));
    
    // Marca como recém-criada
    setNewlyCreated(prev => new Set(prev).add(newHelpRequestId));
    
    // Coloca em modo de edição
    setEditingHelpRequest(newHelpRequestId);
    setEditingHelpRequestTitle('');
  };

  const deleteHelpRequest = (helpId: string) => {
    onUpdate(helpRequests.filter(h => h.id !== helpId));
  };

  const updateHelpRequest = (helpId: string, updates: Partial<HelpRequest>) => {
    onUpdate(helpRequests.map(h => h.id === helpId ? { ...h, ...updates } : h));
  };

  const toggleHelpRequestExpansion = (helpId: string) => {
    const newExpanded = new Set(expandedHelpRequests);
    if (newExpanded.has(helpId)) {
      newExpanded.delete(helpId);
    } else {
      newExpanded.add(helpId);
    }
    setExpandedHelpRequests(newExpanded);
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
          <Card 
            key={helpRequest.id} 
            className={`transition-all duration-300 ${
              newlyCreated.has(helpRequest.id) 
                ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' 
                : ''
            }`}
          >
            <Collapsible 
              open={expandedHelpRequests.has(helpRequest.id)} 
              onOpenChange={() => toggleHelpRequestExpansion(helpRequest.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="text-base flex items-center justify-between">
                    {editingHelpRequest === helpRequest.id ? (
                      <Input
                        value={editingHelpRequestTitle}
                        onChange={(e) => setEditingHelpRequestTitle(e.target.value)}
                        onBlur={() => {
                          updateHelpRequest(helpRequest.id, { title: editingHelpRequestTitle });
                          setEditingHelpRequest(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateHelpRequest(helpRequest.id, { title: editingHelpRequestTitle });
                            setEditingHelpRequest(null);
                          }
                          if (e.key === 'Escape') {
                            setEditingHelpRequest(null);
                            setEditingHelpRequestTitle(helpRequest.title);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mr-2"
                        autoFocus
                      />
                    ) : (
                      <span>{helpRequest.title}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingHelpRequest(helpRequest.id);
                          setEditingHelpRequestTitle(helpRequest.title);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHelpRequest(helpRequest.id);
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
                      <Label htmlFor={`description-${helpRequest.id}`}>Descrição</Label>
                      <Textarea
                        id={`description-${helpRequest.id}`}
                        value={helpRequest.description}
                        onChange={(e) => updateHelpRequest(helpRequest.id, { description: e.target.value })}
                        rows={3}
                        placeholder="Descreva a solicitação de ajuda..."
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`department-${helpRequest.id}`}>Departamento</Label>
                        <Input
                          id={`department-${helpRequest.id}`}
                          value={helpRequest.department}
                          onChange={(e) => updateHelpRequest(helpRequest.id, { department: e.target.value })}
                          placeholder="Nome do departamento"
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
                          placeholder="Nome do solicitante"
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