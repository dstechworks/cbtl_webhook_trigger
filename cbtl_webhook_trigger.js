const { spawn } = require('child_process');
const path = require('path');

// Paths
const backendPath = path.join(__dirname, 'backend', 'server.js');
const frontendDir = path.join(__dirname, 'frontend');

// Start backend
const backend = spawn('node', [backendPath]);

backend.stdout.on('data', (data) => {
    process.stdout.write(`📦 Backend: ${data}`);
});

backend.stderr.on('data', (data) => {
    process.stderr.write(`❌ Backend Error: ${data}`);
});

// Start frontend preview server (build must already be done)
const frontend = spawn('npm', ['run', 'preview'], { cwd: frontendDir, shell: true });

frontend.stdout.on('data', (data) => {
    process.stdout.write(`🌐 Frontend: ${data}`);

    const match = data.toString().match(/http:\/\/localhost:(\d+)/);
    if (match) {
        console.log(`🚀 Frontend running on port: ${match[1]}`);
    }
});

frontend.stderr.on('data', (data) => {
    process.stderr.write(`❌ Frontend Error: ${data}`);
});
