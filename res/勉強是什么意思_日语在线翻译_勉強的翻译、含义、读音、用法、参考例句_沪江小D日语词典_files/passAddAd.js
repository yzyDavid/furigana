(function($){
    'use strict';
    $(function(){
        var url='http://api.site.hujiang.com/Web/tx.ashx';
        var adTpl;
        var isTrue=false;
        var addTime='<span class="time_down">'+
            '<span id="t_h">00</span>'+
            '<span id="t_m">00</span>'+
            '<span id="t_s">00</span>'+
          '</span>';
        var passAddAd = {
            init: function (langs) {
                this.addTpl(langs);
            },
            addTpl:function(langs){
                var that=this;
                window.setTimeout(function(){
                    $.ajax({   
                        type: 'get',
                        url: url,
                        data: {
                            'op':'GetTxInfoList',
                            'top': 1,
                            'txID':23,
                            'lang':langs
                        },
                        dataType: 'jsonp',
                        success: function (result) {
                            var data=result.Value;
                            if(data && data.Value && data.Value.length>0){
                                $('.pass_register_tooltip').hide();
                                adTpl='<div class="pass_add_ad1">'+
                                            '<a href="'+data.Value[0].AdvDetailItem.LinkUrl+'" target="_blank" class="pass_add_ad1212">'+
                                                '<img src="'+data.Value[0].AdvDetailItem.ImgUrl+'" class="pass_add_img" />'+
                                            '</a>'+
                                        '</div>';
                                if($('#pass_c').length>0){
                                    if($('#username').length>0){ //已登录
                                        //if($('.pass_register_tooltip').is(':hidden')){   //已完善信息
                                            if($('.pass_add_ad1').length===0){
                                                $('#pass_c').append(adTpl);
                                                if(typeof(ht) !== 'undefined'){
                                                    ht.sendCustomEvent('passport_1212_show');
                                                }
                                                that.initTime();
                                            }
                                       // }
                                    }else{                       //未登录
                                        if($('.pass_add_ad1').length===0){
                                            $('#pass_c').append(adTpl);
                                            if(typeof(ht) !== 'undefined'){
                                                ht.sendCustomEvent('passport_1212_show');
                                            }
                                            that.initTime();
                                        }
                                    }
                                }else{
                                    that.checkUrl();
                                    that.passAddXD();
                                }
                                that.sentEvent();
                            }else{
                                console.log(data);
                            }
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    });
                },2000);
            },
            // 小D bulo cc passport添加广告位单独处理
            passAddXD:function(){
                if(isTrue){
                    if($('#cls_pnlHeader').length>0){  //小D，bulo
                        if($('#cls_pnlHeader .cls_listUserInfo_box').length>0){
                           $(adTpl).insertAfter($('#cls_pnlHeader .cls_listUserInfo_box'));
                            if(typeof(ht) !== 'undefined'){
                                ht.sendCustomEvent('passport_1212_show');
                            }
                            this.initTime(); 
                        }else if($('#cls_pnlHeader .cls_listUserInfo').length>0){  //词场
                            $(adTpl).insertAfter($('#cls_pnlHeader .cls_listUserInfo'));
                            if(typeof(ht) !== 'undefined'){
                                ht.sendCustomEvent('passport_1212_show');
                            }
                            this.initTime(); 
                        }
                    }else if($('.passport_wrap').length>0){  //cc
                        if($('.passport_wrap .passport_account').length>0){
                            $(adTpl).insertAfter($('.passport_wrap .passport_account'));
                            if(typeof(ht) !== 'undefined'){
                                ht.sendCustomEvent('passport_1212_show');
                            }
                            this.initTime();
                        }
                        
                    }
                }
            },
            checkUrl:function(){
                var href1=window.location.host.indexOf('dict.hjenglish.com'); 
                var href2=window.location.host.indexOf('bulo.hujiang.com');
                var href3=window.location.host.indexOf('cctalk.com');
                var href4=window.location.host.indexOf('cichang.hujiang.com');
                if(href1!=-1){
                    isTrue=true;
                }else if(href2!=-1){
                    isTrue=true;
                }else if(href3!=-1){
                    isTrue=true;
                }else if(href4!=-1){
                    isTrue=true;
                }else{
                    isTrue=false;
                }
                return isTrue;
            },
            initTime:function(){
                var that=this;
                var EndTime= new Date('2015/12/10 00:00:00'); //起始时间
                var NowTime = new Date();
                var t =EndTime.getTime() - NowTime.getTime();
                if(t<0){
                    $('.pass_add_ad1').append(addTime);
                    var time1=new Date('2015/12/11 23:59:59');
                    that.GetRTime(time1,function(){
                        var time2=new Date('2015/12/12 23:59:59');
                        that.GetRTime(time2,function(){
                            $('.time_down').hide(); 
                        }); 
                    });
                }else{
                    console.log('活动还没开始!');
                }
            },
            GetRTime:function(lastTime,callback){
                var timer=window.setInterval(function(){
                    var EndTime =lastTime;  //结束日期
                    var NowTime = new Date();
                    var t =EndTime.getTime() - NowTime.getTime();
                    var d=0;
                    var h=0;
                    var m=0;
                    var s=0;
                    if(t>=0){
                      d=Math.floor(t/1000/60/60/24);
                      h=toDouble(Math.floor((t/1000/60/60%24)+d*24));
                      m=toDouble(Math.floor(t/1000/60%60));
                      s=toDouble(Math.floor(t/1000%60));
                    }else{
                        window.clearInterval(timer);
                        callback && callback();
                        return;
                    }
                    function toDouble(n){
                            return n<10 ? '0'+n : ''+n;
                    }
                    $('#t_h').html(h);
                    $('#t_m').html(m);
                    $('#t_s').html(s);
                },10);
            },
            requireCss: function(url){
                var node = document.createElement('link'),
                    head = document.getElementsByTagName('head');
                node.type = 'text/css';
                node.rel = 'stylesheet';
                node.href = url;
                head = head.length ? head[0] : document.documentElement;
                head.appendChild(node);
            },
            sentEvent:function(){
                $('.pass_add_ad1212').live('click',function(){
                    if(typeof(ht) !== 'undefined'){
                        ht.sendCustomEvent('passport_1212_click');
                    }
                    
                });
            }
        };
        window.passAddAd = passAddAd;
        passAddAd.requireCss('http://common.hjfile.cn/site/css/passAddAd.css?v='+ new Date().getTime());
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

            if(/^(en|jp|kr|fr|de|es|th|ru|xx|ye|zx|gk|all)$/.test(pagelangs)){
                window.passAddAd.init(pagelangs);
                window.passAddAd.init = null;
            }
        }

    });
})(window.$);