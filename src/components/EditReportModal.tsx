import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditEpicsTab } from './edit-tabs/EditEpicsTab';
import { EditHighlightsTab } from './edit-tabs/EditHighlightsTab';
import { EditBlockersTab } from './edit-tabs/EditBlockersTab';
import { EditHelpRequestsTab } from './edit-tabs/EditHelpRequestsTab';
import { EditActionsTab } from './edit-tabs/EditActionsTab';
import { ProjectReport, ReportVersion } from '@/types/report';
import { useCreateReportVersion } from '@/hooks/useReports';
import { Save, X } from 'lucide-react';

interface EditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ProjectReport;
  reportId: string;
  onSuccess?: () => void;
  onVersionCreated?: (version: ReportVersion) => void;
}

export const EditReportModal = ({ isOpen, onClose, report, reportId, onSuccess, onVersionCreated }: EditReportModalProps) => {
  const [editedReport, setEditedReport] = useState<ProjectReport>(report);
  const [activeTab, setActiveTab] = useState('epics');
  const createVersionMutation = useCreateReportVersion();

  // Recarrega o editedReport sempre que o modal abrir ou o report mudar
  React.useEffect(() => {
    if (isOpen) {
      setEditedReport({ ...report });
    }
  }, [isOpen, report]);

  const handleSave = async () => {
    try {
      const now = new Date();
      const dateVersion = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/[/:]/g, '-');
      
      console.log('Salvando relatório editado:', editedReport);
      
      const newVersion = await createVersionMutation.mutateAsync({
        reportId,
        report: {
          ...editedReport,
          version: report.version + 1,
          // Mantém a data original do relatório, não sobrescreve com a data atual
          reportDate: editedReport.reportDate
        },
        description: `Versão ${dateVersion}`,
        author: 'Sistema'
      });
      
      console.log('Nova versão criada:', newVersion);
      
      // Chama a função que atualiza o relatório atual
      onVersionCreated?.(newVersion);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const updateReport = (updates: Partial<ProjectReport>) => {
    setEditedReport(prev => ({ ...prev, ...updates }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Botão de fechar customizado */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 z-20 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Header fixo */}
        <div className="sticky top-0 bg-white z-10 border-b pb-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-10">
              Editar Relatório - {report.projectName}
              <Button 
                onClick={handleSave} 
                disabled={createVersionMutation.isPending}
                className="ml-4 mr-8"
              >
                <Save className="h-4 w-4 mr-2" />
                {createVersionMutation.isPending ? 'Salvando...' : 'Salvar Nova Versão'}
              </Button>
            </DialogTitle>
            <DialogDescription>
              Edite os dados do relatório e salve uma nova versão quando estiver pronto.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="epics">Épicos</TabsTrigger>
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
              <TabsTrigger value="blockers">Bloqueios</TabsTrigger>
              <TabsTrigger value="actions">Ações</TabsTrigger>
              <TabsTrigger value="help">Ajuda</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

            <TabsContent value="epics" className="mt-4 px-1">
              <EditEpicsTab 
                epics={editedReport.epics} 
                onUpdate={(epics) => updateReport({ epics })}
              />
            </TabsContent>

            <TabsContent value="highlights" className="mt-4 px-1">
              <EditHighlightsTab 
                highlights={editedReport.highlights} 
                onUpdate={(highlights) => updateReport({ highlights })}
              />
            </TabsContent>

            <TabsContent value="blockers" className="mt-4 px-1">
              <EditBlockersTab 
                blockers={editedReport.blockers} 
                onUpdate={(blockers) => updateReport({ blockers })}
              />
            </TabsContent>

            <TabsContent value="actions" className="mt-4 px-1">
              <EditActionsTab 
                actions={editedReport.actions} 
                onUpdate={(actions) => updateReport({ actions })}
              />
            </TabsContent>

            <TabsContent value="help" className="mt-4 px-1">
              <EditHelpRequestsTab 
                helpRequests={editedReport.helpRequests} 
                onUpdate={(helpRequests) => updateReport({ helpRequests })}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};