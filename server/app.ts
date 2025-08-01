import express from 'express';
import pool from './db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

const app = express();
app.use(express.json());

// GET /reports - list all reports with their versions
app.get('/reports', async (_req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM project_reports'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// GET /reports/:id - get a single report and its versions
app.get('/reports/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [reportRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM project_reports WHERE id = ?',
      [id]
    );
    if (reportRows.length === 0)
      return res.status(404).json({ error: 'Report not found' });
    const [versionRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM report_versions WHERE report_id = ? ORDER BY version DESC',
      [id]
    );
    res.json({ ...reportRows[0], versions: versionRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// POST /reports - create new report
app.post('/reports', async (req, res) => {
  const report = req.body;
  try {
    const now = new Date();
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO project_reports (project_name, product_owner, current_version, report_data, created_at, updated_at) VALUES (?, ?, 1, ?, ?, ?)',
      [report.projectName, report.productOwner, JSON.stringify(report), now, now]
    );
    const insertId = result.insertId;
    const version = {
      report_id: insertId,
      version: 1,
      report_data: report,
      created_at: now,
      updated_at: now,
      description: 'Initial version',
      author: report.productOwner,
    };
    await pool.query(
      'INSERT INTO report_versions (report_id, version, report_data, created_at, updated_at, description, author) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [insertId, 1, JSON.stringify(report), now, now, version.description, version.author]
    );
    res.status(201).json({ id: insertId, currentVersion: 1, report, createdAt: now, updatedAt: now, versions: [version] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// POST /reports/:id/versions - add a new version to a report
app.post('/reports/:id/versions', async (req, res) => {
  const { id } = req.params;
  const { report, description, author } = req.body;
  try {
    const [[current]] = await pool.query<RowDataPacket[]>(
      'SELECT current_version FROM project_reports WHERE id = ?',
      [id]
    );
    if (!current) return res.status(404).json({ error: 'Report not found' });
    const newVersion = current.current_version + 1;
    const now = new Date();
    await pool.query(
      'INSERT INTO report_versions (report_id, version, report_data, created_at, updated_at, description, author) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, newVersion, JSON.stringify(report), now, now, description, author]
    );
    await pool.query(
      'UPDATE project_reports SET current_version = ?, report_data = ?, updated_at = ? WHERE id = ?',
      [newVersion, JSON.stringify(report), now, id]
    );
    res.status(201).json({ version: newVersion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create version' });
  }
});

// DELETE /reports/:id - delete a report and its versions
app.delete('/reports/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM report_versions WHERE report_id = ?', [id]);
    await pool.query('DELETE FROM project_reports WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;

