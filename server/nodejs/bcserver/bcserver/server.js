var app = require('http').createServer(handler);
var io = require('socket.io')(app);
const crypto = require('crypto');
var jsbnrsa = require('node-bignumber');
var mysql = require('mysql');

var aeskey = "";
var aesiv = "";
var mysqlhost = {
    host: 'www.gwgz.com',
    user: 'gwgzapp00',
    password: 'tnt6316311.',
    database: 'gwgzapp'
};

app.listen(1337);
//console.log(crypto.getCiphers());

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
        var pwd = "";
        try {
            var aes = crypto.createDecipheriv("aes-256-cbc", aeskey, aesiv);
            aes.setAutoPadding(false);
            var aaa = new Buffer(data.pwd, 'base64');
            pwd = aes.update(data.pwd, "base64", "utf8");
            pwd += aes.final();
        } catch (e) {
        }
        console.log("pwd:" + pwd.toString("utf8"));

        
        var connection = mysql.createConnection(mysqlhost);
        var sql = 'CALL user_login("' + data.un + '","' + pwd.toString("utf8") + '");';
        connection.query(sql, function (err, rows, fields) {
            var out = {r:99,m:""};
            if (err) {
                out.m = err;
            } else {

                var results = rows[0];
                var row = results[0];
                console.log("logined：", row.logined);
                out.r = row.logined;
            }

            socket.emit('login', out);
        });

    });
});
