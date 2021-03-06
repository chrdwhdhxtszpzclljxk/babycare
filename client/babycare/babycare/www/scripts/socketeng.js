﻿// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=397704
// 若要在 Ripple 或 Android 设备/仿真程序中调试代码: 启用你的应用程序，设置断点，
// 然后在 JavaScript 控制台中运行 "window.location.reload()"。
(function (a) {
    "use strict";
    a.httpurl = "http://192.168.1.5:1337";
    a.serverurl = "ws://192.168.1.5:1337";
    a.logined = 99;

    $(document).on("pageInit", "#pagemain", function (e, id, page) {
        console.log("pateInit");
        setTimeout(function () {
            console.log(a.rsa);
            $.showPreloader("生成交互密钥...");
            a.rsa = new RSAKey();
            a.rsa.generate(parseInt(1024), "10001");
            //console.log(JSON.stringify(a.rsa.toString()));
            a.rsan = a.rsa.n.toString(16); a.rsae = a.rsa.e.toString(16);
            console.log(a.rsan);
            console.log(a.rsae);

            $.hidePreloader();

            if (a.logined == 0) {
                $('#pagemain').hide();
            } else {
                $('#loading').hide();
                $('#login').show();
            }

        }, 1000);
    });

    a.postinit = function () {
        if (a.socket != undefined) a.socket.close();
        a.socket = io.connect(a.serverurl);
        a.socket.on('connect', function () {
            a.socket.emit('init', { n: a.rsan, e: a.rsae });
        });
        a.socket.on('init', function (data) {

            var key = data.key;
            var iv = data.iv;
            var out = a.rsa.decrypt(key);
            a.aeskey = CryptoJS.enc.Base64.parse(a.rsa.decrypt(key)); a.aesiv = CryptoJS.enc.Base64.parse(a.rsa.decrypt(iv));
            var name10 = $('#un').val(); var pwd10 = CryptoJS.MD5($('#pwd').val()).toString();
            console.log(pwd10);
            var pwd1 = CryptoJS.AES.encrypt(pwd10, a.aeskey, { iv: a.aesiv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
            var name2 = name10 + ""; var pwd2 = pwd1 + "";
            var logininfo = {
                un: name2,
                pwd: pwd2
            };
            console.log("key:" + a.aeskey);
            console.log("iv:" + a.aesiv);
            console.log("pwd:" + pwd2);
            a.socket.emit('login', logininfo);
        });

        a.socket.on('login', function (data) {
            if (data.r == 0) {
                $('#splash').hide();
                a.logined = 0;
            } else {
                $.toast("用户名或密码错误！");
                a.logined = data.r;
            }
        });
    }




})(window.skt = {});
