-- MySQL schema for the versioned reports system

-- Main reports table
CREATE TABLE project_reports (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  project_name TEXT NOT NULL,
  product_owner TEXT NOT NULL,
  current_version INT NOT NULL DEFAULT 1,
  report_data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Report versions table
CREATE TABLE report_versions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  report_id CHAR(36) NOT NULL,
  version INT NOT NULL,
  report_data JSON NOT NULL,
  description TEXT,
  author TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY report_version_unique (report_id, version),
  CONSTRAINT fk_report FOREIGN KEY (report_id) REFERENCES project_reports(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_project_reports_updated_at ON project_reports(updated_at);
CREATE INDEX idx_report_versions_report_id ON report_versions(report_id);
CREATE INDEX idx_report_versions_version ON report_versions(report_id, version);

-- Triggers to automatically update updated_at
DELIMITER //
CREATE TRIGGER update_project_reports_updated_at
  BEFORE UPDATE ON project_reports
  FOR EACH ROW
  BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
  END;//

CREATE TRIGGER update_report_versions_updated_at
  BEFORE UPDATE ON report_versions
  FOR EACH ROW
  BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
  END;//
DELIMITER ;

