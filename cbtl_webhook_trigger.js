const { exec } = require('child_process');
const path = require('path');

// Resolve full paths
const backendPath = path.join(__dirname, 'backend', 'server.js');
const frontendDir = path.join(__dirname, 'frontend');

// Start backend
exec(`node ${backendPath}`, (err, stdout, stderr) => {
    if (err) {
        console.error(`Backend error: ${err.message}`);
        return;
    }
    console.log(`Backend Output:\n${stdout}`);
    if (stderr) console.error(`Backend STDERR:\n${stderr}`);
});

// Build frontend
exec(`npm run build`, { cwd: frontendDir }, (err, stdout, stderr) => {
    if (err) {
        console.error(`Frontend build error: ${err.message}`);
        return;
    }
    console.log(`Frontend Build Output:\n${stdout}`);
    if (stderr) console.error(`Frontend Build STDERR:\n${stderr}`);
});
