(function($){
    'use strict';
    $(function(){
        /* global escape,unescape */
        var hostName = location.hostname;
        var fixQuestionnaire = {
            _getCookie:function(name){
                var cookie_start = document.cookie.indexOf(name);
                var cookie_end = document.cookie.indexOf(';', cookie_start);
                return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
            },
            _setCookie:function(cookieName, cookieValue, seconds, path, domain, secure){
                var expires = new Date();
                expires.setTime(expires.getTime() + seconds * 1000);
                document.cookie = escape(cookieName) + '=' + escape(cookieValue)+
                (expires ? '; expires=' + expires.toGMTString() : '')+
                (path ? '; path=' + path : '/')+
                (domain ? '; domain=' + domain : '')+
                (secure ? '; secure' : '');
            },
            setInvestigateCookie:function(){
                var cookieKey = 'article_investigate_close';
                var investigateClosed = fixQuestionnaire._getCookie(cookieKey);
                if (!investigateClosed || investigateClosed != 'closed') {
                    fixQuestionnaire._setCookie(cookieKey, 'closed', 90 * 24 * 60 * 60, '/', '', '');
                }
            },
            buttonShow:function(){
                //登陆状态
                var showButton = setTimeout(function(){
                    if(!$('.bottomActive1212').length){
                        if (fixQuestionnaire._getCookie('article_investigate_close') == 'closed' || $('.lzs_container').length) {
                            return;
                        }
                        else {
                            ht.sendCustomEvent('vote_show');
                            $('.fix_questionnaire_btn').fadeIn().addClass('animated bounceIn');
                        }
                    }
                },5000);
            },
            bindEvent:function(iframeSource){
                if(!iframeSource){
                    iframeSource='';
                }

                var QuestionnaireContentHTML;
                var hjvoteSource = "";
                if (hostName.indexOf('cichang') !== (-1)) {
                    hjvoteSource = "cichang";
                }
                else if (hostName.indexOf('dict') !== (-1)) {
                    hjvoteSource = "dict";
                }
                else {
                    hjvoteSource = iframeSource;
                }

                QuestionnaireContentHTML =
                    ['<div class="fix_questionnaire_dialog_pagebg"></div>',
                    '<div class="fix_questionnaire_dialog">',
                    '    <div class="fix_questionnaire_dialog_close"></div>',
                    '    <iframe id="questionnaire_iframe" src=\'http://hjvote.yeshj.com/jq/5602573,i,t.aspx?width=525&source=' + hjvoteSource + '\' width=\'535\' height=\'430\' frameborder=\'0\' style=\'overflow:auto\'></iframe>',
                    '</div>'].join('');


                $('.fix_questionnaire_btn').click(function(){
                    $('body').append(QuestionnaireContentHTML);
                    fixQuestionnaire.preventScroll('questionnaire_iframe');
                    $('.fix_questionnaire_dialog_pagebg').show();
                    $('.fix_questionnaire_dialog').show();
                    $('.fix_questionnaire_btn').hide();
                    ht.sendCustomEvent('vote_open');
                });
                
                $(document).on('click','.fix_questionnaire_dialog_close',function(){
                    $('.fix_questionnaire_btn').hide();
                    fixQuestionnaire.setInvestigateCookie();
                    $('.fix_questionnaire_dialog,.fix_questionnaire_dialog_pagebg').hide();
                    ht.sendCustomEvent('vote_close');
                });

            },
            resetDialogHeight:function(){
                var clientHeight = parseInt(document.documentElement.clientHeight)-100;
                $('.fix_questionnaire_dialog').css('height',clientHeight).css('margin-top',-clientHeight/2);
                $('.fix_questionnaire_dialog iframe').css('height',clientHeight);
            },
            preventScroll:function(id){  
                var _this = document.getElementById(id);
                if(navigator.userAgent.indexOf('Firefox')>0){
                    _this.addEventListener('DOMMouseScroll',function(e){
                        _this.scrollTop += e.detail > 0 ? 60 : -60;
                        e.preventDefault();
                    },false);
                }else{  
                    _this.onmousewheel = function(e){
                         e = e || window.event;
                         _this.scrollTop += e.wheelDelta > 0 ? -60 : 60;
                         return false;  
                     };
                 }  
                 return this;
             },
            init: function (iframeSource) {

                if(this._getCookie('hj-lzs')) return;

                var QuestionnaireHTML =
                    ['<div class="fix_questionnaire_btn">',
                    '    <img src="http://i2.w.hjfile.cn/doc/201508/f691467de97746ff9f2bf6e9caa7dae4.gif" />',
                    '</div>'].join('');
                
                
                $('body').append(QuestionnaireHTML);
                fixQuestionnaire.buttonShow();
                fixQuestionnaire.bindEvent(iframeSource);
            }
        };

        window.fixQuestionnaire = fixQuestionnaire;
    });
})(window.$);