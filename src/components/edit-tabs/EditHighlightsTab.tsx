import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Highlight } from '@/types/report';
import { Plus, Trash2, Edit3 } from 'lucide-react';

interface EditHighlightsTabProps {
  highlights: Highlight[];
  onUpdate: (highlights: Highlight[]) => void;
}

export const EditHighlightsTab = ({ highlights, onUpdate }: EditHighlightsTabProps) => {
  const [editingHighlight, setEditingHighlight] = useState<string | null>(null);
  const [editingHighlightTitle, setEditingHighlightTitle] = useState('');
  const [expandedHighlights, setExpandedHighlights] = useState<Set<string>>(new Set());
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

  const addHighlight = (type: 'positive' | 'negative') => {
    const newHighlightId = `highlight-${Date.now()}`;
    const newHighlight: Highlight = {
      id: newHighlightId,
      type,
      title: type === 'positive' ? 'Novo Highlight Positivo' : 'Novo Highlight Negativo',
      description: '',
      impact: 'medium'
    };
    
    onUpdate([...highlights, newHighlight]);
    
    // Expande automaticamente o novo highlight
    setExpandedHighlights(prev => new Set(prev).add(newHighlightId));
    
    // Marca como recém-criado
    setNewlyCreated(prev => new Set(prev).add(newHighlightId));
    
    // Coloca em modo de edição
    setEditingHighlight(newHighlightId);
    setEditingHighlightTitle('');
  };

  const deleteHighlight = (highlightId: string) => {
    onUpdate(highlights.filter(h => h.id !== highlightId));
  };

  const updateHighlight = (highlightId: string, updates: Partial<Highlight>) => {
    onUpdate(highlights.map(h => h.id === highlightId ? { ...h, ...updates } : h));
  };

  const toggleHighlightExpansion = (highlightId: string) => {
    const newExpanded = new Set(expandedHighlights);
    if (newExpanded.has(highlightId)) {
      newExpanded.delete(highlightId);
    } else {
      newExpanded.add(highlightId);
    }
    setExpandedHighlights(newExpanded);
  };

  const positiveHighlights = highlights.filter(h => h.type === 'positive');
  const negativeHighlights = highlights.filter(h => h.type === 'negative');

  return (
    <div className="space-y-6">
      {/* Highlights Positivos */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-status-green">✓ Highlights Positivos</h3>
          <Button onClick={() => addHighlight('positive')} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-3">
          {positiveHighlights.map((highlight) => (
            <Card 
              key={highlight.id} 
              className={`transition-all duration-300 ${
                newlyCreated.has(highlight.id) 
                  ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' 
                  : ''
              }`}
            >
              <Collapsible 
                open={expandedHighlights.has(highlight.id)} 
                onOpenChange={() => toggleHighlightExpansion(highlight.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="text-base flex items-center justify-between">
                      {editingHighlight === highlight.id ? (
                        <Input
                          value={editingHighlightTitle}
                          onChange={(e) => setEditingHighlightTitle(e.target.value)}
                          onBlur={() => {
                            updateHighlight(highlight.id, { title: editingHighlightTitle });
                            setEditingHighlight(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateHighlight(highlight.id, { title: editingHighlightTitle });
                              setEditingHighlight(null);
                            }
                            if (e.key === 'Escape') {
                              setEditingHighlight(null);
                              setEditingHighlightTitle(highlight.title);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mr-2"
                          autoFocus
                        />
                      ) : (
                        <span>{highlight.title}</span>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingHighlight(highlight.id);
                            setEditingHighlightTitle(highlight.title);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHighlight(highlight.id);
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
                        <Label htmlFor={`description-${highlight.id}`}>Descrição</Label>
                        <Textarea
                          id={`description-${highlight.id}`}
                          value={highlight.description}
                          onChange={(e) => updateHighlight(highlight.id, { description: e.target.value })}
                          rows={3}
                          placeholder="Descreva este highlight..."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`impact-${highlight.id}`}>Impacto</Label>
                        <Select 
                          value={highlight.impact} 
                          onValueChange={(value: 'low' | 'medium' | 'high') => updateHighlight(highlight.id, { impact: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baixo</SelectItem>
                            <SelectItem value="medium">Médio</SelectItem>
                            <SelectItem value="high">Alto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>

      {/* Highlights Negativos */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-status-red">⚠ Highlights Negativos</h3>
          <Button onClick={() => addHighlight('negative')} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-3">
          {negativeHighlights.map((highlight) => (
            <Card 
              key={highlight.id} 
              className={`transition-all duration-300 ${
                newlyCreated.has(highlight.id) 
                  ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' 
                  : ''
              }`}
            >
              <Collapsible 
                open={expandedHighlights.has(highlight.id)} 
                onOpenChange={() => toggleHighlightExpansion(highlight.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="text-base flex items-center justify-between">
                      {editingHighlight === highlight.id ? (
                        <Input
                          value={editingHighlightTitle}
                          onChange={(e) => setEditingHighlightTitle(e.target.value)}
                          onBlur={() => {
                            updateHighlight(highlight.id, { title: editingHighlightTitle });
                            setEditingHighlight(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateHighlight(highlight.id, { title: editingHighlightTitle });
                              setEditingHighlight(null);
                            }
                            if (e.key === 'Escape') {
                              setEditingHighlight(null);
                              setEditingHighlightTitle(highlight.title);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mr-2"
                          autoFocus
                        />
                      ) : (
                        <span>{highlight.title}</span>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingHighlight(highlight.id);
                            setEditingHighlightTitle(highlight.title);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHighlight(highlight.id);
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
                        <Label htmlFor={`description-${highlight.id}`}>Descrição</Label>
                        <Textarea
                          id={`description-${highlight.id}`}
                          value={highlight.description}
                          onChange={(e) => updateHighlight(highlight.id, { description: e.target.value })}
                          rows={3}
                          placeholder="Descreva este highlight..."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`impact-${highlight.id}`}>Impacto</Label>
                        <Select 
                          value={highlight.impact} 
                          onValueChange={(value: 'low' | 'medium' | 'high') => updateHighlight(highlight.id, { impact: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baixo</SelectItem>
                            <SelectItem value="medium">Médio</SelectItem>
                            <SelectItem value="high">Alto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};