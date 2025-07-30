-- Schema para o sistema de relatórios versionados

-- Tabela principal de relatórios
CREATE TABLE project_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  product_owner TEXT NOT NULL,
  current_version INTEGER NOT NULL DEFAULT 1,
  report_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de versões de relatórios
CREATE TABLE report_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES project_reports(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  report_data JSONB NOT NULL,
  description TEXT,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(report_id, version)
);

-- Índices para performance
CREATE INDEX idx_project_reports_updated_at ON project_reports(updated_at DESC);
CREATE INDEX idx_report_versions_report_id ON report_versions(report_id);
CREATE INDEX idx_report_versions_version ON report_versions(report_id, version DESC);

-- RLS (Row Level Security) - opcional, se você quiser controle de acesso
ALTER TABLE project_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_versions ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (exemplo - ajuste conforme necessário)
CREATE POLICY "Allow all operations on project_reports" ON project_reports
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on report_versions" ON report_versions
  FOR ALL USING (true);

-- Função para atualizar automaticamente o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_project_reports_updated_at 
  BEFORE UPDATE ON project_reports 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_versions_updated_at 
  BEFORE UPDATE ON report_versions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();