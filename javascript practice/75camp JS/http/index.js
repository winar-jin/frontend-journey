const net = require('net');
const server = net.createServer((socket) => {
  socket.setKeepAlive(true, 5000);
  socket.write(`HTTP/1.1 200 ok
Content-type: text/html
Content-Length: 20

<h1>Hello world</h1>
`);
  socket.on('data', function (data) {
    console.log(data.toString('utf-8'));
  });
});

server.listen({
  host: 'localhost',
  port: '8080',
});