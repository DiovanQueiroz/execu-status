import { useState } from 'react';
import { Package, Calendar, User, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { Epic } from '@/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

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

  const getProgressBadge = (phase: Epic['phase']) => {
    const progressConfig = {
      requirements: { label: 'REQ', icon: '📋' },
      development: { label: 'DEV', icon: '👨‍💻' },
      qa: { label: 'QA', icon: '🔍' }
    };
    return progressConfig[phase];
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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5 text-primary" />
          Épicos do Projeto ({epics.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {sortedEpics.map((epic) => {
            const isOpen = openEpics.has(epic.id);
            const epicProgress = calculateEpicProgress(epic.userStories);
            
            return (
              <Collapsible key={epic.id} open={isOpen} onOpenChange={() => toggleEpic(epic.id)}>
                <div className="border rounded hover:bg-muted/30 transition-colors">
                  <CollapsibleTrigger className="w-full">
                    <div className="grid grid-cols-14 gap-2 items-center py-2 px-3 text-sm">
                      {/* Chevron + Nome */}
                      <div className="col-span-4 flex items-center gap-2 text-left">
                        {isOpen ? (
                          <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="truncate font-medium">{epic.name}</span>
                      </div>

                      {/* Owner */}
                      <div className="col-span-2 truncate">{epic.owner}</div>

                      {/* Progresso Visual */}
                      <div className="col-span-2">
                        <ProgressBar 
                          value={epicProgress} 
                          variant={epic.status === 'green' ? 'success' : epic.status === 'yellow' ? 'warning' : 'danger'}
                          size="sm" 
                          showValue={false}
                        />
                      </div>

                      {/* Data */}
                      <div className="col-span-2 text-xs">
                        <span className={isOverdue(epic.dueDate) && epic.status !== 'green' ? 'text-status-red font-semibold' : ''}>
                          {formatDate(epic.dueDate)}
                        </span>
                      </div>

                      {/* Status de Saúde */}
                      <div className="col-span-1">
                        <StatusBadge status={epic.status} size="sm" />
                      </div>

                      {/* Status de Progresso */}
                      <div className="col-span-2">
                        <Badge variant="secondary" className="text-xs bg-status-blue-light text-status-blue-foreground border-status-blue hover:bg-status-blue/10">
                          <span className="mr-1">{getProgressBadge(epic.phase).icon}</span>
                          {getProgressBadge(epic.phase).label}
                        </Badge>
                      </div>

                      {/* Time */}
                      <div className="col-span-1 text-xs text-muted-foreground flex items-center justify-between">
                        <span>{getPhaseLabel(epic.phase).slice(0, 3)}</span>
                        {epic.concerns && <AlertCircle className="h-3 w-3 text-status-yellow" />}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-3 pb-2 border-t bg-muted/20">
                      {epic.concerns && (
                        <div className="text-xs text-muted-foreground py-2 flex items-start gap-2">
                          <AlertCircle className="h-3 w-3 text-status-yellow flex-shrink-0 mt-0.5" />
                          <span>{epic.concerns}</span>
                        </div>
                      )}
                      
                      <div className="space-y-1 mt-2">
                        {epic.userStories.map((story) => (
                          <div key={story.id} className="grid grid-cols-14 gap-2 items-center py-1 px-2 bg-background rounded text-xs">
                            <div className="col-span-1"></div>
                            <div className="col-span-2 font-mono text-muted-foreground">{story.ticketNumber}</div>
                            <div className="col-span-5 truncate">{story.name}</div>
                            <div className="col-span-2 text-center">
                              <span className="px-2 py-1 bg-muted rounded text-xs">{story.boardStatus}</span>
                            </div>
                            <div className="col-span-2">
                              <ProgressBar 
                                value={story.progress} 
                                size="sm" 
                                showValue={false}
                                variant={story.progress === 100 ? 'success' : story.progress > 0 ? 'warning' : 'default'}
                              />
                            </div>
                            <div className="col-span-2"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};