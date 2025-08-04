import { api } from '@/lib/api';
import { ProjectReport, StoredReport, ReportVersion } from '@/types/report';

export const reportService = {
  async getAllReports(): Promise<StoredReport[]> {
    return api.get<StoredReport[]>('/reports');
  },

  async getReport(id: string): Promise<StoredReport | null> {
    return api.get<StoredReport>(`/reports/${id}`);
  },

  async getReportVersions(reportId: string): Promise<ReportVersion[]> {
    console.log('getReportVersions called with reportId:', reportId);
    return api.get<ReportVersion[]>(`/reports/${reportId}/versions`);
  },

  async createReport(report: ProjectReport): Promise<StoredReport> {
    return api.post<StoredReport>('/reports', report);
  },

  async createReportVersion(
    reportId: string,
    report: ProjectReport,
    description: string,
    author: string
  ): Promise<ReportVersion> {
    console.log('createReportVersion called with reportId:', reportId);
    return api.post<ReportVersion>(`/reports/${reportId}/versions`, {
      report,
      description,
      author
    });
  },

  async getReportVersion(
    reportId: string,
    version: number
  ): Promise<ReportVersion | null> {
    return api.get<ReportVersion>(`/reports/${reportId}/versions/${version}`);
  },

  async deleteReport(reportId: string): Promise<void> {
    await api.delete(`/reports/${reportId}`);
  }
};
