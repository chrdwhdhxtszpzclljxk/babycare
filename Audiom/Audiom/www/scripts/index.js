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
        

    };

    function onPause() {
        // TODO: 此应用程序已挂起。在此处保存应用程序状态。
    };

    function onResume() {
        // TODO: 此应用程序已重新激活。在此处还原应用程序状态。
    };
})();



//The following is customizable, and consistent to the templates used
var home = {};            //default partial page, which will be loaded initially
home.partial = "lib/home.html";
home.init = function () {   //bootstrap method
    //nothing but static content only to render
    miniSPA.render("home");
}

var jiaoliu = {};            //default partial page, which will be loaded initially
jiaoliu.partial = "lib/jiaoliu.html";
jiaoliu.init = function () {   //bootstrap method
    //nothing but static content only to render
    miniSPA.render("jiaoliu");
}

var getEmoji = {};
getEmoji.partial = "getEmoji.html"
getEmoji.init = function () {
    document.getElementById('spinner').style.visibility = 'visible';
    document.getElementById('content').style.visibility = 'hidden';
    miniSPA.ajaxRequest('https://api.github.com/emojis', 'GET', '', function (status, partial) {
        getEmoji.emojis = JSON.parse(partial);
        miniSPA.render('getEmoji');       //render related partial page with data returned from the server
        document.getElementById('content').style.visibility = 'visible';
        document.getElementById('spinner').style.visibility = 'hidden';
    });
}

miniSPA.changeUrl();    //initialize