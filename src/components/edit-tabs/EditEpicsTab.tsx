import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Epic, UserStory } from '@/types/report';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EditEpicsTabProps {
  epics: Epic[];
  onUpdate: (epics: Epic[]) => void;
}

export const EditEpicsTab = ({ epics, onUpdate }: EditEpicsTabProps) => {
  const [editingEpic, setEditingEpic] = useState<string | null>(null);
  const [editingEpicName, setEditingEpicName] = useState('');
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set());
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

  const addEpic = () => {
    const newEpicId = `epic-${Date.now()}`;
    const newEpic: Epic = {
      id: newEpicId,
      name: 'Novo Épico',
      status: 'green',
      owner: '',
      dueDate: new Date().toISOString().split('T')[0],
      phase: 'requirements',
      userStories: [],
      concerns: '' // Sempre incluir campo de preocupações
    };
    
    // Adiciona o épico e automaticamente o expande
    onUpdate([...epics, newEpic]);
    
    // Expande automaticamente o novo épico
    setExpandedEpics(prev => new Set(prev).add(newEpicId));
    
    // Marca como recém-criado para animação
    setNewlyCreated(prev => new Set(prev).add(newEpicId));
    
    // Coloca o novo épico em modo de edição de nome
    setEditingEpic(newEpicId);
    setEditingEpicName('');
  };

  const deleteEpic = (epicId: string) => {
    onUpdate(epics.filter(e => e.id !== epicId));
  };

  const updateEpic = (epicId: string, updates: Partial<Epic>) => {
    onUpdate(epics.map(e => e.id === epicId ? { ...e, ...updates } : e));
  };

  const addUserStory = (epicId: string) => {
    const newStory: UserStory = {
      id: `story-${Date.now()}`,
      ticketNumber: '',
      name: '',
      boardStatus: '',
      progress: 0
    };
    
    updateEpic(epicId, {
      userStories: [...epics.find(e => e.id === epicId)!.userStories, newStory]
    });
  };

  const deleteUserStory = (epicId: string, storyId: string) => {
    const epic = epics.find(e => e.id === epicId)!;
    updateEpic(epicId, {
      userStories: epic.userStories.filter(s => s.id !== storyId)
    });
  };

  const updateUserStory = (epicId: string, storyId: string, updates: Partial<UserStory>) => {
    const epic = epics.find(e => e.id === epicId)!;
    updateEpic(epicId, {
      userStories: epic.userStories.map(s => s.id === storyId ? { ...s, ...updates } : s)
    });
  };

  const toggleEpicExpansion = (epicId: string) => {
    const newExpanded = new Set(expandedEpics);
    if (newExpanded.has(epicId)) {
      newExpanded.delete(epicId);
    } else {
      newExpanded.add(epicId);
    }
    setExpandedEpics(newExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Épicos do Projeto</h3>
        <Button onClick={addEpic} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Épico
        </Button>
      </div>

      <div className="space-y-3">
        {epics.map((epic) => (
          <Card 
            key={epic.id} 
            className={`transition-all duration-300 ${
              newlyCreated.has(epic.id) 
                ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' 
                : ''
            }`}
          >
            <Collapsible 
              open={expandedEpics.has(epic.id)} 
              onOpenChange={() => toggleEpicExpansion(epic.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="text-base flex items-center justify-between">
                    {editingEpic === epic.id ? (
                      <Input
                        value={editingEpicName}
                        onChange={(e) => setEditingEpicName(e.target.value)}
                        onBlur={() => {
                          updateEpic(epic.id, { name: editingEpicName });
                          setEditingEpic(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateEpic(epic.id, { name: editingEpicName });
                            setEditingEpic(null);
                          }
                          if (e.key === 'Escape') {
                            setEditingEpic(null);
                            setEditingEpicName(epic.name);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mr-2"
                        autoFocus
                      />
                    ) : (
                      <span>{epic.name}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEpic(epic.id);
                          setEditingEpicName(epic.name);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEpic(epic.id);
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
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`owner-${epic.id}`}>Owner</Label>
                      <Input
                        id={`owner-${epic.id}`}
                        value={epic.owner}
                        onChange={(e) => updateEpic(epic.id, { owner: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`dueDate-${epic.id}`}>Data de Entrega</Label>
                      <Input
                        id={`dueDate-${epic.id}`}
                        type="date"
                        value={epic.dueDate}
                        onChange={(e) => updateEpic(epic.id, { dueDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`status-${epic.id}`}>Status</Label>
                      <Select value={epic.status} onValueChange={(value: 'green' | 'yellow' | 'red') => updateEpic(epic.id, { status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="green">Verde (No Track)</SelectItem>
                          <SelectItem value="yellow">Amarelo (Atenção)</SelectItem>
                          <SelectItem value="red">Vermelho (Crítico)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`phase-${epic.id}`}>Fase</Label>
                      <Select value={epic.phase} onValueChange={(value: Epic['phase']) => updateEpic(epic.id, { phase: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="requirements">Requirements</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="qa">QA & Testing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor={`concerns-${epic.id}`}>Preocupações</Label>
                    <Textarea
                      id={`concerns-${epic.id}`}
                      value={epic.concerns || ''}
                      onChange={(e) => updateEpic(epic.id, { concerns: e.target.value })}
                      placeholder="Descreva as preocupações sobre este épico..."
                      rows={2}
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">User Stories</h4>
                      <Button onClick={() => addUserStory(epic.id)} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Story
                      </Button>
                    </div>

                    {epic.userStories.map((story) => (
                      <div key={story.id} className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/50 rounded">
                        <div className="col-span-2">
                          <Input
                            value={story.ticketNumber}
                            onChange={(e) => updateUserStory(epic.id, story.id, { ticketNumber: e.target.value })}
                            className="text-xs"
                          />
                        </div>
                        <div className="col-span-4">
                          <Input
                            value={story.name}
                            onChange={(e) => updateUserStory(epic.id, story.id, { name: e.target.value })}
                            className="text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={story.boardStatus}
                            onChange={(e) => updateUserStory(epic.id, story.id, { boardStatus: e.target.value })}
                            className="text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={story.progress}
                            onChange={(e) => updateUserStory(epic.id, story.id, { progress: parseInt(e.target.value) || 0 })}
                            className="text-xs"
                          />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteUserStory(epic.id, story.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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