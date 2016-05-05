// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=397704
// 若要在 Ripple 或 Android 设备/仿真程序中调试代码: 启用你的应用程序，设置断点，
// 然后在 JavaScript 控制台中运行 "window.location.reload()"。
(function (a) {
    "use strict";
    a.serverurl = "http://127.0.0.1:1337";

    $(document).on("pageInit", "#pagemain", function (e, id, page) {
        setTimeout(function () {
            $.showPreloader("生成交互密钥...");
            var rsa = new RSAKey();
            rsa.generate(parseInt(1024), "10001");
            
            console.log(JSON.stringify(rsa.toString()));
            
            a.rsan = rsa.n.toString(16); a.rsae = rsa.e.toString(16);
            console.log(a.rsan);
            console.log(a.rsae);

            $.hidePreloader();
        }, 10);
    });

    a.postinit = function() {
        a.socket = io.connect(a.serverurl);
        a.socket.on('connect', function () {
            a.socket.emit('init', { n: a.rsan, e: a.rsae });
        });
        a.socket.on('init', function (data) {
            console.log(data);
        });
    }




})(window.skt = {});
