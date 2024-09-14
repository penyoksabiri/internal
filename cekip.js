const os = require('os');
const fetch = require('node-fetch');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    for (const addressInfo of addresses) {
      if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
        console.log(`Local IP Address: ${addressInfo.address}`);
      }
    }
  }
}

async function getPublicIPAddress() {
  try {
    const response = await fetch('https://api64.ipify.org?format=json');
    const data = await response.json();
    console.log(`Public IP Address: ${data.ip}`);
  } catch (error) {
    console.error('Error fetching public IP address:', error);
  }
}

function checkIPAddresses() {
  getLocalIPAddress();
  getPublicIPAddress();
}

setInterval(checkIPAddresses, 5000); // Check every 5 seconds
