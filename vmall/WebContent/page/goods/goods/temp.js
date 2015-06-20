$(function() {
	$("#puller").generateRegionList({
		actionURL : "/ware/thirdAddress.json",
		wareID : $("#currentWareId").val()
	});
	try {
		var wxIPhoneControul = $("#wxIPhoneControul").val();
		if (wxIPhoneControul != "" && "true" == wxIPhoneControul) {
			var before = new Date();
			var iframe = document.createElement("iframe");
			iframe.style.cssText = "display:none;width:0px;height:0px;";
			document.body.appendChild(iframe);
			var intentUrl = $("#wxToClient").attr("href");
			try {
				var parametersArr = [];
				try {
					parametersArr.push('"m_param":'
							+ MPing.EventSeries.getSeries())
				} catch (e) {
					parametersArr.push('"m_param":null')
				}
				var parametersStr = parametersArr.join(",");
				if (parametersStr) {
					intentUrl = intentUrl.split("}")[0] + "," + parametersStr
							+ "}"
				}
			} catch (e) {
			}
			iframe.src = intentUrl;
			setTimeout(function() {
				try {
					var after = new Date();
					if (after - before > 250) {
						var click = new MPing.inputs.Click(
								"MVirtual_ProductDetail_Expose");
						click.event_param = $("#currentWareId").val();
						var mping = new MPing();
						mping.send(click)
					}
				} catch (e) {
				}
			}, 200)
		}
	} catch (e) {
	}
	var scrollleft = window.pageXOffset || document.documentElement.scrollLeft
			|| document.body.scrollLeft;
	var allWidth = document.documentElement.clientWidth
			|| document.body.clientWidth;
	var left = scrollleft - 114 + (allWidth / 2);
	var left2 = scrollleft - 135 + (allWidth / 2);
	document.getElementById("cart").style.left = left + "px";
	document.getElementById("tip").style.left = left2 + "px";
	$("#cartyuyue")
			.bind(
					"click",
					function() {
						jQuery
								.ajax({
									url : urlEncode("/ware/isAppoint.json", $(
											"#sid").val()),
									data : {
										wareId : $("#currentWareId").val()
									},
									success : function(d) {
										try {
											var spinner2 = createSpinner();
											$("#spinner2").show();
											spinner2.spin($("#spinner2")[0]);
											var isAppoint = JSON.parse(d).isAppoint;
											if (true == isAppoint) {
												addWareToCart()
											} else {
												$("#tip").css("display",
														"block");
												var poptext = JSON.parse(d).text;
												if (poptext != null
														&& poptext != "") {
													$(".pop-txt").text(
															JSON.parse(d).text)
												} else {
													$(".pop-txt").text(
															"系统繁忙，请稍后再试!")
												}
												var top = 100;
												var scrollTop = window.pageYOffset
														|| document.documentElement.scrollTop
														|| document.body.scrollTop;
												var allHeight = document.documentElement.clientHeight
														|| document.body.clientHeight;
												document.getElementById("tip").style.bottom = ((allHeight - top) / 2 - scrollTop)
														+ "px";
												$("#myyuyue").css("display",
														"none")
											}
										} catch (e) {
											window.location.href = "https://passport.m.jd.com/user/login.action?sid="
													+ sid
													+ "&returnurl=http://m.jd.com/product/"
													+ $("#currentWareId").val()
													+ ".html"
										}
									},
									error : function(d) {
										window.location.href = "https://passport.m.jd.com/user/login.action?sid="
												+ sid
												+ "&returnurl=http://m.jd.com/product/"
												+ $("#currentWareId").val()
												+ ".html"
									}
								})
					});
	$("#attention")
			.bind(
					"click",
					function() {
						if ($("#attention").hasClass("on")) {
							jQuery
									.ajax({
										url : urlEncode(
												"/user/cancelFavorite.json", $(
														"#sid").val()),
										data : {
											wareId : $("#currentWareId").val()
										},
										success : function(d) {
											try {
												var obj = eval("(" + d + ")");
												$("#attention").removeClass(
														"on");
												iconShow(1)
											} catch (e) {
												window.location.href = "https://passport.m.jd.com/user/login.action?sid="
														+ $("#sid").val()
														+ "&returnurl=http://m.jd.com/product/"
														+ $("#currentWareId")
																.val()
														+ ".html"
											}
										},
										error : function(d) {
											window.location.href = "https://passport.m.jd.com/user/login.action?sid="
													+ $("#sid").val()
													+ "&returnurl=http://m.jd.com/product/"
													+ $("#currentWareId").val()
													+ ".html"
										}
									});
							pingClick("MProductdetail_AddtoFollowed", $(
									"#currentWareId").val(), "", $(
									"#currentWareId").val())
						} else {
							jQuery
									.ajax({
										url : urlEncode(
												"/user/addFavorite.json", $(
														"#sid").val()),
										data : {
											wareId : $("#currentWareId").val()
										},
										success : function(d) {
											try {
												var obj = eval("(" + d + ")");
												$("#attention").addClass("on");
												iconShow(0)
											} catch (e) {
												window.location.href = "https://passport.m.jd.com/user/login.action?sid="
														+ $("#sid").val()
														+ "&returnurl=http://m.jd.com/product/"
														+ $("#currentWareId")
																.val()
														+ ".html"
											}
										},
										error : function(d) {
											window.location.href = "https://passport.m.jd.com/user/login.action?sid="
													+ $("#sid").val()
													+ "&returnurl=http://m.jd.com/product/"
													+ $("#currentWareId").val()
													+ ".html"
										}
									});
							pingClick("MProductdetail_AddtoFollowed", $(
									"#currentWareId").val(), "", $(
									"#currentWareId").val())
						}
					});
	var addWareToCart = function() {
		if ("1" == $("#type").val()) {
			judgeKO($("#currentWareId").val(), $("#sid").val())
		} else {
			newAddWare($("#currentWareId").val(), $("#number").val(), false, $(
					"#ybId").val(), $("#resourceType").val(), $(
					"#resourceValue").val(), $("#sid").val())
		}
		pingAddClick("MProductdetail_Addtocart", "", "", $("#currentWareId")
				.val())
	};
	var addWareToCartAndNoJump = function() {
		newAddWare($("#currentWareId").val(), $("#number").val(), true, $(
				"#ybId").val(), $("#resourceType").val(), $("#resourceValue")
				.val(), $("#sid").val());
		pingAddClick("MProductdetail_Easybuy", "", "", $("#currentWareId")
				.val())
	};
	var toCart = function() {
		var sid = $("#sid").val();
		var locations = "/cart/cart.action";
		pingClick("MProductdetail_GotoCart", "", "", $("#currentWareId").val());
		if (sid != null && sid != "") {
			locations += "?sid=" + sid
		}
		window.location.href = locations
	};
	$("#add_cart").click(addWareToCart);
	$("#directorder").click(addWareToCartAndNoJump);
	$("#toCart").click(toCart);
	var time, type;
	type = $("#yuyueType").val();
	switch (type) {
	case "1":
		$("#yuyueing").find(".btn-yuyue").attr("data", "1");
		$("#yuyuecontext").text("\u5f00\u59cb\u9884\u7ea6");
		$("#yuyueing").show();
		time = new Date().getTime()
				/ 1000
				+ parseInt($("#yuYueStartTime").val().length > 0 ? $(
						"#yuYueStartTime").val() : 0);
		getTimes();
		break;
	case "2":
		$(".btn-yuyue2").attr("data", "2");
		$("#yuyuenow").show();
		$("#yuyuenow").css("display", "block");
		time = new Date().getTime()
				/ 1000
				+ parseInt($("#yuYueEndTime").val().length > 0 ? $(
						"#yuYueEndTime").val() : 0);
		getTimes();
		break;
	case "3":
		$("#yuyueing").find(".btn-yuyue").attr("data", "3");
		$("#yuyuecontext").text("\u5f00\u59cb\u62a2\u8d2d");
		if ("$!yuYue.buyStartTime".length > 0) {
			time = new Date().getTime()
					/ 1000
					+ parseInt($("#buyStartTime").val().length > 0 ? $(
							"#buyStartTime").val() : 0);
			getTimes()
		} else {
			$("#yuyuetime")
					.text(
							"\u62a2\u8d2d\u672a\u5f00\u59cb\uff0c\u656c\u8bf7\u5173\u6ce8");
			$("#yuyuecontext").empty()
		}
		$("#yuyueing").show();
		break;
	case "4":
		$("#yuyuecart").show();
		$("#cartyuyue").attr("data", "4");
		if (!$("#cartFlag").val()) {
			$("#cartyuyue").attr("style", "background-color:#666");
			$("#cartyuyue").unbind("click");
			$("#yuyuecart").unbind("click")
		}
		time = new Date().getTime()
				/ 1000
				+ parseInt($("#buyEndTime").val().length > 0 ? $("#buyEndTime")
						.val() : 0);
		getTimes();
		break;
	case "5":
		if ("true" == "$yuYue.isYuYue") {
			$("#yuyueendcontext").text("\u62a2\u8d2d\u5df2\u7ed3\u675f");
			$("#yuyueend").css("display", "block")
		} else {
			if (!($("#stockFlag").val())) {
				$("#add_cart").addClass("btn-fail");
				$("#directorder").addClass("btn-fail");
				$("#add_cart").unbind("click");
				$("#directorder").unbind("click")
			} else {
				$("#cart1").css("display", "table");
				$("#add_cart").removeClass("btn-fail");
				$("#directorder").removeClass("btn-fail")
			}
		}
		break;
	default:
		break
	}
	var endTime;
	function iconShow(e) {
		var scrollleft = window.pageXOffset
				|| document.documentElement.scrollLeft
				|| document.body.scrollLeft;
		var allWidth = document.documentElement.clientWidth
				|| document.body.clientWidth;
		var left = scrollleft - 60 + (allWidth / 2);
		document.getElementById("save").style.left = left + "px";
		var scrollheight = window.pageYOffset
				|| document.documentElement.scrollTop
				|| document.body.scrollTop;
		var allHeight = document.documentElement.clientHeight
				|| document.body.clientHeight;
		var top = scrollheight - 25 + (allHeight / 2);
		document.getElementById("save").style.top = top + "px";
		if (1 == e) {
			$("#guanzhu").html("\u53d6\u6d88\u6210\u529f")
		} else {
			$("#guanzhu").html("\u5173\u6ce8\u6210\u529f")
		}
		$(".pop-attention").show();
		setTimeout(function() {
			$(".pop-attention").hide()
		}, 3000)
	}
	function getTimes() {
		var now_time = new Date().getTime() / 1000;
		var time_distance = parseInt(time - now_time);
		var int_day, int_hour, int_minute, int_second, str_time;
		if (time_distance >= 0) {
			int_day = Math.floor(time_distance / 86400);
			int_hour = Math.floor((time_distance - int_day * 86400) / 3600);
			int_minute = Math
					.floor((time_distance - int_day * 86400 - int_hour * 3600) / 60);
			int_second = Math.floor(time_distance - int_day * 86400 - int_hour
					* 3600 - int_minute * 60);
			if (parseInt(int_day) > 0) {
				str_time = int_day + "\u5929" + int_hour + "\u5c0f\u65f6"
						+ int_minute + "\u5206\u949f\u540e"
			} else {
				str_time = int_hour + "\u5c0f\u65f6" + int_minute
						+ "\u5206\u949f" + int_second + "\u79d2\u540e"
			}
			if ("1" == type) {
				$("#yuyuetime").text(str_time)
			} else {
				if ("3" == type) {
					$("#yuyuetime").text(str_time)
				}
			}
			if (0 == parseInt(time_distance)) {
				window.location.reload()
			}
			if (time_distance > 0) {
				setTimeout(function() {
					getTimes()
				}, 1000)
			}
		}
	}
	function yuyueRender(data) {
		if (data && data.yuYue && data.yuYue.isYuYue) {
			var href = "http://m.jd.com/yuyue/" + data.ware.wareId + ".html";
			$("#nowyuyue").attr("href", href);
			$("#cart1").css("display", "none");
			type = data.yuYue.yuyueType;
			if ("1" == data.yuYue.yuyueType) {
				$("#yuyuecart").css("display", "none");
				$("#yuyuenow").css("display", "none");
				$("#yuyueing").find(".btn-yuyue").attr("data", "1");
				$("#yuyuecontext").text("\u5f00\u59cb\u9884\u7ea6");
				$("#yuyueing").show();
				time = new Date().getTime() / 1000
						+ parseInt(data.yuYue.yuYueStartTime);
				getTimes()
			} else {
				if ("2" == data.yuYue.yuyueType) {
					$("#yuyueing").css("display", "none");
					$("#yuyuecart").css("display", "none");
					$(".btn-yuyue2").attr("data", "2");
					$("#yuyuenow").show();
					$("#yuyuenow").css("display", "block");
					time = new Date().getTime() / 1000
							+ parseInt(data.yuYue.yuYueEndTime);
					getTimes()
				} else {
					if ("3" == data.yuYue.yuyueType) {
						$("#test2").text(data.yuYue.buyStartTime);
						$("#yuyuenow").css("display", "none");
						$("#yuyuecart").css("display", "none");
						$("#yuyueing").show();
						$("#yuyueing").find(".btn-yuyue").attr("data", "3");
						$("#yuyuetime").empty();
						$("#yuyuecontext").empty();
						if (parseInt(data.yuYue.buyStartTime) > 0) {
							$("#yuyuecontext").text("\u5f00\u59cb\u62a2\u8d2d");
							time = new Date().getTime() / 1000
									+ parseInt(data.yuYue.buyStartTime);
							getTimes()
						} else {
							$("#yuyuetime")
									.text(
											"\u62a2\u8d2d\u672a\u5f00\u59cb\uff0c\u656c\u8bf7\u5173\u6ce8");
							$("#yuyuecontext").empty()
						}
					} else {
						if ("4" == data.yuYue.yuyueType) {
							$("#yuyueing").css("display", "none");
							$("#yuyuenow").css("display", "none");
							$("#yuyuecart").show();
							$("#cartyuyue").attr("data", "4");
							time = new Date().getTime() / 1000
									+ parseInt(data.yuYue.buyEndTime);
							getTimes()
						} else {
							if ("5" == data.yuYue.yuyueType) {
								$("#yuyueendcontext").text(
										"\u62a2\u8d2d\u5df2\u7ed3\u675f");
								$("#yuyueend").css("display", "block")
							}
						}
					}
				}
			}
		} else {
			$("#cart1").css("display", "table");
			$("#add_cart").removeClass("btn-cart-def");
			$("#directorder").removeClass("btn-buy-def")
		}
	}
	addTouchEvent(document.getElementById("imgSlider"));
	function addTouchEvent(obj) {
		obj.ontouchstart = tStart;
		obj.ontouchmove = tMove;
		obj.ontouchend = tEnd
	}
	$(".row01")
			.each(
					function() {
						$(this)
								.bind(
										"click",
										function() {
											if ($(this).parent(".list-entry")
													.hasClass("open")) {
												$(this).parent(".list-entry")
														.removeClass("open")
											} else {
												$(this).parent(".list-entry")
														.addClass("open");
												if ($(this).attr("id") == "promotionitem"
														&& $("#suite-slider").length == 1) {
													if (!$("#suite-slider")
															.attr("opend")) {
														$("#suite-slider")
																.jdSlider({
																	lineNum : 1
																});
														$("#suite-slider")
																.attr("opend",
																		"1")
													} else {
														$("#suite-slider")
																.jdSlider({
																	lineNum : 1
																})
													}
												}
											}
										})
					});
	$(".promise-ico").bind("click", function() {
		if ($(this).hasClass("a-show")) {
			$(this).removeClass("a-show")
		} else {
			$(this).addClass("a-show")
		}
	});
	$("#icon-slow").bind("click", function() {
		if ($(".promise-ico").hasClass("a-show")) {
			$(".promise-ico").removeClass("a-show")
		} else {
			$(".promise-ico").addClass("a-show")
		}
	});
	var imgCache = new Array(getAllImgs().split(",").length);
	var currentImg = 0;
	var preImgSize = 1;
	var startX, startY, endX, endY, absX, absY;
	function tStart(event) {
		var touch = event.touches[0];
		startX = touch.pageX;
		startY = touch.pageY
	}
	function tMove(event) {
		var touch = event.touches[0];
		endX = touch.pageX;
		endY = touch.pageY;
		absX = Math.abs(startX - endX);
		absY = Math.abs(startY - endY);
		if (absX > absY) {
			event.preventDefault()
		}
	}
	function tEnd(event) {
		if (absX > absY) {
			if (startX > endX) {
				nextImg()
			} else {
				prevImg()
			}
		}
		startX = 0, startY = 0, endX = 0, endY = 0, absX = 0, absY = 0
	}
	function nextImg() {
		var allImgs = getAllImgs();
		currentImg++;
		var imgArr = allImgs.split(",");
		if (currentImg == imgArr.length) {
			currentImg = 0;
			window.location.href = "/ware/detail.action?wareId="
					+ $("#currentWareId").val()
		}
		preLoadImg();
		loadImg(imgCache[currentImg], 1)
	}
	function prevImg() {
		var allImgs = getAllImgs();
		currentImg--;
		var imgArr = allImgs.split(",");
		if (currentImg < 0) {
			currentImg = imgArr.length - 1
		}
		preLoadImg();
		loadImg(imgCache[currentImg], 0)
	}
	function getAllImgs() {
		var allImgs = $.trim($("#imgs").val());
		if (allImgs.substring(allImgs.length - 1) == ",") {
			allImgs = allImgs.substring(0, allImgs.length - 1)
		}
		return allImgs
	}
	function preLoadImg() {
		var imgs = getAllImgs();
		var imgArr = imgs.split(",");
		var tmp;
		if (!imgCache[currentImg]) {
			imgCache[currentImg] = (createImg(imgArr[currentImg], 200, 200))
		}
		for (var i = 0; i < preImgSize; i++) {
			tmp = currentImg + (i + 1);
			if (tmp < imgArr.length) {
				if (!imgCache[tmp]) {
					imgCache[tmp] = createImg(imgArr[tmp], 200, 200)
				}
			}
			tmp = currentImg - (i + 1);
			if (tmp < 0) {
				tmp = imgArr.length + tmp;
				if (!imgCache[tmp]) {
					imgCache[tmp] = (createImg(imgArr[tmp], 200, 200))
				}
			} else {
				if (!imgCache[tmp]) {
					imgCache[tmp] = (createImg(imgArr[tmp], 200, 200))
				}
			}
		}
	}
	function loadImg(img, rol) {
		var imgs = getAllImgs();
		if (imgs == "") {
			return
		}
		var arrImg = imgs.split(",");
		if (arrImg.length == 0) {
			return
		}
		if (rol == undefined) {
			$("#tips").empty();
			var html = '<span class="tbl-cell"><img src="' + img.src
					+ '" seq="' + currentImg
					+ '" width="320" height="292"></span>';
			$("#imgSlider").html(html);
			$("#imgSlider").css("left", "0px")
		} else {
			if (1 == rol) {
				var prev = currentImg - 1 < 0 ? arrImg.length - 1
						: currentImg - 1;
				$('#imgSlider img[seq="' + prev + '"]').parent("span")
						.siblings().remove();
				$("#tips").empty();
				var html = '<span class="tbl-cell"><img src="'
						+ imgCache[currentImg].src + '" seq="' + currentImg
						+ '" width="320" height="292"></span>';
				$("#imgSlider").append(html);
				if (currentImg + 1 == arrImg.length) {
					var htm = currentImg + 1 + "/" + arrImg.length;
					$("#tips")
							.html(
									"\u7ee7\u7eed\u53f3\u5212\u8fdb\u5165\u5546\u54c1\u8be6\u60c5\u9875")
				}
				var htm = currentImg + 1 + "/" + arrImg.length;
				$("#imgpage").html(htm);
				$("#imgSlider").css("left", "0px");
				if (arrImg.length != 1) {
					setTimeout(function() {
						$("#imgSlider").animate({
							left : "-320px"
						}, 200)
					}, 10)
				}
			} else {
				if (0 == rol) {
					var prev = currentImg + 1 > arrImg.length - 1 ? 0
							: currentImg + 1;
					$('#imgSlider img[seq="' + prev + '"]').parent("span")
							.siblings().remove();
					$("#tips").empty();
					var html = '<span class="tbl-cell"><img src="'
							+ imgCache[currentImg].src + '" seq="' + currentImg
							+ '" width="320" height="292"></span>';
					$("#imgSlider").prepend(html);
					if (currentImg + 1 == arrImg.length) {
						$("#tips")
								.html(
										"\u7ee7\u7eed\u53f3\u5212\u8fdb\u5165\u5546\u54c1\u8be6\u60c5\u9875")
					}
					var htm = currentImg + 1 + "/" + arrImg.length;
					$("#imgpage").html(htm);
					$("#imgSlider").css("left", "-320px");
					setTimeout(function() {
						$("#imgSlider").animate({
							left : "0px"
						}, 200)
					}, 10)
				}
			}
		}
	}
	function createImg(url, width, height) {
		var img = new Image();
		img.src = url;
		img.width = width;
		img.height = height;
		img.ontouchstart = tStart;
		img.ontouchmove = tMove;
		img.ontouchend = tEnd;
		return img
	}
	var yanBaotick = function() {
		$("span[data=yanbao]")
				.bind(
						"click",
						function() {
							if ($(this).children("i").hasClass("active")) {
								$(this).children("i").removeClass("active")
							} else {
								$(this).children("i").addClass("active");
								$(this).parent("li").siblings().find("i")
										.removeClass("active")
							}
							var ybId = "";
							$("#ybShow").empty();
							var yanbaoHtml = "";
							$('span[data="yanbao"]')
									.each(
											function() {
												if ($(this).children("i")
														.hasClass("active")) {
													ybId += $(this)
															.attr("name")
															+ "@@";
													yanbaoHtml += '<li class="list-item"><span class="fore01">'
															+ $(this).next(
																	"span")
																	.text()
															+ '</span><span class="fore02">'
															+ $(this).children(
																	"span")
																	.text()
															+ "</span></li>"
												}
											});
							$("#ybShow").html(yanbaoHtml);
							$("#ybId").val(ybId);
							if (ybId && ybId != "") {
								$("#directorder").addClass("btn-fail");
								$("#directorder").unbind("click")
							} else {
								if (ybId == ""
										&& "false" != $("#stockFlag").val()) {
									$("#directorder").removeClass("btn-fail");
									$("#directorder").bind("click", function() {
										addWareToCartAndNoJump()
									})
								}
							}
						})
	};
	yanBaotick();
	function collectYbId() {
		var ybId = "";
		$('span[data="yanbao"]').each(function() {
			if ($(this).children("i").hasClass("active")) {
				ybId += $(this).attr("name") + "@@"
			}
		});
		$("#ybId").val(ybId)
	}
	$(".menu-fixed-mini").bind("click", function() {
		if ($(".menu-fixed").hasClass("active")) {
			$(".menu-fixed").removeClass("active")
		} else {
			$(".menu-fixed").addClass("active")
		}
	});
	var spinner1 = createSpinner();
	function detail(v) {
		$("#spinner1").show();
		spinner1.spin($("#spinner1")[0]);
		$.post("/ware/view.json", {
			wareId : v,
			sid : $("#sid").val(),
			provinceId : $("#province").val(),
			cityId : $("#city").val(),
			countryId : $("#country").val(),
			townId : $("#town").val()
		}, function(d) {
			yuyueRender(d);
			imageRender(d);
			infoRender(d);
			stockRender(d);
			spinner1.stop();
			$("#spinner1").hide();
			window.scrollTo(0, 0)
		}, "json")
	}
	function imageRender(data) {
		if (data && data.ware && data.ware.images
				&& data.ware.images.length > 0) {
			var strImg = "";
			$.each(data.ware.images, function(i, v) {
				if (v && v.newpath) {
					strImg = strImg + v.newpath.replace("/n4/", "/n1/") + ","
				}
			});
			$("#imgs").val(strImg);
			imgCache = new Array(getAllImgs().split(",").length);
			currentImg = 0;
			var htm = currentImg + 1 + "/" + imgCache.length;
			$("#imgpage").html(htm);
			preLoadImg();
			loadImg(imgCache[currentImg])
		}
	}
	var pid = $("#currentWareId").val();
	var url = "http://chat1.jd.com/api/checkChat?pid=" + pid
			+ "&entry=m_item&returnCharset=gb2312&callback=?";
	if ($("#onlineService").val()) {
		jQuery.getJSON(url, doResult)
	}
	function doResult(json) {
		if ((!json || !json.code)) {
			$("#kefu").hide();
			return
		}
		if (!json || !json.code) {
			return
		}
		var code = json.code;
		if (code == 1) {
			$("#kefu").show();
			var url = "http://im.m.jd.com/merchant/index?v=6&sku="
					+ $("#currentWareId").val()
					+ "&imgUrl="
					+ $("#imgUrl").val()
					+ "&goodName="
					+ encodeURIComponent(encodeURIComponent($("#goodName")
							.val())) + "&jdPrice=" + $("#jdPrice").val()
					+ "&sid=" + $("#sid").val();
			$("#im").attr("href", url)
		} else {
			if (code == 2 || code == 3 || code == 9) {
				$("#kefu").show();
				$(".jdong").addClass("off")
			}
		}
	}
	$("#province").live("change", function() {
		$("#cart").hide();
		if ($(this).val() == "84") {
			$("#citytip").hide();
			$("#fare").hide();
			$("#pShow").text("\u9493\u9c7c\u5c9b");
			$(".promise-ico").hide();
			$("#countrytip").hide();
			$("#towntip").hide();
			$("#stockStatus").html("\u65e0\u8d27");
			$("#add_cart").addClass("btn-fail");
			$("#directorder").addClass("btn-fail");
			$("#add_cart").unbind("click");
			$("#directorder").unbind("click");
			return
		}
		provinceChange($(this).val())
	});
	$("#city").live("change", function() {
		$("#cart").hide();
		cityChange($(this).val(), $("#province").val())
	});
	$("#country").live("change", function() {
		$("#cart").hide();
		countryChange($(this).val(), $("#province").val(), $("#city").val())
	});
	$("#town").live(
			"change",
			function() {
				$("#cart").hide();
				townChange($(this).val(), $("#province").val(), $("#city")
						.val(), $("#country").val())
			});
	var cartJson = $("#cartJson").val();
	if (cartJson && "true" == cartJson) {
		$.post("/cart/cartNum.json", {
			sid : $("#sid").val()
		}, function(data) {
			if (data && data.cartJson && data.cartJson.Num) {
				var cartNum = data.cartJson.Num;
				if (parseInt(cartNum) > 0) {
					if ($("#toCart i").length == 0) {
						$("#toCart").prepend("<i></i>")
					}
					$("#toCart i").text(cartNum)
				}
			}
		}, "json")
	}
});
function getCookie(c) {
	var b = document.cookie.split(";");
	for (var d = 0; d < b.length; d++) {
		if (b[d].indexOf(c) > 0) {
			var a = b[d].split("=");
			if (a.length > 1) {
				return unescape(a[1])
			} else {
				return ""
			}
		}
	}
	return ""
}
var addWareToCart = function() {
	if ("1" == $("#type").val()) {
		judgeKO($("#currentWareId").val(), $("#sid").val())
	} else {
		newAddWare($("#currentWareId").val(), $("#number").val(), false, $(
				"#ybId").val(), $("#resourceType").val(), $("#resourceValue")
				.val(), $("#sid").val())
	}
	pingAddClick("MProductdetail_Addtocart", "", "", $("#currentWareId").val())
};
var addWareToCartAndNoJump = function() {
	newAddWare($("#currentWareId").val(), $("#number").val(), true, $("#ybId")
			.val(), $("#resourceType").val(), $("#resourceValue").val(), $(
			"#sid").val());
	pingAddClick("MProductdetail_Easybuy", "", "", $("#currentWareId").val())
};
var spinner1 = createSpinner();
function provinceChange(a) {
	$("#spinner1").show();
	spinner1.spin($("#spinner1")[0]);
	$.post("/ware/thirdAddress.json", {
		provinceId : a,
		sid : $("#sid").val(),
		wareId : $("#currentWareId").val()
	}, function(b) {
		stockRender(b);
		infoRender(b);
		spinner1.stop();
		$("#spinner1").hide()
	}, "json")
}
function cityChange(b, a) {
	$("#spinner1").show();
	spinner1.spin($("#spinner1")[0]);
	$.post("/ware/thirdAddress.json", {
		provinceId : a,
		cityId : b,
		sid : $("#sid").val(),
		wareId : $("#currentWareId").val()
	}, function(c) {
		stockRender(c);
		infoRender(c);
		spinner1.stop();
		$("#spinner1").hide()
	}, "json")
}
function countryChange(b, a, c) {
	$("#spinner1").show();
	spinner1.spin($("#spinner1")[0]);
	$.post("/ware/thirdAddress.json", {
		provinceId : a,
		cityId : c,
		countryId : b,
		sid : $("#sid").val(),
		wareId : $("#currentWareId").val()
	}, function(e) {
		stockRender(e);
		infoRender(e);
		spinner1.stop();
		$("#spinner1").hide()
	}, "json")
}
function townChange(b, a, d, c) {
	$("#spinner1").show();
	spinner1.spin($("#spinner1")[0]);
	$.post("/ware/thirdAddress.json", {
		provinceId : a,
		cityId : d,
		countryId : c,
		townId : b,
		sid : $("#sid").val(),
		wareId : $("#currentWareId").val()
	}, function(e) {
		stockRender(e);
		infoRender(e);
		spinner1.stop();
		$("#spinner1").hide()
	}, "json")
}
function infoRender(b) {
	$("#wareInfo").attr("href",
			urlEncode("/detail/" + b.ware.wareId + ".html", $("#sid").val()));
	if (b && b.stock) {
		var a = "";
		if (b.stock.jdPrice && b.stock.jdPrice != ""
				&& b.stock.jdPrice.toLowerCase() != "null"
				&& parseFloat(b.stock.jdPrice) > 0) {
			a = "&yen;" + b.stock.jdPrice
		} else {
			a = "&#26242;&#26080;&#25253;&#20215;"
		}
		$("#price").html(a);
		$("#currentWareId").val(b.stock.wareId);
		$("#jdPrice").val(b.stock.jdPrice)
	} else {
		var a = "";
		if (b.ware.jdPrice && b.ware.jdPrice != ""
				&& b.ware.jdPrice.toLowerCase() != "null"
				&& parseFloat(b.ware.jdPrice) > 0) {
			a = "&yen;" + b.ware.jdPrice
		} else {
			a = "&#26242;&#26080;&#25253;&#20215;"
		}
		$("#price").html(a);
		$("#jdPrice").val(b.ware.jdPrice)
	}
	if (b && b.stock && b.stock.flag) {
		if ((b.stock.jdPrice > 0) && b.stock.flag) {
			$("#stockFlag").val(b.stock.flag);
			if ($("#directorder").hasClass("btn-fail")
					&& "" == $("#ybId").val()) {
				$("#directorder").removeClass("btn-fail")
			}
			if ($("#add_cart").hasClass("btn-fail")) {
				$("#add_cart").removeClass("btn-fail")
			}
			$("#add_cart").unbind("click");
			$("#add_cart").bind("click", function() {
				addWareToCart()
			});
			$("#directorder").unbind("click");
			$("#directorder").bind("click", function() {
				addWareToCartAndNoJump()
			})
		}
	} else {
		if (b.stock && b.stock.flag) {
			$("#stockFlag").val(b.stock.flag)
		} else {
			$("#stockFlag").val("false");
			$("#add_cart").addClass("btn-fail")
		}
		$("#directorder").addClass("btn-fail");
		$("#directorder").unbind("click")
	}
	if (b && b.yuYue) {
		$("#yuyueType").val(b.yuYue.yuyueType);
		$("#yuYueStartTime").val(b.yuYue.yuYueStartTime);
		$("#yuYueEndTime").val(b.yuYue.yuYueEndTime);
		$("#buyStartTime").val(b.yuYue.buyStartTime);
		$("#buyEndTime").val(b.yuYue.buyEndTime)
	}
}
function stockRender(c) {
	if (c) {
		if (c.stock && c.stock.status) {
			$("#stockStatus").html(c.stock.status)
		}
		$(".promise-ico").empty();
		if (c.ware && c.ware.iconList) {
			$.each(c.ware.iconList, function(e, d) {
				$(".promise-ico").append(
						'<span class="txt02"><i class="icon-bg03"><img src="'
								+ d.imageUrl + '" width="15" height="15"/>'
								+ d.name + '</i><span class="txt">' + d.tip
								+ "</span>")
			});
			$(".promise-ico").append('<em class="icon-up"></em>')
		} else {
			$(".promise-ico").css("display", "none")
		}
		$(".promise-ico").show();
		if (c.ware && c.ware.fare) {
			$("#fareMoney").empty();
			$("#fareMoney").text(c.ware.fare);
			$("#fare").show()
		}
		if (c.ware && c.ware.proFlagList) {
			$("#sale").empty();
			$.each(c.ware.proFlagList, function(e, d) {
				$("#sale").append('<i class="icon-bg02">' + d.text + "</i> ")
			})
		}
		if (c.proInformation) {
			$("#saleInfo").empty();
			if (c.proInformation.activityList) {
				$.each(c.proInformation.activityList, function(e, d) {
					$("#saleInfo").append(
							'<li> <span class="col02"> <em class="icon-bg02">'
									+ d.text + '</em> <span class="txt01">'
									+ d.value + "</span> </span> </li>")
				})
			}
			if (c.proInformation.giftList) {
				$.each(c.proInformation.giftList, function(e, d) {
					$("#saleInfo").append(
							'<li> <span class="col02"> <em class="icon-bg02">'
									+ d.text + '</em> <span class="txt01">'
									+ d.value + "</span> </span> </li>")
				})
			}
			if (c.proInformation.suitList
					&& c.proInformation.suitList.length > 0) {
				var b = c.proInformation.suitList;
				b.sort(function(e, d) {
					var g = (e.discount + "").substring(1);
					var f = (d.discount + "").substring(1);
					return parseInt(g) < parseInt(f) ? 1 : -1
				});
				$("#saleInfo")
						.append(
								'<li> <span class="col02"> <em class="icon-bg02">\u4f18\u60e0\u5957\u88c5</em> <span class="txt01">\u6700\u9ad8\u7701'
										+ b[0].discount
										+ '\u5143</span> </span> <span class="txt-amount"><a href="javascript:void(0)">\u5171'
										+ b.length + "\u6b3e</a></span> </li>");
				var a = "";
				$
						.each(
								c.proInformation.suitList,
								function(e, d) {
									a += '<li class="icon-suit jd-slider-item"> <a href="'
											+ urlEncode(
													"/suit/"
															+ c.ware.wareId
															+ ".html?resourceType="
															+ $("#resourceType")
																	.val()
															+ "&resourceValue="
															+ $(
																	"#resourceValue")
																	.val(), $(
															"#sid").val())
											+ '"><span class="val-mid">\u5957\u88c5'
											+ (e + 1) + "</span> </a></li>";
									a += '<li class="list-suit-item  jd-slider-item"> <a href="'
											+ urlEncode(
													"/suit/"
															+ c.ware.wareId
															+ ".html?resourceType="
															+ $("#resourceType")
																	.val()
															+ "&resourceValue="
															+ $(
																	"#resourceValue")
																	.val(), $(
															"#sid").val())
											+ '" class="box-img-link"><div class="p-img"> <img width="70" height="70" alt="img" src="'
											+ c.proInformation.domain
											+ d.mainSkuPicUrl
											+ '"></div></a></li>';
									$
											.each(
													d.productList,
													function(g, f) {
														a += '<li class="list-suit-item  jd-slider-item"> <a href="'
																+ urlEncode(
																		"/suit/"
																				+ c.ware.wareId
																				+ ".html?resourceType="
																				+ $(
																						"#resourceType")
																						.val()
																				+ "&resourceValue="
																				+ $(
																						"#resourceValue")
																						.val(),
																		$(
																				"#sid")
																				.val())
																+ '" class="box-img-link"><div class="p-img"> <img width="70" height="70" alt="img" src="'
																+ c.proInformation.domain
																+ f.skuPicUrl
																+ '"></div></a></li>'
													})
								});
				$("#saleSuit").html(a);
				if ($("#saleInfo").parent().css("display") == "block"
						&& $("#suite-slider").attr("opend") == 1) {
					$("#suite-slider").jdSlider({
						lineNum : 1
					})
				}
			}
		}
	}
}
function minus() {
	var a = parseInt($("#number").val(), 10);
	if (a <= 1) {
		$("#number").val(1);
		$("#amount").html("1\u4ef6")
	} else {
		a--;
		$("#number").val(a);
		$("#amount").html(a + "\u4ef6")
	}
}
function plus() {
	var a = parseInt($("#number").val(), 10);
	if (a >= 999) {
		$("#number").val(1);
		$("#amount").html("1\u4ef6")
	} else {
		a++;
		$("#number").val(a);
		$("#amount").html(a + "\u4ef6")
	}
}
function modify() {
	var a = parseInt($("#number").val(), 10);
	if ("" == $("#number").val()) {
		$("#number").val(1);
		$("#amount").html("1\u4ef6");
		return
	}
	if (!isNaN(a)) {
		if (1 > a || a > 999) {
			$("#number").val(1);
			$("#amount").html("1\u4ef6");
			return
		} else {
			$("#number").val(a);
			$("#amount").html(a + "\u4ef6");
			return
		}
	} else {
		$("#number").val(1);
		$("#amount").html("1\u4ef6")
	}
}
var pingClick = function(g, d, c, a) {
	if ($("#pingUse").val()) {
		try {
			var f = new MPing.inputs.Click(g);
			f.event_param = d;
			var b = new MPing();
			b.send(f)
		} catch (h) {
		}
	}
};
var pingAddClick = function(f, d, c, a) {
	if ($("#pingUse").val()) {
		try {
			var h = new MPing.inputs.AddCart(f, a);
			h.event_param = d;
			var b = new MPing();
			b.send(h)
		} catch (g) {
		}
	}
};
var eTime;
var newAddWare = function(a, e, d, l, b, i, c) {
	eTime = new Date().getTime() / 1000 + 4;
	var h = getCookie("USER_FLAG_CHECK");
	if (isNotBlank(d) && d) {
		var j = $("#newOrderServer").val();
		if (l) {
			var f = "http://p.m.jd.com/cart/addDirOrder.json?wareId=" + a
					+ "&num=" + e + "&suitSkuId=" + a + "&suitSkuNum=" + e
					+ (isNotBlank(d) && d ? "&isAjax=" + d : "")
					+ "&sType=8&ybId=" + l + "&resourceType=" + b
					+ "&resourceValue=" + i
					+ (isNotBlank(c) && (c != "") ? "&sid=" + c : "")
					+ "&USER_FLAG_CHECK=" + h
		} else {
			var f = "http://p.m.jd.com/cart/addDirOrder.json?wareId=" + a
					+ "&num=" + e + (isNotBlank(d) && d ? "&isAjax=" + d : "")
					+ "&resourceType=" + b + "&resourceValue=" + i
					+ (isNotBlank(c) && (c != "") ? "&sid=" + c : "")
					+ "&USER_FLAG_CHECK=" + h
		}
		var k = jQuery.get(f, function() {
			if (j == "true") {
				window.location.href = "/norder/order.action?wareId="
						+ a
						+ "&enterOrder=true"
						+ (isNotBlank(c) && (c != "") ? "&sid="
								+ $("#sid").val() : "")
			} else {
				window.location.href = "/order/order.action?wareId="
						+ a
						+ "&enterOrder=true&yys=false&from=0"
						+ (isNotBlank(c) && (c != "") ? "&sid="
								+ $("#sid").val() : "")
			}
		})
	} else {
		if (l) {
			var g = "http://p.m.jd.com/cart/add.json?wareId=" + a + "&num=" + e
					+ "&suitSkuId=" + a + "&suitSkuNum=" + e
					+ (isNotBlank(d) && d ? "&isAjax=" + d : "")
					+ "&sType=8&ybId=" + l + "&resourceType=" + b
					+ "&resourceValue=" + i
					+ (isNotBlank(c) && (c != "") ? "&sid=" + c : "")
					+ "&USER_FLAG_CHECK=" + h
		} else {
			var g = "http://p.m.jd.com/cart/add.json?wareId=" + a + "&num=" + e
					+ (isNotBlank(d) && d ? "&isAjax=" + d : "")
					+ "&resourceType=" + b + "&resourceValue=" + i
					+ (isNotBlank(c) && (c != "") ? "&sid=" + c : "")
					+ "&USER_FLAG_CHECK=" + h
		}
		var k = ajax(g, function(o) {
			var n = JSON.parse(o).sid;
			$("#sid").val(n);
			var p = JSON.parse(o);
			if (p && p.cartJson && p.cartJson.Num) {
				var m = p.cartJson.Num;
				if (parseInt(m) > 0) {
					if ($("#toCart i").length == 0) {
						$("#toCart").prepend("<i></i>")
					}
					$("#toCart i").text(m)
				}
			}
			cartShow()
		})
	}
};
var judgeKO = function(d, b) {
	var a = "/ware/judgeOrder.json?wareId=" + d
			+ (isNotBlank(b) && (b != "") ? "&sid=" + b : "");
	var c = ajax(
			a,
			function(f) {
				try {
					var h = JSON.parse(f);
					if (h && h.url) {
						window.location.href = h.url + "&sid=" + b
					} else {
						if (h && h.text) {
							alert(h.text)
						}
					}
				} catch (g) {
					window.location.href = "https://passport.m.jd.com/user/login.action?sid="
							+ b
							+ "&returnurl=http://item.m.jd.com/product/"
							+ $("#currentWareId").val() + ".html"
				}
			})
};
function cartShow() {
	var a = new Date().getTime() / 1000;
	var d = Math.floor(eTime - a);
	if (d > 0) {
		setTimeout("cartShow()", 1000);
		var c = 100;
		var b = window.pageYOffset || document.documentElement.scrollTop
				|| document.body.scrollTop;
		var e = document.documentElement.clientHeight
				|| document.body.clientHeight;
		document.getElementById("cart").style.bottom = ((e - c) / 2 - b) + "px";
		$("#goCart").click(function() {
			$("#_mask").hide();
			$("#cart").hide();
			window.location.href = "/cart/cart.action?sid=" + tmpSid
		});
		$("#cart").show()
	} else {
		$("#cart").hide()
	}
}
var xmlHttp;
var ajax = function(b, e, d) {
	if (b.length == 0) {
		return ""
	}
	xmlHttp = c();
	if (xmlHttp == null) {
		return false
	}
	b = b + "&ran=" + Math.random();
	xmlHttp.onreadystatechange = a;
	xmlHttp.open("GET", b, true);
	xmlHttp.send(null);
	function a() {
		if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
			e.call(this, xmlHttp.responseText, d)
		}
	}
	function c() {
		var f = null;
		try {
			f = new XMLHttpRequest()
		} catch (g) {
			try {
				f = new ActiveXObject("Msxml2.XMLHTTP")
			} catch (g) {
				f = new ActiveXObject("Microsoft.XMLHTTP")
			}
		}
		return f
	}
	return true
};