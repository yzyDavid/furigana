//
//
// JScript 文件
// For Hjdict a Link behavior
function hj$(objID){
	return document.getElementById(objID);
} 
function HJ$(objID){
	return document.getElementById(objID);
} 
function getcookie(name) {
	var cookie_start = document.cookie.indexOf(name);
	var cookie_end = document.cookie.indexOf(";", cookie_start);
	return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}
function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
	var expires = new Date();
	expires.setTime(expires.getTime() + seconds*1000);
	document.cookie = escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '/')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
}

function on_focus_hintmsg(aevent){
	var Elem=0; 
	if(!aevent.srcElement){
		Elem=aevent.target;
	}else{
		Elem=window.event.srcElement;
	}
	hj$(Elem.id+"_hint").style.display="inline";
}

function on_blur_hintmsg(aevent){
var Elem=0; 
if(!aevent.srcElement){
Elem=aevent.target;
}else{
Elem=window.event.srcElement;
}
hj$(Elem.id+"_hint").style.display="none";
}

function bind_hintmsg(){
var elms = document.getElementsByTagName('input');
var elms2=document.getElementsByTagName('textarea');
var Taglist=[];
if(elms.length>0){
for(var i=0;i<elms.length;i++){
Taglist.push( elms[i] );
}
}
if(elms2.length>0){
for(var i=0;i<elms2.length;i++){
Taglist.push( elms2[i] );
}
}
for (i = 0; i < Taglist.length; i++) { 
var oriElm=Taglist[i]; 
if(hj$(oriElm.id+"_hint") !=undefined ){
if(document.addEventListener) {
oriElm.addEventListener("focus", on_focus_hintmsg, false); 
oriElm.addEventListener("blur", on_blur_hintmsg, false); 
} else if(document.attachEvent) {
oriElm.attachEvent("onfocus", on_focus_hintmsg); 
oriElm.attachEvent("onblur", on_blur_hintmsg); 
}
}
}
}

function _keyup(aevent){
if( aevent==null){
aevent= window.event;
}
if(aevent.keyCode==27){
document.getElementById("w").focus();
try{
var rng   =   document.getElementById("w").createTextRange();
rng.select();
}catch(e){
	       
}
}
}

if(document.addEventListener) {
document.addEventListener("keyup", _keyup, false); 
} else if(document.attachEvent) {
document.attachEvent("onkeyup", _keyup);
}



function QueryString(akey){
    var reg=new RegExp(".*(?:\\?|&)"+ akey +"=(.*?)(?:$|&).*", "igm");
    var value=window.location.href.replace(reg, "$1");
    if(window.location.href==value){
        return "";
    }else{
        return value;
    }
}
function AntiQueryString(akey, aurl ){
	if(!aurl){
		aurl =window.location.href;
	}
	aurl =aurl.toLowerCase().replace("?", "&");
	
	akey=akey.toLowerCase()+"=";
	var items= aurl.split("&");
	var retstring="";
	for(var i=0;i<items.length;i++){
		if(items[i].indexOf("=")!=-1 && items[i].indexOf(akey)!=0 && retstring.indexOf(items[i])==-1){
			if(retstring==""){
				retstring = items[i];
			}else{
				retstring += "&"+ items[i];
			}
		}
	}
	return retstring;  
} 

function GoToMul(mul) {
   
    var strurl = location.href;
	strurl = strurl.replace(location.host + "/app/","d.yeshj.com/");
	strurl = strurl.replace(location.host, "d.yeshj.com");
    //处理带#的链接
    while (strurl.length == strurl.lastIndexOf("#") + 1) {
        strurl = strurl.substr(0, strurl.length - 1);
    }
    var mulQuery = GetQueryString("mul");
    if (mulQuery == mul || (mulQuery==null && mul=="cn")) {
        return false;
    }

    if (mulQuery == null) {
        var reg=new RegExp("/$");

        if (reg.test(strurl)) {
            strurl = strurl + "?mul=" + mul;
        }
        else {
            strurl = strurl + "/?mul=" + mul;
        }

        location.href = strurl;
        return;
    }
    if (mulQuery == "cn") {
        strurl = strurl.replace("mul=cn", "mul=" + mul);
        location.href = strurl;
        return;
    }

    if (mulQuery == "en") {
        strurl = strurl.replace("mul=en", "mul=" + mul);
        location.href = strurl;
        return;
    }

    if (mulQuery == "jp") {
        strurl = strurl.replace("mul=jp", "mul=" + mul);
        location.href = strurl;
        return;
    }
}

