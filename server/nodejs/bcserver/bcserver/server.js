var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var aeskey = "";
var aesiv = "";

app.listen(1337);

function handler(req, res) {
}

io.on('connection', function (socket) {
    socket.on('init', function (data) {
        const crypto = require('crypto');
        crypto.randomBytes(32, function (err, buf){
            if (err) throw err;

            var NodeRSA = require('node-rsa');
            var key = new NodeRSA();
            var keydata = {
                n: new Buffer(data.n, 'hex'),
                e: parseInt(data.e),
            };

            key.importKey(keydata, 'components-public');

            var out = key.encrypt("hello","base64","utf8");

            socket.emit('init', { key:out });
        });


    });
});
