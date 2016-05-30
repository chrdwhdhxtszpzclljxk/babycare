var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var url = require("url");

const crypto = require('crypto');
var jsbnrsa = require('node-bignumber');
var mysql = require('mysql');
var db = null;
var sql = null;

var aeskey = "";
var aesiv = "";
var mysqlhost = {
    host: 'www.gwgz.com',
    user: 'gwgzapp00',
    password: 'tnt6316311.',
    database: 'gwgzapp'
};

connect();

app.listen(1337);

function handler(req, res) {
    var params = url.parse(req.url, true).query;
    console.log(params);

    var content = generateMixed(6);
    var md5 = crypto.createHash('md5');
    md5.update(content);
    var d = md5.digest('hex');
    
    sql = 'CALL user_register("' + params.uniq + '","' + d.toString("utf8") + '");';
    db.query(sql, function (err, rows, fields) {
        var out = { r: 99, m: "" };
        if (err) {
            out.m = err;
            if (err.errno == 1062) {
                out.r = 1062;
                out.m = "手机号或EMAIL已经被注册过";
            }
        } else {
            out.r = 0;
        }
        console.log("password:", content);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(out));
    });
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
        
        sql = 'CALL user_login("' + data.un + '","' + pwd.toString("utf8") + '");';
        db.query(sql, function (err, rows, fields) {
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

function mysqlError(err) {
    if (err) {
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect();
        } else {
            console.error(err.stack || err);
        }
    }
}

// 连接数据库
function connect() {
    db = mysql.createConnection(mysqlhost);
    db.connect(mysqlError);
    db.on('error', mysqlError);
    console.log("mysql：ok.");
}


var chars = ['0', '1', '2', '3', '5', '6', '7', '8', '9','9'];

function generateMixed(n) {
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 9);
        res += chars[id];
    }
    return res;
}