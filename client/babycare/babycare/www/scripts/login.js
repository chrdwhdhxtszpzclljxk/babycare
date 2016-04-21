// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=397704
// 若要在 Ripple 或 Android 设备/仿真程序中调试代码: 启用你的应用程序，设置断点，
// 然后在 JavaScript 控制台中运行 "window.location.reload()"。
(function () {
    "use strict";
    // 全局事件/变量
    var rsan = "";
    var rsae = "";
    var rsa = null;
    var aeskey = "";
    var aesiv = "";
    var guid = "";
    var userid = "";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );
    function onDeviceReady() {
        // 事件处理 装配 处理 Cordova 暂停并恢复事件
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        // Cordova 已加载。在此处执行任何需要 Cordova 的初始化。
        setTimeout(generateRSA(), 10);

        var setup = app.getSettings();
        //$.toast(JSON.stringify(setup));

        $("#bnlogin").click(function () {
            var un = $("#un").val();
            var pwd = $("#pwd").val();
            var ckb = $("#ckb").attr("checked");
            //$.toast("login" + un + pwd + ckb);
            setTimeout(cmdinit(), 10);
        });
        $("#bncancel").click(function () {
            app.exitapp();
        });
        // 函数定义
        function generateRSA() {
            rsa = new RSAKey();
            rsa.generate(parseInt(1024), "10001");
            rsan = rsa.n.toString(16); rsae = rsa.e.toString(16);
            //$.confirm(rsan + " - " + rsae);
        }

        function cmdlogin() {
            if (aeskey == "") { alert("请先取得秘钥！"); return; }

            var iv = aesiv; var key = aeskey;
            var name10 = $('#un').val(); var pwd10 = CryptoJS.MD5($('#pwd').val()).toString();
            //var name1 = CryptoJS.AES.encrypt(name10, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
            var pwd1 = CryptoJS.AES.encrypt(pwd10, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
            var name2 = name10 + ""; var pwd2 = pwd1 + "";
            $.post(app.url_login, { cmd: "login", name: name2, pwd: pwd2, req_guid: guid },
                function (data, status) {
                    alert("login " + JSON.stringify(data));
                    $("#ptitle").html("请您输入自己的用户名和密码");
                    if (data.cs == 1) {
                        var groupid = data.gi;
                        if (groupid <= 3 || groupid == 13) {
                            $("#div_login").fadeOut();
                            $.cookie('gi', data.gi);
                            $.cookie('mgi', data.mgi);
                            if ($.cookie('pre') == undefined) {
                                window.location = "./";
                            } else {
                                window.location = $.cookie('pre');
                            }
                        } else if (groupid == 35) {
                            $("#div_loginoktudi").show();
                        }
                        else {
                            $("#div_loginoknotpri").show();
                        }
                    } else {
                        $("#ptitle").html("用户名或密码错误！请重新填写！");
                        $("#ptitle").css("color", "red");
                    }
                    $('#bnlogin').removeAttr("disabled");
                }
            );
        }



        function cmdinit() {
            console.log("cmdinit");
            $.post(app.url_login, { cmd: "init", name: $("#un").val(), n: rsan, e: rsae },
            function (data, status) {
                // alert("数据：" + data.UserId + "\n状态：" + status);
                // alert(CryptoJS.MD5("hello"));
                // var keyHex = CryptoJS.enc.Utf8.parse("key");
                // var iv = CryptoJS.enc.Utf8.parse("iv");
                // alert(CryptoJS.AES.encrypt("hello", keyHex, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }));
                // 为了提高加密速度，一般选一个较小的e。比较常用的是3、17、257、65537几个素数。
                // generate()生成密钥的算法是依次计算p,q,n,e,d。因此做了如下改动，以便可以自己选e值：
                // 为了提高RSA的加密速度。最常用的三个e值是3,17和65537。（X.509中建议采用65537，
                // PEM中建议采用3，PKCS#1中建议采用3或65537）。
                // RSA方法，简单地说，是生成一组数字n、e和d。用n和e加密明文（明文要求小于n），用n和d解密密文。
                // 寻找一组n、e、d很容易，但当n足够大时，由n和e求出d很难。这是RSA的安全性所在。
                // var qq = rsa.encrypt("hello");
                // alert(data.rsa);
                //alert(JSON.stringify(data));
                console.log("cmdinit post " + status);
                if (data.cs != 1) { // 登陆失败
                    $.toast("操作失败");
                } else {
                    guid = data.req_guid;
                    aeskey = CryptoJS.enc.Base64.parse(rsa.decrypt(data.aeskey)); aesiv = CryptoJS.enc.Base64.parse(rsa.decrypt(data.aesiv));
                    cmdlogin();
                }
                $('#bnlogin').removeAttr("disabled");
            });
        }


    };
    function onPause() {
        // TODO: 此应用程序已挂起。在此处保存应用程序状态。
        console.log("pause");
    };
    function onResume() {
        // TODO: 此应用程序已重新激活。在此处还原应用程序状态。
        console.log("resume");
    };
} )();