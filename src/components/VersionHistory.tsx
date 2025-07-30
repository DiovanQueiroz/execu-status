import { useState } from 'react';
import { History, Eye, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useReportVersions } from '@/hooks/useReports';
import { ReportVersion } from '@/types/report';

interface VersionHistoryProps {
  reportId: string;
  currentVersion: number;
  onSelectVersion?: (version: ReportVersion) => void;
}

export const VersionHistory = ({ reportId, currentVersion, onSelectVersion }: VersionHistoryProps) => {
  const [open, setOpen] = useState(false);
  const { data: versions = [], isLoading } = useReportVersions(reportId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectVersion = (version: ReportVersion) => {
    onSelectVersion?.(version);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Histórico de Versões
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Histórico de Versões do Relatório</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {isLoading ? (
            <div className="text-center py-8">Carregando versões...</div>
          ) : (
            <div className="space-y-3">
              {versions.map((version) => (
                <Card key={version.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant={version.version === currentVersion ? "default" : "secondary"}
                            className="font-mono"
                          >
                            v{version.version}
                          </Badge>
                          {version.version === currentVersion && (
                            <Badge variant="outline" className="text-xs">
                              Atual
                            </Badge>
                          )}
                        </div>
                        
                        <h4 className="font-medium text-sm mb-2">
                          {version.description || `Versão ${version.version}`}
                        </h4>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {version.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(version.createdAt)}
                          </div>
                        </div>
                        
                        {/* Prévia das principais métricas desta versão */}
                        <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <span>Épicos: {version.report.epics?.length || 0}</span>
                            <span>Highlights: {version.report.highlights?.length || 0}</span>
                            <span>Bloqueios: {version.report.blockers?.length || 0}</span>
                            <span>Ações: {version.report.actions?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSelectVersion(version)}
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Visualizar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};