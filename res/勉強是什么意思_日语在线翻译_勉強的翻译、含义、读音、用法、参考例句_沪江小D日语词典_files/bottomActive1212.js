/* global $,escape,unescape,ht,getLangs */
(function(){
    'use strict';
    $(function(){
        var $bottomCloseBtn,$bottomOpenBtn,clientWidth,bottomBannerHref,$bannerShowBox;
        var host = location.host;
        var langs;

        var cookieHandle = {
            getcookie:function(name){
                var cookie_start = document.cookie.indexOf(name);
                var cookie_end = document.cookie.indexOf(';', cookie_start);
                return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
            },
            setcookie:function(cookieName, cookieValue, seconds, path, domain, secure) {
                var expires = new Date();
                expires.setTime(expires.getTime() + seconds * 1000);
                document.cookie = escape(cookieName) + '=' + escape(cookieValue) +
                (expires ? '; expires=' + expires.toGMTString() : '') +
                (path ? '; path=' + path : '/') +
                (domain ? '; domain=' + domain : '') +
                (secure ? '; secure' : '');
            }
        };

        var bottomActive1212={
            init:function(langs){
                var that = this;
                if(!langs){
                    langs = 'en';
                }
                
                if(host.indexOf('www.hujiang.com')!==(-1)||host.indexOf('www2.hujiang.com')!==(-1)){
                    return;
                }
                else{
                    setTimeout(function(){
                        if($('.lamu_banner').length>0){
                            return false;
                        }
                        else{
                            that.initCss();
                            that.render(langs);
                            that.bindEvent();
                        }
                    },3000);
                }
            },
            render:function(langs){
                $.ajax({
                    url:'http://api.site.hujiang.com/Web/tx.ashx',
                    dataType:'jsonp',
                    data:{
                        op:'GetTxInfoList',
                        txID:'20',
                        lang:langs,
                        top:3
                    },
                    success:function(data){
                        if(data&&data.Value.Length>0){
                            var openBtnPic = data.Value.Value[0].AdvDetailItem.ImgUrl;

                            $.ajax({
                                url:'http://api.site.hujiang.com/Web/tx.ashx',
                                dataType:'jsonp',
                                data:{
                                    op:'GetTxInfoList',
                                    txID:'21',
                                    lang:langs,
                                    top:3
                                },
                                success:function(data2){
                                    if(data2&&data2.Value.Length>0){
                                        var bannerPic = data2.Value.Value[0].AdvDetailItem.ImgUrl;
                                        var bannerUrl = data2.Value.Value[0].AdvDetailItem.LinkUrl;

                                        var bottomActive1212HTML = 
                                            '<div class="bottomActive1212">'+
                                            '    <div class="bottomActive1212Show">'+
                                            '        <div class="bottomActive1212Bg"></div>'+
                                            '        <div class="bottomActive1212Content">'+
                                            '            <a href="'+bannerUrl+'" target="_blank" class="bottomActive1212Banner">'+
                                            '                <img src="'+bannerPic+'" />'+
                                            '            </a>'+
                                            '            <img src="http://i2.w.hjfile.cn/doc/201511/4ee4d8eae1ca428da5359bd7dbfd0926.png" class="bottomActive1212CloseBtn" />'+
                                            '        </div>'+
                                            '    </div>'+
                                            '</div>'+
                                            '<div class="bottomActive1212OpenBtn">'+
                                            '    <img src="'+openBtnPic+'" />'+
                                            '</div>';

                                        if($('.bottomActive1212').length===0){
                                            $('body').append(bottomActive1212HTML);
                                            if(typeof(ht) !== 'undefined'){
                                                ht.sendCustomEvent('bottom_show');
                                            }
                                        }

                                        $bottomCloseBtn = $('.bottomActive1212CloseBtn');
                                        $bottomOpenBtn  = $('.bottomActive1212OpenBtn');
                                        $bannerShowBox = $('.bottomActive1212');

                                        bottomBannerHref = $('.bottomActive1212Banner').attr('href');

                                        if(cookieHandle.getcookie('bottomActive1212')==='close'+bottomBannerHref){
                                            $bannerShowBox.css('left','-100%');
                                            $bottomOpenBtn.css('left',0);
                                            $bannerShowBox.css('display','none');
                                        }
                                        else{
                                            $bannerShowBox.css('left',0);
                                            $bottomOpenBtn.css('left',-89);
                                            $bannerShowBox.css('display','block');
                                        }
                                        
                                    }
                                    
                                }
                            });
                        }
                    }
                });
            },
            bindEvent:function(){
                $('.bottomActive1212CloseBtn').live('click',function(){
                    clientWidth = $(document).width();
                    $bannerShowBox.animate({
                        'left':'-100%'
                    },300,function(){
                        $bannerShowBox.css('display','none');
                        $bottomOpenBtn.animate({
                            'left':0
                        },200);
                    });

                    cookieHandle.setcookie('bottomActive1212','close'+bottomBannerHref,60*60*24*60,'/');

                    if(typeof(ht) !== 'undefined'){
                        ht.sendCustomEvent('bottom_close');
                    }
                });

                $('.bottomActive1212OpenBtn').live('click',function(){
                    clientWidth = $(document).width();
                    $bottomOpenBtn.animate({
                        'left':-89
                    },300,function(){
                        $bannerShowBox.css('display','block');
                        $bannerShowBox.animate({
                            'left':0
                        },200);
                    });

                    cookieHandle.setcookie('bottomActive1212','open',60*60*24*60,'/');

                    if(typeof(ht) !== 'undefined'){
                        ht.sendCustomEvent('bottom_small_click');
                    }
                });

                $('.bottomActive1212Banner').live('click',function(){
                    if(typeof(ht) !== 'undefined'){
                        ht.sendCustomEvent('bottom_click');
                    }
                });
            },
            initCss:function(){
                var cssUrl='http://common.hjfile.cn/site/css/bottomActive1212.css?version=' + this.getTimeToMin();
                var setCss=document.createElement('link');
                setCss.setAttribute('rel', 'stylesheet');
                setCss.setAttribute('type', 'text/css');
                setCss.setAttribute('href', cssUrl);
                document.getElementsByTagName('head')[0].appendChild(setCss);
            },
            getTimeToMin:function(){
                var getMinutes = parseInt(new Date().getTime()/1000/60);
                return getMinutes;
            }
        };


        window.bottomActive1212 = bottomActive1212;

        if(!!window.getLangs){
            var pagelangs = getLangs();
            switch(pagelangs){
                case 'xiaoxue':
                    pagelangs = 'xx';
                    break;
                case 'yuer':
                    pagelangs = 'ye';
                    break;
                case 'zhongxue':
                    pagelangs = 'zx';
                    break;
                case 'gaokao':
                    pagelangs = 'gk';
                    break;
                default:
                    pagelangs = pagelangs;
            }

            if(/^(en|jp|kr|fr|de|es|th|ru|xx|ye|zx|gk)$/.test(pagelangs)){
                bottomActive1212.init(pagelangs);
                bottomActive1212.init = null;
            }
        }
    });
})();