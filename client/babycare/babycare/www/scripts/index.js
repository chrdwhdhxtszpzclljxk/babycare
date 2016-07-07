// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=397704
// 若要在 Ripple 或 Android 设备/仿真程序中调试代码: 启用你的应用程序，设置断点，
// 然后在 JavaScript 控制台中运行 "window.location.reload()"。
(function () {
    "use strict";
    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );
    function onDeviceReady() {
        // 处理 Cordova 暂停并恢复事件
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        // TODO: Cordova 已加载。在此处执行任何需要 Cordova 的初始化。
        var element = document.getElementById("deviceready");
        if (element != null) {
            element.innerHTML = 'Device Ready 你好';
            element.className += ' ready';
        } else {
            //$.toast("操作失败");
        }

        $("#bnlogin").click(function () {
            window.skt.postinit();
        });

        $("#sendpwd").click(function () {
            var uniq = $("#uniq").val();
            if (uniq == undefined || uniq == "") {
                $.toast("手机/EMAIL不能为空！");
                return;
            }
            var re = /^[0-9]+.?[0-9]*$/;
            var reginfo = {};
            reginfo.uniq = uniq;
            if (uniq.indexOf("@") != -1) {
                reginfo.type = "email";
                //$.toast("email");
            } else if (re.test(uniq)) {
                //$.toast("mobile");
                reginfo.type = "mobile";
            } else {
                $.toast("输入不合法，请输入手机号或者EMAIL");
                return;
            }

            $.get(window.skt.httpurl, reginfo, function (d, s, x) {
                if (d.r == 0) {
                    $("#getuniq").hide();
                    $("#getuniqok").show();
                }else if (d.r == 1062) {
                    $.toast(d.m);
                } else {
                    $.toast(d.m);
                }
            });



        });

        $(".close-popup").click(function () {
            $("#uniq").val("");
            $("#getuniq").show();
            $("#getuniqok").hide();
        });
    };
    function onPause() {
        // TODO: 此应用程序已挂起。在此处保存应用程序状态。
        console.log("pause");
    };
    function onResume() {
        // TODO: 此应用程序已重新激活。在此处还原应用程序状态。
        console.log("resume");
    };
})();



function a_click(obj) {
    //alert(obj.className);
    var tb = document.getElementById("toolbar_main");
    for (var i = 0; i < tb.children.length; i++) {
        //console.log(tb.children[i].innerHTML);
        removeClass(tb.children[i], "active");
    }
    addClass(obj, "active");

    console.log(obj.innerHTML);
}