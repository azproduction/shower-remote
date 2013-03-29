var express = require('express'),
    http = require('http'),
    socketIo = require('socket.io'),
    fs = require('fs'),
    getRemoteIps = require(__dirname + '/../lib/remoteIp');

require('colors');

// Shower remote js file
var socketIoMinJs = __dirname + '/../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js',
    showerRemoteClient = __dirname + '/../src/shower-remote-client.js';

var showerRemoveSrc = new Buffer(fs.readFileSync(socketIoMinJs) + '\n\n' + fs.readFileSync(showerRemoteClient)),
    showerRemoveUrl = '/shower/remote.js';


// Configure and use defaults
var secretToken = process.argv[2] || Math.random().toString(16).split('.')[1],
    port = +(process.argv[3] || 3000),
    host = process.argv[4] || '0.0.0.0',
    remoteIps = getRemoteIps();

// Interface messages
var cliPort = port === 80 ? '' : ':' + port,
    cliHost = host === '0.0.0.0' ? 'localhost' : host;

// Print CLI message
console.log('Running %s %s %s %s', 'shower-remote'.green, secretToken.blue, port.toString().yellow, host.yellow);
console.log('Add ' + '<script'.blue + ' src="%s"'.green + '></script>'.blue + ' to your presentation to enable Shower Remote', showerRemoveUrl);
console.log('Then use that urls:');
console.log('  - Slave  ' + 'http://%s%s/.../'.blue.underline, cliHost, cliPort);
console.log('  - Master ' + 'http://%s%s/.../?%s'.blue.underline, cliHost, cliPort, secretToken);
if (remoteIps.length) {
    console.log('If %s does not work - try these addresses %s', cliHost.blue, remoteIps.join(', ').blue);
}
console.log('');


// Start Server
var app = express(),
    httpServer = http.createServer(app),
    io = socketIo.listen(httpServer),
    cwd = process.cwd();

httpServer.listen(port, host);

// server static: socket.io.min.js + shower-remote-client.js
app.get(showerRemoveUrl, function (req, res) {
    res.type('js').send(showerRemoveSrc);
});

// serve presentation files
app.use(express.static(cwd));

// remote action proxy
io.sockets.on('connection', function (socket) {
    socket.on('keydown:' + secretToken, function (data) {
        socket.broadcast.emit('keydown', data);
    });

    socket.on('click:' + secretToken, function (data) {
        socket.broadcast.emit('click', data);
    });

    socket.on('hashchange:' + secretToken, function (data) {
        socket.broadcast.emit('hashchange', data);
    });

    socket.on('shower:' + secretToken, function (data) {
        socket.broadcast.emit('shower', data);
    });
});
