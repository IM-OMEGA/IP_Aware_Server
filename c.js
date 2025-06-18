const { Socket } = require('dgram');
const net = require('net')
const process = require('process')

const target_port = process.argv[3];
const target_host = process.argv[2];

function log(context, message){
  const timestamp = new Date().toLocaleDateString();
  console.log(`[${timestamp}] [${context}]: ${message}`);
}

const client = new net.Socket();

client.connect(target_port, target_host, ()=>{
  log('client', `succesfully connected to : ${client.remoteAddress}:${client.remotePort}`);

  client.write('\nhi from client side\n')

  

  setTimeout(() => {
    log('Client', 'Ending connection.');
    client.end(); 
  }, 5000);
})

client.on('data', (data)=>{
  const recivedMsg = data.toString().trim();
  log('client', `recived from server: ${recivedMsg}`)
})

client.on('end', ()=>{
  log('Client', 'Disconnected from server gracefully.');
})

client.on('close', () => {
  log('Client', 'Connection to server fully closed.');
  process.exit(0);
});

client.on('error', (err) => {
  log('Client', `Connection error: ${err.message}`);
 
  process.exit(1); 
});
