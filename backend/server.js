const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve the frontend files

// Database Setup
const db = new sqlite3.Database(':memory:'); // Using in-memory for this POC speed, or file if preferred
// For persistence: const db = new sqlite3.Database('./print_jobs.db');
// Let's use a file for "Base de données simple" compliance
const dbFile = './print_jobs.db';
const dbDisk = new sqlite3.Database(dbFile);

dbDisk.serialize(() => {
  dbDisk.run(`
    CREATE TABLE IF NOT EXISTS print_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Routes
app.post('/print', (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  // 1. Save to DB
  const stmt = dbDisk.prepare("INSERT INTO print_jobs (content, status) VALUES (?, ?)");
  stmt.run(content, 'PENDING', function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const jobId = this.lastID;

    // 2. Emit to Local App
    console.log(`[Backend] Received print job #${jobId}: ${content}`);
    io.emit('print_job', { id: jobId, content });

    res.json({ success: true, message: 'Print job received', jobId });
  });
  stmt.finalize();
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('[Backend] New client connected:', socket.id);

  socket.on('print_confirm', (data) => {
    console.log(`[Backend] Print confirmed for job #${data.id}`);
    dbDisk.run("UPDATE print_jobs SET status = 'PRINTED' WHERE id = ?", [data.id]);
  });

  socket.on('disconnect', () => {
    console.log('[Backend] Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[Backend] Server running on port ${PORT}`);
});
