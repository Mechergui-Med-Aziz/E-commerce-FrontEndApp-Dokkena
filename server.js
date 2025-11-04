const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const apiServer = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 4000;

// Serve Angular build files
app.use(express.static(path.join(__dirname, 'dist')));

// JSON server middleware
apiServer.use(middlewares);
apiServer.use(router);

// API route
app.use('/api', apiServer);

// Redirect all other routes to Angular index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
