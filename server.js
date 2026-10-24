const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to check server status / target dates (optional backend hook)
app.get('/api/milestones', (req, res) => {
  res.json({
    friendshipUnlock: '2026-11-02T19:45:00+05:30',
    birthdayUnlock: '2026-11-05T00:00:00+05:30',
    serverTime: new Date().toISOString()
  });
});

// Fallback route to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✨ Surprise Server running at http://localhost:${PORT}`);
});

module.exports = app;