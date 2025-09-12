import { supabase } from '@/lib/supabase';
import { ProjectReport, StoredReport, ReportVersion } from '@/types/report';

export class ReportService {
  // Buscar todos os relatórios com suas versões
  static async getAllReports(): Promise<StoredReport[]> {
    const { data, error } = await supabase
      .from('project_reports')
      .select(`
        *,
        versions:report_versions(*)
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Buscar um relatório específico
  static async getReport(id: string): Promise<StoredReport | null> {
    const { data, error } = await supabase
      .from('project_reports')
      .select(`
        *,
        versions:report_versions(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Buscar versões de um relatório
  static async getReportVersions(reportId: string): Promise<ReportVersion[]> {
    const { data, error } = await supabase
      .from('report_versions')
      .select('*')
      .eq('report_id', reportId)
      .order('version', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Criar um novo relatório
  static async createReport(report: ProjectReport): Promise<StoredReport> {
    const now = new Date().toISOString();
    
    // Criar o relatório principal
    const { data: reportData, error: reportError } = await supabase
      .from('project_reports')
      .insert({
        project_name: report.projectName,
        product_owner: report.productOwner,
        current_version: 1,
        report_data: report,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (reportError) throw reportError;

    // Criar a primeira versão
    const { data: versionData, error: versionError } = await supabase
      .from('report_versions')
      .insert({
        report_id: reportData.id,
        version: 1,
        report_data: report,
        created_at: now,
        updated_at: now,
        description: 'Versão inicial do relatório',
        author: report.productOwner
      })
      .select()
      .single();

    if (versionError) throw versionError;

    return {
      id: reportData.id,
      currentVersion: 1,
      report: report,
      createdAt: now,
      updatedAt: now,
      versions: [versionData]
    };
  }

  // Criar uma nova versão de um relatório existente
  static async createReportVersion(
    reportId: string, 
    report: ProjectReport, 
    description: string,
    author: string
  ): Promise<ReportVersion> {
    const now = new Date().toISOString();
    
    // Buscar a versão atual
    const { data: currentReport, error: fetchError } = await supabase
      .from('project_reports')
      .select('current_version')
      .eq('id', reportId)
      .single();

    if (fetchError) throw fetchError;

    const newVersion = currentReport.current_version + 1;

    // Criar nova versão
    const { data: versionData, error: versionError } = await supabase
      .from('report_versions')
      .insert({
        report_id: reportId,
        version: newVersion,
        report_data: report,
        created_at: now,
        updated_at: now,
        description,
        author
      })
      .select()
      .single();

    if (versionError) throw versionError;

    // Atualizar o relatório principal
    const { error: updateError } = await supabase
      .from('project_reports')
      .update({
        current_version: newVersion,
        report_data: report,
        updated_at: now
      })
      .eq('id', reportId);

    if (updateError) throw updateError;

    return versionData;
  }

  // Buscar uma versão específica de um relatório
  static async getReportVersion(reportId: string, version: number): Promise<ReportVersion | null> {
    const { data, error } = await supabase
      .from('report_versions')
      .select('*')
      .eq('report_id', reportId)
      .eq('version', version)
      .single();

    if (error) throw error;
    return data;
  }

  // Deletar um relatório e todas suas versões
  static async deleteReport(reportId: string): Promise<void> {
    // Deletar versões primeiro (por causa da foreign key)
    const { error: versionsError } = await supabase
      .from('report_versions')
      .delete()
      .eq('report_id', reportId);

    if (versionsError) throw versionsError;

    // Deletar o relatório principal
    const { error: reportError } = await supabase
      .from('project_reports')
      .delete()
      .eq('id', reportId);

    if (reportError) throw reportError;
  }
}