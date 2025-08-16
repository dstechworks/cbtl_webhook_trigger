const { spawn } = require('child_process');
const path = require('path');

// Paths
const backendPath = path.join(__dirname, 'backend', 'server.js');

// Start backend
const backend = spawn('node', [backendPath]);

backend.stdout.on('data', (data) => {
    process.stdout.write(`📦 Backend: ${data}`);
});

backend.stderr.on('data', (data) => {
    process.stderr.write(`❌ Backend Error: ${data}`);
});
