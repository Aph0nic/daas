const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const cors = require('cors');

const app = express();
const port = 8080;
const rootDir = path.join(__dirname, 'safe_share');
const webDir = path.join(__dirname, 'src');

app.use(cors());
app.use(express.static(webDir));

app.use((req, res, next) => {
  if (req.query.path && !isSafePath(req.query.path)) {
    return res.status(403).send('Forbidden');
  }
  next();
});

app.get('/api/list', handleList);
app.get('/api/download', handleDownload);
app.get('/api/view', handleView);

async function handleList(req, res) {
  try {
    const queryPath = req.query.path || '';
    const fullPath = path.join(rootDir, queryPath);
    
    const files = await fs.readdir(fullPath, { withFileTypes: true });
    const filtered = files.filter(f => !['.', '..'].includes(f.name));

    const filesWithStats = await Promise.all(
      filtered.map(async f => {
        const filePath = path.join(fullPath, f.name);
        const stats = await fs.stat(filePath);
        return {
          name: f.name,
          type: f.isDirectory() ? 'dir' : 'file',
          size: stats.size,
          mtime: stats.mtimeMs
        };
      })
    );

    res.json(filesWithStats);
  } catch (err) {
    res.status(404).send(err.message);
  }
}

async function handleDownload(req, res) {
  try {
    const queryPath = req.query.path;
    const fullPath = path.join(rootDir, queryPath);
    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      const archive = archiver('zip');
      archive.directory(fullPath, false);
      res.attachment(`${path.basename(fullPath)}.zip`);
      archive.pipe(res);
      archive.finalize();
    } else {
      res.download(fullPath);
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
}

async function handleView(req, res) {
  try {
    const queryPath = req.query.path;
    const fullPath = path.join(rootDir, queryPath);
    const content = await fs.readFile(fullPath, 'utf-8');
    res.type('text/plain').send(content);
  } catch (err) {
    res.status(404).send(err.message);
  }
}

function isSafePath(userPath) {
  const resolvedPath = path.resolve(path.join(rootDir, userPath));
  return resolvedPath.startsWith(path.resolve(rootDir));
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});