import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditEpicsTab } from './edit-tabs/EditEpicsTab';
import { EditHighlightsTab } from './edit-tabs/EditHighlightsTab';
import { EditBlockersTab } from './edit-tabs/EditBlockersTab';
import { EditHelpRequestsTab } from './edit-tabs/EditHelpRequestsTab';
import { EditActionsTab } from './edit-tabs/EditActionsTab';
import { ProjectReport } from '@/types/report';
import { useCreateReportVersion } from '@/hooks/useReports';
import { Save } from 'lucide-react';

interface EditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ProjectReport;
  reportId: string;
  onSuccess?: () => void;
}

export const EditReportModal = ({ isOpen, onClose, report, reportId, onSuccess }: EditReportModalProps) => {
  const [editedReport, setEditedReport] = useState<ProjectReport>(report);
  const [activeTab, setActiveTab] = useState('epics');
  const createVersionMutation = useCreateReportVersion();

  const handleSave = async () => {
    try {
      await createVersionMutation.mutateAsync({
        reportId,
        report: {
          ...editedReport,
          version: report.version + 1,
          reportDate: new Date().toISOString()
        },
        description: `Versão ${report.version + 1} - Edição via modal`,
        author: 'Sistema'
      });
      
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Editar Relatório - {report.projectName}
            <Button 
              onClick={handleSave} 
              disabled={createVersionMutation.isPending}
              className="ml-4"
            >
              <Save className="h-4 w-4 mr-2" />
              {createVersionMutation.isPending ? 'Salvando...' : 'Salvar Nova Versão'}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="epics">Épicos</TabsTrigger>
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
            <TabsTrigger value="blockers">Bloqueios</TabsTrigger>
            <TabsTrigger value="help">Ajuda</TabsTrigger>
            <TabsTrigger value="actions">Ações</TabsTrigger>
          </TabsList>

          <TabsContent value="epics" className="mt-4">
            <EditEpicsTab 
              epics={editedReport.epics} 
              onUpdate={(epics) => updateReport({ epics })}
            />
          </TabsContent>

          <TabsContent value="highlights" className="mt-4">
            <EditHighlightsTab 
              highlights={editedReport.highlights} 
              onUpdate={(highlights) => updateReport({ highlights })}
            />
          </TabsContent>

          <TabsContent value="blockers" className="mt-4">
            <EditBlockersTab 
              blockers={editedReport.blockers} 
              onUpdate={(blockers) => updateReport({ blockers })}
            />
          </TabsContent>

          <TabsContent value="help" className="mt-4">
            <EditHelpRequestsTab 
              helpRequests={editedReport.helpRequests} 
              onUpdate={(helpRequests) => updateReport({ helpRequests })}
            />
          </TabsContent>

          <TabsContent value="actions" className="mt-4">
            <EditActionsTab 
              actions={editedReport.actions} 
              onUpdate={(actions) => updateReport({ actions })}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};