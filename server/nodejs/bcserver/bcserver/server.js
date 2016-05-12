var app = require('http').createServer(handler);
var io = require('socket.io')(app);
const crypto = require('crypto');
var NodeRSA = require('node-rsa');
var jsbnrsa = require('node-bignumber');
var aeskey = "";
var aesiv = "";

app.listen(1337);
console.log(crypto.getCiphers());

function handler(req, res) {
}

io.on('connection', function (socket) {
    socket.on('init', function (data) {
        var keylen = 32; var ivlen = 16;
        crypto.randomBytes(keylen + ivlen, function (err, buf){
            if (err) { _err(socket, err); return; }
            var rsakey = new jsbnrsa.Key();
            rsakey.setPublic(data.n, data.e);
            aeskey = buf.slice(0, keylen);
            aesiv = buf.slice(keylen, keylen + ivlen);
            var keybuf = aeskey.toString("base64");
            var ivbuf = aesiv.toString("base64");
            var out = {
                key: rsakey.encrypt(keybuf), iv: rsakey.encrypt(ivbuf) 
            };
            socket.emit('init', out);
        });
    });
    socket.on('login', function (data) {
        var aesc = crypto.createCipheriv("aes-256-cbc", aeskey, aesiv);
        var abc = aesc.update("hell0","ascii","base64");
        var o = aesc.final();
        var aes = crypto.createDecipheriv("aes-256-cbc", aeskey, aesiv);
        var aaa = new Buffer(data.pwd, 'base64');//data.pwd.toString('hex');
        var def = aes.update(aaa);
        var test = aes.final();

    });
});