function MulURL(url) {
    var mulQuery = ""
    switch (GetQueryString("mul")) {
        case "en": mulQuery = "/?mul=en"; break;
        case "jp": mulQuery = "/?mul=jp"; break;
        default: break;
    }

    return url + mulQuery;
}

function GetQueryString(item) {
    var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
    return svalue ? svalue[1] : svalue;
}

function AjaxMethod(page, method, ajaxData, fun) {
    var ajaxReturn = null;
    var blnAsync = false;
    if (fun != undefined && typeof (fun) === "function") {
        blnAsync = true;
    };
    var objData;
    if (ajaxData) {
        objData = ajaxData;
    }
    else {
        objData = "{}";
    }
    $.ajax({
        type: "post",
        url: "/ajax" + page + "/" + method,
        data: objData,
        datatype: "json",
        async: blnAsync,
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data != undefined && data.d != undefined)
            { ajaxReturn = data.d; }
            else
            { ajaxReturn = data; }

            if (blnAsync) {
                fun.call();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          
        }

    });
    return ajaxReturn;
}

/*dropdown.js*/

var lang = new Array();
var hj_userAgent = navigator.userAgent.toLowerCase();
var hj_is_opera = hj_userAgent.indexOf('opera') != -1 && opera.version();
var hj_is_moz = (navigator.product == 'Gecko') && hj_userAgent.substr(hj_userAgent.indexOf('firefox') + 8, 3);
var hj_is_ie = (hj_userAgent.indexOf('msie') != -1 && !hj_is_opera) && hj_userAgent.substr(hj_userAgent.indexOf('msie') + 5, 3);
var hj_is_kon = hj_userAgent.indexOf('konqueror') != -1;
var hj_is_saf = hj_userAgent.indexOf('applewebkit') != -1 || navigator.vendor == 'Apple Computer, Inc.';
var hj_is_mac = hj_userAgent.indexOf('mac') != -1;

function hjG(id) {
    return document.getElementById(id);
}
function in_array(needle, haystack) {
    if (typeof needle == 'string') {
        for (var i in haystack) {
            if (haystack[i] == needle) {
                return true;
            }
        }
    }
    return false;
}
function doane(event) {
    e = event ? event : window.event;
    if (hj_is_ie) {
        e.returnValue = false;
        e.cancelBubble = true;
    } else if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
}
function isUndefined(variable) {
    return typeof variable == 'undefined' ? true : false;
}
function mb_strlen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;
    }
    return len;
}
function strlen(str) {
    return (hj_is_ie && str.indexOf('\n') != -1) ? str.replace(/\r?\n/g, '_').length : str.length;
}
function trim(str) {
    return (str + '').replace(/(\s+)hjG/g, '').replace(/^\s+/g, '');
}

var jsmenu = new Array();
var ctrlobjclassName;
jsmenu['active'] = new Array();
jsmenu['timer'] = new Array();
jsmenu['iframe'] = new Array();

function initCtrl(ctrlobj, click, duration, timeout, layer) {
    if (ctrlobj && !ctrlobj.initialized) {
        ctrlobj.initialized = true;
        ctrlobj.unselectable = true;

        ctrlobj.outfunc = typeof ctrlobj.onmouseout == 'function' ? ctrlobj.onmouseout : null;
        ctrlobj.onmouseout = function() {
            if (this.outfunc) this.outfunc();
            if (duration < 3) jsmenu['timer'][ctrlobj.id] = setTimeout('hideMenu(' + layer + ')', timeout);
        }

        if (click && duration) {
            ctrlobj.clickfunc = typeof ctrlobj.onclick == 'function' ? ctrlobj.onclick : null;
            ctrlobj.onclick = function(e) {
                doane(e);
                if (jsmenu['active'][layer] == null || jsmenu['active'][layer].ctrlkey != this.id) {
                    if (this.clickfunc) this.clickfunc();
                    else showMenu(this.id, true);
                } else {
                    hideMenu(layer);
                }
            }
        }

        ctrlobj.overfunc = typeof ctrlobj.onmouseover == 'function' ? ctrlobj.onmouseover : null;
        ctrlobj.onmouseover = function(e) {
            doane(e);
            if (this.overfunc) this.overfunc();
            if (click) {
                clearTimeout(jsmenu['timer'][this.id]);
            } else {
                for (var id in jsmenu['timer']) {
                    if (jsmenu['timer'][id]) clearTimeout(jsmenu['timer'][id]);
                }
            }
        }
    }
}

