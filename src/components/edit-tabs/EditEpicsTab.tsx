import { useState } from 'react';
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
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set());

  const addEpic = () => {
    const newEpic: Epic = {
      id: `epic-${Date.now()}`,
      name: 'Novo Épico',
      status: 'green',
      owner: '',
      dueDate: new Date().toISOString().split('T')[0],
      phase: 'requirements',
      userStories: []
    };
    onUpdate([...epics, newEpic]);
    setEditingEpic(newEpic.id);
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
      ticketNumber: `TICKET-${Math.floor(Math.random() * 1000)}`,
      name: 'Nova User Story',
      boardStatus: 'To Do',
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
          <Card key={epic.id}>
            <Collapsible 
              open={expandedEpics.has(epic.id)} 
              onOpenChange={() => toggleEpicExpansion(epic.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="text-base flex items-center justify-between">
                    {editingEpic === epic.id ? (
                      <Input
                        value={epic.name}
                        onChange={(e) => updateEpic(epic.id, { name: e.target.value })}
                        onBlur={() => setEditingEpic(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingEpic(null)}
                        autoFocus
                        className="text-base font-medium"
                      />
                    ) : (
                      <span onClick={(e) => e.stopPropagation()}>{epic.name}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEpic(epic.id);
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

                  {epic.concerns !== undefined && (
                    <div className="mb-4">
                      <Label htmlFor={`concerns-${epic.id}`}>Preocupações</Label>
                      <Textarea
                        id={`concerns-${epic.id}`}
                        value={epic.concerns || ''}
                        onChange={(e) => updateEpic(epic.id, { concerns: e.target.value || undefined })}
                        placeholder="Descreva as preocupações sobre este épico..."
                      />
                    </div>
                  )}

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