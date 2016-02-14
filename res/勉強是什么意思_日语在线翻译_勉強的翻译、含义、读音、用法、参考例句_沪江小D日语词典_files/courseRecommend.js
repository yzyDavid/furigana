(function($){
    'use strict';
    $(function(){
        var clientHight=document.documentElement.clientHeight||document.body.clientHeight;
        var url="http://portal.hjapi.com/v1/class/recommend";
        var slider,
            flage=true,
            html='',
            boxTop;
        var $courseRecommend=$('#course_recommend');
        var course_source={
            cms:'30910511',
            bi:'30910510'
        };
        var courseRecommend = {
            init: function (uiTypeIndex,getIDs,langsCate,langs) {
                this.uiType(uiTypeIndex,getIDs,langsCate,langs);
            },
            sliderAuto:function(){
                var $rightLI=$('#right_hover li');
                slider=$('#courseSlide').bxSlider({
                    mode: 'fade',
                    pager: true,
                    controls: false,
                    speed: 400,
                    randomStart: true,
                    pause: 4000,
                    onSlideBefore:function(ele,index){

                    },
                    onSlideAfter:function($slideElement, oldIndex, newIndex){
                        $rightLI.removeClass('active');
                        $rightLI.eq(newIndex).addClass('active');
                        //添加打点
                        if(!flage){
                            var source=$('#courseSlide .item').eq(newIndex).attr('data-source');
                            if(source==='cms'){
                                if(typeof(ht) !== 'undefined'){
                                    ht.sendCustomEvent('class_show_cate');
                                } 
                            }else if(source==='bi'){
                                if(typeof(ht) !== 'undefined'){
                                    ht.sendCustomEvent('class_show_bi');
                                }
                            }
                        }
                    },
                    onSlideNext:function(ele,index){ 
                    },
                    onSliderLoad:function(index){
                        $rightLI.eq(index).addClass('active');
                    }
                });
                slider.startAuto();
            },
            bindData:function(uiTypeIndex,getIDs,langsCateId,langs,uiTpl){
                var that = this;
                setTimeout(function(){ 
                    //var getIDs=Cookie.get('HJ_UID');
                        //langsCateIds=$('#hiCateId').val();
                    if(getIDs===undefined || getIDs===null || getIDs===""){
                        getIDs=that.getCookie('HJ_UID');
                    }
                    $.ajax({   
                        type: 'get',
                        url: url,
                        data: {
                            'visitId':getIDs,
                            'size': 5,
                            'langsCateId':langsCateId,
                            'langs':langs
                        },
                        dataType: 'jsonp',
                        success: function (result) {
                            var data=result.data;
                            if(data && data.classCourseList && data.classCourseList.length>0){
                                var interText = doT.template(uiTpl);
                                var setObj={className:uiTypeIndex};
                                var newData=$.extend(setObj,data);
                                $courseRecommend.append(interText(newData));
                                $('.begin_date').html($('.begin_date').html().substring(0,10));
                                $('.end_date').html($('.end_date').html().substring(0,10));
                                $('#total_title').html(data.copywriting ? data.copywriting : '您感兴趣的课程有优惠啦，快去看看：');

                                boxTop=$courseRecommend.offset().top;
                                that.courseScroll();
                                that.sliderAuto();
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
            uiType:function(uiTypeIndex,getIDs,langsCateIds,langs){
                this.bindData(uiTypeIndex,getIDs,langsCateIds,langs,this.uiTpl);
            },
            uiTpl:
                '<div class="course_type{{=it.className}}">'+
                    '<div class="course_total_title">'+
                        '<i></i>'+
                        '<span id="total_title"></span>'+
                    '</div>'+
                    '<div id="course_slider" class="course_slider">'+
                        '<ul class="right_hover" id="right_hover">'+
                            '{{ for(var i=0; i<it.classCourseList.length; i++){ }}' +
                                '<li></li>'+
                            '{{ } }}'+
                        '</ul>'+
                        '<div class="slider-unit" id="courseSlide">'+
                            '{{ for(var i=0; i<it.classCourseList.length; i++){ }}' +
                                '<div class="item" data-source="{{=it.classCourseList[i].source}}">' +
                                    '<div class="left">'+
                                        '{{ if(it.classCourseList[i].source=="cms"){ }}'+
                                            '<a href="http://class.hujiang.com/{{=it.classCourseList[i].classID}}/intro?source='+course_source.cms+'" target="_blank" class="course_item_cms">'+
                                                '<i></i>'+
                                                '<img src="{{=it.classCourseList[i].bigCoverUrl}}" align="absmiddle" />'+
                                            '</a>'+
                                        '{{ }else{ }}'+
                                             '<a href="http://class.hujiang.com/{{=it.classCourseList[i].classID}}/intro?source='+course_source.bi+'" target="_blank" class="course_item_bi">'+
                                                '<i></i>'+
                                                '<img src="{{=it.classCourseList[i].bigCoverUrl}}" align="absmiddle" />'+
                                            '</a>'+   
                                        '{{ } }}'+
                                    '</div>'+
                                    '<div class="right">'+
                                        '<div class="title">'+
                                            '{{ if(it.classCourseList[i].source=="cms"){ }}'+
                                                '<a class="short_name course_item_cms" href="http://class.hujiang.com/{{=it.classCourseList[i].classID}}/intro?source='+course_source.cms+'" target="_blank">{{=it.classCourseList[i].shortName}}</a>'+
                                            '{{ }else{ }}'+
                                                '<a class="short_name course_item_bi" href="http://class.hujiang.com/{{=it.classCourseList[i].classID}}/intro?source='+course_source.bi+'" target="_blank">{{=it.classCourseList[i].shortName}}</a>'+
                                            '{{ } }}'+
                                            '<span class="period">{{=it.classCourseList[i].period}}课时</span>'+
                                        '</div>'+
                                        '<div class="sub_title">{{=it.classCourseList[i].subTitle}}</div>'+
                                        '<div class="time">课程安排：<span class="begin_date">{{=it.classCourseList[i].beginDate}}</span> 至 <span class="end_date">{{=it.classCourseList[i].endDate}}</span></div>'+
                                        '{{ if(it.classCourseList[i].source=="cms"){ }}'+
                                            '<a class="free_linner course_item_cms" href="http://class.hujiang.com/{{=it.classCourseList[i].classID}}/intro?source='+course_source.cms+'" target="_blank">查看详情<i></i></a>'+
                                        '{{ }else{ }}'+
                                            '<a class="free_linner course_item_bi" href="http://class.hujiang.com/{{=it.classCourseList[i].classID}}/intro?source='+course_source.bi+'" target="_blank">查看详情<i></i></a>'+
                                        '{{ } }}'+
                                    '</div>'+
                                '</div>' +
                            '{{ } }}'+
                        '</div>'+
                    '</div>'+
                '</div>',
            sentEvent:function(){
                var that=this;
                $('#course_slider').on('mouseover',function(){
                    slider.stopAuto();
                }).on('mouseout',function(){
                    slider.startAuto();
                });
                $('#right_hover li').on('mouseenter',function(){
                    $('#right_hover li').removeClass('active');
                    $(this).addClass('active');
                    slider.stopAuto();
                    slider.goToSlide($(this).index());
                });
                $(document).on('click', '.course_item_cms', function () {
                    if(typeof(ht) !== 'undefined'){
                        ht.sendCustomEvent('class_click_cate');
                    }
                    
                });
                $(document).on('click', '.course_item_bi', function () {
                    if(typeof(ht) !== 'undefined'){
                        ht.sendCustomEvent('class_click_bi');
                    }
                });
                $(window).on('scroll',function(){
                    that.courseScroll();
                });
            },
            courseScroll:function(){
                var top=document.documentElement.scrollTop||document.body.scrollTop;
                if((boxTop-top)>0 && (boxTop-top)< clientHight){
                    flage=false;
                }else{
                    flage=true;
                }
            },
            getCookie: function (objName) {
                var arrStr = document.cookie.split("; ");
                for (var i = 0; i < arrStr.length; i++) {
                    var temp = arrStr[i].split("=");
                    if (temp[0] == objName) {
                        return unescape(temp[1]);
                    }
                }
            }
        };
        //courseRecommend.init(index,langs);
        window.courseRecommend = courseRecommend;
    });
})(window.$);