function initMenu(ctrlid, menuobj, duration, timeout, layer) {
    if (menuobj && !menuobj.initialized) {
        menuobj.initialized = true;
        menuobj.ctrlkey = ctrlid;
        menuobj.onclick = ebygum;
        menuobj.style.position = 'absolute';
        if (duration < 3) {
            if (duration > 1) {
                menuobj.onmouseover = function() {
                    clearTimeout(jsmenu['timer'][ctrlid]);
                }
            }
            if (duration != 1) {
                menuobj.onmouseout = function() {
                    jsmenu['timer'][ctrlid] = setTimeout('hideMenu(' + layer + ')', timeout);
                }
            }
        }
        menuobj.style.zIndex = 50;
        if (hj_is_ie && !hj_is_mac) {
            menuobj.style.filter += "progid:DXImageTransform.Microsoft.shadow(direction=135,color=#EBEBEB,strength=3)";
        }
    }
}

function showMenu(ctrlid, click, offset, duration, timeout, layer, showid, maxh) {
    e = window.event ? window.event : showMenu.caller.arguments[0];
    var ctrlobj = hjG(ctrlid);
    if (!ctrlobj) return;
    if (isUndefined(click)) click = false;
    if (isUndefined(offset)) offset = 0;
    if (isUndefined(duration)) duration = 2;
    if (isUndefined(timeout)) timeout = 500;
    if (isUndefined(layer)) layer = 0;
    if (isUndefined(showid)) showid = ctrlid;
    var showobj = hjG(showid);
    var menuobj = hjG(showid + '_menu');
    if (!showobj || !menuobj) return;
    if (isUndefined(maxh)) maxh = 400;

    hideMenu(layer);

    for (var id in jsmenu['timer']) {
        if (jsmenu['timer'][id]) clearTimeout(jsmenu['timer'][id]);
    }

    initCtrl(ctrlobj, click, duration, timeout, layer);
    ctrlobjclassName = ctrlobj.className;
    ctrlobj.className += ' hover';
    initMenu(ctrlid, menuobj, duration, timeout, layer);

    menuobj.style.display = '';
    if (!hj_is_opera) {
        menuobj.style.clip = 'rect(auto, auto, auto, auto)';
    }

    setMenuPosition(showid, offset);

    if (hj_is_ie && hj_is_ie < 7) {
        if (!jsmenu['iframe'][layer]) {
            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.position = 'absolute';
            iframe.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';
            hjG('append_parent') ? hjG('append_parent').appendChild(iframe) : menuobj.parentNode.appendChild(iframe);
            jsmenu['iframe'][layer] = iframe;
        }
        jsmenu['iframe'][layer].style.top = menuobj.style.top;
        jsmenu['iframe'][layer].style.left = menuobj.style.left;
        jsmenu['iframe'][layer].style.width = menuobj.w;
        jsmenu['iframe'][layer].style.height = menuobj.h;
        jsmenu['iframe'][layer].style.display = 'block';
    }

    if (maxh && menuobj.scrollHeight > maxh) {
        menuobj.style.height = maxh + 'px';
        if (hj_is_opera) {
            menuobj.style.overflow = 'auto';
        } else {
            menuobj.style.overflowY = 'auto';
        }
    }

    if (!duration) {
        setTimeout('hideMenu(' + layer + ')', timeout);
    }

    jsmenu['active'][layer] = menuobj;
}

function setMenuPosition(showid, offset) {
    var showobj = hjG(showid);
    var menuobj = hjG(showid + '_menu');
    if (isUndefined(offset)) offset = 0;
    if (showobj) {
        showobj.pos = fetchOffset(showobj);
        showobj.X = showobj.pos['left'];
        showobj.Y = showobj.pos['top'];
        showobj.w = showobj.offsetWidth;
        showobj.h = showobj.offsetHeight;
        menuobj.w = menuobj.offsetWidth;
        menuobj.h = menuobj.offsetHeight;
        menuobj.style.left = (showobj.X + menuobj.w > document.body.clientWidth) && (showobj.X + showobj.w - menuobj.w >= 0) ? showobj.X + showobj.w - menuobj.w + 'px' : showobj.X + 'px';
        menuobj.style.top = offset == 1 ? showobj.Y + 'px' : (offset == 2 || ((showobj.Y + showobj.h + menuobj.h > document.documentElement.scrollTop + document.documentElement.clientHeight) && (showobj.Y - menuobj.h >= 0)) ? (showobj.Y - menuobj.h) + 'px' : showobj.Y + showobj.h + 'px');
       
        if (menuobj.style.clip && !hj_is_opera) {
            menuobj.style.clip = 'rect(auto, auto, auto, auto)';
        }
    }
}

