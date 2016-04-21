var app = require('http').createServer(handler);
var io = require('socket.io')(app);

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
                e: data.e,
            };

            key.importKey(keydata, 'components-public');

            //var pri = key.exportKey('private');
            //console.log(pri)
            var pub = key.exportKey('public');
            console.log(pub);
           

        });


    });
});
