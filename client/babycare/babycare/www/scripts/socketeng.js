// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=397704
// 若要在 Ripple 或 Android 设备/仿真程序中调试代码: 启用你的应用程序，设置断点，
// 然后在 JavaScript 控制台中运行 "window.location.reload()"。
(function (a) {
    "use strict";

    var socket = io.connect('http://127.0.0.1:1337');
    socket.on('news', function (data) {
        console.log(JSON.stringify(data));
        socket.emit('my other event', { my: 'data' });
    });

})(window.skt = {});
