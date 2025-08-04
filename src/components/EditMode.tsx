import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditIcon } from 'lucide-react';
import { ProjectReport, ReportVersion } from '@/types/report';
import { EditReportModal } from './EditReportModal';

interface EditModeProps {
  report: ProjectReport;
  reportId: string;
  onSuccess?: () => void;
  onVersionCreated?: (version: ReportVersion) => void;
}

export const EditMode = ({ report, reportId, onSuccess, onVersionCreated }: EditModeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    onSuccess?.();
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleEdit}
        className="flex items-center gap-2"
      >
        <EditIcon className="h-4 w-4" />
        Criar Versão
      </Button>

      <EditReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        report={report}
        reportId={reportId}
        onSuccess={handleSuccess}
        onVersionCreated={onVersionCreated}
      />
    </>
  );
};