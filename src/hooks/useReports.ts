import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import { ProjectReport, StoredReport, ReportVersion } from '@/types/report';
import { toast } from 'sonner';

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
  return useQuery({
    queryKey: ['report-versions', reportId],
    queryFn: () => reportService.getReportVersions(reportId),
    enabled: !!reportId,
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