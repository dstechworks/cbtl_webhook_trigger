const { exec } = require('child_process');
const path = require('path');

// Resolve full paths
const backendPath = path.join(__dirname, 'backend', 'server.js');
const frontendPath = path.join(__dirname, 'frontend', 'app.js');

// Start backend
exec(`node ${backendPath}`, (err, stdout, stderr) => {
    if (err) {
        console.error(`Backend error: ${err.message}`);
        return;
    }
    console.log(`Backend: ${stdout}`);
});

// Start frontend
// exec(`node ${frontendPath}`, (err, stdout, stderr) => {
//     if (err) {
//         console.error(`Frontend error: ${err.message}`);
//         return;
//     }
//     console.log(`Frontend: ${stdout}`);
// });
