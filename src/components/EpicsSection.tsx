import { useState } from 'react';
import { Package, Calendar, User, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { Epic } from '@/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EpicsSectionProps {
  epics: Epic[];
}

export const EpicsSection = ({ epics }: EpicsSectionProps) => {
  const [openEpics, setOpenEpics] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getPhaseLabel = (phase: Epic['phase']) => {
    const phaseLabels = {
      requirements: 'Requirements',
      development: 'Development', 
      qa: 'QA & Testing'
    };
    return phaseLabels[phase];
  };

  const calculateEpicProgress = (stories: Epic['userStories']) => {
    if (stories.length === 0) return 0;
    const totalProgress = stories.reduce((sum, story) => sum + story.progress, 0);
    return Math.round(totalProgress / stories.length);
  };

  const toggleEpic = (epicId: string) => {
    const newOpenEpics = new Set(openEpics);
    if (newOpenEpics.has(epicId)) {
      newOpenEpics.delete(epicId);
    } else {
      newOpenEpics.add(epicId);
    }
    setOpenEpics(newOpenEpics);
  };

  const sortedEpics = [...epics].sort((a, b) => {
    // Ordenar por status (críticas primeiro) e depois por data
    const statusOrder = { red: 0, yellow: 1, green: 2 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Package className="h-6 w-6 text-primary" />
          Épicos do Projeto ({epics.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEpics.map((epic) => {
            const isOpen = openEpics.has(epic.id);
            const epicProgress = calculateEpicProgress(epic.userStories);
            
            return (
              <Collapsible key={epic.id} open={isOpen} onOpenChange={() => toggleEpic(epic.id)}>
                <Card className="border-2 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <CollapsibleTrigger className="w-full">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* Nome, Status e Timeline */}
                        <div className="lg:col-span-5">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {isOpen ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <h3 className="font-semibold text-base mb-1">{epic.name}</h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <StatusBadge status={epic.status} size="sm" />
                                <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                                  {getPhaseLabel(epic.phase)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {epic.userStories.length} stories
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progresso */}
                        <div className="lg:col-span-2">
                          <div className="space-y-1">
                            <span className="text-sm font-medium">Progresso</span>
                            <ProgressBar 
                              value={epicProgress} 
                              variant={epic.status === 'green' ? 'success' : epic.status === 'yellow' ? 'warning' : 'danger'}
                              size="sm"
                            />
                          </div>
                        </div>

                        {/* Responsável */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{epic.owner}</span>
                          </div>
                        </div>

                        {/* Data de Entrega */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className={`text-sm ${isOverdue(epic.dueDate) && epic.status !== 'green' ? 'text-status-red font-semibold' : ''}`}>
                              {formatDate(epic.dueDate)}
                            </span>
                            {isOverdue(epic.dueDate) && epic.status !== 'green' && (
                              <AlertCircle className="h-4 w-4 text-status-red" />
                            )}
                          </div>
                        </div>

                        {/* Concerns */}
                        <div className="lg:col-span-1">
                          <div className="flex items-center justify-end">
                            {epic.concerns && (
                              <AlertCircle className="h-4 w-4 text-status-yellow" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    {/* Concerns expandidas em mobile */}
                    <div className="lg:hidden mt-3">
                      {epic.concerns && (
                        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-status-yellow flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium">Pontos de atenção:</span>
                              <p className="mt-1">{epic.concerns}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <CollapsibleContent>
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium text-sm mb-3 text-muted-foreground">User Stories</h4>
                        <div className="space-y-2">
                          {epic.userStories.map((story) => (
                            <div key={story.id} className="flex items-center justify-between p-3 bg-muted/30 rounded text-sm">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="font-mono text-xs text-muted-foreground">
                                  {story.ticketNumber}
                                </span>
                                <span className="flex-1">{story.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs px-2 py-1 bg-muted rounded">
                                  {story.boardStatus}
                                </span>
                                <div className="w-16">
                                  <ProgressBar 
                                    value={story.progress} 
                                    size="sm" 
                                    showValue={false}
                                    variant={story.progress === 100 ? 'success' : story.progress > 0 ? 'warning' : 'default'}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};