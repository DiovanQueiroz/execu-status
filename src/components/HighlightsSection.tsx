import { TrendingUp, TrendingDown, Star, AlertTriangle } from 'lucide-react';
import { Highlight } from '@/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HighlightsSectionProps {
  highlights: Highlight[];
}

export const HighlightsSection = ({ highlights }: HighlightsSectionProps) => {
  const positiveHighlights = highlights.filter(h => h.type === 'positive');
  const negativeHighlights = highlights.filter(h => h.type === 'negative');

  const getImpactColor = (impact: Highlight['impact']) => {
    switch (impact) {
      case 'high': return 'text-status-red';
      case 'medium': return 'text-status-yellow';
      case 'low': return 'text-status-green';
    }
  };

  const getImpactBg = (impact: Highlight['impact']) => {
    switch (impact) {
      case 'high': return 'bg-status-red-light';
      case 'medium': return 'bg-status-yellow-light';
      case 'low': return 'bg-status-green-light';
    }
  };

  const HighlightCard = ({ highlight }: { highlight: Highlight }) => (
    <Card key={highlight.id} className="border-2 hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${highlight.type === 'positive' ? 'bg-status-green-light' : 'bg-status-red-light'}`}>
            {highlight.type === 'positive' ? (
              <TrendingUp className="h-5 w-5 text-status-green" />
            ) : (
              <TrendingDown className="h-5 w-5 text-status-red" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-base">{highlight.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactBg(highlight.impact)} ${getImpactColor(highlight.impact)}`}>
                {highlight.impact === 'high' && 'Alto Impacto'}
                {highlight.impact === 'medium' && 'Médio Impacto'}  
                {highlight.impact === 'low' && 'Baixo Impacto'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {highlight.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Highlights Positivos */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-status-green">
            <Star className="h-5 w-5" />
            Highlights ({positiveHighlights.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {positiveHighlights.length > 0 ? (
              positiveHighlights.map(highlight => (
                <HighlightCard key={highlight.id} highlight={highlight} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum highlight positivo reportado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lowlights/Negativos */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-status-red">
            <AlertTriangle className="h-5 w-5" />
            Lowlights ({negativeHighlights.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {negativeHighlights.length > 0 ? (
              negativeHighlights.map(highlight => (
                <HighlightCard key={highlight.id} highlight={highlight} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum ponto negativo reportado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};