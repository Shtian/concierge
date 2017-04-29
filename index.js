const spawn = require('child_process').spawn;
const config = require('./config.js');

console.log(`Running concierge. Checking room availability every ${config.checkInterval}. minute.`);

const runTest = () => {
  const roomTest = spawn('npm', ['test']);
  roomTest.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  roomTest.stderr.on('data', (data) => {
    console.log(`${data}`);
  });
  roomTest.on('close', (exitCode) => {
    console.log(`Roomtest exited with code: ${exitCode}`);
  });
};

setInterval(runTest, config.checkInterval * 60 * 1000);
