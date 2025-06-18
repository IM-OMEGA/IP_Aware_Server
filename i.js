const os = require('os');
const process = require('process')
const net = require('net')

function log(context, message){
  const timestamp = new Date().toLocaleDateString();
  console.log(`[${timestamp}] [${context}]: ${message}`);
}

const port = 7001;
const host = process.argv[2] || '0.0.0.0';

const server = net.createServer((socket)=>{

  log('server', `client connected from ${socket.remoteAddress}:${socket.remotePort}`)
  log('server', `my side of connection is: ${socket.localAddress}:${socket.localPort}`)

  socket.write(`hellow fron SERVER!!! You are connected to : ${socket.localAddress}:${socket.localPort}`);

  socket.on('data', (data)=>{
    const recivedMsg = data.toString().trim();
    console.log('you have recived a message: \n')
    log('server', recivedMsg);
    socket.write('thanks for the mesage. ')
  })

  socket.on('end', ()=>{
    log('server', `client ${socket.remoteAddress}:${socket.remotePort} has disconnected gracefully!`)
  })

  socket.on('close', ()=>{
    log('server', `connection has closed completly`)
  })

  socket.on('error', (err)=>{
    log('server', `socket error with client: ${socket.remoteAddress}:${socket.remotePort}----${err.message}`)
  })
})

server.on('error', (err)=>{
  if(err.code===' EADDRINUSE'){
    log('server main', `Error: ${port} is already in use. please use another or close it.`);
  }
  else if(err.code === 'EADDRNOTAVAIL'){
    log('server main', `Error: IP Adress ${host} is not available on this machine. are you sure it's correct? `)
  }
  else if(err.code==='EACCES'){
    log('server main', `Error: Permission denied to bind to host : ${port} . (Ports below 1024 often require root privileges).`)
  }
  else {
    log('Server Main', `Unexpected server error: ${err.message} (Code: ${err.code || 'N/A'})`);
  }
  process.exit(1);
})

server.listen(port, host, ()=>{
  console.log('server is listeing at port : ', port, " host: ", host);
  console.log('waiting for a client to connect.....');
})