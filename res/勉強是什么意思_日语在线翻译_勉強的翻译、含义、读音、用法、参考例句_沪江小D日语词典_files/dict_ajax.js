var _gaq = _gaq || [];

(function () {
    var win = window;
    if (win['HJ'] === undefined) win['HJ'] = {};
    var HJ = win['HJ'];
    /**
    *创建命名空间
    *<code>
    *HJ.namespace('HJ.Ajax'); // returns HJ.Ajax
    </code>
    */
    HJ.namespace = function () {
        var args = Array.prototype.slice.call(arguments, 0),
        i, j, nps, len, o, len2;
        for (i = 0, len = args.length; i < len; i++) {
            nps = ('' + args[i] + '').split('.');
            len2 = nps.length;
            o = this;
            for (j = win[nps[0]] == o ? 1 : 0; j < len2; j++) {
                o = o[nps[j]] = o[nps[j]] || {};
            }
        }
    }

    /**
    *common function
    */
    HJ.common = {
        /**
        *移除文字前后的空白
        */
        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        /**
        *复制配置属性给某对象
        */
        apply: function (obj, config) {
            if (obj && config && typeof config == 'object') {
                for (var p in config)
                    obj[p] = config[p];
            }
            return obj;
        },
        mix: function (r, s, ov, wl) {
            if (!s || !r) return r;
            if (ov === undefined) ov = true;
            var i, p, l;

            if (wl && (l = wl.length)) {
                for (i = 0; i < l; i++) {
                    p = wl[i];
                    if (p in s) {
                        if (ov || !(p in r)) {
                            r[p] = s[p];
                        }
                    }
                }
            } else {
                for (p in s) {
                    if (ov || !(p in r)) {
                        r[p] = s[p];
                    }
                }
            }
            return r;
        },
        debug: function (msg) {
            var debugflag = false;
            if (debugflag) {
                try {
                    console.info(msg);
                }
                catch (e) { }
            }
        }
    }

    /**
    *浏览器版本检查
    */
    HJ.namespace('ua');
    (function () {
        var ua = navigator.userAgent.toLowerCase();
        var _isOpera = ua.indexOf('opera') != -1,
		_isSafari = ua.indexOf('safari') != -1,
		_isGecko = ua.indexOf('gecko') > -1,
		_isChrome = ua.indexOf('chrome') > -1,
		_isIE = ua.indexOf('msie') != -1,
		_isIE6 = ua.indexOf('msie 6') != -1,
		_isIE7 = ua.indexOf('msie 7') != -1,
	    _isIE8 = ua.indexOf('msie 8') != -1;
        HJ.ua = {
            isOpera: _isOpera,
            isSafari: _isSafari,
            isGecko: _isGecko,
            isChrome: _isChrome,
            isIE: _isIE,
            isIE6: _isIE6,
            isIE7: _isIE7,
            isIE8: _isIE8
        };
    })()

    /**
    *一些基本的dom操作
    */
    HJ.namespace('HJ.dom');
    var SPACE = ' ';
    HJ.dom = {
        /**
        *简单的方法得到一个DOM节点
        */
        get: function (el) {
            return typeof el == 'string' ? document.getElementById(el) : el;
        },
        html: function (el, htmlCode) {
            el = HJ.dom.get(el);
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0) {
                el.innerHTML = '<div style="display:none">for IE</div>' + htmlCode;
                el.removeChild(el.firstChild);
            }
            else {
                if (!el) return;
                var el_next = el.nextSibling;
                var el_parent = el.parentNode;
                el_parent.removeChild(el);
                el.innerHTML = htmlCode;
                if (el_next) {
                    el_parent.insertBefore(el, el_next)
                } else {
                    el_parent.appendChild(el);
                }
            }
        },
        /**
        * 判断一个元素是否有一个类名
        */
        hasClass: function (el, className) {
            var ret = false;
            el = HJ.dom.get(el);
            if (el && el.nodeType == 1) {
                var current = HJ.common.trim(el.className);
                ret = className && (SPACE + current + SPACE).indexOf(SPACE + className + SPACE) > -1;
            }
            return ret;
        },
        /**
        *假如这个dom节点不具有指定的类名，则增加这个class
        */
        addClass: function (el, className) {
            el = HJ.dom.get(el);
            if (el && el.nodeType == 1) {
                if (!HJ.dom.hasClass(el, className)) {
                    var current = HJ.common.trim(el.className);
                    el.className = HJ.common.trim(current + SPACE + className);
                }
            }
        },
        /**
        *假如这个dom节点具有指定的类名，则移除这个class
        */
        removeClass: function (el, className) {
            el = HJ.dom.get(el);
            if (el && el.nodeType == 1) {
                if (HJ.dom.hasClass(el, className)) {
                    var current = el.className;
                    if (current) {
                        current = (SPACE + current + SPACE).replace(/[\n\t]/g, SPACE);
                        className = current.replace(SPACE + className + SPACE, SPACE);
                        el.className = className;
                    }
                }
            }
        },
        /**
        *用一个新的class替换老的class
        */
        replace: function (el, oldClassName, newClassName) {
            el = HJ.dom.get(el);
            HJ.dom.removeClass(el, oldClassName);
            HJ.dom.addClass(el, newClassName);
        },
        /**
        *获取 el 相对 el.ownerDocument 的坐标
        */
        getPositionOffset: function (el) {
            var box, left = 0, top = 0,
            doc = el.ownerDocument;
            //抛弃老的获取方式，通过getBoudingClientRect方法
            if (el.getBoundingClientRect) {
                box = el.getBoundingClientRect();
                left = box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
                top = box.top + Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
                left -= doc.documentElement.clientLeft;
                top -= doc.documentElement.clientTop;
            }
            return { left: left, top: top };
        },
        /**
        *得到el元素style的name值
        */
        getCurrentStyleByName: function (el, name) {
            var val = null;
            if (!(el = HJ.dom.get(el))) {
                return null
            }
            if (val = el.style[name]) {
                return val
            } else {
                //ie 获取方法
                if (el.currentStyle) {
                    val = el.currentStyle[name];
                } else {
                    var doc = el.ownerDocument;
                    if (doc.defaultView && doc.defaultView.getComputedStyle) {
                        var s = doc.defaultView.getComputedStyle(el, '');
                        if (s) {
                            val = s[name];
                        }
                    }
                }
                return val;
            }
        },
        getCurrentStyle: function (element) {
            return element.currentStyle || document.defaultView.getComputedStyle(element, null);
        },
        /*
        *返回最近的带有tagname的祖先
        */
        getAncestorByTagName: function (el, tagName) {
            el = HJ.dom.get(el);
            if (el.nodeType == 1) {
                while (el && el.tagName) {
                    if (el.tagName.toUpperCase() == tagName.toUpperCase()) {
                        return el;
                    }
                    el = el.parentNode;
                }
                return el;
            }
        },
        /*
        *返回最近的带有class的祖先
        */
        getAncestorByClassName: function (el, className) {
            el = HJ.dom.get(el);
            if (el.nodeType == 1) {
                while (el && el.parentNode) {
                    if (HJ.common.trim(el.className) == HJ.common.trim(className)) {
                        return el;
                    }
                    el = el.parentNode;
                }
                return el;
            }
        },
        /**
        *获取一个元素节点的下一个兄弟节点
        */
        getNextSibling: function (el) {
            el = el.nextSibling;
            while (el) {
                if (el.nodeType == 1) {
                    return el;
                }
                el = el.nextSibling;
            }
            return el;
        },
        /**
        *获取一个元素节点的前一个兄弟节点
        */
        getPreviousSibling: function (el) {
            el = el.previousSibling;
            while (el) {
                if (el.nodeType == 1) {
                    return el;
                }
                el = el.nextSibling;
            }
            return el;
        },
        /**
        *验证一个dom节点是否被包含在另外一个dom节点中
        */
        contains: function (container, contained) {
            var ret = false;
            if ((container = HJ.dom.get(container)) && (contained = HJ.dom.get(contained))) {
                //ie,chrome,opera的dom节点具有这个方法
                if (container.contains) {
                    return container.contains(contained);
                }
                    //ff,chrome,opera的dom节点具有这个方法，就是ff特殊一点没有上面的那个方法
                else if (container.compareDocumentPosition) {
                    return !!(container.compareDocumentPosition(contained) & 16);
                }
            }
            return ret;
        },
        /**
        * get document rect
        */
        getDocRect: function () {
            var p = function (val) {
                return parseInt(val) || 0;
            }
            //对于ff,通过window.pageXOffset获取页面,ie,opera是通过document.documentElement.scrollLeft
            var xo = window.pageXOffset || p(document.documentElement.scrollLeft) || 0;
            var yo = window.pageYOffset || document.documentElement.scrollTop || 0;
            var cw = Math.max(document.documentElement.clientWidth, 0);
            var ch = Math.max(document.documentElement.clientHeight, 0);
            //对于ff来说 是document.documentElement.scrollHeight 对于ie,document.documentElement.offsetHeight。
            var oh = Math.max(p(document.documentElement.scrollHeight), p(document.documentElement.offsetHeight));
            var ow = Math.max(p(document.documentElement.scrollWidth), p(document.documentElement.offsetWidth));
            //Compatible模式
            if (!((document.compatMode || document.compatMode == 'CSS1Compat') && !/opera/i.test(window.navigator.userAgent) && document.documentElement && document.documentElement.clientHeight)) {
                if (document.body) {
                    cw = document.body.clientWidth;
                    ch = document.body.clientHeight;
                }
                else {
                    if (window.innerWidth) {
                        //ie不支持，对于firefox,opera都是支持的，这几个浏览器也支持document.documentElement.clientWidth
                        cw = window.innerWidth;
                        ch = window.innerHeight;
                    }
                }
            }
            return {
                "scrollX": xo,
                "scrollY": yo,
                "width": cw,
                "height": ch,
                "scrollHeight": oh,
                "scrollWidth": ow
            };
        },
        /**
        *获取 scroll坐标
        */
        getScrollOffset: function () {
            var left = 0, top = 0;
            top = document.documentElement.scrollTop || document.body.scrollTop;
            left = document.documentElement.scrollLeft || document.body.scrollLeft;
            return { left: left, top: top };
        },
        /**
        *在dom树构建完成时执行fn函数
        */
        ready: function (fn) {
            if (Object.prototype.toString.call(fn) == '[object Function]') {
                var flag = false;
                var doc = document,
                //仅仅针对ie
                doScroll = doc.documentElement.doScroll,
                //w3c mode 是DOMContentLoaded，ie的dom不具有这个方法
                eventType = doScroll ? 'onreadystatechange' : 'DOMContentLoaded';
                var fire = function () {
                    if (!flag) {
                        fn.call(window);
                    }
                }
                //所有的A级浏览器的document都有这个属性，表示文档的加载状态
                if (doc.readyState == 'complete') {
                    fire();
                    flag = true;
                }
                //w3c mode
                if (doc.addEventListener) {
                    function domReady() {
                        doc.removeEventListener(eventType, domReady, false);
                        fire();
                        flag = true;
                    }

                    doc.addEventListener(eventType, domReady, false);

                    //确保一定会执行
                    win.addEventListener('load', fire, false);
                } else { //仅仅针对ie
                    function stateChange() {
                        if (doc.readyState === 'complete') {
                            doc.detachEvent(eventType, stateChange);
                            fire();
                            flag = true;
                        }
                    }

                    doc.attachEvent(eventType, stateChange);

                    win.attachEvent('onload', fire);

                    function readyScroll() {
                        try {
                            doScroll('left');
                            fire();
                        } catch (ex) {
                            setTimeout(readyScroll, 1);
                        }
                    }
                    readyScroll();
                }
            }
        },
        //设置透明
        SetOpacity: function (obj, n) {
            try {
                if (HJ.ua.isIE) {
                    //obj.filters.alpha.opacity = n;
                    obj.style.filter = 'alpha(opacity=' + n + ');';
                }
                else {
                    obj.style.opacity = n / 100;
                }
            }
            catch (e) { }

        }
    }

    /**
    *一些基本的event操作
    */
    HJ.namespace('HJ.event');
    var simpleAdd = document.addEventListener ?
        function (el, type, fn, capture) {
            if (el.addEventListener) {
                //boolean capture is better
                el.addEventListener(type, fn, !!capture);
            }
        } :
        function (el, type, fn) {
            if (el.attachEvent) {
                el.attachEvent('on' + type, fn);
            }
        },
    simpleRemove = document.removeEventListener ?
        function (el, type, fn, capture) {
            if (el.removeEventListener) {
                el.removeEventListener(type, fn, !!capture);
            }
        } :
        function (el, type, fn) {
            if (el.detachEvent) {
                el.detachEvent('on' + type, fn);
            }
        };
    HJ.event = {
        /**
        * 阻止事件的冒泡和默认的行为
        */
        stopEvent: function (ev) {
            this.stopPropagation(ev);
            this.preventDefault(ev);
        },

        /**
        * 阻止事件的冒泡
        */
        stopPropagation: function (ev) {
            if (ev.stopPropagation) {
                ev.stopPropagation();
            } else {
                ev.cancelBubble = true;
            }
        },

        /**
        * 阻止事件的默认行为
        */
        preventDefault: function (ev) {
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
        },
        /**
        *获取事件对象
        */
        getEvent: function (e) {
            var ev = e || window.event;

            if (!ev) {
                var c = this.getEvent.caller;
                while (c) {
                    ev = c.arguments[0];
                    if (ev && Event == ev.constructor) {
                        break;
                    }
                    c = c.caller;
                }
            }
            return ev;
        },
        /**
        *获取事件触发源
        */
        getTarget: function (ev) {
            var t = ev.target || ev.srcElement;
            return t;
        },
        /**
        *获取事件触发源
        */
        getTargetSrc: function () {
            return this.getTarget(this.getEvent());
        },
        /**
        * 返回事件的charcode
        */
        getCharCode: function (ev) {
            var code = ev.keyCode || ev.charCode || 0;
            return code;
        },
        /**
        *获取事件的鼠标偏移
        */
        getEventOffset: function (ev) {
            return [
            ev.pageX || (ev.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
            ev.pageY || (ev.clientY + (document.documentElement.scrollTop || document.body.scrollTop))
            ];
        },
        /**
        *获取鼠标位置
        */
        getMousePos: function (ev) {
            if (!ev) {
                ev = this.getEvent();
            }
            if (ev.pageX || ev.pageY) {
                return {
                    x: ev.pageX,
                    y: ev.pageY
                };
            }

            if (document.documentElement && document.documentElement.scrollTop) {
                return {
                    x: ev.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
                    y: ev.clientY + document.documentElement.scrollTop - document.documentElement.clientTop
                };
            }
            else if (document.body) {
                return {
                    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                    y: ev.clientY + document.body.scrollTop - document.body.clientTop
                };
            }
        },
        getViewportSize: { w: (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth, h: (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight },
        getSelection: function (ev) {
            var obj;
            var strlen;
            ev = (ev) ? ev : ((window.event) ? window.event : "");
            if (ev) {
                obj = (ev.target) ? ev.target : ev.srcElement;
                strlen = window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
            }
            var str = "";
            if (obj.tagName != "INPUT") {
                if (strlen.length > 0) {
                    str = strlen;
                }
            }
            HJ.common.debug("getSelection-src:" + obj.tagName);
            return HJ.common.trim(str);
        },
        /**
        *增加事件的监听函数
        */
        addListener: function (el, sType, fn, obj, overrideContext, bCapture) {
            if (!Object.prototype.toString.call(fn) == '[object Function]') {
                return false;
            }
            el = HJ.dom.get(el);
            var context = el;
            if (overrideContext) {
                if (overrideContext === true) {
                    context = obj;
                } else {
                    context = overrideContext;
                }
            }
            var wrappedFn = function (e) {
                return fn.call(context, HJ.event.getEvent(e),
                    obj);
            };
            simpleAdd(el, sType, wrappedFn, bCapture);
        },
        /**
        *移除事件监听函数
        */
        removeListener: function (el, sType, fn, bCapture) {
            simpleRemove(el, sType, fn, bCapture);
        },
        click: function (el, fn) {
            el = HJ.dom.get(el);
            this.addListener(el, 'click', function () {
                fn.call(window);
            });
        },
        mousedown: function (el, fn) {
            el = HJ.dom.get(el);
            this.addListener(el, 'mousedown', function () {
                fn.call(window);
            });
        },
        mousemove: function (el, fn) {
            el = HJ.dom.get(el);
            this.addListener(el, 'mousemove', function () {
                fn.call(window);
            });
        },
        mouseup: function (el, fn) {
            el = HJ.dom.get(el);
            this.addListener(el, 'mouseup', function () {
                fn.call(window);
            });
        },
        Bind: function (object, fun) {
            return function () {
                return fun.apply(object, arguments);
            }
        },

        BindAsEventListener: function (object, fun) {
            var args = Array.prototype.slice.call(arguments).slice(2);
            return function (event) {
                return fun.apply(object, [event || window.event].concat(args));
            }
        },
        Extend: function (destination, source) {
            for (var property in source) {
                destination[property] = source[property];
            }
        },
        addEventHandler: function (oTarget, sEventType, fnHandler) {
            if (oTarget.addEventListener) {
                oTarget.addEventListener(sEventType, fnHandler, false);
            } else if (oTarget.attachEvent) {
                oTarget.attachEvent("on" + sEventType, fnHandler);
            } else {
                oTarget["on" + sEventType] = fnHandler;
            }
        },

        removeEventHandler: function (oTarget, sEventType, fnHandler) {
            if (oTarget.removeEventListener) {
                oTarget.removeEventListener(sEventType, fnHandler, false);
            } else if (oTarget.detachEvent) {
                oTarget.detachEvent("on" + sEventType, fnHandler);
            } else {
                oTarget["on" + sEventType] = null;
            }
        }
    }
    HJ.event.on = HJ.event.addListener;
    HJ.event.detach = HJ.event.removeListener;

    /**
    *HJ.ajax
    */
    HJ.namespace('ajax');
    HJ.ajax.connection = function (config) {
        //默认配置
        var defaultConfig = {
            url: location.href,
            type: 'GET',
            contentType: "application/x-www-form-urlencoded",
            async: true,
            //data可以是对象，也可以是字符串
            data: null,
            xhr: window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject) ?
		    function () {
		        return new window.XMLHttpRequest();
		    } :
		    function () {
		        try {
		            return new window.ActiveXObject("Microsoft.XMLHTTP");
		        } catch (e) { }
		    },
            complete: new Function,
            args: null
        };
        var con = defaultConfig;
        HJ.common.mix(con, config);
        // 假如传入的data不是一个字符串的话，是一个object对象，则需要转换为一个字符串
        if (con.data && typeof con.data !== "string") {
            var _str = '';
            for (var i in con.data) {
                _str += '&' + i + '=' + con.data[i];
            }
            con.data = _str.replace(/^&/i, '');
        }
        //如果是用get请求，则将data追加到url后面去，作为querystring
        if (con.data && con.type === "GET") {
            con.url += (/\?/.test(con.url) ? "&" : "?") + con.data;
        }
        var xhr = con.xhr();
        //打开一个connection
        xhr.open(con.type, con.url, con.async);

        if (con.data || con && con.contentType) {
            xhr.setRequestHeader("Content-Type", con.contentType);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                con.complete.call(new Date().getTime(), xhr, con.args);
            }
        }

        xhr.send(con.type === "POST" ? con.data : null);

        return xhr;
    }
    HJ.ajax.json = function (config) {
        //默认配置
        var defaultConfig = {
            url: location.href,
            timeout: 8000,
            complete: new Function,
            error: new Function,
            charset: "UTF-8"
        };
        var con = defaultConfig;
        HJ.common.mix(con, config);

        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = defaultConfig.url;
        script.charset = defaultConfig.charset;
        var done = false;
        var haserror = false;
        window.setTimeout(function () { if (!haserror) con.error.call(); }, con.timeout);
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function () {
            if (!done && (!this.readyState ||
							this.readyState == "loaded" || this.readyState == "complete")) {
                haserror = true;
                done = true;
                con.complete.call();
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                if (head)
                    head.removeChild(script);
            }
        };

        head.appendChild(script);
    }



    HJ.namespace('HJ.Drag');
    HJ.Drag = {
        //拖放对象
        init: function (drag, options) {
            this.Drag = HJ.dom.get(drag); //拖放对象
            if (this.Drag == null) { return; }
            this._x = this._y = 0; //记录鼠标相对拖放对象的位置
            this._marginLeft = this._marginTop = 0; //记录margin
            //事件对象(用于绑定移除事件)
            this._fM = HJ.event.BindAsEventListener(this, this.Move);
            this._fS = HJ.event.Bind(this, this.Stop);



            this.SetOptions(options);

            this.Limit = !!this.options.Limit;
            this.mxLeft = parseInt(this.options.mxLeft);
            this.mxRight = parseInt(this.options.mxRight);
            this.mxTop = parseInt(this.options.mxTop);
            this.mxBottom = parseInt(this.options.mxBottom);

            this.LockX = !!this.options.LockX;
            this.LockY = !!this.options.LockY;
            this.Lock = !!this.options.Lock;

            this.onStart = this.options.onStart;
            this.onMove = this.options.onMove;
            this.onStop = this.options.onStop;

            this._Handle = HJ.dom.get(this.options.Handle) || this.Drag;
            this._mxContainer = HJ.dom.get(this.options.mxContainer) || null;

            this.Drag.style.position = "absolute";
            //透明
            if (HJ.ua.isIE && !!this.options.Transparent) {
                //填充拖放对象
                with (this._Handle.appendChild(document.createElement("div")).style) {
                    width = height = "100%"; backgroundColor = "#fff"; filter = "alpha(opacity:0)"; fontSize = 0;
                }
            }
            //修正范围
            this.Repair();
            HJ.event.addEventHandler(this._Handle, "mousedown", HJ.event.BindAsEventListener(this, this.Start));
        },
        //设置默认属性
        SetOptions: function (options) {
            this.options = {//默认值
                Handle: "", //设置触发对象（不设置则使用拖放对象）
                Limit: false, //是否设置范围限制(为true时下面参数有用,可以是负数)
                mxLeft: 0, //左边限制
                mxRight: 9999, //右边限制
                mxTop: 0, //上边限制
                mxBottom: 999999, //下边限制
                mxContainer: "", //指定限制在容器内
                LockX: false, //是否锁定水平方向拖放
                LockY: false, //是否锁定垂直方向拖放
                Lock: false, //是否锁定
                Transparent: false, //是否透明
                Contenter: "",
                onStart: function () { }, //开始移动时执行
                onMove: function () { }, //移动时执行
                onStop: function () { } //结束移动时执行
            };
            HJ.event.Extend(this.options, options || {});
        },
        //准备拖动
        Start: function (oEvent) {
            HJ.common.debug("Drag-start:" + HJ.event.getTargetSrc().id);
            var src = HJ.event.getTargetSrc();
            if (src.id !== "hjd_top_title" && src != this._Handle)
            { return; }
            if (this.Lock) { return; }
            this.Repair();
            //记录鼠标相对拖放对象的位置
            this._x = oEvent.clientX - this.Drag.offsetLeft;
            this._y = oEvent.clientY - this.Drag.offsetTop;
            //记录margin
            this._marginLeft = parseInt(HJ.dom.getCurrentStyle(this.Drag).marginLeft) || 0;
            this._marginTop = parseInt(HJ.dom.getCurrentStyle(this.Drag).marginTop) || 0;
            //mousemove时移动 mouseup时停止
            HJ.event.addEventHandler(document, "mousemove", this._fM);
            HJ.event.addEventHandler(document, "mouseup", this._fS);
            if (HJ.ua.isIE) {
                //焦点丢失
                HJ.event.addEventHandler(this._Handle, "losecapture", this._fS);
                //设置鼠标捕获
                this._Handle.setCapture();
            } else {
                //焦点丢失
                HJ.event.addEventHandler(window, "blur", this._fS);
                //阻止默认动作
                oEvent.preventDefault();
            };

            //附加程序
            this.onStart();
        },
        //修正范围
        Repair: function () {
            if (this.Limit) {
                //修正错误范围参数
                this.mxRight = Math.max(this.mxRight, this.mxLeft + this.Drag.offsetWidth);
                this.mxBottom = Math.max(this.mxBottom, this.mxTop + this.Drag.offsetHeight);
                //如果有容器必须设置position为relative或absolute来相对或绝对定位，并在获取offset之前设置
                !this._mxContainer || HJ.dom.getCurrentStyle(this._mxContainer).position == "relative" || HJ.dom.getCurrentStyle(this._mxContainer).position == "absolute" || (this._mxContainer.style.position == "relative");
            }
        },
        //拖动
        Move: function (oEvent) {
            //判断是否锁定
            if (this.Lock) { this.Stop(); return; };

            //设置透明
            HJ.dom.SetOpacity(this.Drag, 80);

            //清除选择
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            //设置移动参数
            var iLeft = oEvent.clientX - this._x, iTop = oEvent.clientY - this._y;
            //设置范围限制
            if (this.Limit) {
                //设置范围参数
                var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
                //如果设置了容器，再修正范围参数
                if (!!this._mxContainer) {
                    mxLeft = Math.max(mxLeft, 0);
                    mxTop = Math.max(mxTop, 0);
                    mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
                    mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
                };
                //修正移动参数
                iLeft = Math.max(Math.min(iLeft, mxRight - this.Drag.offsetWidth), mxLeft);
                iTop = Math.max(Math.min(iTop, mxBottom - this.Drag.offsetHeight), mxTop);
            }
            //设置位置，并修正margin
            if (!this.LockX) { this.Drag.style.left = iLeft - this._marginLeft + "px"; }
            if (!this.LockY) { this.Drag.style.top = iTop - this._marginTop + "px"; }
            //附加程序
            this.onMove();
        },
        //拖动
        MoveTo: function (oEvent) {
            //判断是否锁定
            if (this.Lock) { this.Stop(); return; };
            //清除选择
            //window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            //设置移动参数
            var tmpdisplay = this.Drag.style.display;
            this.Drag.style.display = "block";
            var iLeft = oEvent.clientX + 10, iTop = oEvent.clientY + 10;
            HJ.common.debug("oEvent.clientY + this.Drag.clientHeight:" + oEvent.clientY + "+" + this.Drag.clientHeight + " = " + (oEvent.clientY + this.Drag.clientHeight));
            HJ.common.debug("document.body.scrollTop + document.documentElement.clientHeight+ this.Drag.clientHeight:" + document.body.scrollTop + "+" + document.documentElement.clientHeight + " +" + this.Drag.clientHeight + " = " + (document.body.scrollTop + document.documentElement.clientHeight + this.Drag.clientHeight));

            var scroll = HJ.dom.getScrollOffset(), rect = HJ.dom.getDocRect();

            if (iTop > scroll.top + document.documentElement.clientHeight - this.Drag.clientHeight) {
                iTop = iTop - this.Drag.clientHeight - 30;
                iLeft += 10;
            }
            HJ.common.debug("oEvent.clientX + this.Drag.clientWidth:" + oEvent.clientX + "+" + this.Drag.clientWidth + " = " + (oEvent.clientX + this.Drag.clientWidth));
            if (iLeft > scroll.left + document.documentElement.clientWidth - this.Drag.clientWidth) {
                iLeft = iLeft - this.Drag.clientWidth - 30;
                HJ.common.debug("iLeft:" + iLeft);

                //iLeft += 10;
            }
            this.Drag.style.display = tmpdisplay;
            //iLeft = document.body.scrollTop + document.documentElement.clientHeight;
            //设置范围限制
            if (this.Limit) {
                //设置范围参数
                var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
                //如果设置了容器，再修正范围参数
                if (!!this._mxContainer) {
                    mxLeft = Math.max(mxLeft, 0);
                    mxTop = Math.max(mxTop, 0);
                    mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
                    //mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
                    mxBottom = Math.min(mxBottom, rect.scrollY + rect.height);
                };
                //修正移动参数
                iLeft = Math.max(Math.min(iLeft, mxRight - this.Drag.offsetWidth), mxLeft);
                iTop = Math.max(Math.min(iTop, mxBottom - this.Drag.offsetHeight), mxTop);
            }
            //设置位置，并修正margin
            if (!this.LockX) { this.Drag.style.left = iLeft - this._marginLeft + "px"; }
            if (!this.LockY) { this.Drag.style.top = iTop - this._marginTop + "px"; }
            //附加程序
            this.onMove();
        },
        //停止拖动
        Stop: function () {
            //移除事件
            HJ.event.detach(document, "mousemove", this._fM);
            HJ.event.detach(document, "mouseup", this._fS);
            if (HJ.ua.isIE) {
                HJ.event.detach(this._Handle, "losecapture", this._fS);
                this._Handle.releaseCapture();
            } else {
                HJ.event.removeEventHandler(window, "blur", this._fS);
            };
            //透明恢复
            HJ.dom.SetOpacity(this.Drag, 100);
            //附加程序
            this.onStop();
        }
    };


    HJ.namespace('HJ.Resize');
    HJ.Resize = {
        init: function (obj, options) {

            this._obj = HJ.dom.get(obj);
            if (this._obj == null) { return; }
            this._styleWidth = this._styleHeight = this._styleLeft = this._styleTop = 0; //样式参数
            this._sideRight = this._sideDown = this._sideLeft = this._sideUp = 0; //坐标参数
            this._fixLeft = this._fixTop = 0; //定位参数
            this._scaleLeft = this._scaleTop = 0; //定位坐标

            this._mxSet = function () { }; //范围设置程序
            this._mxRightWidth = this._mxDownHeight = this._mxUpHeight = this._mxLeftWidth = 0; //范围参数
            this._mxScaleWidth = this._mxScaleHeight = 0; //比例范围参数

            this._fun = function () { }; //缩放执行程序

            //获取边框宽度
            var _style = HJ.dom.getCurrentStyle(this._obj);
            this._borderX = (parseInt(_style.borderLeftWidth) || 0) + (parseInt(_style.borderRightWidth) || 0);
            this._borderY = (parseInt(_style.borderTopWidth) || 0) + (parseInt(_style.borderBottomWidth) || 0);
            //事件对象(用于绑定移除事件)
            this._fR = HJ.event.BindAsEventListener(this, this.Resize);
            this._fS = HJ.event.Bind(this, this.Stop);

            this.SetOptions(options);
            //范围限制
            this.Max = !!this.options.Max;
            this._mxContainer = HJ.dom.get(this.options.mxContainer) || null;
            this.mxLeft = Math.round(this.options.mxLeft);
            this.mxRight = Math.round(this.options.mxRight);
            this.mxTop = Math.round(this.options.mxTop);
            this.mxBottom = Math.round(this.options.mxBottom);
            //内部容器，用于后面调整该容器高度
            this._Contenter = HJ.dom.get(this.options.Contenter);
            //宽高限制
            this.Min = !!this.options.Min;
            this.minWidth = Math.round(this.options.minWidth);
            this.minHeight = Math.round(this.options.minHeight);
            this.maxWidth = Math.round(this.options.maxWidth);
            this.maxHeight = Math.round(this.options.maxHeight);
            //按比例缩放
            this.Scale = !!this.options.Scale;
            this.Ratio = Math.max(this.options.Ratio, 0);

            this.onResize = this.options.onResize;
            this.onStop = this.options.onStop;

            this._obj.style.position = "absolute";
            !this._mxContainer || HJ.dom.getCurrentStyle(this._mxContainer).position == "relative" || (this._mxContainer.style.position == "relative");

            /*this._fR = HJ.event.BindAsEventListener(this, this.Resize);
            this._fS = HJ.event.Bind(this, this.Stop);

            this._obj.style.position = "absolute";*/
        },
        //设置默认属性
        SetOptions: function (newoptions) {
            this.options = {//默认值
                Max: false, //是否设置范围限制(为true时下面mx参数有用)
                mxContainer: "", //指定限制在容器内
                mxLeft: 0, //左边限制
                mxRight: 9999, //右边限制
                mxTop: 0, //上边限制
                mxBottom: 999999, //下边限制
                Min: true, //是否最小宽高限制(为true时下面min参数有用)
                minWidth: 352, //最小宽度
                minHeight: 242, //最小高度
                maxWidth: 425, //最大宽度
                maxHeight: 600, //最大高度
                Scale: false, //是否按比例缩放
                Ratio: 0, //缩放比例(宽/高)
                onResize: function () { }, //缩放时执行
                onStop: function () { } //停止缩放时执行
            };
            HJ.event.Extend(this.options, newoptions || {});
        },
        //设置触发对象
        Set: function (resize, side) {
            var resize = HJ.dom.get(resize), fun;
            if (!resize) return;
            switch (side.toLowerCase()) {
                case "up":
                    fun = this.Up;
                    break;
                case "down":
                    fun = this.Down;
                    break;
                case "left":
                    fun = this.Left;
                    break;
                case "right":
                    fun = this.Right;
                    break;
                case "left-up":
                    fun = this.LeftUp;
                    break;
                case "right-up":
                    fun = this.RightUp;
                    break;
                case "left-down":
                    fun = this.LeftDown;
                    break;
                case "right-down":
                default:
                    fun = this.RightDown;
            };
            HJ.event.addEventHandler(resize, "mousedown", HJ.event.BindAsEventListener(this, this.Start, fun));
        },
        //准备缩放
        Start: function (e, fun) {
            //防止冒泡(跟拖放配合时设置)
            e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
            //设置执行程序
            this._fun = fun;

            this._styleWidth = this._obj.clientWidth;
            this._styleHeight = this._obj.clientHeight;
            this._styleLeft = this._obj.offsetLeft;
            this._styleTop = this._obj.offsetTop;

            this._sideLeft = e.clientX - this._styleWidth;
            this._sideRight = e.clientX + this._styleWidth;
            this._sideUp = e.clientY - this._styleHeight;
            this._sideDown = e.clientY + this._styleHeight;

            this._fixLeft = this._styleWidth + this._styleLeft;
            this._fixTop = this._styleHeight + this._styleTop;
            //范围限制
            if (this.Max) {
                //设置范围参数
                var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
                //如果设置了容器，再修正范围参数
                if (!!this._mxContainer) {
                    mxLeft = Math.max(mxLeft, 0);
                    mxTop = Math.max(mxTop, 0);
                    mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
                    mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
                };
                //根据最小值再修正
                mxRight = Math.max(mxRight, mxLeft + (this.Min ? this.minWidth : 0) + this._borderX);
                mxBottom = Math.max(mxBottom, mxTop + (this.Min ? this.minHeight : 0) + this._borderY);
                //由于转向时要重新设置所以写成function形式
                this._mxSet = function () {
                    this._mxRightWidth = mxRight - this._styleLeft - this._borderX;
                    this._mxDownHeight = mxBottom - this._styleTop - this._borderY;
                    this._mxUpHeight = Math.max(this._fixTop - mxTop, this.Min ? this.minHeight : 0);
                    this._mxLeftWidth = Math.max(this._fixLeft - mxLeft, this.Min ? this.minWidth : 0);
                };
                this._mxSet();
                //有缩放比例下的范围限制
                if (this.Scale) {
                    this._mxScaleWidth = Math.min(this._scaleLeft - mxLeft, mxRight - this._scaleLeft - this._borderX) * 2;
                    this._mxScaleHeight = Math.min(this._scaleTop - mxTop, mxBottom - this._scaleTop - this._borderY) * 2;
                };
            };
            HJ.event.addEventHandler(document, "mousemove", this._fR);
            HJ.event.addEventHandler(document, "mouseup", this._fS);
            if (HJ.ua.isIE) {
                HJ.event.addEventHandler(this._obj, "losecapture", this._fS);
                this._obj.setCapture();
            } else {
                HJ.event.addEventHandler(window, "blur", this._fS);
                e.preventDefault();
            };
        },
        //缩放
        Resize: function (e) {

            //清除选择
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

            this._fun(e);
            //var objWidth = this._styleWidth;
            if (this.Max && this.maxWidth < this._styleWidth) {
                this._styleWidth = this.maxWidth;
            }
            if (this.Max && this.maxHeight < this._styleHeight) {
                this._styleHeight = this.maxHeight;
            }
            with (this._obj.style) {
                width = this._styleWidth + "px"; height = this._styleHeight + "px";
                top = this._styleTop + "px"; left = this._styleLeft + "px";
            }
            HJ.common.debug("_styleWidth:" + this._styleWidth);
            //HJ.common.debug("Resize_1():" + this._Contenter.style.height);
            this._Contenter.style.height = this._styleHeight - 102 + "px";
            //HJ.common.debug("Resize_2():" + this._Contenter.style.height);
            //附加程序
            this.onResize(e);
        },
        //缩放程序
        //上
        Up: function (e) {
            this.RepairY(this._sideDown - e.clientY, this._mxUpHeight);
            this.RepairTop();
            this.TurnDown(this.Down);
        },
        //下
        Down: function (e) {
            this.RepairY(e.clientY - this._sideUp, this._mxDownHeight);
            this.TurnUp(this.Up);
        },
        //右
        Right: function (e) {
            this.RepairX(e.clientX - this._sideLeft, this._mxRightWidth);
            this.TurnLeft(this.Left);
        },
        //左
        Left: function (e) {
            this.RepairX(this._sideRight - e.clientX, this._mxLeftWidth);
            this.RepairLeft();
            this.TurnRight(this.Right);
        },
        //右下
        RightDown: function (e) {
            this.RepairAngle(
		e.clientX - this._sideLeft, this._mxRightWidth,
		e.clientY - this._sideUp, this._mxDownHeight
	    );
            this.TurnLeft(this.LeftDown) || this.Scale || this.TurnUp(this.RightUp);
        },
        //右上
        RightUp: function (e) {
            this.RepairAngle(
		e.clientX - this._sideLeft, this._mxRightWidth,
		this._sideDown - e.clientY, this._mxUpHeight
	    );
            this.RepairTop();
            this.TurnLeft(this.LeftUp) || this.Scale || this.TurnDown(this.RightDown);
        },
        //左下
        LeftDown: function (e) {
            this.RepairAngle(
		this._sideRight - e.clientX, this._mxLeftWidth,
		e.clientY - this._sideUp, this._mxDownHeight
	    );
            this.RepairLeft();
            this.TurnRight(this.RightDown) || this.Scale || this.TurnUp(this.LeftUp);
        },
        //左上
        LeftUp: function (e) {
            this.RepairAngle(
		this._sideRight - e.clientX, this._mxLeftWidth,
		this._sideDown - e.clientY, this._mxUpHeight
	    );
            this.RepairTop(); this.RepairLeft();
            this.TurnRight(this.RightUp) || this.Scale || this.TurnDown(this.LeftDown);
        },
        //修正程序
        //水平方向
        RepairX: function (iWidth, mxWidth) {
            iWidth = this.RepairWidth(iWidth, mxWidth);
            if (this.Scale) {
                var iHeight = this.RepairScaleHeight(iWidth);
                if (this.Max && iHeight > this._mxScaleHeight) {
                    iHeight = this._mxScaleHeight;
                    iWidth = this.RepairScaleWidth(iHeight);
                } else if (this.Min && iHeight < this.minHeight) {
                    var tWidth = this.RepairScaleWidth(this.minHeight);
                    if (tWidth < mxWidth) { iHeight = this.minHeight; iWidth = tWidth; }
                }
                this._styleHeight = iHeight;
                this._styleTop = this._scaleTop - iHeight / 2;
            }
            this._styleWidth = iWidth;
        },
        //垂直方向
        RepairY: function (iHeight, mxHeight) {
            iHeight = this.RepairHeight(iHeight, mxHeight);
            if (this.Scale) {
                var iWidth = this.RepairScaleWidth(iHeight);
                if (this.Max && iWidth > this._mxScaleWidth) {
                    iWidth = this._mxScaleWidth;
                    iHeight = this.RepairScaleHeight(iWidth);
                } else if (this.Min && iWidth < this.minWidth) {
                    var tHeight = this.RepairScaleHeight(this.minWidth);
                    if (tHeight < mxHeight) { iWidth = this.minWidth; iHeight = tHeight; }
                }
                this._styleWidth = iWidth;
                this._styleLeft = this._scaleLeft - iWidth / 2;
            }
            this._styleHeight = iHeight;
        },
        //对角方向
        RepairAngle: function (iWidth, mxWidth, iHeight, mxHeight) {
            iWidth = this.RepairWidth(iWidth, mxWidth);
            if (this.Scale) {
                iHeight = this.RepairScaleHeight(iWidth);
                if (this.Max && iHeight > mxHeight) {
                    iHeight = mxHeight;
                    iWidth = this.RepairScaleWidth(iHeight);
                } else if (this.Min && iHeight < this.minHeight) {
                    var tWidth = this.RepairScaleWidth(this.minHeight);
                    if (tWidth < mxWidth) { iHeight = this.minHeight; iWidth = tWidth; }
                }
            } else {
                iHeight = this.RepairHeight(iHeight, mxHeight);
            }
            this._styleWidth = iWidth;
            this._styleHeight = iHeight;
        },
        //top
        RepairTop: function () {
            this._styleTop = this._fixTop - this._styleHeight;
        },
        //left
        RepairLeft: function () {
            this._styleLeft = this._fixLeft - this._styleWidth;
        },
        //height
        RepairHeight: function (iHeight, mxHeight) {
            iHeight = Math.min(this.Max ? mxHeight : iHeight, iHeight);
            iHeight = Math.max(this.Min ? this.minHeight : iHeight, iHeight, 0);
            return iHeight;
        },
        //width
        RepairWidth: function (iWidth, mxWidth) {
            iWidth = Math.min(this.Max ? mxWidth : iWidth, iWidth);
            iWidth = Math.max(this.Min ? this.minWidth : iWidth, iWidth, 0);
            return iWidth;
        },
        //比例高度
        RepairScaleHeight: function (iWidth) {
            return Math.max(Math.round((iWidth + this._borderX) / this.Ratio - this._borderY), 0);
        },
        //比例宽度
        RepairScaleWidth: function (iHeight) {
            return Math.max(Math.round((iHeight + this._borderY) * this.Ratio - this._borderX), 0);
        },
        //转向程序
        //转右
        TurnRight: function (fun) {
            if (!(this.Min || this._styleWidth)) {
                this._fun = fun;
                this._sideLeft = this._sideRight;
                this.Max && this._mxSet();
                return true;
            }
        },
        //转左
        TurnLeft: function (fun) {
            if (!(this.Min || this._styleWidth)) {
                this._fun = fun;
                this._sideRight = this._sideLeft;
                this._fixLeft = this._styleLeft;
                this.Max && this._mxSet();
                return true;
            }
        },
        //转上
        TurnUp: function (fun) {
            if (!(this.Min || this._styleHeight)) {
                this._fun = fun;
                this._sideDown = this._sideUp;
                this._fixTop = this._styleTop;
                this.Max && this._mxSet();
                return true;
            }
        },
        //转下
        TurnDown: function (fun) {
            if (!(this.Min || this._styleHeight)) {
                this._fun = fun;
                this._sideUp = this._sideDown;
                this.Max && this._mxSet();
                return true;
            }
        },
        //停止缩放
        Stop: function () {
            HJ.event.removeEventHandler(document, "mousemove", this._fR);
            HJ.event.removeEventHandler(document, "mouseup", this._fS);
            if (HJ.ua.isIE) {
                HJ.event.removeEventHandler(this._obj, "losecapture", this._fS);
                this._obj.releaseCapture();
            } else {
                HJ.event.removeEventHandler(window, "blur", this._fS);
            }
            //附加程序
            this.onStop();
        }
    };

    HJ.namespace('HJ.Counter');
    HJ.Counter = {
        //webclick计数器
        LoadWebClick: function (word) {
            /*if (document.URL.indexOf("//dev.") > -1 || document.URL.indexOf("localhost.") > -1) {
                return;
            }*/

            var yes_cookieinfo = HJ.fun.getCookie("ClubAuth");
            var yesdata = "&key=" + yes_cookieinfo + "&refe=" + escape(word) + "&random=" + Math.random();
            var counter = G.mode == "simple" ? "dict_huaci_simple" : "dict_huaci";

            //window.setTimeout(
		    //    function () {
		    //        var img = new Image();
		    //        img.onload = function () { img.onload = null; };
		    //        img.src = "http://webclick.yeshj.com/clickgather.ashx?counter=" + counter + yesdata;
		    //    }, 10);
        },
        LoadGA: function () {
            if (!_gaq._getAsyncTracker) {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            }

            _gaq.push(
	            ['dt._setAccount', 'UA-28009525-1'],
                ['dt._trackEvent', (G.mode == "simple" ? "simple" : "") + 'webword::' + location.host + location.pathname + location.search, HJ.fun.getLanguage(), G.OldSearchWord.replace(" ", "+")],
                ['dt._trackEvent', 'input', '划词框内搜索', G.isInputSearch ? 'yes' : 'no']
            );
        },
        /*LoadBaiduTongJi: function () {
            if(this.baiduLoaded) return;
            var baidu = document.createElement('script');
            baidu.type = 'text/javascript';
            baidu.async = true;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(baidu, s);     
            baidu.src = "http://common.hjfile.cn/analytics/baidu/baidu_tongji.js?id=0e95f1361bea6bbacc4669dfb29bf92f";        
            this.baiduLoaded = true;
        },*/
        SetLangs: function () {
            try {
                _gaq.push(['dt._trackEvent', 'langs_set', '语种切换', HJ.fun.getLanguage()]);
            } catch (e) { }
        },
        SetTips: function () {
            try {
                _gaq.push(['dt._trackEvent', 'tips_set', '即划即查设置', HJ.global.hjd_hidetip ? 'on' : 'off']);
            } catch (e) { }
        },
        SetVoice: function () {
            try {
                _gaq.push(['dt._trackEvent', 'voice_set', '悬停发音设置', HJ.global.hjd_soundtype ? 'on' : 'off']);
            } catch (e) { }
        },
        ChangeMode: function () {
            try {
                _gaq.push(['dt._trackEvent', 'mode_set', '查词模式切换', HJ.global.mode]);
            } catch (e) { }
        },
        PlaySound: function (word) {
            try {
                _gaq.push(['dt._trackEvent', 'play_sound', '播放单词声音', word]);
            } catch (e) { }
        },
        SetSwitch: function () {
            try {
                _gaq.push(['dt._trackEvent', 'switch', '开启或关闭划词', HJ.global.IsEnable ? 'on' : 'off']);
            } catch (e) { }
        },
        AddScb: function (word) {
            try {
                _gaq.push(['dt._trackEvent', 'scb', '加入生词本', word]);
            } catch (e) { }
        },
        AddScbSimple: function (word) {
            try {
                _gaq.push(['dt._trackEvent', 'scb_simple', '精简版加入生词本', word]);
            } catch (e) { }
        }
    }

    //
    HJ.namespace('HJ.fun');
    HJ.fun = {
        //ajax回调函数
        jsonCallBack: function (json) {
            //显示查询结果，隐藏载入
            window.clearTimeout(HJ.global.TimeoutID);
            if (json && json.content) {
                HJ.global.data = json;
                if (HJ.global.IsQuick) {
                    this.QuickSearchCallBack(json);
                    return;
                }
                if (G.mode == "simple") {
                    SimpleMode.showContent();
                    return;
                }
                var D = HJ.dom;
                D.get("hjd_txtresult").innerHTML = json.content;
                HJ.fun.hide("hjd_imgloading");
                HJ.fun.show("hjd_txtresult");
                
                if (D.get("hjd_uk_pronounce_sound")) {

                    var hjd_uk_pronounce_sound = D.get("hjd_uk_pronounce_sound");

                    GetTTSFlash(hjd_uk_pronounce_sound, "mp3_flash", HJ.global.Domain + "/flash/speaker_mini_tts.swf", "son=" + hjd_uk_pronounce_sound.innerHTML + "", 31, 16, false);
                }
                if (D.get("hjd_pronounce_sound")) {
                    var hjd_pronounce_sound = D.get("hjd_pronounce_sound");

                    GetTTSFlash(hjd_pronounce_sound, "mp3_flash", HJ.global.Domain + "/flash/speaker_mini_tts.swf", "son=" + hjd_pronounce_sound.innerHTML + "", 31, 16, false);
                }
                else if (D.get("hjd_es_pronounce_sound")) {
                    var hjd_es_pronounce_sound = D.get("hjd_es_pronounce_sound");

                    GetTTSFlash(hjd_es_pronounce_sound, "mp3_flash", HJ.global.Domain + "/flash/speaker_mini_tts.swf", "son=" + hjd_es_pronounce_sound.innerHTML + "", 31, 16, false);
                }
                else if (D.get("hjd_fr_pronounce_sound")) {
                    var hjd_fr_pronounce_sound = D.get("hjd_fr_pronounce_sound");

                    GetTTSFlash(hjd_fr_pronounce_sound, "mp3_flash", HJ.global.Domain + "/flash/speaker_mini_tts.swf", "son=" + hjd_fr_pronounce_sound.innerHTML + "", 31, 16, false);
                }
                else if (D.get("hjd_kr_pronounce_sound")) {
                    var hjd_kr_pronounce_sound = D.get("hjd_kr_pronounce_sound");
                    GetTTSFlash(hjd_kr_pronounce_sound, "mp3_flash", HJ.global.Domain + "/flash/speaker_mini_tts.swf", "son=" + hjd_kr_pronounce_sound.innerHTML + "", 31, 16, false);
                }
                else {

                    var jp_sound = document.getElementsByName("hjd_jp_pronounce_sound");

                    if (jp_sound.length > 0) {
                        for (var i = jp_sound.length - 1; i >= 0; i--) {
                            //GetFlash(jp_sound[i], "Speaker_swf", HJ.global.Domain + "/flash/speaker_jp.swf?v=4", "w=" + jp_sound[i].innerHTML, 31, 16, false);
                            GetTTSFlash(jp_sound[i], "mp3_flash", HJ.global.Domain + "/flash/speaker_mini_tts.swf", "son=" + jp_sound[i].innerHTML + "", 31, 16, false);
                        }

                    }
                    //不存在发音时，调用TTS发音
                    jp_sound = document.getElementsByName("hjd_jp_tts_pronounce_sound");
                    if (jp_sound.length > 0) {
                        for (var i = jp_sound.length - 1; i >= 0; i--) {
                            GetTTSFlash(jp_sound[i], "mp3_flash", HJ.global.Domain + "/flash/speaker_mini_tts.swf", "son=http://tts.yeshj.com/c/jp/s/" + jp_sound[i].innerHTML + "&autoplay=false", 31, 16, false);
                        }
                    }

                }

                //是否没有找到结果
                if (D.get("hjd_noresult")) {

                    var ol = D.get("hjd_txtresult").getElementsByTagName("ol");
                    if (ol && ol.length > 0) //存在推荐相近单词
                    {
                        //debugger;
                        var arryLink = ol[0].getElementsByTagName("a");
                        //为推荐单词绑定查询事件
                        for (var i = arryLink.length - 1; i >= 0; i--) {
                            var a = arryLink[i];
                            a.href = "javascript:void(0); "
                            HJ.event.on(a, 'click', function () {
                                HJ.dom.get("hjd_txtsearch").value = HJ.event.getTarget(HJ.event.getEvent()).innerHTML;
                                HJ.fun.doSearch();
                                return false;
                            });
                        }
                    } //存在推荐相近单词 End

                }
                //选中查询框 暂时注释
                if (json.word) {
                    D.get("hjd_txtsearch").value = json.word;
                }
            }
        },
        QuickSearchCallBack: function (json) {
            var D = HJ.dom, F = HJ.fun;
            F.DictHide();
            F.ToolTipHide();
            F.QuickTipShow();


            D.get("hjd_txtresult").innerHTML = "";
            D.get("hjd_quicktoolbar").innerHTML = json.content;

            F.hide("hjd_pronounce_sound");
            F.hide("hjd_amw_panel");

            F.hide("hjd_imgloading");
            F.show("hjd_txtresult");


        },
        /*属性：判断浏览器是否需要利用flash来代替html5 audio标签*/
        isSupportAudio: function () {
            var b = document.createElement("audio");
            return (b.canPlayType && b.canPlayType("audio/mpeg;").replace(/no/, ""))
        }(),
        changeLanguage: function () {
            this.changeLanguageForSearch(arguments[0]);
            HJ.global.OldSearchLang = arguments[0];
            if (G.mode == "simple") SimpleMode.changeLanguage(arguments[0]);
        },
        //设置查询模式
        changeLanguageForSearch: function () {
            var D = HJ.dom;

            D.get("hjd_btnEnSearch").style.display = "none";
            D.get("hjd_btnJCSearch").style.display = "none";
            D.get("hjd_btnCJSearch").style.display = "none";
            D.get("hjd_btnFrSearch").style.display = "none";
            D.get("hjd_btnKrSearch").style.display = "none";
            D.get("hjd_btnDeSearch").style.display = "none";//德
            D.get("hjd_btnEsSearch").style.display = "none";//西
            D.get("hjd_cj_wrapper").style.display = "none";

            switch (arguments[0]) {
                case "en": D.get("hjd_btnEnSearch").style.display = "block";
                    D.get("hjd_chkLangEn").checked = true;
                    document.getElementById("dictlang").style.display = "none";
                    document.getElementById("shiftlang").innerHTML = "&#33521";//英
                    break;
                case "jc":
                case "cj":
                    D.get("hjd_btnJCSearch").style.display = "block";
                    D.get("hjd_btnCJSearch").style.display = "block";
                    D.get("hjd_cj_wrapper").style.display = "block";
                    D.get("hjd_chkLangJp").checked = true;
                    document.getElementById("dictlang").style.display = "none";
                    document.getElementById("shiftlang").innerHTML = "&#26085"; //日
                    break;

                case "fr": D.get("hjd_btnFrSearch").style.display = "block";
                    D.get("hjd_chkLangFr").checked = true;
                    document.getElementById("dictlang").style.display = "none";
                    document.getElementById("shiftlang").innerHTML = "&#27861";//法
                    break;

                case "kr": D.get("hjd_btnKrSearch").style.display = "block";
                    D.get("hjd_chkLangKr").checked = true;
                    document.getElementById("dictlang").style.display = "none";
                    document.getElementById("shiftlang").innerHTML = "&#38889";//韩
                    break;
                case "de": D.get("hjd_btnDeSearch").style.display = "block";
                    D.get("hjd_chkLangDe").checked = true;
                    document.getElementById("dictlang").style.display = "none";
                    document.getElementById("shiftlang").innerHTML = "&#24503";//德
                    break;
                case "es": D.get("hjd_btnEsSearch").style.display = "block";
                    D.get("hjd_chkLangEs").checked = true;
                    document.getElementById("dictlang").style.display = "none";
                    document.getElementById("shiftlang").innerHTML = "&#35199";//西

            }
            HJ.fun.setLanguage(arguments[0]);

            adjustInputSize();
        },
        //设置查询模式
        setLanguage: function () {
            var lang = arguments[0];
            HJ.global.lang = lang;
            HJ.fun.setCookie("hjd_ajax_Language2011", lang, 9999999, "/");
        },
        //获得查询模式
        getLanguage: function () {
            var language = HJ.fun.getCookie("hjd_ajax_Language2011");
            if (language)
            { return language; }
            else if(HJ.global.lang){
                return HJ.global.lang;
            }else {
                HJ.fun.setCookie("hjd_ajax_Language2011", "en", 9999999, "/");
                return "en";
            }
        },
        //获取Cookie
        getCookie: function (name) {
            var cookie_start = document.cookie.indexOf(name);
            var cookie_end = document.cookie.indexOf(";", cookie_start);
            return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
        },
        //设置Cookie
        setCookie: function (cookieName, cookieValue, seconds, path, domain, secure) {
            if (!domain) {
                domain = this.getHost();
            }
            var expires = new Date();
            expires.setTime(expires.getTime() + seconds * 1000);
            document.cookie = escape(cookieName) + '=' + escape(cookieValue)
		    + (expires ? '; expires=' + expires.toGMTString() : '')
		    + (path ? '; path=' + path : '/')
		    + (domain ? '; domain=' + domain : '')
		    + (secure ? '; secure' : '');
        },
        getHost: function (url) {
            var host = "null";
            if (typeof url == "undefined"
                        || null == url)
            { url = window.location.host; }
            var hosts = url.split(".");

            if (hosts.length > 1) {
                return hosts[hosts.length - 2] + "." + hosts[hosts.length - 1];
            }
            return hosts[hosts.length - 1];
        },
        ShiftVisible_jpcom: function (aObjName, a_linkObj, a_Bool) {
            var targetElement = HJ.dom.get(aObjName);
            if (typeof (a_Bool) == "undefined" || a_Bool == null) {
                if (targetElement.style.display == "none" || targetElement.style.display == "") {
                    targetElement.style.display = "block";
                    a_linkObj.innerHTML = "<b><div class='hjd_jp_exp_off'></div></b>";
                } else {
                    targetElement.style.display = "none";
                    a_linkObj.innerHTML = "<b><div class='hjd_jp_exp_on'></div></b>";
                }
            } else {
                if (a_Bool) {
                    targetElement.style.display = "block";
                    a_linkObj.innerHTML = "<b><div class='hjd_jp_exp_off'></div></b>";
                } else {
                    targetElement.style.display = "none";
                    a_linkObj.innerHTML = "<b><div class='hjd_jp_exp_on'></div></b>";
                }
            }
            return false;
        },
        ShiftExplanPanels: function (aObjCounts, aLinkObj) {
            //ShiftVisible_jpcom com_panel_1
            //click2expend_0
            if (aLinkObj.innerHTML.indexOf("expall_off") > 0) {
                aLinkObj.innerHTML = "<b><div class='hjd_jp_expall_on'></div></b>";
                for (var i = 0; i < aObjCounts; i++) {
                    HJ.fun.ShiftVisible_jpcom("com_panel_" + i, HJ.dom.get("click2expend_" + i), false);
                }
            } else {
                aLinkObj.innerHTML = "<b><div class='hjd_jp_expall_off'></div></b>";
                for (var i = 0; i < aObjCounts; i++) {
                    HJ.fun.ShiftVisible_jpcom("com_panel_" + i, HJ.dom.get("click2expend_" + i), true);
                }
            }
        },
        //添加我的生词  开始
        amw_callback: function (json) {
            if (G.mode == "simple") {
                SimpleMode._addMyWordCallback(json);
                return;
            }
            var result = json.result;
            if (result == "yes") {
                //HJ.dom.get("hjd_amw_panel").innerHTML = '<a href="' + HJ.global.BuloDomain + '/mydict/" title="查看我的生词本" target="_blank">添加成功</a>';
                HJ.dom.get("hjd_amw_panel").innerHTML = '<a href="http://dict.hujiang.com/scb/" title="查看我的生词本" target="_blank"><img align="absmiddle" src="http://dict.hujiang.com/images/btn_myword_del.gif" alt="查看我的生词本" style="border:0 none;"></a>'
            } else if (result == "no") {
                //HJ.dom.get("hjd_amw_panel").innerHTML = '<a href="' + HJ.global.BuloDomain + '/mydict/" title="查看我的生词本" target="_blank">该词已添加</a>';
                HJ.dom.get("hjd_amw_panel").innerHTML = '<a href="http://dict.hujiang.com/scb/" title="查看我的生词本" target="_blank"><img align="absmiddle" src="http://dict.hujiang.com/images/btn_myword_del.gif" alt="查看我的生词本" style="border:0 none;"></a>'
            } else if (result == "error") {
                HJ.dom.get("hjd_amw_panel").innerHTML = '添加失败';
            } else if (result == "login") {
                //if (confirm("只有登录沪江部落后，才能添加自己的生词，现在是否登录？")) {dict_ajax2 - min
                //    window.open(HJ.global.BuloDomain + "/login.aspx?returnURL=" + escape("http://dict.hujiang.com/scb/"));
                //    //HJ.dom.get("hjd_amw_panel").innerHTML = '请登录后刷新';
                //}
                HJ.dom.get("hjd_amw_panel").innerHTML = '<a href="javascript:void(0);" title="添加到我的生词本" onclick="HJ.fun.AddMyWord();return false;"><img align="absmiddle" src="' + HJ.global.Domain + '/images/btn_myword_add.gif" alt="添加到我的生词本" style="border:0 none;"/></a>';

                $("#hjd_close_btn").click();
                window.hjquicklogin.doLogin();
                return;
            }
            HJ.fun.Copy2amwPanel();

        },
        //添加我的生词  开始
        amw_jp_callback: function (json) {
            if (G.mode == "simple") {
                SimpleMode._addMyWordCallback(json);
                return;
            }
            var retValue = json.result;
            var aTurnID = json.aTurnID;

            if (retValue == "yes") {
                //HJ.dom.get("hjd_amw_panel_" + aTurnID).innerHTML = '<a href="' + HJ.global.BuloDomain + '/mydict/" title="查看我的生词本" target="_blank">添加成功</a>';
                HJ.dom.get("hjd_amw_panel_" + aTurnID).innerHTML = '<a href="http://dict.hujiang.com/scb/" title="查看我的生词本" target="_blank"><img align="absmiddle" src="http://dict.hujiang.com/images/btn_myword_del.gif" alt="查看我的生词本" style="border:0 none;"></a>'
            } else if (retValue == "no") {
                //HJ.dom.get("hjd_amw_panel_" + aTurnID).innerHTML = '<a href="' + HJ.global.BuloDomain + '/mydict/" title="查看我的生词本" target="_blank">该词已添加</a>';
                HJ.dom.get("hjd_amw_panel_" + aTurnID).innerHTML = '<a href="http://dict.hujiang.com/scb/" title="查看我的生词本" target="_blank"><img align="absmiddle" src="http://dict.hujiang.com/images/btn_myword_del.gif" alt="查看我的生词本" style="border:0 none;"></a>'
            } else if (retValue == "error") {
                HJ.dom.get("hjd_amw_panel_" + aTurnID).innerHTML = '添加失败';

            } else if (retValue == "login") {
                //if (confirm("只有登录沪江部落后，才能添加自己的生词，现在是否登录？")) {dict_ajax2 - min
                //    window.open(HJ.global.BuloDomain + "/login.aspx?Reset=1&returnURL=" + escape("http://dict.hujiang.com/scb/"));
                //}
                HJ.dom.get("hjd_amw_panel_" + aTurnID).innerHTML = '<a align="absmiddle" title="添加到我的生词本" href="javascript:void(0);" onclick="HJ.fun.Do_AddJpWord(' + aTurnID + ');return false;"><img src="' + HJ.global.Domain + '/images/btn_myword_add.gif" alt="将这个单词添加到我的生词本" style="border:0 none;"/></a>';

                $("#hjd_close_btn").click();
                window.hjquicklogin.doLogin();
            }
        },
        Copy2amwPanel: function () {
            if (HJ.dom.get("hjd_amw_panel2") != null) {
                HJ.dom.get("hjd_amw_panel2").innerHTML = HJ.dom.get("hjd_amw_panel").innerHTML;
            }
        },
        AddMyWord: function () {
            HJ.dom.get("hjd_amw_panel").innerHTML = '<img align="absmiddle"  style="cursor:pointer;" src="' + HJ.global.Domain + '/images/loading2.gif" />';
            setTimeout("HJ.fun.Do_AddMyWord();", 500);

            HJ.fun.Copy2amwPanel();
        },

        AddJpWord: function (aID) {
            HJ.dom.get("hjd_amw_panel_" + aID).innerHTML = '<img align="absmiddle" style="cursor:pointer;" src="' + HJ.global.Domain + '/images/loading2.gif" />';
            setTimeout("HJ.fun.Do_AddJpWord(" + aID + ");", 500);
        },

        AddSimpleJpWord: function (aID) {
            //HJ.dom.get("hjd_addword_image_" + aID).innerHTML = '<img align="absmiddle" style="cursor:pointer;" src="' + HJ.global.Domain + '/images/loading2.gif" />';
            HJ.dom.get("hjd_addword_image_" + aID).innerHTML = '<img align="absmiddle" style="cursor:pointer;" src="' + HJ.global.Domain + '/images/loading2.gif" />';
            setTimeout("HJ.fun.Do_AddSimpleJpWord(" + aID + ");", 500);
            //HJ.dom.get("hjd_addword_image_" + aID).innerHTML = '<img align="absmiddle" style="cursor:pointer;" src="' + HJ.global.Domain + '/images/btn_myword_del.gif" />';
        },

        AddFrWord: function () {
            HJ.dom.get("hjd_amw_panel").innerHTML = '<img align="absmiddle" style="cursor:pointer;" src="' + HJ.global.Domain + '/images/loading2.gif" />';
            setTimeout("HJ.fun.Do_AddFrWord();", 500);
        },
        Do_AddMyWord: function () {

            var strText = HJ.dom.get("hjd_amw_comment").innerHTML;
            strText = strText.replace(/<br\/>/igm, "\n").replace(/<br><br>/igm, "\n");
            var regEx = /<[^>]*>/g;
            var word = HJ.dom.get("hjd_word_encode").value.replace(" ", "+");
            //strText = strText.replace(regEx, "");

            var jsonURL = HJ.global.Domain + "/services/AddMyWordAjax.ashx?w=" + word;
            //jsonURL += "&c=" + encodeURI(HJ.dom.get("hjd_amw_comment").innerHTML);
            jsonURL += "&c=" + encodeURI(strText);
            jsonURL += "&r=" + encodeURI(document.referrer);
            jsonURL += "&l=" + HJ.dom.get("hjd_langs").value + "&" + Math.random();
            
            ////debugger;
            ////执行查询
            //HJ.ajax.json({
            //    url: jsonURL,
            //    error: function () {
            //        alert("服务器连接超时，请确认您的网络连接后再次添加！");
            //    }
            //});
            //post提交jsonURL
            $.ajax({
                type: "post",
                dataType: "script",
                url: HJ.global.Domain + "/services/AddMyWordAjax.ashx",
                async: true,
                data: { w: word, c: encodeURI(strText), r: encodeURI(document.referrer), l: HJ.dom.get("hjd_langs").value + "&" + Math.random() },
                success: function (data) {
                    eval(data);
                },
                error: function (req, status, error) {
                    alert("服务器连接超时，请确认您的网络连接后再次添加！");
                }
            });

            HJ.Counter.AddScb(word);
        },
        Do_AddJpWord: function (aID) {

            var strText = HJ.dom.get("hjd_amw_comment_" + aID).value;
            strText = strText.replace(/<br\/>/igm, "\n");
            var regEx = /<[^>]*>/g;
            var word = HJ.dom.get("hjd_amw_word_" + aID).value.replace(" ", "+");
            strText = strText.replace(regEx, "");

            var jsonURL = HJ.global.Domain + "/services/AddMyWordAjax.ashx?w=" + encodeURI(word);
            jsonURL += "&c=" + encodeURI(strText);
            jsonURL += "&r=" + encodeURI(document.referrer);
            jsonURL += "&l=" + HJ.fun.getLanguage();
            jsonURL += "&i=" + aID + "&" + Math.random();
            //debugger;
            //执行查询
            HJ.ajax.json({
                url: jsonURL,
                error: function () {
                    alert("服务器连接超时，请确认您的网络连接后再次添加！");
                }
            });
            ////post提交jsonURL
            //$.ajax({
            //    type: "post",
            //    dataType: "script",
            //    url: HJ.global.Domain + "/services/AddMyWordAjax.ashx",
            //    async: true,
            //    data: { w: encodeURI(word), c: encodeURI(strText), r: encodeURI(document.referrer), l: HJ.fun.getLanguage(),i:aID + "&" + Math.random() },
            //    success: function (data) {
            //        eval(data);
            //    },
            //    error: function (req, status, error) {
            //        alert("服务器连接超时，请确认您的网络连接后再次添加！");
            //    }
            //});

            HJ.Counter.AddScb(word);
        },
        Do_AddSimpleJpWord: function (aID) {

            var strText = HJ.dom.get("hjd_wordcomment_" + aID).value;//解释
            strText = strText.replace(/<br\/>/igm, "\n");
            var regEx = /<[^>]*>/g;
            var word = HJ.dom.get("hjd_amw_word_" + aID).value.replace(" ", "+"); //单词
            strText = strText.replace(regEx, "");

            var wordid = $("#hjd_simple_content").attr("data-wordid");
            var fromlang = $("#hjd_simple_content").attr("data-fromlang");
            var tolang = $("#hjd_simple_content").attr("data-tolang");

            var jsonURL = HJ.global.Domain + "/services/AddMyWordAjax.ashx?w=" + encodeURI(word);
            jsonURL += "&fromlang=" + encodeURI(fromlang);
            jsonURL += "&tolang=" + encodeURI(tolang);
            jsonURL += "&wordid=" + encodeURI(wordid);
            jsonURL += "&c=" + encodeURI(strText);
            jsonURL += "&r=" + encodeURI(document.referrer);
            jsonURL += "&l=" + HJ.fun.getLanguage();
            jsonURL += "&i=" + aID + "&" + Math.random();

            HJ.ajax.json({
                url: jsonURL,
                error: function () {
                    alert("服务器连接超时，请确认您的网络连接后再次添加！");
                }
            });

            HJ.Counter.AddScbSimple(word);            
        },

        ShiftVisible: function (aObjName) {
            var targetElement = HJ.dom.get(aObjName);
            if (targetElement.style.display == "none" || targetElement.style.display == "") {
                targetElement.style.display = "block";
            } else {
                targetElement.style.display = "none";
            }
            return false;
        },
        ShiftCommentArea: function (aObj) {
            HJ.fun.ShiftVisible(aObj + "_content");
            HJ.fun.ShiftVisible(aObj + "_hint");
            return false;
        },

        hjd_hidewindow: function () {
            this.DictHide();
        },
        show: function (obj) {
            var obj = HJ.dom.get(obj);
            if (obj != null)
            { obj.style.display = "block"; }
        },
        hide: function (obj) {
            var obj = HJ.dom.get(obj);
            if (obj != null)
            { obj.style.display = "none"; }
        },
        DictShow: function () { this.show("hjd_panel"); adjustInputSize(); /* HJ.dom.get("hjd_panel").style.display = "block";*/ },
        DictHide: function () { this.hide("hjd_panel"); if (G.mode == "simple") SimpleMode.hide(); /*HJ.dom.get("hjd_panel").style.display = "none";*/ },
        ToolTipShow: function () { D.get("hjd_tiptoolbar").style.visibility = "visible"; },
        ToolTipHide: function () { D.get("hjd_tiptoolbar").style.visibility = "hidden"; },
        QuickTipShow: function () { this.show("hjd_quicktoolbar"); },
        QuickTipHide: function () { this.hide("hjd_quicktoolbar"); },
        hjd_ShiftFrozen: function () {

            var D = HJ.dom, G = HJ.global;
            G.IsFix = !G.IsFix;
            //清除固定状态
            D.removeClass("hjd_btn_wrap_frozen", "hjd_btn_wrap_frozen0");
            D.removeClass("hjd_btn_wrap_frozen", "hjd_btn_wrap_frozen1");
            //添加固定样式
            D.addClass("hjd_btn_wrap_frozen", "hjd_btn_wrap_frozen" + (G.IsFix ? "1" : "0"));

            var hjd_panelStyle = D.get("hjd_panel").style;
            var top = (parseInt(hjd_panelStyle.top) || 0), left = (parseInt(hjd_panelStyle.left) || 0);
            var bodyTop = (parseInt(document.body.style.marginTop) || 8), bodyLeft = (parseInt(document.body.style.marginLeft) || 8);
            var scroll = HJ.dom.getScrollOffset();

            if (!HJ.ua.isIE6) {
                if (G.IsFix) {
                    HJ.common.debug("top:" + top + "-left:" + left);
                    HJ.common.debug("bodyTop:" + bodyTop + "-bodyLeft:" + bodyLeft + "-scrollTop:" + document.body.scrollTop);
                    hjd_panelStyle.position = "fixed";
                    hjd_panelStyle.top = top + bodyTop - scroll.top + "px";
                    hjd_panelStyle.left = left + bodyLeft - scroll.left + "px";
                }
                else {
                    hjd_panelStyle.position = "absolute";
                    hjd_panelStyle.top = top - bodyTop + scroll.top + "px";
                    hjd_panelStyle.left = left - bodyLeft + scroll.left + "px";
                }
            }

        },
        Dict_CallBack: function (isenable) {
            // 部落中点击开启 /关闭划词时的回调函数
        },
        dictEnable: null,
        hjd_remove: null,
        ShiftDictEnable: function (aBool, aObjID) {
            if (HJ.dom.get("hjdict_slide") != null && aObjID == null) {
                aObjID = "hjdict_slide";
            }
            if (aObjID == null) {
                aObjID = "hjdict_power";
            }
            else if (HJ.dom.get("hjdict_power") != null) {
                aObjID = "hjdict_power";
            }
            try {
                if (aBool == null) {
                    HJ.global.IsEnable = !HJ.global.IsEnable;
                    HJ.common.debug("aBool:" + aBool);
                }
                else {
                    HJ.common.debug("aBool-aBool == null:" + aBool);
                    HJ.global.IsEnable = aBool;
                }

                var a = HJ.event.getTarget(HJ.event.getEvent()); //获取事件源
                var bgPosition = HJ.global.IsEnable ? "0px -787px" : "0px -758px";

                var textSelf = HJ.global.IsEnable ? "关闭划词" : "开启划词";
                var textPage = HJ.global.IsEnable ? "关闭划词" : "开启划词";

                //a.innerHTML = textSelf;

                HJ.common.debug("ShiftDictEnable:" + HJ.global.IsEnable + "-aObjID:" + aObjID);

                if (HJ.dom.get("hjdict_switch") != null) {
                    //HJ.dom.get("hjdict_switch").innerHTML = textSelf;
                    // HJ.dom.get("hjdict_switch").style.backgroundPosition = bgPosition;
                    if (HJ.ua.isIE6) {
                        HJ.dom.get("hjdict_switch").className = HJ.global.IsEnable ? "dict_state_1" : "dict_state_2";
                    } else {
                        HJ.dom.get("hjdict_switch").className = HJ.global.IsEnable ? "dict_state_1 icon_enable_png" : "dict_state_2 icon_disable_png";
                    }
                }
                if (HJ.dom.get("hjdict_power") != null) {
                    HJ.dom.get("hjdict_power").innerHTML = textSelf;
                }
                if (HJ.dom.get("hjdict_slide") != null) {
                    HJ.dom.get("hjdict_slide").innerHTML = textPage;
                }
                //_dictUpdateStatus();
                //RecordSetting();
                //InitHJToolbar(aObjID);
                //设置用户的划词开关设置
                var userSetState = HJ.global.IsEnable;
                HJ.fun.setCookie("userHuaCiSet", userSetState, -1, "/");
                HJ.fun.setCookie("userHuaCiSet", userSetState, 9999999, "/");

                //调用回调函数
                HJ.fun.Dict_CallBack(HJ.global.IsEnable);


            } catch (e) {
                //
            }
            if (typeof (hjd_onShiftDictEnable) != "undefined") {
                //如果存在hjd_onShiftDictEnable方法，则调用
                hjd_onShiftDictEnable(HJ.global.IsEnable);
            }
            HJ.Counter.SetSwitch();
            return false;
        },
        hjd_ShiftDictEnable: function (aBool) {
            if (typeof (aBool) == "undefined") {
                aBool = !HJ.global.IsEnable;
            }
            this.ShiftDictEnable(aBool);
        },
        doSearch: function (e) {
            var G = HJ.global, F = HJ.fun, D = HJ.dom;

            var language = F.getLanguage();
            var str = HJ.dom.get("hjd_txtsearch").value;
            G.isInputSearch = HJ.dom.get("hjd_txtsearch") == document.activeElement;
            var regex;
            if (language == "en") {
                //删除两端的'
                str = str.replace(/(^'*|'+$)/g, '');
                regex = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\,|\<|\.|\>|\/|\?]/g;
            }
            else if (language == "fr") {//todo xuyc 法语取出过滤 '  
                regex = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\|\,|\<|\.|\>|\/|\?]/g;
            }
            else {
                regex = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g;
            }
            str = str.replace(regex, "+");
            var word = HJ.common.trim(str);

            //如果和上次查询内容相同，则不再做查询动作
            if (language == G.OldSearchLang && word == G.OldSearchWord) {
                if (G.mode == "simple") SimpleMode.showContent();
                return false;
            }

            if (G.IsQuick) {
                F.DictHide();
                F.ToolTipHide();
                F.QuickTipShow();
                D.get("hjd_quicktoolbar").innerHTML = "正在查询，请稍后...";
                //return;
            }

            G.OldSearchLang = language;
            G.OldSearchWord = word;

            G.TimeoutID = window.setTimeout(function () {
                HJ.fun.show("hjd_imgloading");
                HJ.fun.hide("hjd_txtresult");
            }, 1500);

            //test address
            var jsonURL =  HJ.global.Domain;
            //if(G.mode == "simple") jsonURL = "http://dict2.hujiang.com"; //for testing

            switch (language) {
                case "en":
                    if (G.mode == "simple") jsonURL = jsonURL + "/services/simpleExplain/en_simpleExplain.ashx?w=";
                    else jsonURL = jsonURL + "/services/huaci/xml_web_ajax.ashx?w=";
                    break;
                case "jc":
                case "cj":
                case "jp":
                    if (language == "jp") {
                        F.setLanguage("jc");
                        language = "jc";
                    }
                    if (G.mode == "simple") jsonURL = jsonURL + "/services/simpleExplain/jp_simpleExplain.ashx?type=" + language + "&w=";
                    else jsonURL = jsonURL + "/services/huaci/jp_web_ajax.ashx?type=" + language + "&w=";
                    break;
                case "fr":
                    if (G.mode == "simple") jsonURL = jsonURL + "/services/simpleExplain/fr_simpleExplain.ashx?w=";
                    else jsonURL = jsonURL + "/services/huaci/fr_web_ajax.ashx?w=";
                    break;
                case "kr":
                    if (G.mode == "simple") jsonURL = jsonURL + "/services/simpleExplain/kr_simpleExplain.ashx?w=";
                    else jsonURL = jsonURL + "/services/huaci/kr_web_ajax.ashx?w=";
                    break;
                case "de":
                    if (G.mode == "simple")
                        jsonURL = jsonURL + "/services/simpleExplain/de_simpleExplain.ashx?langType=" + language + "&w=";
                    else
                        jsonURL = jsonURL + "/services/huaci/de_web_ajax.ashx?langType=" + language + "&w=";
                    break;
                case "es":
                    if (G.mode == "simple")
                        jsonURL = jsonURL + "/services/simpleExplain/es_simpleExplain.ashx?langType=" + language + "&w=";
                    else jsonURL = jsonURL + "/services/huaci/es_web_ajax.ashx?langType=" + language + "&w=";
                    break;
            }
            //查询URL
            jsonURL = jsonURL + encodeURI(word) /*+ "&" + Math.random()*/;
            //执行查询
            A.json({
                url: jsonURL,
                error: function () {
                    HJ.dom.get("hjd_txtresult").innerHTML = "服务器连接超时，请确认您的网络连接后再次查询！";
                    HJ.fun.hide("hjd_imgloading");
                    HJ.fun.show("hjd_txtresult");
                }
            });

            //加载计数器
            HJ.Counter.LoadWebClick(word);
            HJ.Counter.LoadGA();
            //HJ.Counter.LoadBaiduTongJi();
            /*if (!hjd_blnisLoadCount) {
            //加载计数器
            loadCount();
            hjd_blnisLoadCount = true;
            }*/

            return true;
        },
        doEnSearch: function () {
            HJ.fun.changeLanguageForSearch("en");
            HJ.fun.doSearch();
        },
        doJcSearch: function () {
            HJ.fun.changeLanguageForSearch("jc");
            HJ.fun.doSearch();
        },
        doCjSearch: function () {
            HJ.fun.changeLanguageForSearch("cj");
            HJ.fun.doSearch();
        },
        doFrSearch: function () {
            HJ.fun.changeLanguageForSearch("fr");
            HJ.fun.doSearch();
        },
        doKrSearch: function () {
            HJ.fun.changeLanguageForSearch("kr");
            HJ.fun.doSearch();
        },
        doDeSearch: function () {
            HJ.fun.changeLanguageForSearch("de");
            HJ.fun.doSearch();
        },
        doEsSearch: function () {
            HJ.fun.changeLanguageForSearch("es");
            HJ.fun.doSearch();
        },

        hjd_mydictsearch: function (word, Loc, el) {
            if (HJ.global.IsInit) {
                var pos = new Object();
                pos.x = pos.clientX = Loc.left;
                pos.y = pos.clientY = Loc.top + el.offsetHeight;
                G.targetPos = pos;
                HJ.Drag.MoveTo(pos);
            }

            var hjd_txtsearch = HJ.dom.get("hjd_txtsearch");
            hjd_txtsearch.value = word;

            if(G.mode == "simple"){
                SimpleMode.show();
                SimpleMode.showTitle(hjd_txtsearch.value);
                SimpleMode.clearContent();
            }else{
                HJ.fun.DictShow();          
            }   
            HJ.fun.ToolTipHide();
            HJ.fun.doSearch();
        },
        stopMove: null,
        DictSelection: function (e) {
            //如果未启用划词，直接退出
            if (!HJ.global.IsEnable) { return; }
            var E = HJ.event, D = HJ.dom, F = HJ.fun, G = HJ.global;
            var str = HJ.common.trim(E.getSelection(e));
            var target = E.getTargetSrc();
            var pos = E.getMousePos(e);
            var hjd_tiptoolbar = D.get("hjd_tiptoolbar");

            //最大字符长度为50
            if (str == null || str.length == 0 || str.length > 50) {
                return;
            }

            //选择划词内部后，不用改变位置
            var isSelfSearch = (D.contains("hjd_panel", target) || D.contains("hjd_quicktoolbar", target) || D.contains("hjd_simple", target));

			var isNoShowConatin = false;
			var ojbNoShowConain = D.getAncestorByClassName(target,"no_dict_show");

			if(ojbNoShowConain.nodeType == 1)
			{
				isNoShowConatin = true;
				return ;
			}
			ojbNoShowConain = D.getAncestorByClassName(target, "ke-dialog-content");

			if (ojbNoShowConain.nodeType == 1) {
			    isNoShowConatin = true;
			    return;
			}
			
            if (isSelfSearch && !G.AllowSelfSearch) {
                return;
            }

            G.targetPos = pos;
            if (G.mode == "simple") {
                SimpleMode.show();
                SimpleMode.showTitle(str);
                SimpleMode.clearContent();
                pos.clientX = pos.x;
                pos.clientY = pos.y;
            } else if (G.hjd_hidetip) {
                F.DictShow();
                pos.clientX = pos.x;
                pos.clientY = pos.y;
                HJ.common.debug("G.hjd_hidetip1:" + G.hjd_hidetip);
            }
            else {
                F.ToolTipShow();
                F.DictHide();

                hjd_tiptoolbar.style.top = (pos.y + 3) + "px";
                hjd_tiptoolbar.style.left = (pos.x - 5) + "px";

                pos.clientX = parseInt(hjd_tiptoolbar.style.left) - 20;
                pos.clientY = parseInt(hjd_tiptoolbar.style.top) - 20;

                HJ.common.debug("G.hjd_hidetip2:" + G.hjd_hidetip);
            }

            HJ.common.debug(hjd_tiptoolbar.style.display);

            D.get("hjd_txtsearch").value = str;
            F.doSearch();

            if (G.IsQuick) {
                F.DictHide();
                F.ToolTipHide();
                F.QuickTipShow();

                D.get("hjd_quicktoolbar").style.left = pos.x + "px";
                D.get("hjd_quicktoolbar").style.top = pos.y + 5 + "px";
                //debugger;
                HJ.common.debug("target:" + target.clientX + "-" + target.clientY);

                return;
            }

            if (G.IsFix) {
                F.ToolTipHide();
                F.DictShow();
                return;
            }

            //选择划词内部后，不用改变位置
            if (isSelfSearch) {
                return;
            }

            //划词位置更新
            HJ.common.debug(pos);
            HJ.Drag.MoveTo(pos);


            /*D.get("hjd_panel").style.left = pos.x;
            D.get("hjd_panel").style.top = pos.y;*/
        },
        hjd_TipSet: function () {
            var G = HJ.global, D = HJ.dom;
            G.hjd_hidetip = !G.hjd_hidetip;
            HJ.common.debug("hjd_TipSet():" + G.hjd_hidetip);

            if (HJ.ua.isIE6) {
                D.get("hjd_hover").className = G.hjd_hidetip ? "hjd_hover_1" : "hjd_hover_2";
            } else {
                D.get("hjd_hover").className = G.hjd_hidetip ? "hjd_hover_1 icon_enable2_png" : "hjd_hover_2 icon_disable2_png";
            }

            //ga事件
            HJ.Counter.SetTips();
            HJ.fun.setCookie("ShowState", G.hjd_hidetip ? "panel" : "tip", 99999999999, "/"); //设置迷你查词过期时间。
        },
        //站内是否已经使用划词工具条
        isUsedHJToolbar: function () {
            return (HJ.dom.get("hjdict_power") != null || HJ.dom.get("hjdict_slide") != null);
        },
        //初始化站内工具条状态
        InitHJToolbar: function (aObjID) {
            try {
                var D = HJ.dom;
                //新小D划词工具，用于小D新
                if (aObjID == "hjdict_slide") {
                    if (HJ.global.IsEnable) {
                        D.get(aObjID).innerHTML = "关闭划词";
                    } else {
                        D.get(aObjID).innerHTML = "开启划词";
                    }
                    return;
                }
                if (aObjID == "hjdict_power") {
                    if (HJ.global.IsEnable) {
                        D.get(aObjID).innerHTML = "关闭划词";
                    } else {
                        D.get(aObjID).innerHTML = "开启划词";
                    }
                    return;
                }
                //原划词工具，用于网站等
                if (HJ.global.IsEnable) {
                    hj$(aObjID).innerHTML = "&#24050;&#21551;&#29992;"; //经过编码的原文字：已启用
                } else {
                    hj$(aObjID).innerHTML = "&#24050;&#31105;&#29992;";//经过编码的原文字：已禁用
                }
            } catch (e) {
                //
            }
        },
        /*网站用，有特定属性的链接直接显示划词*/
        AttachDictBH: function () {
            var elms = document.getElementsByTagName('a');
            for (i = 0; i < elms.length; i++) {
                var hj_dict_timer = HJ.global.hj_dict_timer;
                if (elms[i].className.indexOf("hjdict") == 0 && elms[i].getAttribute("word") != null) {
                    elms[i].onmouseover = function (aevent) {
                        if (aevent == null) {
                            aevent = window.event;
                        }
                        if (!HJ.global.IsEnable) {
                            return;
                        }

                        var me = this;
                        if (HJ.global.hj_dict_show_timer) clearTimeout(HJ.global.hj_dict_show_timer);
                        HJ.global.hj_dict_show_timer = setTimeout(function () {
                            if (HJ.global.IsInit) {
                                var pos = E.getMousePos(aevent);
                                pos.clientX = pos.x;
                                pos.clientY = pos.y;
                                G.targetPos = pos;
                                HJ.Drag.MoveTo(pos);
                            }
                            hj_dict_word = me.getAttribute("word");
                            var hjd_txtsearch = HJ.dom.get("hjd_txtsearch");
                            var F = HJ.fun;
                            if (hj_dict_word.indexOf("&type=jc") != -1) {
                                hjd_txtsearch.value = hj_dict_word.replace("&type=jc", "");
                                hj_dict_timer = setTimeout(F.doJcSearch, 300);
                            }
                            else if (hj_dict_word.indexOf("&type=cj") != -1) {
                                hjd_txtsearch.value = hj_dict_word.replace("&type=cj", "");
                                hj_dict_timer = setTimeout(F.doCjSearch, 300);
                            }
                            else if (hj_dict_word.indexOf("&type=fr") != -1) {
                                hjd_txtsearch.value = hj_dict_word.replace("&type=fr", "");
                                hj_dict_timer = setTimeout(F.doFrSearch, 300);
                            }
                            else if (hj_dict_word.indexOf("&type=kr") != -1) {
                                hjd_txtsearch.value = hj_dict_word.replace("&type=kr", "");
                                hj_dict_timer = setTimeout(F.doFrSearch, 300);
                            }
                            else if (me.href.indexOf("/jp/") != -1 && hj_dict_word.indexOf("&type=") == -1) {
                                hjd_txtsearch.value = hj_dict_word;
                                hj_dict_timer = setTimeout(F.doJcSearch, 300);
                            }
                            else if (me.href.indexOf("/fr/") != -1 && hj_dict_word.indexOf("&type=") == -1) {
                                hjd_txtsearch.value = hj_dict_word;
                                hj_dict_timer = setTimeout(F.doFrSearch, 300);
                            }
                            else if (me.href.indexOf("/kr/") != -1 && hj_dict_word.indexOf("&type=") == -1) {
                                hjd_txtsearch.value = hj_dict_word;
                                hj_dict_timer = setTimeout(F.doKrSearch, 300);
                            }
                            else if (me.href.indexOf("/de/") != -1 && hj_dict_word.indexOf("&type=") == -1) {
                                hjd_txtsearch.value = hj_dict_word;
                                hj_dict_timer = setTimeout(F.doDeSearch, 300);
                            }
                            else if (me.href.indexOf("/es/") != -1 && hj_dict_word.indexOf("&type=") == -1) {
                                hjd_txtsearch.value = hj_dict_word;
                                hj_dict_timer = setTimeout(F.doEsSearch, 300);
                            }
                            else {
                                hjd_txtsearch.value = hj_dict_word;
                                hj_dict_timer = setTimeout(F.doEnSearch, 300);
                            }

                            if (G.mode == "simple") {
                                SimpleMode.show();
                                SimpleMode.showTitle(hjd_txtsearch.value);
                                SimpleMode.clearContent();
                            } else {
                                HJ.fun.DictShow();
                                HJ.fun.ToolTipHide();
                            }
                        }, 300);
                    }
                    elms[i].onmouseout = function () {
                        if (HJ.global.hj_dict_show_timer) clearTimeout(HJ.global.hj_dict_show_timer);
                        clearTimeout(hj_dict_timer);
                        hj_dict_word = "";
                    }
                }
            }
        },

        changeMode: function (mode) {
            HJ.global.mode = mode;
            HJ.Counter.ChangeMode();
            HJ.fun.setCookie("hjd_mode", mode, 99999999999, "/");
        },

        initClipboard: function(width, height){
            var id = "hjd_clipboard";
            var swfURL = HJ.global.Domain + "/outapp/huaci/Clipboard.swf";
            //swfURL = "Clipboard.swf";
            var vars = "handler=HJ.fun.HJClipboard";

            var str = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,22,0'";
            str += " width='"+ width +"' height='"+ height +"' id='" + id + "' align='middle' >";
            str += "<param name='allowScriptAccess' value='always' />";
            str += "<param name='movie' value='" + swfURL + "' />";
            str += "<param name='scale' value='noScale' />";
            str += "<param name='wmode' value='transparent' />";
            str += "<param name='allowfullscreen' value='false' />";
            str += "<param name='flashvars' value='"+ vars +"' />";
            str += "<embed src='" + swfURL + "' scale='noScale' wmode='transparent' bgcolor='#ffffff' width='" + width + "' height='" + height + "' flashvars='" + vars + "' id='" + id + "' name='" + id + "' align='middle' allowScriptAccess='always' allowfullscreen='false' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer'/>";
            str += "</object>";

            var elem = document.createElement("div");
            elem.id = "hjd_clipboard_container";
            elem.style.position = "absolute";
            elem.style.width = width + "px";
            elem.style.height = height + "px";
            elem.style.right = "2px";
            elem.style.top = "8px";
            elem.innerHTML = str;
            document.getElementById("hjd_tiptoolbar").appendChild(elem);
        },

        HJClipboard: {
            getText: function(){
                return HJ.dom.get("hjd_txtsearch").value;
            },
            complete: function(){
                F.ToolTipHide();
            },
            mouseOver: function(){
                D.get("copyBtn").style.color = "orange";
            },
            mouseOut: function(){
                D.get("copyBtn").style.color = "#4d8606";
            }
        }
    };

    //
    HJ.namespace('HJ.global');
    HJ.global = {
        IsEnable: true,     /*是否启用划词 */
        IsFix: false,        /*是否已经固定*/
        IsInit: false,                          /*是否已经初始化过*/
        HasBindEvent: false,                    /*HJ.global.HasBindEvent*/
        SearchType: "en"/*en,cj,jc,fr,kr*/,     /*HJ.global.SearchType*/
        Domain: "http://dict2.hujiang.com",    /*HJ.global.Domain*/
        BuloDomain: "http://bulo.hjenglish.com", /*HJ.global.BuloDomain*/
        expen_click: "-",
        ShowState: "none",                       /*"none":不显示tip与查询框,"tip":只显示tip,"panel":只显示查询框*/
        mode: "normal", /*normal:完整版,simple:精简版*/
        TimeoutID: null,
        IDFlag: 0 /*控制标识*/,
        LangClearTimeout: 0,
        hjd_hidetip: true,    //是否显示tips
        hjd_soundtype: true,    //发音方式，true为悬停发音，false 为单击发音。
        SearchWord: "",       //查询单词
        OldSearchWord: "",     //上次查询单词
        OldSearchLang: "",     //上次查询单词的语种
        AllowSelfSearch: false,   /*是否允许划词内部的单词*/
        hj_dict_timer: null,   /*外部用*/

        IsQuick: false,   /*是否允许划词内部的单词*/
        SelectItem: null  /*划词对象*/
    };

    if (location.href.indexOf("http://dev.dict.hjenglish.com") != -1) {
        HJ.global.Domain = "http://dev.dict.hjenglish.com";
    }
    else if (location.href.indexOf("http://192.168.18.178") != -1) {
        HJ.global.Domain = "http://192.168.18.178";
    }
    else if (location.href.indexOf("http://dict.hujiang.com") != -1) {
        HJ.global.Domain = "http://dict.hujiang.com";
    }
    else if (location.href.indexOf("http://dict.hjenglish.com") != -1) {
        HJ.global.Domain = "http://dict.hjenglish.com";
    }
    else if (location.href.indexOf("http://beta.dict.hjenglish.com") != -1) {
        HJ.global.Domain = "http://beta.dict.hjenglish.com";
    }
    else if (location.href.indexOf("http://yz.dict.hjenglish.com") != -1) {
        HJ.global.Domain = "http://yz.dict.hjenglish.com";
    }
    else {
        HJ.global.Domain = "http://dict.hjenglish.com";
    }

    var userAgent = navigator.userAgent.toLowerCase();
    var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
    var is_moz = (navigator.product == 'Gecko') && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);
    var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);
    var is_kon = userAgent.indexOf('konqueror') != -1;
    var is_saf = userAgent.indexOf('applewebkit') != -1 || navigator.vendor == 'Apple Computer, Inc.';
    var is_mac = userAgent.indexOf('mac') != -1;

    //-------------------------------------------------
    Number.prototype.NaN0 = function () { return isNaN(this) ? 0 : this; }

    var E = HJ.event, D = HJ.dom, A = HJ.ajax, G = HJ.global, F = HJ.fun;
    var hjd_old_word = "";
    var hjd_old_sentence = "";
    var _dict_enable = true;
    var hjd_status;
    //var hjd_iframe = 0;
    var hjd_window = 0;
    var hjd_SentenceWindow = 0;
    var hjd_host = HJ.global.Domain;
    var hjd_help = HJ.global.Domain;
    // 
    var hjd_x = 0;
    var hjd_y = 25;
    var _hjd_x = 0;
    var _hjd_y = 25;
    var hjd_width = 282;
    var hjd_height = 220;
    var hjd_m_offx = 0;
    var hjd_m_offy = 0;
    var hjd_clientW = 0;
    var hjd_clientH = 0;
    var hjd_mouseloc = 0;
    var msgpanelTime = 0;
    var hjd_frozen = false;
    var hjd_maxused = false;
    var hjd_dictInited = false;
    var hjd_isFullScreen = false;
    var hjd_hidetip = true;
    var hjd_lastmsgTitle = "";
    var hjd_offsetX = 0;
    var hjd_offsetY = 0;
    var hjd_framebodyDuce = (is_moz != false) ? 3 : 25;
    var hjd_scrollControl, hjd_searchpnl;
    var hjd_txtsearch, hjd_btnsearch, hjd_txtresult, hjd_imgloading, hjd_bodyframe, hjd_tiptoolbar;
    var hjd_scriptid = "hjd" + Math.random;
    var hjd_ChromeTempEvent;
    var hjd_blnisLoadCount = false;
    var hjd_minwidth = 382; //最小宽度
    var hjd_minheight = 250; //最小高度
    var hjd_isStopMove = false; //禁止移动框
    var mouseOffset = {};
    //var soundType = true; //发音方式，true为悬停发音，false 为单击发音。

    var SimpleMode = {
        getTemplate: function () {
            var tmpl = '<div class="inner"><span id="hjd_simple_title" class="simple_title"></span><a id="hjd_simple_link" href="#" target="_blank" title="查看词条详细注释">&raquo;</a><span id="hjd_simple_amw_panel" class="hjd_simple_amw_panel"><a href="#" title="添加到我的生词本"><img align="absmiddle" src="http://dict.hjenglish.com/images/btn_myword_add.gif"></a></span><div id="hjd_simple_lang" class="lang"><a class="disabled" id="hjd_simple_lang_jc" href="#" title="日译中">日中</a>|<a id="hjd_simple_lang_cj" href="#" title="中译日">中日</a></div><div id="hjd_simple_content" class="hjd_simple_content" data-wordid="0" data-fromlang="En" data-tolang="Cn"></div><div id="hjd_simple_loading" class="loading"><img src="http://dict.hujiang.com/images/loading2.gif">&nbsp;我正在努力查询，请稍等...</div><div class="hjd_simple_bottom"><a id="hjd_simple_switch" class="hjd_simple_switch" href="#">划词</a><span id="hjd_simple_toggle_wrapper"><a id="hjd_simple_toggle" class="hjd_simple_toggle" href="#">标准版</a></span><a id="hjd_simple_lang_icon" class="hjd_simple_lang_icon"><i></i></a><div id="hjd_simple_lang_list" class="hjd_simple_lang_list"><a class="firstitem"><span></span></a><a></a><a></a><a></a><a></a><a></a></div><a id="hjd_simple_lang_link" class="hjd_simple_lang_link" href="http://dict.hjenglish.com" target="_blank">小D英语</a></div></div>';
            return tmpl;
        },

        init: function () {
            var elem = D.get("hjd_simple");
            if (!elem) {
                elem = document.createElement("div");
                elem.id = "hjd_simple";
                elem.className = "hjd_simple";
                document.body.appendChild(elem);
                D.html(elem, this.getTemplate());

                this.view = elem;
                this.title = D.get("hjd_simple_title");
                this.link = D.get("hjd_simple_link");
                this.content = D.get("hjd_simple_content");
                this.lang = D.get("hjd_simple_lang");
                this.loading = D.get("hjd_simple_loading");
                this.langIcon = D.get("hjd_simple_lang_icon");
                this.langList = D.get("hjd_simple_lang_list");
                this.showControls(false);
                HJ.fun.SimpleMode = this;

                this.view.onmouseover = function (e) {
                    SimpleMode.showControls(true);
                };

                this.view.onmouseout = function (e) {
                    SimpleMode.showControls(false);
                    SimpleMode.showLangList(false);
                };

                this.langList.onmouseover = function (e) {
                    SimpleMode.showLangList(true);
                };

                this.langList.onmouseout = function (e) {
                    SimpleMode.showLangList(false);
                };

                this.langIcon.onmouseover = function (e) {
                    SimpleMode.showLangList(true);
                };

                this.resetLangList();

                var langItems = this.langList.getElementsByTagName("a");
                for (var i = 1, item; i < langItems.length; i++) {
                    item = langItems[i];
                    item.onclick = function (e) {
                        var lang = this.getAttribute("data-lang");
                        if (lang == "jp") lang = "jc";
                        SimpleMode.changeLanguage(lang);
                        SimpleMode.showLangList(false, true);
                        F.setLanguage(lang);
                        HJ.Counter.SetLangs();
                        F.doSearch();
                    }
                }

                D.get("hjd_simple_toggle").onclick = function (e) {
                    SimpleMode.hide();
                    G.OldSearchWord = "";
                    F.changeMode("normal");
                    G.hjd_hidetip = F.getCookie("ShowState") != "tip";
                    F.DictShow();
                    HJ.Drag.MoveTo(G.targetPos);
                    F.doSearch();
                    return false;
                };

                D.get("hjd_simple_switch").onclick = function (e) {
                    F.ShiftDictEnable();
                    SimpleMode.showEnabled();
                    return false;
                };

                D.get("hjd_simple_lang_cj").onclick = function (e) {
                    this.className = "disabled";
                    D.get("hjd_simple_lang_jc").className = "";
                    F.setLanguage("cj");
                    HJ.Counter.SetLangs();
                    F.doSearch();
                    return false;
                };

                D.get("hjd_simple_lang_jc").onclick = function (e) {
                    this.className = "disabled";
                    D.get("hjd_simple_lang_cj").className = "";
                    F.setLanguage("jc");
                    HJ.Counter.SetLangs();
                    F.doSearch();
                    return false;
                };
            }
        },

        show: function (x, y) {
            this.init();
            this.view.style.display = "block";
            this.adjustPosition();
            F.ToolTipHide();
            this.showEnabled();
        },

        showEnabled: function () {
            var elem = D.get("hjd_simple_switch");
            //elem.innerHTML = G.IsEnable ? "已开启划词" : "已关闭划词";
            if (HJ.ua.isIE6) {
                elem.className = G.IsEnable ? "hjd_simple_switch" : "switch_disabled";
            } else {
                elem.className = G.IsEnable ? "hjd_simple_switch icon_enable_png" : "switch_disabled icon_disable_png";
            }
        },

        adjustPosition: function () {
            var pos = G.targetPos,
                x = (pos.x || pos.clientX) + 10,
                y = (pos.y || pos.clientY) + 10,
                w = this.view.offsetWidth,
                h = this.view.offsetHeight;
            if (x + w > document.body.clientWidth) x = x - w;
            if (y + h > document.body.clientHeight) y = y - h - 22;
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            this.view.style.left = x + "px";
            this.view.style.top = y + "px";
        },

        hide: function () {
            if (this.view) this.view.style.display = "none";
        },

        showTitle: function (title) {
            if (!this.view) return;
            var word = title || hjd_txtsearch.value || "";
            var str = this.restrictString(word, 12, '...');
            this.title.innerHTML = str;
            this.title.title = str != word ? word : "";
            this.link.style.visibility = "";
            this.changeLanguage();
        },

        showContent: function () {
            if (!this.view) return;
            $("#hjd_simple_content").attr("data-wordid", G.data.WordId);
            $("#hjd_simple_content").attr("data-fromlang", G.data.FromLang);
            $("#hjd_simple_content").attr("data-tolang", G.data.ToLang);
            var content = G.data ? G.data.content : "";
            this.content.innerHTML = content;
            this.loading.style.display = "none";
            this.adjustPosition();
            if(G.OldSearchLang != "jc" && G.OldSearchLang != "cj"){
                var hasScb = G.data.IfHasScb ? G.data.IfHasScb.toLowerCase() : "";
                var flag = hasScb == "true" ? "no" : "default";
                this._addMyWordCallback({result:flag});
            }
            //bugfix:IE7 scrollbar
            D.get("hjd_simple_content").style.overflowY = D.get("hjd_nodata_msg") == null ? "auto" : "hidden";
        },

        clearContent: function () {
            if (!this.view) return;
            this.content.innerHTML = "";
            this.loading.style.display = "block";
            D.get("hjd_simple_amw_panel").style.visibility = "hidden";
        },

        setWordLink: function () {
            var lang = G.OldSearchLang;
            if (lang == "jp" || lang == "jc" || lang == "cj") lang = "jp/w";
            else if (lang == "en") lang = "w";
            this.link.setAttribute("href", "http://dict.hjenglish.com/" + lang + "/" + G.OldSearchWord);
        },

        changeLanguage: function (lang) {
            if (!this.view) return;
            var lang = lang || G.OldSearchLang,
                isJP = lang == "jp" || lang == "jc" || lang == "cj";
            this.lang.style.display = isJP ? "block" : "none";
            D.get("hjd_simple_lang_jc").className = lang == "jc" ? "disabled" : "";
            D.get("hjd_simple_lang_cj").className = lang == "cj" ? "disabled" : "";
            var iconPosition = "", langLink = "http://dict.hjenglish.com", langTitle = "";
            switch (lang) {
                case "jc":
                case "cj":
                case "jp":
                    iconPosition = "8px -585px";
                    langLink += "/jp/";
                    langTitle = "日语小D";
                    break;
                case "fr":
                    iconPosition = "8px -608px";
                    langLink += "/fr/";
                    langTitle = "法语小D";
                    break;
                case "kr":
                    iconPosition = "8px -631px";
                    langLink += "/kr/";
                    langTitle = "韩语小D";
                    break;
                case "de":
                    iconPosition = "8px -816px";
                    langLink += "/de/";
                    langTitle = "德语小D";
                    break;
                case "es":
                    iconPosition = "8px -839px";
                    langLink += "/es/";
                    langTitle = "西语小D";
                    break;
                case "en":
                default:
                    iconPosition = "8px -562px";
                    langTitle = "英语小D";
                    break;
            }
            this.langIcon.style.backgroundPosition = iconPosition;
            D.get("hjd_simple_lang_link").setAttribute("href", langLink);
            D.get("hjd_simple_lang_link").innerHTML = langTitle;

            this.resetLangList(lang);
            this.setWordLink();
            D.get("hjd_simple_amw_panel").style.visibility = isJP || D.get("hjd_noresult") != null ? "hidden" : "visible";
        },

        showLangList: function (visible, nodelay) {
            if (this.langListTimeoutId) clearTimeout(this.langListTimeoutId);
            var display = visible ? "block" : "none";
            if (nodelay) {
                SimpleMode.langList.style.display = display;
            } else {
                this.langListTimeoutId = setTimeout(function () {
                    SimpleMode.langList.style.display = display;
                }, 300);
            }
        },

        resetLangList: function (lang) {
            if (lang == "cj" || lang == "jc") lang = "jp";
            var langItems = this.langList.getElementsByTagName("a"),
                currentLang = lang || G.OldSearchLang || "en",
                langs = "en|jp|fr|kr|de|es".split(currentLang + "|").join("").split("|"),
                index = 0;
            for (var i = 0, item, lang; i < langItems.length; i++) {
                item = langItems[i];
                if (i == 0) {
                    lang = currentLang;
                } else {
                    while (index < langs.length && !langs[index]) index++;
                    lang = langs[index];
                    index++;
                }
                this._setLangItem(item, lang, i);
            }
        },

        _setLangItem: function (item, lang, index) {
            item.setAttribute("data-lang", lang);
            var bgPosition = "", title = "";
            switch (lang) {
                case "jc":
                case "cj":
                case "jp":
                    bgPosition = "6px -580px";
                    title = "日语";
                    break;
                case "fr":
                    bgPosition = "6px -603px";
                    title = "法语";
                    break;
                case "kr":
                    bgPosition = "6px -626px";
                    title = "韩语";
                    break;
                case "de":
                    bgPosition = "6px -811px";
                    title = "德语";
                    break;
                case "es":
                    bgPosition = "6px -835px";
                    title = "西语";
                    break;
                case "en":
                default:
                    bgPosition = "6px -557px";
                    title = "英语";
                    break;
            }
            item.style.backgroundPosition = bgPosition;
            if (index > 0) item.innerHTML = '<div>' + title + '<div>';
        },

        showControls: function (visible) {
            var value = visible ? "" : "hidden";
            D.get("hjd_simple_toggle_wrapper").style.visibility = value;
            D.get("hjd_simple_switch").style.visibility = value;
        },

        restrictString: function (str, maxLength, ending) {
            var result = "", len = 0, i, s, code;

            for (i = 0; i < str.length; i++) {
                s = str.charAt(i);
                code = str.charCodeAt(i);
                if (code >= 0 && code <= 128) len++;
                else len += 2;
                if (len <= maxLength) {
                    result += s;
                } else {
                    if (ending) result += ending;
                    break;
                }
            }
            return result;
        },

        doAddMyWord: function () {
            var panel = D.get("hjd_simple_amw_panel"),
                alink = panel.getElementsByTagName("a")[0],
                img = alink.getElementsByTagName("img")[0];
            alink.onclick = function () { return false; };
            img.src = "http://dict.hjenglish.com/images/loading2.gif";

            var word = G.OldSearchWord;
            var comment = D.get("hjd_simple_content").innerHTML.replace(/<br[ \/]*>/igm, "\n");
            comment = comment.split("\n\n")[0];

            var wordid = $("#hjd_simple_content").attr("data-wordid");
            var fromlang = $("#hjd_simple_content").attr("data-fromlang");
            var tolang = $("#hjd_simple_content").attr("data-tolang");

            var url = G.Domain + "/services/AddMyWordAjax.ashx?w=" + word.replace(" ", "+");
            url += "&fromlang=" + encodeURI(fromlang);
            url += "&tolang=" + encodeURI(tolang);
            url += "&wordid=" + encodeURI(wordid);
            url += "&c=" + encodeURI(comment);
            url += "&r=" + encodeURI(document.referrer);
            url += "&l=" + (G.data.hjd_langs || G.OldSearchLang);
            if (G.OldSearchLang == "cj" || G.OldSearchLang == "jc") url += "&i=0";
            url += "&" + Math.random();

            setTimeout(function () {
                HJ.ajax.json({
                    url: url,
                    error: function () {
                        alert("服务器连接超时，请确认您的网络连接后再次添加！");
                    }
                });
            }, 500);

            HJ.Counter.AddScbSimple(word);
        },

        _addMyWordCallback: function (data) {
            var result = data.result.toLowerCase(), me = this, panel;
            if(G.OldSearchLang == "jc" || G.OldSearchLang == "cj") {
                var panel = D.get("hjd_simple_amw_panel_" + data.aTurnID);
                if(!panel) return;
            }else{
                panel = D.get("hjd_simple_amw_panel");
                panel.style.visibility = D.get("hjd_noresult") != null ? "hidden" : "visible";
                panel.style.top = "-2px";
            }
            var alink = panel.getElementsByTagName("a")[0],
                img = alink.getElementsByTagName("img")[0];

            switch (result) {
                case "yes":
                case "no":
                    alink.href = "http://dict.hjenglish.com/scb/";
                    alink.target = "_blank";
                    alink.title = img.alt = "查看我的生词本";
                    alink.onclick = null;
                    img.src = "http://dict.hjenglish.com/images/btn_myword_del.gif";
                    break;
                case "error":
                    panel.innerHTML = "添加失败";
                    panel.style.top = "0";
                    panel.style.lineHeight = "19px";
                    break;
                case "login":
                    //if (confirm("只有登录沪江部落后，才能添加自己的生词，现在是否登录？")) {dict_ajax2 - min
                    //    window.open("http://bulo.hjenglish.com/login.aspx?returnURL=" + escape("http://dict.hjenglish.com/scb/"));
                    //}
                    $("#hjd_close_btn").click();
                    window.hjquicklogin.doLogin();
                    alink.onclick = function () { me.doAddMyWord(); return false; };
                    img.src = "http://dict.hjenglish.com/images/btn_myword_add.gif";
                    break;
                default:
                    alink.onclick = function () { me.doAddMyWord(); return false; };
                    img.src = "http://dict.hjenglish.com/images/btn_myword_add.gif";
                    break;
            }
        }
    }

    D.ready(hjd_init);

    function getTemplate() {

        //编码之后：
        var tmpl = '<div id="hjd_searchpnl"><div id="hjd_top"><span id="hjd_top_title">&#21010&#35789&#37322&#20041</span><a id="hjd_close_btn"href="javascript:void(0);"title="&#20851&#38381&#24748&#28014&#26694"><div class="hjd_btn_wrap_close"></div></a><a id="hjd_btn_frozen"href="javascript:void(0);"title="&#24320&#21551&#47&#20851&#38381&#22266&#23450&#26174&#31034"><div id="hjd_btn_wrap_frozen"class="hjd_btn_wrap_frozen0"></div></a><div id="dictlang"class="hdj_cursor_def"><a id="hjd_chkLangEn"value="en"href="###">&#33521</a><a id="hjd_chkLangJp"value="jp"href="###">&#26085</a><a id="hjd_chkLangFr"value="fr"href="###">&#27861</a><a id="hjd_chkLangKr"value="kr"href="###">&#38889</a><a id="hjd_chkLangDe"value="de"href="###">&#24503</a><a id="hjd_chkLangEs"value="es"href="###">&#35199</a></div><a id="hjlang"href="javascript:void(0);"><span id="shiftLan"><span id="shiftlang">&#33521</span></span></a></div><div id="hjd_bodyframe"><input id="hjd_txtsearch"type="text" style="float:left;"><span id="hjd_btn_wrapper"><a id="hjd_btnEnSearch"style="display:block;">&#26597&#35789</a><span id="hjd_cj_wrapper"><a id="hjd_btnJCSearch"style="display:none;">&#26085&#20013</a><a id="hjd_btnCJSearch"style="display:none;">&#20013&#26085</a></span><a id="hjd_btnFrSearch"style="display:none;">&#26597&#35789</a><a id="hjd_btnKrSearch"style="display:none;">&#26597&#35789</a><a id="hjd_btnDeSearch"style="display:none;">&#26597&#35789</a><a id="hjd_btnEsSearch"style="display:none;">&#26597&#35789</a></span><div class="clear"></div><div id="hjd_imgloading"style="display:none;"><img src="http://dict.hujiang.com/images/loading2.gif">&nbsp;&#25105&#27491&#22312&#21162&#21147&#26597&#35810&#44&#35831&#31245&#31561&#46&#46&#46</div><div id="hjd_txtresult"></div><div id="hjd_tipAlert"></div><div id="set_detail"style="display:none;"><a id="hjd_btn_tip"class="no_underline"href="javascript:void(0);"><div id="hjd_hover"class="hjd_hover_1">&#21363&#21010&#21363&#26597</div></a><a href="javascript:void(0);"><div id="movesound"class="movesound_1">&#24748&#20572&#21457&#38899</div></a></div></div><div id="hjd_bottombar"><a id="hjdict_switch"class="dict_state_1">划词</a><a id="switchToSimple" class="hjd_tosimple" href="javascript:void(0);">精简版</a><span id="hjd_set_wrapper"><span id="hjd_set_topline"></span><a id="hjd_set">&#35774&#32622</a></span><a id="hjd_feedback"href="http://st.hujiang.com/cihui/c2505/"target="_blank"title="&#26377&#38382&#39064&#65292&#24744&#21487&#20197&#28857&#36825&#37324&#21453&#39304&#21734">&#38382&#39064&#21453&#39304</a></div></div><div id="hjd_scrollControl"></div>';
        //编码之前
        //var tmpl = '<div id="hjd_searchpnl"><div id="hjd_top"><span id="hjd_top_title">划词释义</span><a id="hjd_close_btn"href="javascript:void(0);"title="关闭悬浮框"><div class="hjd_btn_wrap_close"></div></a><a id="hjd_btn_frozen"href="javascript:void(0);"title="开启/关闭固定显示"><div id="hjd_btn_wrap_frozen"class="hjd_btn_wrap_frozen0"></div></a><div id="dictlang"class="hdj_cursor_def"><a id="hjd_chkLangEn"value="en"href="###">英</a><a id="hjd_chkLangJp"value="jp"href="###">日</a><a id="hjd_chkLangFr"value="fr"href="###">法</a><a id="hjd_chkLangKr"value="kr"href="###">韩</a></div><a id="hjlang"href="javascript:void(0);"><span id="shiftLan"><span id="shiftlang">英</span></span></a></div><div id="hjd_bodyframe"><input id="hjd_txtsearch"type="text" style="float:left;"><span id="hjd_btn_wrapper"><a id="hjd_btnEnSearch"style="display:block;">查词</a><span id="hjd_cj_wrapper"><a id="hjd_btnJCSearch"style="display:none;">日中</a><a id="hjd_btnCJSearch"style="display:none;">中日</a></span><a id="hjd_btnFrSearch"style="display:none;">查词</a><a id="hjd_btnKrSearch"style="display:none;">查词</a></span><div class="clear"></div><div id="hjd_imgloading"style="display:none;"><img src="http://dict.hujiang.com/images/loading2.gif">&nbsp;我正在努力查询,请稍等...</div><div id="hjd_txtresult"></div><div id="hjd_tipAlert"></div><div id="set_detail"style="display:none;"><a id="hjd_btn_tip"class="no_underline"href="javascript:void(0);"><div id="hjd_hover"class="hjd_hover_1">即划即查</div></a><a href="javascript:void(0);"><div id="movesound"class="movesound_1">悬停发音</div></a></div></div><div id="hjd_bottombar"><a id="hjd_feedback"href="http://www.hujiang.com/fankui/suggest/"target="_blank"title="有问题，您可以点这里反馈哦">问题反馈</a><span id="hjd_set_wrapper"><span id="hjd_set_topline"></span><a id="hjd_set">设置</a></span><a id="hjdict_switch"class="dict_state_1">已开启划词</a></div></div><div id="hjd_scrollControl"></div>';
        return tmpl;
    }

    function adjustInputSize() {
        var isJP = D.get("hjd_btnJCSearch").style.display != "none";
        var btnWidth = isJP ? 92 : 60, gap = 25;
        var input = D.get("hjd_txtsearch"), panel = D.get("hjd_panel"), panelWidth = panel.clientWidth || panel.offsetWidth;
        var w = Math.max(0, panelWidth - btnWidth - gap);
        input.style.width = w + "px";
    }

    function hjd_init() {

        if (D.get("hjdict_slide")) //如果有标签才执行用户上次的选择，否则默认是开启划词的
        {
            var getHuaciSetCookie = HJ.fun.getCookie("userHuaCiSet");
            if (getHuaciSetCookie == "false") {
                HJ.global.IsEnable = false;
            }
        }




        if (G.IsInit) { return; }
        G.IsInit = true;
        //获取Cookie是否显示tip
        var mode = HJ.fun.getCookie("hjd_mode") || "simple";
        var state = HJ.fun.getCookie("ShowState") || "tip";
        HJ.common.debug("ShowState:" + state);
        G.ShowState = state;
        G.mode = mode;
        G.hjd_hidetip = (state == "panel" || mode == "simple");
        var hjd_soundtype = HJ.fun.getCookie("hjd_soundtype");
        if (hjd_soundtype == false || hjd_soundtype == "false")
        { G.hjd_soundtype = false; }

        HJ.common.debug("hjd_soundtype:" + hjd_soundtype);

        HJ.common.debug("load:" + G.hjd_hidetip);

        var Html = getTemplate();

        try {
            //加载样式表
            var head = document.getElementsByTagName("head")[0];
            var objDynamic = document.createElement("link");
            objDynamic.rel = "stylesheet";
            objDynamic.type = "text/css";
            objDynamic.href = HJ.global.Domain + "/outapp/huaci/styleAjax3.css?0604";
            // objDynamic.href = "styleAjax3.css";
            head.appendChild(objDynamic);

            //生成主查询框
            var el = document.createElement('div');
            el.id = 'hjd_panel';
            el.style.position = 'absolute';
            el.style.display = 'none';
            el.style.zIndex = 900000001;
            el.style.fontSize = "12px";
            el.style.border = "solid 1px #A4BF3C";
            //el.style.backgroundColor = '#ECFBC2';
            el.style.width = hjd_width + 'px';
            el.style.height = hjd_height + 'px';
            el.style.left = '0px';
            el.style.top = '0px';
            //el.style.padding = '5px';


            //检查Cookie是否有划词框大小
            var awsize = HJ.fun.getCookie("hjd_wsize_2012");
            //内部查词结果框需要设置下默认高度
            var content_height = 302;
            if (awsize != "") {
                awsize = awsize.split("-");
                content_height = Number(awsize[1]);
                el.style.width = Number(awsize[0]) + "px";
                el.style.height = content_height + "px";
            }
            else {
                el.style.width = "382px";
                el.style.height = "302px";
            }

            document.body.appendChild(el);
            D.html(el, Html);

            //注册事件
            D.get("hjd_close_btn").onclick = function () {
                HJ.fun.hjd_hidewindow();
            };
            D.get("hjd_btn_frozen").onclick = function () {
                return HJ.fun.hjd_ShiftFrozen();
            };
            D.get("hjd_btn_tip").onclick = function () {
                return HJ.fun.hjd_TipSet();
            };
            D.get("hjdict_switch").onclick = function () {
                HJ.fun.ShiftDictEnable();
                return false;
            };
            //bugfix in IE6
            D.get("hjdict_switch").onmouseover = function (e) {
                D.get("hjdict_switch").style.color = "orange";
            };
            D.get("hjdict_switch").onmouseout = function (e) {
                D.get("hjdict_switch").style.color = "";
            };

            D.get("hjd_panel").onmouseover = function(e){
                D.get("hjdict_switch").style.display = "block";
                D.get("switchToSimple").style.display = "block";
            };

            D.get("hjd_panel").onmouseout = function(e){
                D.get("hjdict_switch").style.display = "none";
                D.get("switchToSimple").style.display = "none";
            };

            if (HJ.ua.isIE6) {
                D.get("hjd_hover").className = G.hjd_hidetip ? "hjd_hover_1" : "hjd_hover_2";
                D.get("movesound").className = G.hjd_soundtype ? "movesound_1" : "movesound_2";
                D.get("hjdict_switch").className = HJ.global.IsEnable ? "dict_state_1" : "dict_state_2";
                //D.get("switchToSimple").className = "hjd_hover_2";
            } else {
                D.get("hjd_hover").className = G.hjd_hidetip ? "hjd_hover_1 icon_enable2_png" : "hjd_hover_2 icon_disable2_png";
                D.get("movesound").className = G.hjd_soundtype ? "movesound_1 icon_enable2_png" : "movesound_2 icon_disable2_png";
                D.get("hjdict_switch").className = HJ.global.IsEnable ? "dict_state_1 icon_enable_png" : "dict_state_2 icon_disable_png";
                //D.get("switchToSimple").className = "hjd_hover_2 icon_disable2_png";
            }

            //设置查词结果框的高度
            D.get("hjd_txtresult").style.height = content_height - 102 + "px";

            //初始化推拽
            HJ.Drag.init("hjd_panel", { mxContainer: document.body, Handle: "hjd_top", Limit: true });
            //初始化缩放
            HJ.Resize.init("hjd_panel", {
                Max: true, maxWidth: 425, maxHeight: 600, mxContainer: document.body, Contenter: "hjd_txtresult", onStop: function () {
                    //记录划词框大小
                    HJ.fun.setCookie("hjd_wsize_2012", this._styleWidth + "-" + this._styleHeight, 9999999, "/");
                    HJ.common.debug("hjd_wsize:" + this._styleWidth + "-" + this._styleHeight);
                }, onResize: function (e) {
                    adjustInputSize();
                    //防止显示设置框
                    var detail = HJ.dom.get("set_detail");
                    if (detail != null && detail.style.display != "none") {
                        F.hide("set_detail");
                        F.hide("hjd_set_topline");
                        HJ.dom.removeClass("hjd_set_wrapper", "hjd_set_wrapper_hover");
                    }
                }
            });
            HJ.Resize.Set("hjd_scrollControl", "right-down");

            /** doesn't use at the moment
            el = document.createElement('div');
            el.id = 'hjd_statuspanel';
            if (document.documentElement.clientWidth) {
                el.style.position = 'fixed';
                el.style.left = '1px';
                el.style.top = '1px';
            } else {
                el.style.position = 'absolute';
                el.style.left = hjd_scrn_left() + 'px';
                el.style.top = hjd_scrn_top() + 'px';
            }
            el.style.backgroundColor = '#F1FCD6';
            el.style.padding = '2px';
            el.style.filter = 'Alpha(Opacity=96)';
            el.style.fontSize = '14px';
            el.style.display = 'block';
            el.style. = 9002;
            el.style.border = '1px solid #A2D911';

            document.body.appendChild(el);
            // D.html(el, _dictStatus());
			**/

            //TipToolbar
            el = document.createElement('div');
            el.id = 'hjd_tiptoolbar';
            el.style.position = 'absolute';
            //  el.style.backgroundColor = '#F1FCD6';
            el.style.padding = '10px 2px 2px 2px';
            //el.style.filter = 'Alpha(Opacity=96)';
            el.style.fontSize = '12px';
            //el.style.visibility = 'hidden';
            el.style.zIndex = 9000003;
            //el.style.border = '1px solid #A2D911';
            el.style.width = '82px';
            el.style.height = '18px';
            el.style.left = "-9999px";
            el.style.top = "-9999px";
            el.className = "hjd_title_ajax_tip";

            document.body.appendChild(el);

            //经过编码的原文字：点击显示词义解释;[可在选项中关闭迷你工具条]
            D.html(el, '<a id="dictBtn" title="点击显示词义解释;[可在选项中关闭迷你工具条]" href="javascript:void(0);">查词</a>|<a id="copyBtn" href="javascript:void(0);">复制</a>');

            // E.on('hjd_tiptoolbar', "mouseover", function(e){     
            //     HJ.dom.get("hjd_tiptoolbar").className = "hjd_title_ajax_tip_hover";
            // });
            // E.on('hjd_tiptoolbar', "mouseout", function(e){
            //     HJ.dom.get("hjd_tiptoolbar").className = "hjd_title_ajax_tip";       
            // });
            HJ.fun.initClipboard(39, 20);

            //Quick Search
            el = document.createElement('div');
            el.id = 'hjd_quicktoolbar';
            el.style.position = 'absolute';
            //  el.style.backgroundColor = '#F1FCD6';
            //el.style.padding = '2px';
            //el.style.filter = 'Alpha(Opacity=96)';
            el.style.fontSize = '12px';
            el.style.display = 'none';
            el.style.zIndex = 9000003;
            //el.style.border = '1px solid #A2D911';
            el.style.width = '300px';
            //el.style.height = '200px';

            document.body.appendChild(el);

            //单击查词按钮事件。
            E.on('dictBtn', 'click', function () {
                G.ShowState = "panel";
                F.ToolTipHide();
                F.DictShow();

                //
                try {
                    _gaq.push(['dt._trackEvent', 'tips', '工具条查词', '1']);
                } catch (e) { }

                return false;
                //F.setCookie("ShowState", G.hjd_hidetip ? "panel" : "tip", 99999999999, "/"); //设置迷你查词过期时间。
                //暂时注释
                //updateshowstate();
            });

            //暂时注释
            window.setTimeout(HJ.fun.AttachDictBH, 600);

        } catch (x) {
            // alert(x);
            hjd_window = true;
            return;
        }
        hjd_status = D.get("hjd_statuspanel");
        //hjd_iframe = D.get("hjd_dictFrame");
        hjd_window = D.get("hjd_panel");

        hjd_scrollControl = D.get("hjd_scrollControl");
        hjd_searchpnl = D.get("hjd_searchpnl");
        hjd_txtsearch = D.get("hjd_txtsearch");
        hjd_txtresult = D.get("hjd_txtresult");
        hjd_imgloading = D.get("hjd_imgloading");
        hjd_bodyframe = D.get("hjd_bodyframe");
        hjd_tiptoolbar = D.get("hjd_tiptoolbar");

        //-------------------------------------------------
        /*D.get("hjd_panel").onmousedown = function (ev) {
        mouseOffset = getMouseOffset(this, ev);
        if (ev == null || ev == "undefined") {
        return;
        }
        var clickElement = ev.target || ev.srcElement;
        if (clickElement != null) {
        if (clickElement.id == "hjd_txtsearch" || clickElement.id == "hjd_bodyframe" || clickElement.id == "hjd_txtresult" || clickElement.id == "hjd_imgloading" || clickElement.id == "hjd_tipAlert") {
        clickElement.focus();
        return true;
        }
        }
        return false;
        }*/
        E.on('hjd_txtsearch', 'keydown', function () {
            aevent = arguments[0];
            if (!aevent) {
                aevent = window.event;
            }
            if (aevent.keyCode == 13) {

                F.doSearch();
                return false;
            }
        });

        E.on("movesound", "click", function (e) {
            HJ.global.hjd_soundtype = !HJ.global.hjd_soundtype;
            if (HJ.ua.isIE6) {
                D.get("movesound").className = G.hjd_soundtype ? "movesound_1" : "movesound_2";
            } else {
                D.get("movesound").className = G.hjd_soundtype ? "movesound_1 icon_enable2_png" : "movesound_2 icon_disable2_png";
            }
            // switch (HJ.global.hjd_soundtype) {
            //     case true:                     
            //         HJ.dom.replace("movesound", "movesound_1", "movesound_2"); 
            //         HJ.global.hjd_soundtype = false; F.doSearch();
            //         //document.getElementById("movesound").innerHTML = "点击发音";
            //         break;
            //     case false: 
            //         HJ.dom.replace("movesound", "movesound_2", "movesound_1"); 
            //         HJ.global.hjd_soundtype = true; F.doSearch();
            //         //document.getElementById("movesound").innerHTML = "悬停发音";
            //         break;
            // };
            F.doSearch();
            HJ.fun.setCookie("hjd_soundtype", HJ.global.hjd_soundtype ? true : false, 99999999999, "/"); //设置发音方式  
            HJ.Counter.SetVoice();
        });

        E.on("switchToSimple", "click", function (e) {
            F.hide("set_detail");
            F.hide("hjd_set_topline");
            F.changeMode("simple");
            //var pos = D.getPositionOffset(D.get("hjd_panel"));
            F.DictHide();
            SimpleMode.show();
            SimpleMode.showTitle();
            G.OldSearchWord = "";
            F.doSearch();
            //SimpleMode.showContent();
            return false;
        });


        //顶部radio事件绑定
        //暂时注释
        E.on("hjd_chkLangEn", "click", function (e) {
            if (F.getLanguage() != "en")
            { F.doEnSearch(); }
            F.hide("dictlang");
            D.html("shiftlang", "&#33521");//经过编码的原文字：英
            //ga事件
            HJ.Counter.SetLangs();

        });
        E.on("hjd_chkLangJp", "click", function () {
            if (F.getLanguage() != "jc" && F.getLanguage() != "cj")
            { F.doJcSearch(); }
            F.hide("dictlang");
            D.html("shiftlang", "&#26085"); //经过编码的原文字：日
            //ga事件
            HJ.Counter.SetLangs();
        });
        E.on("hjd_chkLangFr", "click", function () {
            F.hide("dictlang");
            D.html("shiftlang", "&#27861"); //经过编码的原文字：法
            if (F.getLanguage() != "fr")
            { F.doFrSearch(); }
            //ga事件
            HJ.Counter.SetLangs();
        });
        E.on("hjd_chkLangKr", "click", function () {
            F.hide("dictlang");
            D.html("shiftlang", "&#38889");//经过编码的原文字：韩
            if (F.getLanguage() != "kr")
            { F.doKrSearch(); }
            //ga事件
            HJ.Counter.SetLangs();
        });
        E.on("hjd_chkLangDe", "click", function () {
            F.hide("dictlang");
            D.html("shiftlang", "&#24503");//经过编码的原文字：德
            if (F.getLanguage() != "de")
            { F.doDeSearch(); }
            //ga事件
            HJ.Counter.SetLangs();
        });
        E.on("hjd_chkLangEs", "click", function () {
            F.hide("dictlang");
            D.html("shiftlang", "&#35199");//经过编码的原文字：西
            if (F.getLanguage() != "es")
            { F.doEsSearch(); }
            //ga事件
            HJ.Counter.SetLangs();
        });

        var canHide = true;
        var hideTimeout = null;

        if (D.get("hjdict_slide") != null) {
            E.on("hjdict_slide", "mouseover", function () {
                document.getElementById("hjdict_slide").style.textDecoration = "none";
            });
            E.on("hjdict_slide", "mouseout", function () {
                document.getElementById("hjdict_slide").style.textDecoration = "none";
            });
        }

        E.on("hjd_set_wrapper", "mouseover", function () {
            clearTimeout(HJ.global.LangClearTimeout);
            HJ.global.LangClearTimeout = setTimeout(function () {
                F.show("set_detail");
                HJ.dom.addClass("hjd_set_wrapper", "hjd_set_wrapper_hover");
            }, 300);
        });
        E.on("hjd_set_wrapper", "mouseout", function () {
            clearTimeout(HJ.global.LangClearTimeout);
            HJ.global.LangClearTimeout = setTimeout(function () {
                F.hide("set_detail");
                F.hide("hjd_set_topline");
                HJ.dom.removeClass("hjd_set_wrapper", "hjd_set_wrapper_hover");
            }, 100);
        });
        document.getElementById("set_detail").onmouseover = function () {
            clearTimeout(HJ.global.LangClearTimeout);
            F.show("set_detail");
            HJ.dom.addClass("hjd_set_wrapper", "hjd_set_wrapper_hover");
        };

        document.getElementById("set_detail").onmouseout = function () {
            HJ.global.LangClearTimeout = setTimeout(function () {
                F.hide("set_detail");
                F.hide("hjd_set_topline");
                HJ.dom.removeClass("hjd_set_wrapper", "hjd_set_wrapper_hover");
            }, 100);
        };


        //切换网页划词语种。
        E.on("hjlang", "mouseover", function () {
            clearTimeout(HJ.global.LangClearTimeout);
            HJ.global.LangClearTimeout = setTimeout(function () {
                F.show("dictlang");
            }, 300);
        });
        E.on("hjlang", "mouseout", function () {
            clearTimeout(HJ.global.LangClearTimeout);
            HJ.global.LangClearTimeout = setTimeout(function () {
                F.hide("dictlang");
            }, 200);
        });

        E.on("dictlang", "mouseover", function () {
            clearTimeout(HJ.global.LangClearTimeout);
            F.show("dictlang");
        });

        E.on("dictlang", "mouseout", function () {
            G.LangClearTimeout = setTimeout(function () {
                F.hide("dictlang");
            }, 200);
        });

        //获取选择的文字
        E.on(document.body, "mouseup", function (e) {
            var obj = HJ.global.SelectItem;
            if (obj != null && (obj.tagName == "INPUT" || obj.tagName == "IMG" || D.contains("hjd_clipboard_container", obj) || D.contains("copyBtn", obj))) {
                return;
            }
            F.DictSelection(e)
        });

        E.on(document.body, "mousedown", function (e) {
            var target = HJ.event.getTargetSrc();
            HJ.global.SelectItem = target;
            HJ.common.debug("mousedown-src:" + target.tagName);
            var isSelfSearch = (D.contains("hjd_panel", target) || D.contains("hjd_quicktoolbar", target) || D.contains("hjd_tiptoolbar", target) || D.contains("hjd_simple", target));
            //如果已经固定，不做其他处理
            if (HJ.global.IsFix) { return; }
            if (!isSelfSearch) {
                F.DictHide();
                F.ToolTipHide();
                F.QuickTipHide();
                if (G.mode == "simple") SimpleMode.hide();
            }
        });





        E.on("dictlang", "click", function (e) {
            if (!e) { return; }
            var eventsource = e.target || e.srcElement;
            if (eventsource.tagName == "A") {
                F.hide("dictlang");
            }
            HJ.event.stopPropagation(e);
        });

        //暂时注释
        if (G.HasBindEvent == false) {
            G.HasBindEvent = true;
            E.on("hjd_btnEnSearch", "click", F.doEnSearch);
            E.on("hjd_btnJCSearch", "click", F.doJcSearch);
            E.on("hjd_btnCJSearch", "click", F.doCjSearch);
            E.on("hjd_btnFrSearch", "click", F.doFrSearch);
            E.on("hjd_btnKrSearch", "click", F.doKrSearch);
            E.on("hjd_btnDeSearch", "click", F.doDeSearch);
            E.on("hjd_btnEsSearch", "click", F.doEsSearch);

            /*E.on("hjd_btnEnSearch", "mouseover", function () { document.getElementById("hjd_btnEnSearch").style.cursor = "pointer"; });
            E.on("hjd_btnJCSearch", "mouseover", function () { document.getElementById("hjd_btnJCSearch").style.cursor = "pointer"; });
            E.on("hjd_btnCJSearch", "mouseover", function () { document.getElementById("hjd_btnCJSearch").style.cursor = "pointer"; });
            E.on("hjd_btnFrSearch", "mouseover", function () { document.getElementById("hjd_btnFrSearch").style.cursor = "pointer"; });
            E.on("hjd_btnKrSearch", "mouseover", function () { document.getElementById("hjd_btnKrSearch").style.cursor = "pointer"; });
            */
        }
        F.changeLanguage(F.getLanguage());

        //判断是不是本站已经存在划词工具条
        if (F.isUsedHJToolbar()) {
            //hjd_status.style.display = "none";
            F.InitHJToolbar("hjdict_power");
            F.InitHJToolbar("hjdict_slide");
        }

        if (typeof (hjd_onShiftDictEnable) != "undefined") {
            //如果存在hjd_onShiftDictEnable方法，则调用
            hjd_onShiftDictEnable(HJ.global.IsEnable);
        }

        //暂时注释
        /*hjd_scrollControl.onmousedown = function (hjd_event) {

        if (document.addEventListener) {
        document.addEventListener('mousemove', _scrollControl, false);
        document.addEventListener('selectstart', revfalse, false);

        }
        else if (document.attachEvent) {
        document.attachEvent('onmousemove', _scrollControl);
        document.attachEvent('onselectstart', revfalse);
        }
        }




        //----------------------------------------------
        if (document.addEventListener) {
        document.addEventListener("mousemove", _mouseMove, false);
        document.addEventListener("mousedown", _mouseDown, false);
        document.addEventListener("mouseup", _mouseUp, false);
        document.addEventListener("mouseup", _dictQuery, false);
        document.addEventListener("mouseup", _clearScrollControl, false);
        document.addEventListener("dblclick", _dictQuery, true);

        window.addEventListener("scroll", _scroll, false);
        } else if (document.attachEvent) {
        document.attachEvent("onmousemove", _mouseMove);
        document.attachEvent("onmousedown", _mouseDown);
        document.attachEvent("onmouseup", _mouseUp);
        document.attachEvent("onmouseup", _dictQuery);
        document.attachEvent("onmouseup", _clearScrollControl);
        document.attachEvent("ondblclick", _dictQuery);

        window.attachEvent("onscroll", _scroll);
        }

        //
        hjd_dictInited = true;
        if (typeof (hjd_onShiftDictEnable) != "undefined") {
        hjd_onShiftDictEnable(_dict_enable);
        }


        hjd_bodyframe.style.height = hjd_height - 3 + 23 + 'px';
        //判断是不是本站已经存在划词工具条
        if (isUsedHJToolbar()) {
        hjd_status.style.display = "none";
        InitHJToolbar("hjdict_power");
        InitHJToolbar("hjdict_slide");
        }

        noSelect(hj$("hjd_top"));
        noSelect(hj$("hjd_scrollControl"));*/
    }
    /*
    //
    if (typeof (hjd_dictInited) == "undefined") {
    var E = HJ.event, D = HJ.dom, A = HJ.ajax, G = HJ.global, F = HJ.fun;
    var hjd_old_word = "";
    var hjd_old_sentence = "";
    var _dict_enable = true;
    var hjd_status;
    //var hjd_iframe = 0;
    var hjd_window = 0;
    var hjd_SentenceWindow = 0;
    var hjd_host = HJ.global.Domain;
    var hjd_help = HJ.global.Domain;
    // 
    var hjd_x = 0;
    var hjd_y = 25;
    var _hjd_x = 0;
    var _hjd_y = 25;
    var hjd_width = 282;
    var hjd_height = 220;
    var hjd_m_offx = 0;
    var hjd_m_offy = 0;
    var hjd_clientW = 0;
    var hjd_clientH = 0;
    var hjd_mouseloc = 0;
    var msgpanelTime = 0;
    var hjd_frozen = false;
    var hjd_maxused = false;
    var hjd_dictInited = false;
    var hjd_isFullScreen = false;
    var hjd_hidetip = true;
    var hjd_lastmsgTitle = "";
    var hjd_offsetX = 0;
    var hjd_offsetY = 0;
    var hjd_framebodyDuce = (is_moz != false) ? 3 : 25;
    var hjd_scrollControl, hjd_searchpnl;
    var hjd_txtsearch, hjd_btnsearch, hjd_txtresult, hjd_imgloading, hjd_bodyframe, hjd_tiptoolbar;
    var hjd_scriptid = "hjd" + Math.random;
    var hjd_ChromeTempEvent;
    var hjd_blnisLoadCount = false;
    var hjd_minwidth = 382; //最小宽度
    var hjd_minheight = 250; //最小高度
    var hjd_isStopMove = false; //禁止移动框
    var mouseOffset = {};
    var soundType = true; //发音方式，true为悬停发音，false 为单击发音。



    function UpdateWinSizeInfo() {
    try {
    if (document.documentElement.clientWidth) {
    hjd_clientW = document.documentElement.clientWidth;
    hjd_clientH = document.documentElement.clientHeight;
    } else {
    hjd_clientW = document.body.clientWidth;
    hjd_clientH = document.body.clientHeight;
    }
    } catch (e) {
    }
    }
    UpdateWinSizeInfo();

    function RecordSetting() {

    HJ.fun.setCookie("hjd_initable", _dict_enable ? "on" : "off", 9999999, "/");
    }

    var awsize = HJ.fun.getCookie("hjd_wsize");
    if (awsize != "") {
    awsize = awsize.split("-");
    hjd_width = Number(awsize[0]);
    hjd_height = Number(awsize[1]);
    }
    function hj$(aObjID) {
    return document.getElementById(aObjID);
    }
    function hjd_ShiftSize(aObjid, awidth, aheight, remainfullscreen) {
    if (awidth == 0 || aheight == 0) {
    if (hjd_isFullScreen && !remainfullscreen) {
    hjd_isFullScreen = false;
    //
    awidth = hjd_width;
    aheight = hjd_height;
    hj$(aObjid).style.top = hjd_y + "px";
    hj$(aObjid).style.left = hjd_x + "px";
    } else {
    hj$(aObjid).style.top = hjd_scrn_top() + 5 + "px";
    hj$(aObjid).style.left = hjd_scrn_left() + 5 + "px";
    UpdateWinSizeInfo();
    awidth = hjd_clientW - 25;
    aheight = 550;
    //hj$("hjd_img_full").src = hjd_host + "/images/btn_wrap_full1.gif";
    hjd_isFullScreen = true;
    }
    } else {
    hjd_width = awidth;
    hjd_height = aheight;
    hjd_isFullScreen = false;
    hj$(aObjid).style.top = hjd_y + "px";
    hj$(aObjid).style.left = hjd_x + "px";
    HJ.fun.setCookie("hjd_wsize", awidth + "-" + aheight, 9999999, "/");
    }
    hj$("hjd_img_1x").style.display = (awidth == 350) ? "none" : "inline";
    hj$("hjd_img_2x").style.display = (awidth == 400) ? "none" : "inline";

    hj$(aObjid).style.width = awidth + "px";
    hj$(aObjid).style.height = aheight + "px";

    if (!hjd_isFullScreen) {
    //
    UpdateDocks();
    }
    _mouseUp();
    return false;
    }
    function hjd_moveWin(ev, xxx, yyy) {
    if (HJ.dom.contains(hjd_bodyframe, E.getTarget(E.getEvent())))
    return;
    var mousePos = 0;
    if (ev == null) {
    hjd_x = xxx;
    hjd_y = yyy;
    } else {
    mousePos = mouseCoords(ev);
    hjd_x = mousePos.x - hjd_m_offx;
    hjd_y = mousePos.y - hjd_m_offy;
    }
    if (hjd_mouseloc != 0) {
    var willDock = false;
    if (hjd_x < hjd_scrn_left() + 10) {
    willDock = true;
    hjd_x = hjd_scrn_left();

    } else if (Math.abs(hjd_x - (hjd_scrn_left() + hjd_clientW - hjd_width - 12)) < 10) {
    willDock = true;
    hjd_x = hjd_scrn_left() + hjd_clientW - hjd_width - 12;

    } else {
    }
    if (hjd_y < hjd_scrn_top() + 10) {
    willDock = true;
    hjd_y = hjd_scrn_top();

    } else if (Math.abs((hjd_scrn_top() + hjd_clientH - hjd_height - 36) - hjd_y) < 10) {
    willDock = true;
    hjd_y = hjd_scrn_top() + hjd_clientH - hjd_height - 36;

    } else {
    }
    if (willDock || hjd_frozen) {
    hjd_ShiftFrozen(true);
    }
    }
    //迷你位置


    hj$('hjd_panel').style.left = Math.max(0, Math.min(hjd_x, hjd_clientW)) + 6 + "px";


    hj$('hjd_panel').style.top = Math.max(0, hjd_y) + 8 + "px";



    //set tip tool bar postion 控制查词按钮位置
    hj$('hjd_tiptoolbar').style.left = Math.max(0, Math.min(_hjd_x, hjd_scrn_left() + hjd_clientW)) + 3 + "px";
    hj$('hjd_tiptoolbar').style.top = Math.max(0, Math.min(_hjd_y, hjd_scrn_top() + hjd_clientH)) + 5 + "px";



    }
    function hjd_ResetWindowLoc() {
    if (hjd_x > hjd_scrn_left() + hjd_clientW - hjd_width) {
    hjd_x = hjd_x - hjd_width - 25;
    hj$('hjd_panel').style.left = hjd_x + "px";
    hj$('hjd_tiptoolbar').style.left = _hjd_x + "px";
    }
    if (hjd_y > hjd_scrn_top() + hjd_clientH - hjd_height) {
    hjd_y = hjd_y - hjd_height - 25;
    hj$('hjd_panel').style.top = hjd_y + "px";
    hj$('hjd_tiptoolbar').style.top = _hjd_y + "px";
    }
    }
    //
    function hjd_hidewindow() {
    var divlist = document.getElementsByTagName("DIV");
    for (var i = 0; i < divlist.length; i++) {
    if (divlist[i].className == "dict_state_2") {
    divlist[i].className = "dict_state_1";
    divlist[i].innerHTML = "已开启划词";
    }
    else {
    continue;
    }
    }
    hjd_ShiftFrozen(false);
    hj$('hjd_panel').style.display = "none";
    if (hjd_isFullScreen) {
    hjd_ShiftSize('hjd_panel', 0, 0);
    }
    hjd_old_word = "";
    }
    HJ.fun.hjd_hidewindow = hjd_hidewindow;
    function hjd_stopMove() {
    hjd_isStopMove = true;
    }
    HJ.fun.stopMove = hjd_stopMove;
    function hjd_showwindow() {
    hj$('hjd_panel').style.display = "block";
    }
    function hjd_scrn_top() {
    if (document.documentElement && document.documentElement.scrollTop) {
    return document.documentElement.scrollTop;
    } else if (document.body) {
    return document.body.scrollTop;
    }
    }
    function hjd_scrn_left() {
    if (document.documentElement && document.documentElement.scrollLeft) {
    return document.documentElement.scrollLeft;
    } else if (document.body) {
    return document.body.scrollLeft;
    }
    }
    function _mouseDown(ev) {
    ev = ev || window.event;
    var eventtarget = 0;
    if (is_ie) {
    eventtarget = ev.srcElement;
    }
    else {
    eventtarget = ev.target;
    }
    var lang = HJ.fun.getCookie("hjd_ajax_Language2011"); //读取上次语种选择cookie
    switch (lang) {
    case "en": document.getElementById("shiftlang").innerHTML = "英"; break;
    case "jc": document.getElementById("shiftlang").innerHTML = "日"; break;
    case "cj": document.getElementById("shiftlang").innerHTML = "日"; break;
    case "fr": document.getElementById("shiftlang").innerHTML = "法"; break;
    case "kr": document.getElementById("shiftlang").innerHTML = "韩"; break;
    default: break;
    }

    if (hjd_isFullScreen == true || hjd_isStopMove == true) { return; }
    try {
    if (eventtarget.getAttribute("id") == "hjd_top") {
    hjd_mouseloc = mouseCoords(ev);
    hjd_m_offx = hjd_mouseloc.x - hjd_x;
    hjd_m_offy = hjd_mouseloc.y - hjd_y;
    UpdateWinSizeInfo();
    } else {
    hjd_m_offx = 0;
    hjd_m_offy = 0;
    hjd_UpdatePosCache(ev);
    var amouseloc = mouseCoords(ev);

    if (HJ.dom.contains(hjd_window, E.getTarget(E.getEvent())))
    { return; }
    else if (HJ.dom.contains(hjd_tiptoolbar, E.getTarget(E.getEvent())) || hjd_tiptoolbar == E.getTarget(E.getEvent()))
    { return; }
    else
    { hjd_dictClose(); hide(hjd_tiptoolbar); }
    return;
    }
    } catch (e) {

    }
    }
    //
    function HjdWindowClicked(srcElement) {
    try {
    var q = 0;
    while (q < 5) {
    q++;
    if (srcElement.tagName.toLowerCase() == "a" && srcElement.tagName.toLowerCase() == "img") {
    return false;
    }
    if (srcElement.tagName.toLowerCase() == "div" && srcElement.getAttribute("id") == "hjd_top") {
    return true;
    } else {
    srcElement = srcElement.parentNode;
    }
    }
    return false;
    } catch (e) {
    return false;
    }
    }
    function _mouseUp(ev) {
    hjd_mouseloc = 0;
    }

    function getMouseOffset(target, ev) {
    ev = ev || window.event;

    var docPos = getPosition(target);
    var mousePos = mouseCoords(ev);
    return { x: mousePos.x - docPos.x, y: mousePos.y - docPos.y };
    }
    function getPosition(e) {
    var left = 0;
    var top = 0;
    while (e.offsetParent) {
    left += e.offsetLeft + (e.currentStyle ? (parseInt(e.currentStyle.borderLeftWidth)).NaN0() : 0);
    top += e.offsetTop + (e.currentStyle ? (parseInt(e.currentStyle.borderTopWidth)).NaN0() : 0);
    e = e.offsetParent;
    }

    left += e.offsetLeft + (e.currentStyle ? (parseInt(e.currentStyle.borderLeftWidth)).NaN0() : 0);
    top += e.offsetTop + (e.currentStyle ? (parseInt(e.currentStyle.borderTopWidth)).NaN0() : 0);

    return { x: left, y: top };

    }
    function _mouseMove(ev) {
    ev = ev || window.event;
    if (hjd_isFullScreen == true || hjd_isStopMove == true) { return; }

    if (hjd_mouseloc != 0) {
    hjd_moveWin(ev);
    return false;
    } else {
    var mousePos = mouseCoords(ev);
    _hjd_x = mousePos.x;
    _hjd_y = mousePos.y;
    }
    }
    function _resize() {
    if (hjd_isFullScreen) {
    hjd_ShiftSize('hjd_panel', 0, 0, true);
    } else {

    _scroll();
    }
    }
    function _scroll() {
    UpdateWinSizeInfo();
    if (hjd_status != 0) {
    if (!document.documentElement.clientWidth) {
    if (hjd_status.style.display == "block") {
    hjd_status.style.left = hjd_scrn_left() + "px";
    hjd_status.style.top = hjd_scrn_top() + "px";
    }
    }
    }
    if (!hjd_isFullScreen) {
    UpdateDocks();
    } else {
    hjd_ShiftSize('hjd_panel', 0, 0, true);
    }
    }
    function UpdateDocks() {
    //
    if (hjd_frozen) {

    hjd_moveWin(null, hjd_scrn_left() + hjd_offsetX, hjd_scrn_top() + hjd_offsetY);
    }
    }
    function hjd_TipSet() {

    hjd_hidetip = !hjd_hidetip;



    if (hjd_hidetip) {
    HJ.dom.replace(HJ.dom.get("hjd_hover"), "hjd_hover_1", "hjd_hover_2");

    }
    else {
    HJ.dom.replace(HJ.dom.get("hjd_hover"), "hjd_hover_2", "hjd_hover_1");

    }


    HJ.fun.setCookie("ShowState", hjd_hidetip ? "panel" : "tip", 99999999999, "/"); //设置迷你查词过期时间。

    }
    HJ.fun.hjd_TipSet = hjd_TipSet;
    function hjd_ShiftFrozen(aBool) {
    if (aBool != null) {
    hjd_frozen = aBool;
    } else {
    hjd_frozen = !hjd_frozen;
    }
    if (hjd_frozen) {
    HJ.dom.replace(HJ.dom.get("hjd_btn_wrap_frozen"), "hjd_btn_wrap_frozen0", "hjd_btn_wrap_frozen1");
    }
    else {
    HJ.dom.replace(HJ.dom.get("hjd_btn_wrap_frozen"), "hjd_btn_wrap_frozen1", "hjd_btn_wrap_frozen0");
    }

    if (hjd_frozen) {
    hjd_offsetX = hjd_x - hjd_scrn_left();
    hjd_offsetY = hjd_y - hjd_scrn_top();
    } else {
    hjd_offsetX = 0;
    hjd_offsetY = 0;
    }
    return false;
    }
    HJ.fun.hjd_ShiftFrozen = hjd_ShiftFrozen;
    function mouseCoords(ev) {
    if (ev.pageX || ev.pageY) {
    return { x: ev.pageX, y: ev.pageY };
    }
    var yy = 0;
    if (document.body.scrollTop == hjd_scrn_top()) {
    return {
    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
    y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
    } else {
    return {
    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
    y: ev.clientY + document.body.scrollTop - document.body.clientTop + hjd_scrn_top()
    };
    }
    }
    function _clearScrollControl() {
    if (document.removeEventListener) {
    document.removeEventListener('mousemove', _scrollControl, false);
    document.removeEventListener('selectstart', revfalse, false);
    }
    else
    if (document.detachEvent) {
    document.detachEvent('onmousemove', _scrollControl);
    document.detachEvent('onselectstart', revfalse);
    }

    }

    function noSelect(target) {
    if (typeof target.onselectstart != "undefined") //for IE ,Chrome
    {
    target.onselectstart = function () {
    return false;
    }
    }
    else
    if (typeof target.style.MozUserSelect != "undefined") //for Firefox
    { target.style.MozUserSelect = "none"; }


    }
    function _scrollControl(hjd_event) {
    // get scrollTop
    var h = hj$("hjd_top").clientHeight;
    var st = document.body.scrollTop;
    st = st == 0 ? document.documentElement.scrollTop : st;
    var width = hjd_event.clientX - hjd_window.offsetLeft;
    width = width > hjd_minwidth ? width : hjd_minwidth; //235
    var cHeight = hjd_window.offsetHeight;
    //
    var height = hjd_event.clientY - hjd_window.offsetTop + st;
    height = (height - h) > hjd_minheight ? (height - h) : hjd_minheight;

    //宽度设置
    hj$("hjd_panel").style.width = width - 10 + 10 + 'px';
    hj$("hjd_bodyframe").style.width = width - 16 + 'px';
    hjd_width = width - 10;
    //高度设置
    hj$("hjd_panel").style.height = height - 1 + 30 + 2 + 'px';
    hj$("hjd_bodyframe").style.height = height - 7 - h + 'px';
    hjd_height = height + 16;

    HJ.fun.setCookie("hjd_wsize", hjd_width + "-" + hjd_height, 9999999, "/", "hjenglish.com");
    }
    //
    function revfalse() {
    return false;
    }

    function hjd_init() {
    if (G.IsInit) { return; }
    G.IsInit = true;
    //获取Cookie是否显示tip

    hjd_hidetip = (HJ.fun.getCookie("ShowState") == "panel");
    var Html = "";
    Html += "<div id='hjd_searchpnl' ><div id='hjd_top'>";
    Html += "		<a href='javascript:HJ.fun.hjd_hidewindow();' title='关闭悬浮框'><div class='hjd_btn_wrap_close'></div></a>";
    Html += "		<a href='javascript:void(0);' id='hjd_btn_frozen' onclick='return HJ.fun.hjd_ShiftFrozen();' title='开启/关闭固定显示'><div id='hjd_btn_wrap_frozen' class='hjd_btn_wrap_frozen0'></div></a>";
    Html += "<div id ='dictlang' class='hdj_cursor_def'";
    Html += " style ='border:1px solid #D7D7D7;background-color:#F6F4F5;display:none;text-align:center;position:absolute;top:27px; right:20px; width:60px;z-index:7777; height:80px; background-color:#F6F4F5'";
    Html += "><a  id='hjd_chkLangEn'  value='en' style ='text-decoration:none;' href='###' />英<-->中<br/>";
    Html += "<a  id='hjd_chkLangJp' value='jp' style ='text-decoration:none;' href='###'/>日<-->中</a><br/>";
    Html += "<a  id='hjd_chkLangFr' value='fr' style ='text-decoration:none;' href='###' />法<-->中</a><br/>";
    Html += "<a  id='hjd_chkLangKr' value='kr' style ='text-decoration:none;' href='###' />韩<-->中</a></div></div>";
    Html += "<div id='hjd_bodyframe' >";
    Html += "<input id='hjd_txtsearch' type='text'"
    if (HJ.ua.isChrome)
    { Html += " style='position:relative;top:13px;' "; }
    else if (HJ.ua.isGecko || HJ.ua.isOpera)
    { Html += " style='position:relative;top:1px;' "; }
    else if (HJ.ua.isIE) {
    Html += " style='position:relative;top:-3px;' ";
    }
    else {
    Html += " style='position:relative;";
    }
    Html += "/><a href='#'  id ='hjlang' ";


    Html += "style ='background-color:#ECFBC2;text-decoration:none;z-index:8888;position:absolute;top:4px;right:50px;'";

    Html += "><span style='margin:5px; color:#676767;' id ='shiftLan'><span id='shiftlang'></span><span id ='shiftdictlang'></span></span></a>";


    Html += "<input id='hjd_btnEnSearch' type='button' value='' /><input id='hjd_btnJCSearch' type='button' value='' style='display:none;position:relative;left:10px;'/><input id='hjd_btnCJSearch' type='button' value='' style='display:none;position:relative;left:10px;'/><input id='hjd_btnFrSearch' type='button' value='' style='display:none'/><input id='hjd_btnKrSearch' type='button' value='' style='display:none'/>";

    Html += "<div id='hjd_imgloading' style='display:none;'><img src='" + hjd_host + "/images/loading2.gif'/>&nbsp;我正在努力查询,请稍等...</div><div id='hjd_txtresult' ></div><div id='hjd_tipAlert'></div>";
    Html += "<div id='set_detail'><a href='javascript:void(0);' id='hjd_btn_tip' style='text-decoration:none;' onclick='return HJ.fun.hjd_TipSet();' ><div id='hjd_hover' class='hjd_hover_" + (hjd_hidetip ? "2" : "1") + "'>即划即查</div></a>";
    Html += "<div id ='movesound' class='movesound_1'>悬停发音</div>";
    Html += "</div>";
    Html += "</div>";
    //测试手动调整按钮暂时去掉
    Html += "<div style='background-color:#ECFCC2;margin-bottom:0px;height:26px;'><span id='sysset' style='position:absolute;text-decoration:none;bottom:5px;color:#65A122;cursor:pointer;'>设置</span></span><div  id='hjdict_slide' onclick='ShiftDictEnable();return false;' class='dict_state_1'>已开启划词</div></div>";
    Html += "</div>";
    Html += "<div id='hjd_scrollControl' ></div>";

    try {
    var head = document.getElementsByTagName("head")[0];
    var objDynamic = document.createElement("link");
    objDynamic.rel = "stylesheet";
    objDynamic.type = "text/css";
    objDynamic.href = "http://dict.hujiang.com/common/styleAjax.css";
    head.appendChild(objDynamic);

    var el = document.createElement('div');
    el.id = 'hjd_panel';
    el.style.position = 'absolute';
    el.style.display = 'none';
    el.style.zIndex = 9001;
    el.style.fontSize = "12px";
    el.style.border = "solid 1px #A4BF3C";
    el.style.backgroundColor = '#ECFBC2';
    el.style.width = hjd_width + 'px';
    el.style.height = hjd_height + 'px';
    el.style.left = '0px';
    el.style.top = '0px';
    el.style.padding = '5px';
    el.style.width = "382px";
    el.style.height = "302px";


    document.body.appendChild(el);
    _dictSet(el, Html);


    el = document.createElement('div');
    el.id = 'hjd_statuspanel';
    if (document.documentElement.clientWidth) {
    el.style.position = 'fixed';
    el.style.left = '1px';
    el.style.top = '1px';
    } else {
    el.style.position = 'absolute';
    el.style.left = hjd_scrn_left() + 'px';
    el.style.top = hjd_scrn_top() + 'px';
    }
    el.style.backgroundColor = '#F1FCD6';
    el.style.padding = '2px';
    el.style.filter = 'Alpha(Opacity=96)';
    el.style.fontSize = '14px';
    el.style.display = 'block';
    el.style.zIndex = 9002;
    el.style.border = '1px solid #A2D911';

    document.body.appendChild(el);
    _dictSet(el, _dictStatus());

    //TipToolbar
    el = document.createElement('div');
    el.id = 'hjd_tiptoolbar';
    el.style.position = 'absolute';
    //  el.style.backgroundColor = '#F1FCD6';
    el.style.padding = '2px';
    el.style.filter = 'Alpha(Opacity=96)';
    el.style.fontSize = '14px';
    el.style.display = 'none';
    el.style.zIndex = 9003;
    //el.style.border = '1px solid #A2D911';
    el.style.width = '60px';
    el.style.height = '26px';

    document.body.appendChild(el);

    _dictSet(el, "<a href='javascript:void(0);'><div class='hjd_title_ajax_tip' title='&#28857&#20987&#26174&#31034&#35789&#20041&#35299&#37322&#59&#91&#21487&#22312&#36873&#39033&#20013&#20851&#38381&#36855&#20320&#24037&#20855&#26465&#93'></div></a>");

    //单击查词按钮事件。
    E.on('hjd_tiptoolbar', 'click', function () {
    G.ShowState = "panel";
    updateshowstate();
    });

    window.setTimeout(AttachDictBH, 600);

    } catch (x) {
    hjd_window = true;
    return;
    }
    hjd_status = hj$("hjd_statuspanel");
    //hjd_iframe = hj$("hjd_dictFrame");
    hjd_window = hj$("hjd_panel");

    hjd_scrollControl = hj$("hjd_scrollControl");
    hjd_searchpnl = hj$("hjd_searchpnl");
    hjd_txtsearch = hj$("hjd_txtsearch");
    hjd_txtresult = hj$("hjd_txtresult");
    hjd_imgloading = hj$("hjd_imgloading");
    hjd_bodyframe = hj$("hjd_bodyframe");
    hjd_tiptoolbar = hj$("hjd_tiptoolbar");

    //-------------------------------------------------
    hj$("hjd_panel").onmousedown = function (ev) {
    mouseOffset = getMouseOffset(this, ev);
    if (ev == null || ev == "undefined") {
    return;
    }
    var clickElement = ev.target || ev.srcElement;
    if (clickElement != null) {
    if (clickElement.id == "hjd_txtsearch" || clickElement.id == "hjd_bodyframe" || clickElement.id == "hjd_txtresult" || clickElement.id == "hjd_imgloading" || clickElement.id == "hjd_tipAlert") {
    clickElement.focus();
    return true;
    }
    }
    return false;
    }
    E.on('hjd_txtsearch', 'keydown', function () {
    aevent = arguments[0];
    if (!aevent) {
    aevent = window.event;
    }
    if (aevent.keyCode == 13) {

    doSearch();
    return false;
    }
    });



    E.on("movesound", "click", function (e) {
    switch (soundType) {
    case true: HJ.dom.replace("movesound", "movesound_1", "movesound_2"); soundType = false; doSearch();
    document.getElementById("movesound").innerHTML = "点击发音";
    break;
    case false: HJ.dom.replace("movesound", "movesound_2", "movesound_1"); soundType = true; doSearch();
    document.getElementById("movesound").innerHTML = "悬停发音";
    break;
    };

    });

    //顶部radio事件绑定
    E.on("hjd_chkLangEn", "click", function (e) {
    if (F.getLanguage() != "en") { doEnSearch(); }
    document.getElementById("dictlang").style.display = "none";
    document.getElementById("dictlang").style.width = "60px";
    document.getElementById("shiftlang").innerHTML = "英";
    });
    E.on("hjd_chkLangJp", "click", function () {
    if (F.getLanguage() != "jc" && F.getLanguage() != "cj") { doJcSearch(); }
    document.getElementById("dictlang").style.display = "none";
    document.getElementById("dictlang").style.width = "60px";
    document.getElementById("shiftlang").innerHTML = "日";
    });
    E.on("hjd_chkLangFr", "click", function () {
    document.getElementById("dictlang").style.display = "none";
    document.getElementById("shiftlang").innerHTML = "法";
    document.getElementById("dictlang").style.width = "60px";
    if (F.getLanguage() != "fr") { doFrSearch(); }
    });
    E.on("hjd_chkLangKr", "click", function () {
    document.getElementById("dictlang").style.display = "none";
    document.getElementById("shiftlang").innerHTML = "韩";
    document.getElementById("dictlang").style.width = "60px";
    if (F.getLanguage() != "kr") { doKrSearch(); }
    });

    var canHide = true;
    var hideTimeout = null;


    E.on("hjdict_slide", "mouseover", function () {
    document.getElementById("hjdict_slide").style.textDecoration = "none";
    });
    E.on("hjdict_slide", "mouseout", function () {
    document.getElementById("hjdict_slide").style.textDecoration = "none";
    });


    E.on("sysset", "mouseover", function () {
    document.getElementById("set_detail").style.display = "block";
    clearTimeout(HJ.global.LangClearTimeout);
    });
    E.on("sysset", "mouseout", function () {
    HJ.global.LangClearTimeout = setTimeout(function () {
    document.getElementById("set_detail").style.display = "none";
    }, 100);
    });
    document.getElementById("set_detail").onmouseover = function () {
    clearTimeout(HJ.global.LangClearTimeout);
    document.getElementById("set_detail").style.display = "block";
    };

    document.getElementById("set_detail").onmouseout = function () {
    HJ.global.LangClearTimeout = setTimeout(function () {
    document.getElementById("set_detail").style.display = "none";
    }, 100);
    };


    //切换网页划词语种。
    E.on("hjlang", "mouseover", function () {
    document.getElementById("dictlang").style.display = "block";
    clearTimeout(HJ.global.LangClearTimeout);
    });
    E.on("hjlang", "mouseout", function () {
    HJ.global.LangClearTimeout = setTimeout(function () {
    document.getElementById("dictlang").style.display = "none";
    }, 400);
    });

    document.getElementById("dictlang").onmouseover = function () {
    clearTimeout(HJ.global.LangClearTimeout);
    document.getElementById("dictlang").style.display = "block";
    };

    document.getElementById("dictlang").onmouseout = function () {
    HJ.global.LangClearTimeout = setTimeout(function () {
    document.getElementById("dictlang").style.display = "none";
    }, 400);
    };



    document.getElementById("dictlang").onclick = function (e) {
    if (!e) { return; }
    var eventsource = e.target || e.srcElement;
    if (eventsource.tagName == "A") {
    document.getElementById("dictlang").style.display = "none";
    }
    e.stopPropagation();
    };

    if (G.HasBindEvent == false) {
    G.HasBindEvent = true;
    E.on("hjd_btnEnSearch", "click", doEnSearch);
    E.on("hjd_btnJCSearch", "click", doJcSearch);
    E.on("hjd_btnCJSearch", "click", doCjSearch);
    E.on("hjd_btnFrSearch", "click", doFrSearch);
    E.on("hjd_btnKrSearch", "click", doKrSearch);

    E.on("hjd_btnEnSearch", "mouseover", function () { document.getElementById("hjd_btnEnSearch").style.cursor = "pointer"; });
    E.on("hjd_btnJCSearch", "mouseover", function () { document.getElementById("hjd_btnJCSearch").style.cursor = "pointer"; });
    E.on("hjd_btnCJSearch", "mouseover", function () { document.getElementById("hjd_btnCJSearch").style.cursor = "pointer"; });
    E.on("hjd_btnFrSearch", "mouseover", function () { document.getElementById("hjd_btnFrSearch").style.cursor = "pointer"; });
    E.on("hjd_btnKrSearch", "mouseover", function () { document.getElementById("hjd_btnKrSearch").style.cursor = "pointer"; });
    }
    F.changeLanguage(F.getLanguage());


    hjd_scrollControl.onmousedown = function (hjd_event) {

    if (document.addEventListener) {
    document.addEventListener('mousemove', _scrollControl, false);
    document.addEventListener('selectstart', revfalse, false);

    }
    else if (document.attachEvent) {
    document.attachEvent('onmousemove', _scrollControl);
    document.attachEvent('onselectstart', revfalse);
    }
    }




    //----------------------------------------------
    if (document.addEventListener) {
    document.addEventListener("mousemove", _mouseMove, false);
    document.addEventListener("mousedown", _mouseDown, false);
    document.addEventListener("mouseup", _mouseUp, false);
    document.addEventListener("mouseup", _dictQuery, false);
    document.addEventListener("mouseup", _clearScrollControl, false);
    document.addEventListener("dblclick", _dictQuery, true);

    window.addEventListener("scroll", _scroll, false);
    } else if (document.attachEvent) {
    document.attachEvent("onmousemove", _mouseMove);
    document.attachEvent("onmousedown", _mouseDown);
    document.attachEvent("onmouseup", _mouseUp);
    document.attachEvent("onmouseup", _dictQuery);
    document.attachEvent("onmouseup", _clearScrollControl);
    document.attachEvent("ondblclick", _dictQuery);

    window.attachEvent("onscroll", _scroll);
    }
    //
    hjd_dictInited = true;
    if (typeof (hjd_onShiftDictEnable) != "undefined") {
    hjd_onShiftDictEnable(_dict_enable);
    }


    hjd_bodyframe.style.height = hjd_height - 3 + 23 + 'px';
    //判断是不是本站已经存在划词工具条
    if (isUsedHJToolbar()) {
    hjd_status.style.display = "none";
    InitHJToolbar("hjdict_power");
    InitHJToolbar("hjdict_slide");
    }

    noSelect(hj$("hjd_top"));
    noSelect(hj$("hjd_scrollControl"));
    }

    function loadCount() {
    function y_gVal(iz)
    { var endstr = document.cookie.indexOf(";", iz); if (endstr == -1) endstr = document.cookie.length; return document.cookie.substring(iz, endstr); }
    function y_g(name)
    { var arg = name + "="; var alen = arg.length; var clen = document.cookie.length; var i = 0; var j; while (i < clen) { j = i + alen; if (document.cookie.substring(i, j) == arg) return y_gVal(j); i = document.cookie.indexOf(" ", i) + 1; if (i == 0) break; } return null; }
    function cc_k()
    { var y_e = new Date(); var y_t = 93312000; var yesvisitor = 1000 * 36000; var yesctime = y_e.getTime(); y_e.setTime(y_e.getTime() + y_t); var yesiz = document.cookie.indexOf("cck_lasttime"); if (yesiz == -1) { document.cookie = "cck_lasttime=" + yesctime + "; expires=" + y_e.toGMTString() + "; path=/"; document.cookie = "cck_count=0; expires=" + y_e.toGMTString() + "; path=/"; return 0; } else { var y_c1 = y_g("cck_lasttime"); var y_c2 = y_g("cck_count"); y_c1 = parseInt(y_c1); y_c2 = parseInt(y_c2); y_c3 = yesctime - y_c1; if (y_c3 > yesvisitor) { y_c2 = y_c2 + 1; document.cookie = "cck_lasttime=" + yesctime + "; expires=" + y_e.toGMTString() + "; path=/"; document.cookie = "cck_count=" + y_c2 + "; expires=" + y_e.toGMTString() + "; path=/"; } return y_c2; } }
    var yesdata;
    yesdata = '&refe=' + escape(document.referrer) + '&location=' + escape(document.location) + '&color=' + screen.colorDepth + 'x&resolution=' + screen.width + 'x' + screen.height + '&returning=' + cc_k() + '&language=' + navigator.systemLanguage + '&ua=' + escape(navigator.userAgent) + "&random=" + Math.random();

    window.setTimeout(
    function () {
    var el = document.createElement('img');
    el.style.display = 'none';
    el.style.width = '0px';
    el.style.height = '0px';
    el.src = "http://count44.51yes.com/sa.aspx?id=443566342" + yesdata;
    document.body.appendChild(el);
    }, 5000);
    }
    function show(el) {
    D.get(el).style.display = "block";
    }
    function hide(el) {
    D.get(el).style.display = "none";
    }
    function updateshowstate() {
    switch (G.ShowState) {
    case "none": hide(hjd_tiptoolbar); hide(hjd_window); break;
    case "tip": if (hjd_window.style.display == "block" && hjd_frozen) { return; } show(hjd_tiptoolbar); hide(hjd_window); break;
    case "panel": hide(hjd_tiptoolbar); show(hjd_window); break;
    }

    }
    function doEnSearch() {
    F.changeLanguage("en");
    doSearch();
    }
    function doJcSearch() {
    F.changeLanguage("jc");
    doSearch();
    }
    function doCjSearch() {
    F.changeLanguage("cj");
    doSearch();
    }
    function doFrSearch() {
    F.changeLanguage("fr");
    doSearch();
    }
    function doKrSearch() {
    F.changeLanguage("kr");
    doSearch();
    }
    function doSearch() {

    HJ.global.TimeoutID = window.setTimeout(function () {
    show(hjd_imgloading);
    hide(hjd_txtresult);
    }, 1500);


    var jsonURL = HJ.global.Domain;
    var language = F.getLanguage();
    switch (language) {
    case "en": jsonURL = jsonURL + "/services/xml_web_ajax.ashx?w=";

    break;
    case "jc":
    case "cj": jsonURL = jsonURL + "/services/jp_web_ajax.ashx?type=" + language + "&w=";

    break;
    case "fr": jsonURL = jsonURL + "/services/fr_web_ajax.ashx?w=";

    break;
    case "kr": jsonURL = jsonURL + "/services/kr_web_ajax.ashx?w=";

    break;
    }
    //查询URL
    jsonURL = jsonURL + encodeURI(hjd_txtsearch.value.replace(" ", "+")).trim() +"&" + Math.random();
    //执行查询
    A.json({
    url: jsonURL,
    error: function () {
    HJ.dom.get(hjd_txtresult).innerHTML = "服务器连接超时，请确认您的网络连接后再次查询！";
    hide(hjd_imgloading);
    show(hjd_txtresult);
    }
    });
    if (!hjd_blnisLoadCount) {
    //加载计数器
    loadCount();
    hjd_blnisLoadCount = true;
    }
    }
    HJ.fun.doSearch = doSearch;
    HJ.fun.doEnSearch = doEnSearch;
    HJ.fun.doJcSearch = doJcSearch;
    HJ.fun.doCjSearch = doCjSearch;
    HJ.fun.doFrSearch = doFrSearch;
    HJ.fun.doKrSearch = doKrSearch;

    function _dictSet(el, htmlCode) {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0) {
    el.innerHTML = '<div style="display:none">for IE</div>' + htmlCode;
    el.removeChild(el.firstChild);
    }
    else {
    if (!el) return;
    var el_next = el.nextSibling;
    var el_parent = el.parentNode;
    el_parent.removeChild(el);
    el.innerHTML = htmlCode;
    if (el_next) {
    el_parent.insertBefore(el, el_next)
    } else {
    el_parent.appendChild(el);
    }
    }
    }
    function hjd_dictGetSel() {
    if (window.getSelection) return window.getSelection();
    else if (document.getSelection) return document.getSelection();
    else if (document.selection) return document.selection.createRange().text;
    else return '';
    }
    //
    function hjd_UpdatePosCache(aevent) {
    if (aevent) {
    var mouseloc = mouseCoords(aevent);

    _hjd_x = mouseloc.x;
    if (is_ie) {
    _hjd_y = mouseloc.y
    }
    else {
    _hjd_y = mouseloc.y;
    }
    }
    }

    function hjd_getFFinputSelect(e) {
    try {
    var myArea = e.target || e.srcElement;
    if (myArea.selectionStart != undefined) {
    return myArea.value.substr(myArea.selectionStart, myArea.selectionEnd - myArea.selectionStart);
    } else {
    return "";
    }
    } catch (e) {
    return "";
    }
    }
    function getSentence(e, aword) {
    try {
    var Chreg = /([\u4e00-\u9fa5])/igm
    if (Chreg.test(aword)) {
    return "";
    }
    var Elem = 0;
    if (is_ie) {
    Elem = e.srcElement;
    } else {
    Elem = e.target;
    }
    var Sent = "";
    while ("<P><SPAN><DIV>".indexOf("<" + Elem.tagName + ">") == -1) {
    if (Elem.parentNode) {
    Elem = Elem.parentNode;
    } else {
    break;
    }
    }
    if (Elem.textContent) {
    Sent = (Elem.textContent);
    } else {
    Sent = (Elem.innerText);
    }
    if (Sent && Sent.split(" ").length > 5) {
    return Sent;
    } else {
    return "";
    }
    } catch (e) {
    return "";
    }
    }
    function hjd_replaceNumber(aChar, aIndex) {
    return String.fromCharCode(aChar.charCodeAt(0) - 65248);
    }
    function _dictQuery(e) {
    var eid = HJ.event.getTarget(HJ.event.getEvent()).id;
    var word = hjd_dictGetSel(e);

    if ((word + '') == '') {
    return;
    }
    if (!_dict_enable || HJ.fun.getCookie("hjd_initable") == "off") {
    _dict_enable = false;
    return true;
    }

    if (hjd_mouseloc != 0) {
    if (is_ie) {
    window.event.cancelBubble = true;
    window.event.returnValue = false;
    } else {
    e.preventDefault();
    }
    return false;
    }

    //
    try {
    if (e == null) {
    e = window.event;
    }
    var Elem = 0;
    if (is_ie) {
    Elem = e.srcElement;
    } else {
    Elem = e.target;
    }
    if (!e.ctrlKey) {
    if (Elem.tagName == 'INPUT' && Elem.getAttribute('type').toLowerCase() == 'text') {
    return;
    }
    if (Elem.tagName == 'TEXTAREA' && ((Elem.getAttribute('readonly') != true && Elem.getAttribute('readonly') != "readonly"))) {
    return;
    }
    }
    if (Elem.tagName == "INPUT" && Elem.getAttribute("type").toLowerCase() != "text") {
    return;
    }
    } catch (e) { }
    //
    if (!is_ie) {
    if (word.toString().length == 0) {
    word = hjd_getFFinputSelect(e);
    }
    }
    word = "" + word;
    var ChNumber = /[\uff21-\uff5a]/igm;
    if (ChNumber.test(word)) {
    word = word.replace(ChNumber, hjd_replaceNumber);
    }

    word = word.replace(/(^[ \u3000\uff5e\uff0c,\uff1a\u3002\u201c\u201d\u2018\u3001\u2019\uff1b;\uff09\)\u300b>]*)|([<\u300a\(\uff08 \u3000\uff1b;\u3001\uff0c,\u3002\u201c\u201d\u2018\uff1a\uff5e\u2019]*hj$)/g, "");
    var reg = /([\uff0c\u3002\u3001\uff1f\uff1b\uff1a\u201c\u2018\u2019\u201d\u3001\u3000\uff01\uff3b\uff3d\uff5b\uff5d\uff1c\uff1e\uff40~\uff5e])/g;
    word = word.replace(reg, "-----------------------------------------");

    if (word == "" || word == hjd_old_word || word.length > 30) {

    return true;
    }
    var reg2 = /(([a-zA-Z0-9][\u0800-\u9fa5])|([\u0800-\u9fa5][a-zA-Z]))/igm
    if (reg2.test(word) && word.length <= 30) {
    return;
    } else {
    var reg3 = /[\u0800-\u9fa5]/igm
    var reg4 = /[\u3042-\u3106]/igm
    if (reg3.test(word) && !reg4.test(word) && word.length > 5) {
    //最多划4个字符
    return true;
    } else {
    if (word.split(" ").length > 5) {
    //最多划5个词
    return true;
    }
    }
    }
    if (word.split("\n").length > 1) {
    return;
    }
    if (eid.indexOf("hjd_chkLang") > -1) { return; }
    if (eid.indexOf("hjd_btn_tip") > -1) { return; }
    if (eid.indexOf("hjd_hover") > -1) { return; }
    hjd_UpdatePosCache(e);
    hjd_dictShow(word, getSentence(e, word));
    }
    //
    function _dictDisplay(ev) {
    if (ev != null) {
    var amouseloc = mouseCoords(ev);
    hjd_moveWin(null, amouseloc.x, amouseloc.y);
    } else {
    //解决固定显示问题
    if (hjd_frozen == true) {
    hjd_moveWin(null, hjd_x, hjd_y);
    } else {
    hjd_moveWin(null, _hjd_x, _hjd_y);
    }


    // hjd_moveWin(null, _hjd_x, _hjd_y); //谷歌浏览器查询框跳转问题
    }

    if (hjd_hidetip)
    { G.ShowState = "panel"; }
    else
    { G.ShowState = "tip"; }
    updateshowstate();

    }
        
    //网站用，有特定属性的链接直接显示划词
    function AttachDictBH() {
    var elms = document.getElementsByTagName('a');
    for (i = 0; i < elms.length; i++) {
    if (elms[i].className.indexOf("hjdict") == 0 && elms[i].getAttribute("word") != null) {
    elms[i].onmouseover = function (aevent) {
    if (aevent == null) {
    aevent = window.event;
    }
    if (hjd_dictInited) {
    hjd_UpdatePosCache(aevent);
    }
    hj_dict_word = this.getAttribute("word");
    if (hj_dict_word.indexOf("&type=jc") != -1) {
    hjd_txtsearch.value = hj_dict_word.replace("&type=jc", "");
    hj_dict_timer = setTimeout(doJcSearch, 300);
    }
    else if (hj_dict_word.indexOf("&type=cj") != -1) {
    hjd_txtsearch.value = hj_dict_word.replace("&type=cj", "");
    hj_dict_timer = setTimeout(doCjSearch, 300);
    }
    else if (hj_dict_word.indexOf("&type=fr") != -1) {
    hjd_txtsearch.value = hj_dict_word.replace("&type=fr", "");
    hj_dict_timer = setTimeout(doFrSearch, 300);
    }
    else if (hj_dict_word.indexOf("&type=kr") != -1) {
    hjd_txtsearch.value = hj_dict_word.replace("&type=kr", "");
    hj_dict_timer = setTimeout(doFrSearch, 300);
    }
    else if (this.href.indexOf("/jp/") != -1 && hj_dict_word.indexOf("&type=") == -1) {
    hjd_txtsearch.value = hj_dict_word;
    hj_dict_timer = setTimeout(doJcSearch, 300);
    }
    else if (this.href.indexOf("/fr/") != -1 && hj_dict_word.indexOf("&type=") == -1) {
    hjd_txtsearch.value = hj_dict_word;
    hj_dict_timer = setTimeout(doFrSearch, 300);
    }
    else if (this.href.indexOf("/kr/") != -1 && hj_dict_word.indexOf("&type=") == -1) {
    hjd_txtsearch.value = hj_dict_word;
    hj_dict_timer = setTimeout(doKrSearch, 300);
    }
    else {
    hjd_txtsearch.value = hj_dict_word;
    hj_dict_timer = setTimeout(doEnSearch, 300);
    }

    _dictDisplay();
    hide(hjd_tiptoolbar);
    show(hjd_window);

    }
    elms[i].onmouseout = function () {
    clearTimeout(hj_dict_timer);
    hj_dict_word = "";
    }
    }
    }
    }

    function hjd_dictShow(word, sentence) {

    _dictDisplay();



    try {
    var reg = /([\u0800-\u4e00]{1,})/igm
    if (reg.test(word)) {

    hjd_txtsearch.value = word;
    setTimeout(doSearch, 150);
    } else {

    hjd_txtsearch.value = word;
    setTimeout(doSearch, 150);

    }
    } catch (x) {

    hjd_txtsearch.value = word;
    setTimeout(doSearch, 150);
    }
    hjd_old_word = word;
    hjd_ResetWindowLoc();
    }
        
    //单词本页面专用查询方法
    function hjd_mydictsearch(word, Loc, el) {
    _hjd_x = Loc.left;
    _hjd_y = Loc.top + el.offsetHeight;
    hjd_txtsearch.value = word;
    doEnSearch();
    _dictDisplay();
    hide(hjd_tiptoolbar);
    show(hjd_window);
    }
    HJ.fun.hjd_mydictsearch = hjd_mydictsearch;

    function hjd_escape(astring) {
    var ret = "";
    try {
    ret = encodeURI(astring);
    return ret;
    } catch (x) {
    alert("值得反馈的错误信息： hjd_escape." + x.message);
    return astring;
    }
    }
    function hjd_dictClose() {
    if (hjd_frozen) { return; }
    try {
    hjd_window.style.display = "none";
    setTimeout(function () { hjd_old_word = ""; }, 500);
    }
    catch (x) {
    }
    }

    function _dictEnable() {

    if (_dict_enable) {
    _dict_enable = false;
    } else {
    if (hjd_maxused) {
    alert("您已启动小D侧边栏，请展开侧边栏查看划词结果！");
    return false;
    } else {
    _dict_enable = true;
    }
    }
    if (typeof (hjd_onShiftDictEnable) != "undefined") {
    hjd_onShiftDictEnable(_dict_enable);
    }
    _dictUpdateStatus();
    }
    HJ.fun.dictEnable = _dictEnable;

    function ShiftDictable(aBool) {
    _dict_enable = aBool;
    _dictUpdateStatus();
    }

    function _dictUpdateStatus() {
    _dictSet(hjd_status, _dictStatus());
    }

    function hjd_remove() {
    hjd_window.style.display = "none";
    hjd_status.style.display = "none";
    _dict_enable = false;
    }
    HJ.fun.hjd_remove = hjd_remove;

    function _dictStatus() {
    var h = '';

    RecordSetting();

    if (isUsedHJToolbar())
    { return ''; }

    if (_dict_enable) {
    h += '[<a href="' + hjd_help + '" title="&#25105;&#35201;&#26597;&#30475;&#21010;&#35789;&#24110;&#21161;" target="_blank" style="color:#6E9C3C;font-size:14px;">&#21010;&#35789;&#32763;&#35793;</a>&#24050;<a href="javascript:HJ.fun.dictEnable()" title="&#25105;&#35201;&#31105;&#29992;&#21010;&#35789;&#32763;&#35793;" target="_self" style="color:#FF6600;font-size:14px;">&#24320;&#21551;</a>]';
    } else {
    h += '[<a href="' + hjd_help + '" title="&#25105;&#35201;&#26597;&#30475;&#21010;&#35789;&#24110;&#21161;" target="_blank" style="color:#6E9C3C;font-size:14px;">&#21010;&#35789;&#32763;&#35793;</a>&#24050;<a href="javascript:HJ.fun.dictEnable()" title="&#25105;&#35201;&#24320;&#21551;&#21010;&#35789;&#32763;&#35793;" target="_self" style="color:#FF6600;font-size:14px;">&#31105;&#29992;</a>]';
    }
    h += ' <a href="javascript:HJ.fun.hjd_remove();" target="_self"><img  src=' + hjd_host + '/images/close.gif border=0 align=absmiddle curson=hand ></a>';
    return h;

    }

    if (document.location.toString().indexOf("dict.hjenglish.com") != -1) {
    hjd_host = 'http://dict.hujiang.com';
    }
    if (document.location.toString().indexOf("dict.hujiang.com") != -1) {
    hjd_host = 'http://dict.hujiang.com';
    }
    try {
    if (document.location.href.indexOf("dict.hjenglish.com") != -1) {
    hjd_help = "http://dict.hjenglish.com/snipper.aspx";
    }
    } catch (x) { ; }
    _dictShow = hjd_dictShow;
    //disable init
    if (typeof (_initdisable) != "undefined") {
    _dict_enable = !_initdisable;
    }
    //
    function BeginDict() {
    if (hjd_dictInited) { return; }
    else { hjd_dictInited = true; }
    if (HJ.fun.getCookie("hjd_initable") == "off" || (typeof (hjd_dict_enable) != "undefined" && hjd_dict_enable == false)) {
    ShiftDictEnable(false);
    } else {
    ShiftDictEnable(true);
    }
    if (!document.getElementById('hjd_panel')) {
    try {
    window.setTimeout(function () { hjd_init(); }, 200);
    } catch (x) {
    alert("划词加载错误！");
    }
    // 
    } else {
    try {
    _dict_enable = (HJ.fun.getCookie("hjd_initable") != "off");
    //判断是不是本站已经存在划词工具条
    if (isUsedHJToolbar()) {
    hjd_status.style.display = "none";
    InitHJToolbar("hjdict_power");
    InitHJToolbar("hjdict_slide");
    }
    else {
    hjd_status.style.display = "block";
    }

    _dictUpdateStatus();


    } catch (x) { ; }
    }
    }
    if (is_opera || is_moz)
    document.addEventListener("DOMContentLoaded", BeginDict, false);
    else if (is_ie) {
    document.write("<scr" + "ipt id=__ie_init defer=true " +
    "src=//:><\/script>");
    var hjd_script = document.getElementById("__ie_init");
    if (hjd_script)
    hjd_script.onreadystatechange = function () {
    if (document.readyState != "complete") return;
    BeginDict();
    };
    hjd_script = null;
    } else {
    }
    if (document.addEventListener) {
    window.addEventListener("load", BeginDict, false);
    } else if (document.attachEvent) {
    window.attachEvent("onload", BeginDict);
    }
    if (typeof _embedwebpage == "undefined") {
    setTimeout(BeginDict, 500);
    }

    //站内是否已经使用划词工具条
    function isUsedHJToolbar() {
    return (hj$("hjdict_power") != null || hj$("hjdict_slide") != null);
    }
    //初始化站内工具条状态
    function InitHJToolbar(aObjID) {
    try {
    //新小D划词工具，用于小D新
    if (aObjID == "hjdict_slide") {
    if (_dict_enable) {
    hj$(aObjID).innerHTML = "关闭划词";
    } else {
    hj$(aObjID).innerHTML = "开启划词";
    }
    return;
    }
    if (aObjID == "hjdict_power") {
    if (_dict_enable) {
    hj$(aObjID).innerHTML = "关闭划词";
    } else {
    hj$(aObjID).innerHTML = "开启划词";
    }
    return;
    }
    //原划词工具，用于网站等
    if (_dict_enable) {
    hj$(aObjID).innerHTML = "&#24050;&#21551;&#29992;";
    } else {
    hj$(aObjID).innerHTML = "&#24050;&#31105;&#29992;";
    }
    } catch (e) {
    //
    }
    }
    //Shift DictEnable, use in hjenglish.com pages 
    function ShiftDictEnable(aBool, aObjID) {
    if (hj$("hjdict_slide") != null && aObjID == null) {
    aObjID = "hjdict_slide";
    }
    if (aObjID == null) {
    aObjID = "hjdict_power";
    }
    else if (hj$("hjdict_power") != null) {
    aObjID = "hjdict_power";
    }
    try {
    if (aBool == null) {
    _dict_enable = !_dict_enable;
    var a = HJ.event.getTarget(HJ.event.getEvent()); //获取事件源
    switch (a.className) {
    case "dict_state_1": a.className = "dict_state_2"; a.innerHTML = "已关闭划词"; break;
    case "dict_state_2": a.className = "dict_state_1"; a.innerHTML = "已开启划词"; break;
    }
    } else {
    _dict_enable = aBool;
    }
    _dictUpdateStatus();
    RecordSetting();
    InitHJToolbar(aObjID);
    } catch (e) {
    //
    }
    if (typeof (hjd_onShiftDictEnable) != "undefined") {
    hjd_onShiftDictEnable(_dict_enable);
    }
    return false;
    }

    HJ.fun.ShiftDictEnable = ShiftDictEnable;
    function hjd_ShiftDictEnable(aBool) {
    if (typeof (aBool) == "undefined") {
    aBool = !_dict_enable;
    }
    ShiftDictEnable(aBool);
    }
    HJ.fun.hjd_ShiftDictEnable = hjd_ShiftDictEnable;
    } else {
    }
    */
    /************************ TTS发音开始************************/

    function GetFlash(object, id, playerfile, flashvers, width, height, NotTransparent, tts) {
        GetTTSFlash(object, id, playerfile, flashvers, width, height, NotTransparent, tts);
    }
    function GetFlashObj(obj) {

        if (navigator.appName.indexOf("Microsoft") != -1) {
            return window[obj];

        } else {
            return document[obj];

        }

    }

    var htmlAudio = (function () {
        var obj = {
            play: function (url) {
                if (!this.canPlay) return;
                var elem = this._element || (this._element = document.createElement("audio"));
                elem.preload = true;
                elem.src = url;
                elem.play();
                return this;
            },

            _element: null
        };

        //feature detection
        //see more: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
        var elem = document.createElement("audio");
        if (obj.canPlay = !!elem.canPlayType) {
            obj.mp3 = elem.canPlayType('audio/mpeg;').replace(/^no$/, '');
        }

        return obj;
    })();

    function PlaySound(obj) {
        try {
            HJ.common.debug("PlaySound()");
            var img = HJ.dom.get(obj).getElementsByTagName("img")[0];
            img.src = 'http://dict.hujiang.com/images/btn_voice_over.gif';
            var w = obj.title;
            var lan = HJ.fun.getLanguage();

            var url = "";

            if (w.indexOf("http://") > -1) {
                url = w;
            }
            else if (lan == "en") {
                url = "http://tts.yeshj.com/s/" + w;
            }
            else if (lan == "jc") {
                if (w.indexOf(".mp3") > 0) {
                    url = "http://d1.g.hjfile.cn/voice/jpsound/" + w;
                }
                else {
                    url = "http://tts.yeshj.com/jp/s/" + w;
                }
            }
            else {
                url = "http://tts.yeshj.com/s/" + w;

            }

            HJ.Counter.PlaySound(w);

            HJ.common.debug("PlaySound()-url:" + url);

            if (htmlAudio.canPlay && htmlAudio.mp3) {
                htmlAudio.play(url);
            } else {
                var id = "hjd_sound";
                var name = "hjd_sound";
                var width = 1;
                var height = 1;
                var playerfile = "http://dict.hujiang.com/flash/sound2.swf";

                var agent = navigator.userAgent.toLowerCase();
                if (agent.indexOf("msie") > 0 && (agent.indexOf("360ee") || agent.indexOf("360se"))) {
                    playerfile += "?i=" + Math.random();
                }

                var flashvers = "son=" + url;
                var object = document.getElementById("hjd_sound_player");

                var str = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,22,0'";
                str += " width='10' height='10' id='" + id + "' align='middle' >";
                str += "<param name='allowScriptAccess' value='always' />";
                str += "<param name='movie' value='" + playerfile + "' />";
                str += "<param name='quality' value='high' />";
                str += "<param name='scale' value='noScale' />";
                str += "<param name='align' value='tl' />";
                str += "<param name='wmode' value='" + transparent + "' />";
                str += "<param name='flashvars' value='" + flashvers + "' />";
                str += "<embed src='" + playerfile + "' quality='high' scale='noScale' wmode='transparent' bgcolor='#ffffff' width='" + width + "' height='" + height + "' flashvars='" + flashvers + "' id='" + id + "' name='" + id + "' align='middle' allowScriptAccess='always' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer'/>";
                str += "</object>";

                object.innerHTML = str;
            }

            setTimeout(function () {
                img.src = 'http://dict.hujiang.com/images/btn_voice.gif';
            }, 2000);
        }
        catch (e) {
            HJ.common.debug("PlaySound()-err:" + e);
        }
    }
    function ClickPlayer(id, soundtype) {
        HJ.common.debug("ClickPlayer()");

        document.getElementById(id).onclick = function () {//单击发音
            if (!HJ.global.hjd_soundtype) {
                document.getElementById(id).style.curson = "pointer"; //移上去发音，鼠标变换成手形状。
                PlaySound(this);
            }
            return false;
        };

        document.getElementById(id).onmouseover = function () {//移上去发音
            if (HJ.global.hjd_soundtype) {
                document.getElementById(id).style.curson = "pointer"; //移上去发音，鼠标变换成手形状。
                PlaySound(this);
            }
            return false;
        };

    }
    //新方法tts发音。
    function GetTTSFlash(object, id, playerfile, flashvers, width, height, NotTransparent, tts) {
        var sound_word = "";
        if (flashvers.indexOf("http://tts.yeshj.com/c/") > -1 || flashvers.indexOf("http://tts.yeshj.com/jp/s/") > -1) {
            var link1 = flashvers.split("&")[0];
            var link2 = link1.split("=")[1];
            sound_word = link2;
        }
        else if (flashvers.indexOf(".mp3") > 0) {
            var myArray = flashvers.split("=");
            sound_word = myArray[1];
        }
        else {
            var myArray = flashvers.split("=");
            var tempWord = myArray[1].split("|");
            sound_word = tempWord[0];
        }
        var tempID = "dict_player_" + HJ.global.IDFlag;
        var str = "<a id ='" + tempID + "'  title='" + sound_word + "' onclick='return false;' style ='margin:5px; '><img  align='absmiddle' width='16px' height='16px' src='http://dict.hujiang.com/images/btn_voice.gif' title='发音' style='cursor:pointer'></a>";


        if (NotTransparent == true) {
            NotTransparent = "window";
        } else {
            NotTransparent = "transparent";
        }

        // 始终透明, 防止在最前
        transparent = "transparent";

        id = "hjd_sound_player";
        name = "hjd_sound_player";
        width = 1;
        height = 1;
        playerfile = "http://dict.hujiang.com/flash/sound2.swf";

        if (!document.getElementById("hjd_sound_player")) {
            str += "<span id='hjd_sound_player' style='width:0px;height:0px;border:0px;position: absolute;'>";
            str += "</span>";

        }
        object.innerHTML = str;
        ClickPlayer(tempID, HJ.global.hjd_soundtype);
        HJ.global.IDFlag += 1;
    }

})();

//Shift DictEnable, use in hjenglish.com pages
ShiftDictEnable = HJ.fun.ShiftDictEnable;
hjd_ShiftDictEnable = HJ.fun.hjd_ShiftDictEnable;