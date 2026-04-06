const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve the React build folder as static files
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Handle all routes by serving index.html (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend server running on port ${PORT}`);
});
