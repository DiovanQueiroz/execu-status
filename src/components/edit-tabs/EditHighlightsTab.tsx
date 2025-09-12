import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Highlight } from '@/types/report';
import { Plus, Trash2 } from 'lucide-react';

interface EditHighlightsTabProps {
  highlights: Highlight[];
  onUpdate: (highlights: Highlight[]) => void;
}

export const EditHighlightsTab = ({ highlights, onUpdate }: EditHighlightsTabProps) => {
  const addHighlight = (type: 'positive' | 'negative') => {
    const newHighlight: Highlight = {
      id: `highlight-${Date.now()}`,
      type,
      title: type === 'positive' ? 'Novo Highlight Positivo' : 'Novo Highlight Negativo',
      description: '',
      impact: 'medium'
    };
    onUpdate([...highlights, newHighlight]);
  };

  const deleteHighlight = (highlightId: string) => {
    onUpdate(highlights.filter(h => h.id !== highlightId));
  };

  const updateHighlight = (highlightId: string, updates: Partial<Highlight>) => {
    onUpdate(highlights.map(h => h.id === highlightId ? { ...h, ...updates } : h));
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
            <Card key={highlight.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <Input
                    value={highlight.title}
                    onChange={(e) => updateHighlight(highlight.id, { title: e.target.value })}
                    className="text-base font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHighlight(highlight.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`desc-${highlight.id}`}>Descrição</Label>
                    <Textarea
                      id={`desc-${highlight.id}`}
                      value={highlight.description}
                      onChange={(e) => updateHighlight(highlight.id, { description: e.target.value })}
                      rows={3}
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
            <Card key={highlight.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <Input
                    value={highlight.title}
                    onChange={(e) => updateHighlight(highlight.id, { title: e.target.value })}
                    className="text-base font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHighlight(highlight.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`desc-${highlight.id}`}>Descrição</Label>
                    <Textarea
                      id={`desc-${highlight.id}`}
                      value={highlight.description}
                      onChange={(e) => updateHighlight(highlight.id, { description: e.target.value })}
                      rows={3}
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
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};