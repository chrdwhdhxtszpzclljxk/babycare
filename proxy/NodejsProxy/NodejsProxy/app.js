var net = require('net');
var url = require('url');

var HOST = '';
var PORT = 6969;

var server = net.createServer();
server.listen(PORT);
console.log('Server listening on ' + server.address().address + ':' + server.address().port);

server.on('connection', function (sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sock.on('data', function (data) {
            var req = data.toString().split('\r\n');
            console.log(req[0]);
            var cmd = req[0].split(' ');
            sock.hosturl = cmd[1];
            var a = url.parse(cmd[1]);
            sock.hosturl = a.host;
            console.log(a);
            if (a.port == null) a.port = 80;

            var client = net.connect({
                host:a.host, port:a.port
            }, function () { // connect监听器
                console.log("客户端已连接");
                client.write(data);

            });
            client.on("data", function (data) {
                sock.write(data);
                client.end();
            });
            client.on("end", function () {
                console.log("客户端断开连接");
            });

            client.on("error", function () {
            });

    });

    sock.on('close', function (data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

    sock.on("error", function () {
    });
});

