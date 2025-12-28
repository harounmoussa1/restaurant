const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

// Configuration
const BACKEND_URL = 'http://localhost:3000';
const PRINTER_OUTPUT_DIR = path.join(__dirname, 'printer_output');

// Ensure output directory exists
if (!fs.existsSync(PRINTER_OUTPUT_DIR)) {
    fs.mkdirSync(PRINTER_OUTPUT_DIR);
}

// Connect to Backend
console.log('🔌 Connecting to backend at', BACKEND_URL);
const socket = io(BACKEND_URL);

socket.on('connect', () => {
    console.log('✅ Connected to backend! Waiting for print jobs...');
});

socket.on('print_job', (job) => {
    console.log(`\n📥 Received Print Job #${job.id}`);

    try {
        printTicket(job);

        // Confirm success to backend
        socket.emit('print_confirm', { id: job.id });
        console.log(`✅ Job #${job.id} printed successfully.`);
    } catch (error) {
        console.error(`❌ Failed to print job #${job.id}:`, error);
    }
});

socket.on('disconnect', () => {
    console.log('❌ Disconnected from backend');
});

function printTicket(job) {
    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    // 1. Format the ticket (receipt style)
    const ticketContent = `
========================================
           RESTAURANT DEMO
           TICKET #${job.id}
========================================
Date: ${date}
----------------------------------------

${job.content}

----------------------------------------
       MERCI DE VOTRE VISITE !
========================================
`;

    // 2. "Print" to console
    console.log(ticketContent);

    // 3. "Print" to file (Simulating physical printer)
    const filename = `ticket_${job.id}_${Date.now()}.txt`;
    const filepath = path.join(PRINTER_OUTPUT_DIR, filename);

    fs.writeFileSync(filepath, ticketContent, 'utf8');
    console.log(`🖨️  Sent to 'printer' (saved to ${filename})`);

    // 4. Real Print on Windows (Default Printer)
    // Using PowerShell to print the text file to the default printer
    const command = `powershell -Command "Get-Content -Path '${filepath}' -Encoding UTF8 | Out-Printer"`;

    console.log('🖨️  Sending to physical printer (System Default)...');

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error printing: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Print stderr: ${stderr}`);
            return;
        }
        console.log('✅ Sent to default printer queue.');
    });
}
