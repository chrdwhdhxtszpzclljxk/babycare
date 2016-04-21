// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=397704
// 若要在 Ripple 或 Android 设备/仿真程序中调试代码: 启用你的应用程序，设置断点，
// 然后在 JavaScript 控制台中运行 "window.location.reload()"。
(function (a) {
    "use strict";

	// 获取应用本地配置
    a.setSettings = function (settings) {
        settings = settings || {};
        localStorage.setItem('$settings', JSON.stringify(settings));
    }

	// 设置应用本地配置
    a.getSettings = function () {
        var settingsText = localStorage.getItem('$settings') || "{}";
        return JSON.parse(settingsText);
    }

    a.exitapp = function () {
        navigator.app.exitApp();
    }

    a.url_host = "http://localhost:3000/";
    a.url_login = a.url_host + "login.ashx";

})(window.app = {});


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



function addClass(obj, cls) {
    if (obj == null) return;
    if (!hasClass(obj, cls)) {
        var obj_class = obj.className,//获取 class 内容.
	    blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
        added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
        obj.className = added;//替换原来的 class.
    }
}

function removeClass(obj, cls) {
    if (obj == undefined) return;
    while (hasClass(obj, cls)) {
        removeClass1(obj, cls);
    }
    return;
    var obj_class = ' ' + obj.className + ' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc        bcd' -> ' abc        bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc        bcd ' -> ' abc bcd '
    removed = obj_class.replace(' ' + cls + ' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的 class.
}


function removeClass1(obj, cls) {
    //console.log("removeClass" + obj + cls);
    if (obj == undefined) return;
    var obj_class = ' ' + obj.className + ' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc        bcd' -> ' abc        bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc        bcd ' -> ' abc bcd '
    removed = obj_class.replace(' ' + cls + ' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的 class.
}

function hasClass(obj, cls) {
    if (obj == null) return;
    var obj_class = obj.className;//获取 class 内容.
    if (obj_class == undefined) return;
    //console.log(obj.className);
    obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
    x = 0;
    for (x in obj_class_lst) {
        if (obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
            return true;
        }
    }
    return false;
}

console.trace = function () {
    console.log("console.trace");
    var stack = [],
        caller = arguments.callee.caller;

    while (caller) {
        stack.unshift(getFunctionName(caller));
        caller = caller && caller.caller;
    }

    alert('functions on stack:' + '\n' + stack.join('\n'));
}
