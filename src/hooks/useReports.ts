import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import { ProjectReport, StoredReport, ReportVersion } from '@/types/report';
import { toast } from 'sonner';

// Hook para limpar cache do React Query
export const useClearCache = () => {
  const queryClient = useQueryClient();
  return () => queryClient.clear();
};

// Hook para buscar todos os relatórios
export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: reportService.getAllReports,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar um relatório específico
export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => reportService.getReport(id),
    enabled: !!id,
  });
};

// Hook para buscar versões de um relatório
export const useReportVersions = (reportId: string) => {
  console.log('useReportVersions called with reportId:', reportId);
  return useQuery({
    queryKey: ['report-versions', reportId],
    queryFn: () => reportService.getReportVersions(reportId),
    enabled: !!reportId,
    staleTime: 0, // Sempre buscar dados frescos
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false, // Não tentar novamente em caso de erro
  });
};

// Hook para buscar uma versão específica
export const useReportVersion = (reportId: string, version: number) => {
  return useQuery({
    queryKey: ['report-version', reportId, version],
    queryFn: () => reportService.getReportVersion(reportId, version),
    enabled: !!reportId && !!version,
  });
};

// Hook para buscar o relatório atual (versão mais recente)
export const useCurrentReport = (reportId: string) => {
  return useQuery({
    queryKey: ['current-report', reportId],
    queryFn: async () => {
      try {
        const versions = await reportService.getReportVersions(reportId);
        if (versions.length === 0) {
          // Se não há versões, retorna dados do sampleReport como fallback
          const { sampleReport } = await import('@/data/sampleData');
          return sampleReport;
        }
        
        // Retorna a versão com maior número (mais recente)
        const currentVersion = versions.reduce((latest, current) => 
          current.version > latest.version ? current : latest
        );
        
        return currentVersion.report_data;
      } catch (error) {
        console.error('Erro ao buscar relatório atual:', error);
        // Em caso de erro, retorna sampleReport como fallback
        const { sampleReport } = await import('@/data/sampleData');
        return sampleReport;
      }
    },
    enabled: !!reportId,
    staleTime: 0,
    refetchOnMount: true,
  });
};

// Hook para criar um novo relatório
export const useCreateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reportService.createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Relatório criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar relatório:', error);
      toast.error('Erro ao criar relatório');
    },
  });
};

// Hook para criar uma nova versão
export const useCreateReportVersion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      reportId, 
      report, 
      description, 
      author 
    }: { 
      reportId: string; 
      report: ProjectReport; 
      description: string;
      author: string;
    }) => reportService.createReportVersion(reportId, report, description, author),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', variables.reportId] });
      queryClient.invalidateQueries({ queryKey: ['report-versions', variables.reportId] });
      queryClient.invalidateQueries({ queryKey: ['current-report', variables.reportId] });
      toast.success('Nova versão criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar versão:', error);
      toast.error('Erro ao criar nova versão');
    },
  });
};

// Hook para deletar um relatório
export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reportService.deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Relatório excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir relatório:', error);
      toast.error('Erro ao excluir relatório');
    },
  });
};