function hideMenu(layer) {
    if (isUndefined(layer)) layer = 0;
    if (jsmenu['active'][layer]) {
        try {
            hjG(jsmenu['active'][layer].ctrlkey).className = ctrlobjclassName;
        } catch (e) { }
        clearTimeout(jsmenu['timer'][jsmenu['active'][layer].ctrlkey]);
        jsmenu['active'][layer].style.display = 'none';
        if (hj_is_ie && hj_is_ie < 7 && jsmenu['iframe'][layer]) {
            jsmenu['iframe'][layer].style.display = 'none';
        }
        jsmenu['active'][layer] = null;
    }
}

function fetchOffset(obj) {
    var left_offset = obj.offsetLeft;
    var top_offset = obj.offsetTop;
    while ((obj = obj.offsetParent) != null) {
        left_offset += obj.offsetLeft;
        top_offset += obj.offsetTop;
    }
    return { 'left': left_offset, 'top': top_offset };
}

function ebygum(eventobj) {
    if (!eventobj || hj_is_ie) {
        window.event.cancelBubble = true;
        return window.event;
    } else {
        if (eventobj.target.type == 'submit') {
            eventobj.target.form.submit();
        }
        eventobj.stopPropagation();
        return eventobj;
    }
}

function menuoption_onclick_function(e) {
    this.clickfunc();
    hideMenu();
}

function menuoption_onclick_link(e) {
    choose(e, this);
}

function menuoption_onmouseover(e) {
    this.className = 'popupmenu_highlight';
}

function menuoption_onmouseout(e) {
    this.className = 'popupmenu_option';
}

function choose(e, obj) {
    var links = obj.getElementsByTagName('a');
    if (links[0]) {
        if (hj_is_ie) {
            links[0].click();
            window.event.cancelBubble = true;
        } else {
            if (e.shiftKey) {
                window.open(links[0].href);
                e.stopPropagation();
                e.preventDefault();
            } else {
                window.location = links[0].href;
                e.stopPropagation();
                e.preventDefault();
            }
        }
        hideMenu();
    }
}


///-------------------------------------------------------------------------
//jQuery弹出窗口 By Await [2009-11-22]
//--------------------------------------------------------------------------
/*参数：[可选参数在调用时可写可不写,其他为必写]
----------------------------------------------------------------------------
title:	窗口标题
content:  内容(可选内容为){ text | id | img | url | iframe }
width:	内容宽度
height:	内容高度
drag:  是否可以拖动(ture为是,false为否)
time:	自动关闭等待的时间，为空是则不自动关闭
showbg:	[可选参数]设置是否显示遮罩层(0为不显示,1为显示)
cssName:  [可选参数]附加class名称
------------------------------------------------------------------------*/
//示例:
//------------------------------------------------------------------------
//simpleWindown("例子","text:例子","500","400","true","3000","0","exa")
//------------------------------------------------------------------------

