var app = require('http').createServer(handler);
var io = require('socket.io')(app);
const crypto = require('crypto');
var NodeRSA = require('node-rsa');
var aeskey = "";
var aesiv = "";

app.listen(1337);

function handler(req, res) {
}

io.on('connection', function (socket) {
    socket.on('init', function (data) {
        var keylen = 32; var ivlen = 16;
        crypto.randomBytes(keylen + ivlen, function (err, buf){
            if (err) { _err(socket,err); return;}
            var keybuf = buf.subarray(0, 32);
            var ivbuf = buf.subarray(32, 16);
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
