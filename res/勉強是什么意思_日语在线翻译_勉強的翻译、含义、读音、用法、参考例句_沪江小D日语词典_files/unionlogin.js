var _after = function (newEl, targetEl) {
    var parentEl = targetEl.parentNode;

    if (parentEl.lastChild == targetEl) {
        parentEl.appendChild(newEl);
    } else {
        parentEl.insertBefore(newEl, targetEl.nextSibling);
    }
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}

function ie6fixed(top, obj) {
  
    var obj = document.getElementById(obj);
    window.onresize = function () {if (obj) { obj.style.top = (document.body.scrollTop || document.documentElement.scrollTop) + top + 'px'; }}
    window.onscroll = function () {if (obj) { obj.style.top = (document.body.scrollTop || document.documentElement.scrollTop) + top + 'px'; }}
   
}

/**
* 沪江快速登录
@param theme 样式
*/
function hjpassport(theme) {
    var context = this;
    this.sid = new Date().getTime();
    this.divid = 'hj_login_' + this.sid;
    this.baseUrl = '';
    this.style = theme;
    this.source = '';
    this.agent = '';
    this.returnUrl = window.location.href;
    this.cookie_name = 'hj_token';
    this.isIE6 = !-[1, ] && !window.XMLHttpRequest;
    this.requestString = function (item) {
        var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return (svalue ? svalue[1] : svalue) || '';
    }
   

    this.loadstyle = function () {
        return;
        if (!this.style)
            this.style = 'http://yeshj.qiniudn.com/default.css';
        if (!document.getElementById('ulogin_style_' + this.sid)) {
            var _header_style = document.createElement('link');
            _header_style.setAttribute('id', 'ulogin_style_' + this.sid);
            _header_style.setAttribute('href', this.style + '?r=' + this.sid);
            _header_style.setAttribute('rel', 'stylesheet');
            _header_style.setAttribute('type', 'text/css');
            document.getElementsByTagName("HEAD").item(0).appendChild(_header_style);
        }
    }
    this.loadstyle();

   
    /**
    *验证成功以后的回调函数
    */
    this.validationSuccess = null;

    this.doLogin = function () {
        
        var size = this.widthandheight();
        var pageHeight = size[1];
        var iframe_src = this.baseUrl + '/?source=' + encodeURIComponent(this.source) + '&agent=' + encodeURIComponent(this.agent) + '&callback=' + this.validationSuccess + '&url=' + this.returnUrl;
        var markdiv = document.createElement('div');

        

        markdiv.id = 'ulogin_mark_' + this.divid;
        markdiv.style.top = '0px';
        markdiv.style.left = '0px';
        markdiv.style.width = '100%';
        markdiv.style.height = pageHeight + 'px';
        markdiv.style.backgroundColor = '#cccccc';
        markdiv.style.zIndex = 999998;
        markdiv.style.position = 'absolute';
        markdiv.style.filter = 'alpha(opacity=50)';
        markdiv.style.opacity = '0.5';
        
        document.body.insertBefore(markdiv, document.body.childNodes[0]);

        if (!document.getElementById(this.divid)) {
          
            var div = document.createElement('div');
            div.id = this.divid;
            div.setAttribute('class', 'hj_passport_login');
            div.style.zIndex = 999999;
            div.style.paddingTop = "5px";
            div.style.paddingLeft = "5px";
            div.style.paddingRight = "5px";
            div.style.paddingBottom = "5px";
            div.style.position = "absolute";
            div.style.top = "40%";
            div.style.left = "50%";
            div.style.marginTop = "-61px";
            div.style.marginLeft = "-161px";
            div.style.borderRadius = "5px";
            div.style.width = '416px';
            div.style.height = '335px';
            
            div.style.background = "url(http://yeshj.qiniudn.com/ulogin/images/layer_bg.png)";
           
            document.body.insertBefore(div, document.body.childNodes[1]);
            

            if (this.isIE6) {
                div.style.top = (document.body.scrollTop || document.documentElement.scrollTop) + 340 + 'px';
                ie6fixed(340, this.divid);
            }



            var fixDiv = document.createElement('div');
            fixDiv.id = 'fix_div_' + this.divid;
            _after(fixDiv,document.getElementById(this.divid));


            setTimeout(function () {
                if (typeof document.body.style.maxHeight !== "undefined") {
                    div.style.position = "fixed";
                    div.style.height = "auto";
                    div.style.minHeight = '335px';
                }
            }, 10);
            

            var close_div = document.createElement('div');
            close_div.id = 'close_' + this.sid;
            close_div.style.position = 'absolute';
            close_div.style.right = '17px';
            close_div.style.top = '17px';
            close_div.style.width = '16px';
            close_div.style.height = '16px';
            close_div.style.background = 'url(http://yeshj.qiniudn.com/ulogin/images/icons_close.gif) no-repeat 2px 0px';
            close_div.style.cursor = 'pointer';
            var obj = this;
            close_div.onmouseover = function () {
                close_div.style.background = 'url(http://yeshj.qiniudn.com/ulogin/images/icons_close.gif) no-repeat -22px 0px';
            }
            close_div.onmouseout = function () {
                close_div.style.background = 'url(http://yeshj.qiniudn.com/ulogin/images/icons_close.gif) no-repeat 2px 0px';
            }
            close_div.onclick = function () {
                obj.close();
            };

            div.innerHTML = '<div style="background:#eefaff;border-bottom:1px solid #dce6e9;height:40px;line-height:36px;width:100%;"><span style="float:left;font-size:14px;font-weight:bold;margin-left:15px;color:#666;">登录沪江</span></div><iframe src="" scrolling="no" frameborder="0" id="passport_login_frame" style="border:none;width:0px;height:0px;overflow:hidden;" ></iframe><div style="position:absolute;top:46px;left:5px;width:416px;height:294px;background:#fff;text-align:center;z-index:-10;" id="ulogin_loading"><img style="margin-top:114px;display:inline !important;" src="http://yeshj.qiniudn.com/loadding.gif" /></div>';
            document.getElementById('passport_login_frame').src = iframe_src;
          
            div.appendChild(close_div);
            
            if (getCookie(this.cookie_name))
            {
                markdiv.style.display = 'none';
                div.style.display = 'none';
                try {
                    eval(this.validationSuccess);
                    return true;
                }
                catch (e) {

                }
            }


          
        }
        else {
            document.getElementById(this.divid).style.display = 'block';
        }

        document.onkeydown = function (evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                obj.close();
            }
        };
    }
    this.close = function () {
        if (document.getElementById(this.divid)) {
            var layerDiv = document.getElementById(this.divid);
            document.body.removeChild(layerDiv);
            layerDiv = null;
        }
        if (document.getElementById('ulogin_mark_' + this.divid)) {
            var markDiv = document.getElementById('ulogin_mark_' + this.divid);
            document.body.removeChild(markDiv);
            markDiv = null;
        }
    }
    this.widthandheight = function () {
        var xScroll, yScroll;
        if (window.innerHeight && window.scrollMaxY) {
            xScroll = document.body.scrollWidth;
            yScroll = window.innerHeight + window.scrollMaxY;
        } else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }

        var windowWidth, windowHeight;
        if (self.innerHeight) {  // all except Explorer
            windowWidth = self.innerWidth;
            windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) { // other Explorers
            windowWidth = document.body.clientWidth;
            windowHeight = document.body.clientHeight;
        }

        // for small pages with total height less then height of the viewport
        if (yScroll < windowHeight) {
            pageHeight = windowHeight;
        } else {
            pageHeight = yScroll;
        }

        if (xScroll < windowWidth) {
            pageWidth = windowWidth;
        } else {
            pageWidth = xScroll;
        }

        arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight)
        return arrayPageSize;
    }
}