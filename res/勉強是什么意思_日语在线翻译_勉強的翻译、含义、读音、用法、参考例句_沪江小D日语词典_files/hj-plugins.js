var HJPlugins = HJPlugins || function() {
	return {
		append: function(e) {
			var a = "p_footer_more";
			var t = document.getElementById(a);
			if (!t) {
				t = document.createElement("div");
				t.id = a;
				document.body.appendChild(t)
			}
			if (typeof e == "string") {
				t.insertAdjacentHTML("beforeEnd", e)
			} else {
				t.appendChild(e)
			}
		},
		parseQuery: function(e) {
			var a = (e || "").replace(/^#/, "");
			arr = a.split("&");
			var t = {};
			for (var n = 0; n < arr.length; n++) {
				var i = arr[n].split("=");
				var r = i[0].toLowerCase();
				var o = decodeURIComponent(i[1]);
				if (o.match(/%[0-9A-F]{2}/)) {
					o = decodeURIComponent(o)
				}
				t[r] = o
			}
			return t
		},
		BDShareSlide: function(e) {
			try {
				var a = {
					bdimg: 1,
					bdtop: 250
				};
				var e = $.extend(a, e);
				var t = document.createElement("script");
				t.id = "bdshare_slide_js";
				t.text = 'window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"16"},"slide":{"type":"slide","bdImg":"' + e.bdimg + '","bdPos":"right","bdTop":"' + e.bdtop + "\"}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];";
				HJPlugins.append(t)
			} catch (n) {}
		},
		BDShareImg: function(e) {
			try {
				var a = document.createElement("div");
				a.innerHTML = '<div class="bdsharebuttonbox"><a href="#"class="bds_qzone"data-cmd="qzone"title="分享到QQ空间"></a><a href="#"class="bds_tsina"data-cmd="tsina"title="分享到新浪微博"></a><a href="#"class="bds_tqq"data-cmd="tqq"title="分享到腾讯微博"></a><a href="#"class="bds_renren"data-cmd="renren"title="分享到人人网"></a><a href="#"class="bds_weixin"data-cmd="weixin"title="分享到微信"></a><a href="#"class="bds_more"data-cmd="more"></a></div>';
				var t = document.createElement("script");
				t.text = 'window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"16"},"share":{}};with(document)0[(getElementsByTagName(\'head\')[0]||body).appendChild(createElement(\'script\')).src=\'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=\'+~(-new Date()/36e5)];';
				$(e).append(a);
				$(e).append(t)
			} catch (n) {}
		},
		hjqrcode: function(e, a) {
			var t = {
				width: 110,
				qrcode: window.location.href,
				sitename: "m.hujiang.com",
				top: 80
			};
			var n = $.extend({}, t, e);
			try {
				addCssByLink("http://common.hjfile.cn/css/hjqrcode.css");
				var i = "WebkitAppearance" in document.documentElement.style;
				var r = "";
				if (i) {
					r = "canvas"
				} else {
					r = "table"
				}
				GetStatisticsUrl(n.qrcode, function(e) {
					$(a).qrcode({
						render: r,
						width: n.width,
						height: n.width,
						text: e
					}).css({
						width: n.width,
						top: n.top + "px"
					}).attr("data-url", n.qrcode).append("<div class='qr_title'>扫一扫 分享朋友圈<br/>" + n.sitename + "</div>")
				})
			} catch (o) {}
		},
		qr_close: function() {
			$(".plugin_qrcode").hide()
		}
	}
}();
$(document).ready(function() {
	$("#plugin_bdshare").each(function() {
		var e = HJPlugins.parseQuery($(this).attr("data-args"));
		HJPlugins.BDShareSlide(e)
	});
	$(".plugin_bdshare_img").each(function() {
		HJPlugins.BDShareImg(this)
	});
	$(".plugin_qrcode").each(function() {
		var e = HJPlugins.parseQuery($(this).attr("data-args"));
		$(this).append('<a href="javascript:HJPlugins.qr_close();" class="qr_close" title="点击关闭"><img src="http://i2.w.yun.hjfile.cn/doc/201404/69cad619917c4d6cbb728fd3d49c6111.png" /></a>');
		HJPlugins.hjqrcode(e, this)
	})
});

function addCssByLink(e) {
	var a = document;
	var t = a.createElement("link");
	t.setAttribute("rel", "stylesheet");
	t.setAttribute("type", "text/css");
	t.setAttribute("href", e);
	var n = a.getElementsByTagName("head");
	if (n.length) n[0].appendChild(t);
	else a.documentElement.appendChild(t)
}

function getLangs() {
	var e = window.location.host.replace(/\d+/, "");
	var a = e.match(/(\w+)\.\w+\.\w+$/);
	var t = "all";
	if (a.length >= 2) {
		if (a[0] == "www.hjenglish.com") {
			t = "en"
		} else {
			t = a[1]
		}
		if (t == "www") {
			t = "all"
		}
	}
	return t
}

function GetStatisticsUrl(e, a) {
	var t = getLangs();
	var n = "site_" + t + "_hjqrcode";
	var i = "http://channel.hujiang.com/ch_click.aspx?ch_source=" + n + "&page=" + e;
	var r = "http://api.t.sina.com.cn/short_url/shorten.json";
	$.ajax({
		type: "GET",
		cache: true,
		url: r,
		data: {
			source: "1681459862",
			url_long: i
		},
		dataType: "jsonp",
		jsonp: "callback",
		jsonpCallback: "jsonpshorturl",
		success: function(e) {
			if (e != null && e.length > 0 && e[0].type == 0 && e[0].url_short != "") {
				a(e[0].url_short)
			} else {
				a(i)
			}
		},
		error: function() {
			a(i)
		}
	})
}

function toCode(e, a) {
	var e = e || "0";
	var a = a || 16;
	var t = 0;
	for (var n = 0; n < e.length; n++) {
		t += e.charCodeAt(n) * n
	}
	return t.toString(16).substr(0, a)
}