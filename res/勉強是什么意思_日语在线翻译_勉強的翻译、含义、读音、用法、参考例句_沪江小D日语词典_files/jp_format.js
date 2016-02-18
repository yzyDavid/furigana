
$(function () {
    var currentWord = $(".jp_word_comment").first().attr("id");

    var tyCount = $("#ty_list a").length;
    var txCount = $("#tx_list a").length;
    var tyIsshow = false;
    var txIsshow = false;
    if (tyCount > 0) {
        $("#ty_list").show();
        tyIsshow = true;
    }
    if (txCount > 0) {
        $("#tx_list").show();
        txIsshow = true;
    }
    if (tyIsshow && txIsshow) {
        $(".description_br").show();
    } else {
        if (tyCount == 1) {
            $("#ty_list").hide();
            tyIsshow = false;
        }
        if (txCount == 1) {
            $("#tx_list").hide();
            txIsshow = false;
        }
    }
    if (!tyIsshow && !txIsshow) {
        $("#headword_div").hide();
    }
    $(".jp_word_comment").hide();
    $(".headword_div_jp a").click(function () {
        var aclass = $(this).attr("class");
        $(".headword_div_jp a").show();
        $(".headword_div_jp a").removeClass("word_cliked");
        $("#showall_jp").removeClass("showall_cliked");
        $("#showall_jp").addClass("showall_default");
        $(this).addClass("word_cliked");
        if (aclass != undefined && aclass.indexOf("word_cliked") < 0) {
            $(".jp_word_comment").hide();
            $(document.getElementById(aclass)).show();
            loadsetlab(aclass);
            loadSimpleContent(aclass);
        }
    });
    $("#showall_jp").click(function () {
        $(this).addClass("showall_cliked");
        $(this).removeClass("showall_default");
        $(".headword_div_jp a").show();
        $(".jp_word_comment").show();
        $(".headword_div_jp a").removeClass("word_cliked");
        $(".headword_div_jp a").each(function () {
            var current = $(this).attr("class");
            if (current != undefined)
            {
                loadsetlab(current);
                loadSimpleContent(current);
            }
        });        
    });
    //$(".jp_word_comment").first().show();
    $("#showall_jp").click();
    $(document.getElementsByClassName(currentWord)).addClass("word_cliked");

    var sentCount = $("#tabs1 li").length;
    if (sentCount < 1) {
        $("#ulExt").hide();
    }

    //tab切换
    var lia = $("#ulExt a:eq(0)").addClass("fix_tab");
    var tabName = lia.attr("href");
    if (tabName) {
        $("#ulExt ul").idTabs(tabName.replace("#", ""));
    }

    //详细解释标签切换
    var lia_top = $("#ulExplain a:eq(0)").addClass("fix_tab");
    var tabName_top = lia_top.attr("href");
    if (tabName_top) {
        $("#ulExplain ul").idTabs(tabName_top.replace("#", ""));
    }
    //详细释义
    $("#main_content").click(function () {
        $(".pnl_word_comment").show();
        $(".recommend_box").show();
        $("#tabs4").hide();
        $("#tab_etyma").hide();
        $("#tip_content").hide();
        $("#tip_content + ul").find(".tip_content_item").each(function (i) {
            $(this).show();
        });
        $("#tip_content + ul").find(".tip_content_item").find("li").each(function (i) {
            $(this).show();
        });

        //$(".jp_open_content").hide();
        $(".jp_openAllSent").show();
        $("#panelAdvice").hide();
        $("#shift_content").show();
        //设置详细释义tab的ga 统计
        _gaq.push(['dt._trackEvent', '详细释义', '详细释义', '详细释义']);
    });
    //简明释义
    $("#detail_com").click(function () {
        $("#panel_com").show();
        $(".pnl_word_comment").show();
        $("#tabs4").hide();
        $("#tab_etyma").hide();
        $("#tip_content").show();
        $(".jp_open_content").show();
        loadSimpleContent(currentWord);
        $(".jp_openAllSent").hide();
        $("#panelAdvice").show();
        //设置简明释义 tab ga统计代码
        _gaq.push(['dt._trackEvent', '简明释义', '简明释义', '简明释义']);
    });

    $(".link_more").click(function () {
        _gaq.push(['dt._trackEvent', '左边栏展开/收起', '左边栏展开/收起', '左边栏展开/收起']);
    });

    //背诵词书GA统计
    $(".link_recite").click(function () {
        var stock = $(this).attr("title");
        _gaq.push(['dt._trackEvent', "背诵词书", stock, stock]);
    });

    //控制更多详细解释展开

    var shiftContentState = true; //控制详细解释开关，默认是关闭状态。

    loadSimpleContent(currentWord);

    $(".jp_open_content").click(function () {
        if (shiftContentState == true) {
            $(this).parent().parent().find(".pnl_word_comment ul").find(".tip_content_item").each(function (i) {
                $(this).show();
                shiftContentState = false;
            });
            $(this).html("收起");
            $(this).removeClass("open_content");
            $(this).addClass("open_content1");
            //控制具体释义显示
            $(this).parent().parent().find(".pnl_word_comment ul").find(".tip_content_item").find("li").each(function (i) {
                $(this).show();
                shiftContentState = false;
            });
            $(this).html("收起");
            $(this).removeClass("open_content");
            $(this).addClass("open_content1");
            shiftContentState = false;
        }
        else {
            $(this).html("更多详细释义");
            $(this).removeClass("open_content1");
            $(this).addClass("open_content");
            $(this).parent().parent().find(".pnl_word_comment ul").find(".tip_content_item").each(function (i) {
                if (i > 4) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }
            });
            $(this).parent().parent().find(".pnl_word_comment ul").find(".tip_content_item").find("li").each(function (k) {
                if (k > 4) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }
            });
            shiftContentState = true;
        }
        _gaq.push(['dt._trackEvent', '更多详细释义', '更多详细释义', '更多详细释义']);
    });
    // lijia add
    $(".icon_slide").click(function () {
        $this = $(this);
        $this.parent(".word_ext").next(".word_ext_con").slideToggle();
        $this.toggleClass("icon_slidedown");
        if ($this.attr("id") == "slide") {
            _gaq.push(['dt._trackEvent', '详细释义展开', '详细释义展开', '详细释义展开']);
        }
        else {
            _gaq.push(['dt._trackEvent', '折叠常用短语', '折叠常用短语', '折叠常用短语']);
        }
    });
    $(".rptHot_tab a").click(function () {
        $(".rptHot_ul").addClass("hide");
        $("#" + $(this).attr("page-panel")).removeClass("hide");
        $(".rptHot_tab li").removeClass("active");
        $(this).parent("li").addClass("active");
    });
    $("#amw_panel").live("hover", function () {
        $(".link_deleteWord", this).toggle();
        $(".link_editWord", this).toggle();
    });
    //释义置顶
    $(".flagStrong").each(function () {
        if ($(this).html() < 0) {
            $(this).parent().parent().addClass("important");
            $(this).parent().parent().find(".word_comment_num").each(function () {
                $(this).html("");
            });
            var first = 0;
            $(this).parent().parent().parent().find("li[class!='important']").each(function () {
                var num1 = $(this).find(".word_comment_num").html();
                if (num1 == 0) {
                    $(this).find(".word_comment_num").html("");
                    $(this).find(".word_comment_num").remove();

                    first += 1;
                }
                else {
                    if (num1 == first)
                        first += 1;
                    else
                        $(this).find(".word_comment_num").html(num1 - 1 + ".");
                }
            });

            //展开第一个例句
            $(this).parent().parent().parent().find("li[class!='flag important']").first().find(".pnl_cmd_sent").show();
            var $li = $(this).parent().parent().parent().find("li[class!='flag important']").first();
            if ($li.find(".sent_btn").size() > 0) {
                var nsrc = $li.find(".sent_btn").attr("src").replace("_on.", "_off.");
                $li.find(".sent_btn").addClass("off_img").removeClass("on_img");
                $li.find(".sent_btn").attr("src", nsrc);
            } //展开例句结束
        }
    });

    var ifOpenSent = true; //默认是关闭
    loadsetlab(currentWord);

    // 展开所有例句
    $(".jp_openAllSent").click(function () {
        if (ifOpenSent == true) {

            $(this).parent().find(".cmd_sent").each(function (i) {
                $(this).parent().show();
                $(this).show();
                $(this).find(".cmd_sent_en").show();
                $(this).find(".cmd_sent_cn").show();
            });

            ifOpenSent = false;

            $(this).addClass("closeAllSent");
            $(this).removeClass("openAllSent");



            //替换所有图片为减号
            $(this).parent().find(".sent_btn").each(function (i) {
                var oldsrc = $(this).attr("src");
                var nsrc = oldsrc.replace("_on.", "_off.");
                $(this).addClass("off_img").removeClass("on_img");
                $(this).attr("src", nsrc);
            });
        }
        else {

            $(this).parent().find(".cmd_sent").each(function (i) {
                $(this).parent().hide();
                $(this).hide();
            });

            ifOpenSent = true;

            $(this).addClass("openAllSent");
            $(this).removeClass("closeAllSent");



            //替换所有图片为 加号
            $(this).parent().find(".sent_btn").each(function (i) {

                var oldsrc = $(this).attr("src");
                var nsrc = oldsrc.replace("_off.", "_on.");
                $(this).addClass("on_img").removeClass("off_img");
                $(this).attr("src", nsrc);

            });
        }

        _gaq.push(['dt._trackEvent', '展开所有例句', '展开所有例句', '展开所有例句']);

    });
    //例句切换
    $(".sent_btn").click(function () {
        var oldsrc = $(this).attr("src");
        if (oldsrc.indexOf("_on.") > 0) {
            var nsrc = oldsrc.replace("_on.", "_off.");
            $(this).addClass("off_img").removeClass("on_img");
            $(this).closest("div").next("div").find("div").show();
            $(this).parent().next().find(".cmd_sent").show();
            $(this).parent().next().show();
        }
        else {
            var nsrc = oldsrc.replace("_off.", "_on.");
            $(this).addClass("on_img").removeClass("off_img");
            $(this).closest("div").next("div").find("div").hide();
            $(this).parent().next().find(".cmd_sent").hide();
            $(this).parent().next().hide();
        }
        $(this).attr("src", nsrc);
        
        var sentcount = $(".sent_btn").length;
        var oncount = $(".on_img").length;
        var offcount = $(".off_img").length;
        if (sentcount == oncount) {
            ifOpenSent = true;
            $(".jp_openAllSent").addClass("openAllSent");
            $(".jp_openAllSent").removeClass("closeAllSent");
        } else if (sentcount == offcount) {
            ifOpenSent = false;
            $(".jp_openAllSent").addClass("closeAllSent");
            $(".jp_openAllSent").removeClass("openAllSent");
        }
    });

    //展开显示第一个例句
    var $li = $(".pnl_word_comment li:first");
    if ($li.find(".sent_btn").size() > 0) {
        var nsrc = $li.find(".sent_btn").attr("src").replace("_on.", "_off.");
        $li.find(".sent_btn").addClass("off_img").removeClass("on_img");
        $li.find(".sent_btn").attr("src", nsrc);
        $li.find("div").show();
    }

    function loadSimpleContent(current) {
        var num = $(document.getElementById(current)).find(".pnl_word_comment ul ul").children().length;
        
        if (num < 6) {
            $(document.getElementById(current)).find(".jp_open_content").hide();
        }
        else {
            $(document.getElementById(current)).find("#tip_content + ul").find(".tip_content_item").each(function (i) {
                if (i > 3) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }
            });

            $(document.getElementById(current)).find(".pnl_word_comment ul").find(".flag").each(function (j) {
                if (j > 5) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }
            });
        }
    }
    
    function loadsetlab(current)
    {
        if ($(document.getElementById(current)).find(".pnl_word_comment ul").find("ul").find("li div[class='cmd_sent']").length <= 0) {
            $(document.getElementById(current)).find(".jp_openAllSent").remove();
        }
        else {
            var pnl_cmd_sent_count = 0;
            $(document.getElementById(current)).find(".pnl_word_comment").find(".pnl_cmd_sent").each(function () {
                if ($(this).find("div[class='cmd_sent']").length > 0) {
                    pnl_cmd_sent_count += 1;
                    if (pnl_cmd_sent_count == 1) {
                        if ($(this).is(":hidden") || $(this).is(":hidden") == "false" || $(this).is(":hidden") == false) {
                            $(this).show();
                            var $li = $(this).parent().parent().parent().find("li[class!='flag important']").first();
                            if ($li.find(".sent_btn").size() > 0) {
                                var nsrc = $li.find(".sent_btn").attr("src").replace("_on.", "_off.");
                                $li.find(".sent_btn").addClass("off_img").removeClass("on_img");
                                $li.find(".sent_btn").attr("src", nsrc);
                            } //展
                        }
                    }
                }
            });
            if (pnl_cmd_sent_count >= 2) {
                ifOpenSent = true;
                $(document.getElementById(current)).find(".jp_openAllSent").addClass("openAllSent");
                $(document.getElementById(current)).find(".jp_openAllSent").removeClass("closeAllSent");
            }
            else {
                ifOpenSent = false;
                $(document.getElementById(current)).find(".jp_openAllSent").addClass("closeAllSent");
                $(document.getElementById(current)).find(".jp_openAllSent").removeClass("openAllSent");
            }
        }
    }
});