var showWindown = true;
var templateSrc = "http://bulo.hujiang.com/app"; //设置loading.gif路径
function tipsWindown(title, content, width, height, drag, time, showbg, cssName) {
    $("#windown-box").remove(); //请除内容
    var width = width >= 950 ? this.width = 950 : this.width = width;     //设置最大窗口宽度
    var height = height >= 650 ? this.height = 650 : this.height = height;  //设置最大窗口高度
    if (showWindown == true) {
        var simpleWindown_html = new String;
        simpleWindown_html = "<div id=\"windownbg\" style=\"height:" + $(document).height() + "px;filter:alpha(opacity=0);opacity:0;z-index: 999901\"></div>";
        simpleWindown_html += "<div id=\"windown-box\">";
        simpleWindown_html += "<div id=\"windown-title\"><h2></h2><span id=\"windown-close\">关闭</span></div>";
        simpleWindown_html += "<div id=\"windown-content-border\"><div id=\"windown-content\"></div></div>";
        simpleWindown_html += "</div>";
        $("body").append(simpleWindown_html);
        show = false;
    }
    contentType = content.substring(0, content.indexOf(":"));
    content = content.substring(content.indexOf(":") + 1, content.length);
    switch (contentType) {
        case "text":
            $("#windown-content").html(content);
            break;
        case "id":
            $("#windown-content").html($("#" + content + "").html());
            break;
        case "img":
            $("#windown-content").ajaxStart(function() {
                $(this).html("<img src='" + templateSrc + "/images/loading.gif' class='loading' />");
            });
            $.ajax({
                error: function() {
                    $("#windown-content").html("<p class='windown-error'>加载数据出错...</p>");
                },
                success: function(html) {
                    $("#windown-content").html("<img src=" + content + " alt='' />");
                }
            });
            break;
        case "url":
            var content_array = content.split("?");
            

            $("#windown-content").html("<img src='" + templateSrc + "/images/loading.gif' class='loading' />");
          
            $.ajax({
                type: content_array[0],
                url: content_array[1],
                data: content_array[2],
                error: function() {
                    $("#windown-content").html("<p class='windown-error'>加载数据出错...</p>");
                },
                success: function(html) {
                    $("#windown-content").html(html);
                }
            });
            break;
        case "iframe":
            $("#windown-content").ajaxStart(function() {
                $(this).html("<img src='" + templateSrc + "/images/loading.gif' class='loading' />");
            });
            $.ajax({
                error: function() {
                    $("#windown-content").html("<p class='windown-error'>加载数据出错...</p>");
                },
                success: function(html) {
                    $("#windown-content").html("<iframe src=\"" + content + "\" width=\"100%\" height=\"" + parseInt(height) + "px" + "\" scrolling=\"no\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\"></iframe>");
                }
            });
    }
    $("#windown-title h2").html(title);
    if (showbg == "true") { $("#windownbg").show(); } else { $("#windownbg").remove(); };
    $("#windownbg").animate({ opacity: "0.5" }, "normal"); //设置透明度
    $("#windown-box").show();
    if (height >= 650) {
        $("#windown-title").css({ width: (parseInt(width) + 27) + "px" });
        $("#windown-content").css({ width: (parseInt(width) + 17) + "px", height: height + "px" });
    } else {
        $("#windown-title").css({ width: (parseInt(width) + 10) + "px" });
        $("#windown-content").css({ width: width + "px", height: height + "px" });
    }
    var cw = document.documentElement.clientWidth, ch = document.documentElement.clientHeight, est = document.documentElement.scrollTop;
    var _version = $.browser.version;
    if (_version == 6.0) {
        $("#windown-box").css({ left: "50%", top: (parseInt((ch) / 2) + est) + "px", marginTop: -((parseInt(height) + 53) / 2) + "px", marginLeft: -((parseInt(width) + 32) / 2) + "px", zIndex: "999999" });
    } else {
        $("#windown-box").css({ left: "50%", top: "50%", marginTop: -((parseInt(height) + 53) / 2) + "px", marginLeft: -((parseInt(width) + 32) / 2) + "px", zIndex: "999999" });
    };
    var Drag_ID = document.getElementById("windown-box"), DragHead = document.getElementById("windown-title");

    var moveX = 0, moveY = 0, moveTop, moveLeft = 0, moveable = false;
    if (_version == 6.0) {
        moveTop = est;
    } else {
        moveTop = 0;
    }
    var sw = Drag_ID.scrollWidth, sh = Drag_ID.scrollHeight;
    DragHead.onmouseover = function(e) {
        if (drag == "true") { DragHead.style.cursor = "move"; } else { DragHead.style.cursor = "default"; }
    };
    DragHead.onmousedown = function(e) {
        if (drag == "true") { moveable = true; } else { moveable = false; }
        e = window.event ? window.event : e;
        var ol = Drag_ID.offsetLeft, ot = Drag_ID.offsetTop - moveTop;
        moveX = e.clientX - ol;
        moveY = e.clientY - ot;
        document.onmousemove = function(e) {
            if (moveable) {
                e = window.event ? window.event : e;
                var x = e.clientX - moveX;
                var y = e.clientY - moveY;
                if (x > 0 && (x + sw < cw) && y > 0 && (y + sh < ch)) {
                    Drag_ID.style.left = x + "px";
                    Drag_ID.style.top = parseInt(y + moveTop) + "px";
                    Drag_ID.style.margin = "auto";
                }
            }
        }
        document.onmouseup = function() { moveable = false; };
        Drag_ID.onselectstart = function(e) { return false; }
    }
    $("#windown-content").attr("class", "windown-" + cssName);
    var closeWindown = function() {
        $("#windownbg").remove();
        $("#windown-box").fadeOut("slow", function() { $(this).remove(); });
    }
    if (time == "" || typeof (time) == "undefined") {
        $("#windown-close").click(function() {
            $("#windownbg").remove();
            $("#windown-box").fadeOut("slow", function() { $(this).remove(); });
        });
    } else {
        setTimeout(closeWindown, time);
    }
}
/*tips end*/

