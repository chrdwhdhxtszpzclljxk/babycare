var app = require('http').createServer(handler)
var io = require('socket.io')(app);

app.listen(1337);

function handler(req, res) {
}

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(JSON.stringify(data));
    });
});