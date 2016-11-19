/**
 * Created by Administrator on 2016/11/9 0009.
 */
(function () {





    document.onmousewheel=function() {
        if (event.ctrlKey) {
            return false;
        }
    }






    /**
     *  点击切换导航按钮
     * @param target 被点击的按钮
     * @param else1  要隐藏的按钮
     * @param else2  要隐藏的按钮
     * @param else3  要隐藏的按钮
     * @param else4  要隐藏的按钮
     *
     */
    function ChangNav(target, else1, else2, else3, else4) {
        $(target).click(function () {
            $(target).addClass("active");

            $(else1).removeClass("active");
            $(else2).removeClass("active");
            $(else3).removeClass("active");
            $(else4).removeClass("active");

        });
    }

    ChangNav(".nav-btn1", ".nav-btn2", ".nav-btn3", ".nav-btn4", ".nav-btn5");
    ChangNav(".nav-btn2", ".nav-btn1", ".nav-btn3", ".nav-btn4", ".nav-btn5");
    ChangNav(".nav-btn3", ".nav-btn1", ".nav-btn2", ".nav-btn4", ".nav-btn5");
    ChangNav(".nav-btn4", ".nav-btn1", ".nav-btn3", ".nav-btn2", ".nav-btn5");
    ChangNav(".nav-btn5", ".nav-btn1", ".nav-btn3", ".nav-btn4", ".nav-btn1");

    //实现输入框的显隐
    function showAndHideSearch() {
        $(".search").click(function () {
            if ($(".input").css("display") == "none") {
                $(".input").slideDown(300);
            } else {
                $(".input").slideUp(300);
            }
        });
    };
    showAndHideSearch();

    /**
     *鼠标移入移出显隐轮播图按钮
     * @param leftArrow     左箭头
     * @param rightArrow    右箭头
     * @param speed         移动速度（正负表示方向）
     * @param distance        移动的目标距离
     *
     */
    var animated = false;

    function ShowArrow(leftArrow, rightArrow, speed, distance) {
        var id = setInterval(function () {
            var left = parseInt($(leftArrow).css("left"));
            var right = parseInt($(rightArrow).css("right"));
            animated = true;
            left = left + speed
            right = right + speed;
            $(leftArrow).css("left", left);
            $(rightArrow).css("right", right);

            if (speed > 0) {
                if (left > distance) {
                    clearInterval(id);
                    animated = false;
                }
            } else if (speed < 0) {
                if (left < distance) {
                    clearInterval(id);
                    animated = false;
                }
            }

        }, 1)
    }

    $(".banner").mouseenter(function () {
        ShowArrow(".prev", ".next", 2, 0)
    });

    $(".banner").mouseleave(function () {
        ShowArrow(".prev", ".next", -2, -53)
    });

    //实现轮播图


    var container = $(".banner");
    var list = $('.showBanner');
    var prev = $('.prev');
    var next = $('.next');
    var index = 1;
    var len = 4;
    var interval = 3000;
    var timer;


    /**
     * 实现轮播图
     * @param offset  带方向的移动距离
     */

    function animate(offset) {
        var left = parseInt(list.css('left')) + offset;
        if (offset > 0) {
            //把offset设为字符串形式
            offset = '+=' + offset;

        }
        else {
            //对负值的offset取绝对值
            offset = '-=' + Math.abs(offset);

        }
        // $(selector).animate(styles,speed,callback)
        list.animate({'left': offset}, 300, function () {
            if (left > -100) {
                list.css('left', -1350 * len);
            }
            if (left < (-1350 * len)) {
                list.css('left', -1350);
            }
        });
    }


    function play() {
        timer = setInterval(function () {
            next.trigger('click');
            // play();
        }, interval);
    }

    function stop() {
        clearInterval(timer);
    }

    next.click(function () {
        if (list.is(':animated')) {
            return;
        }
        if (index == 4) {
            index = 1;
        }
        else {
            index += 1;
        }
        animate(-1350);
    });

    prev.click(function () {
        if (list.is(':animated')) {
            return;
        }
        if (index == 1) {
            index = 4;
        }
        else {
            index -= 1;
        }
        animate(1350);
    });


    container.hover(stop, play);

    play();


    /**
     * 服务产品介绍  移入移出实现交叉切换
     * @param mouseTarget   鼠标移入目标
     * @param hideTxt       要隐藏的文字
     * @param showTxt       要显示的文字
     * @param hideImg       要隐藏的图片
     * @param showImg       要显示的图片
     * @param hideBg        要隐藏的背景
     * @param showBg        要显示的背景
     *
     */
    function CrossChange(mouseTarget, hideTxt, showTxt, hideImg, showImg, hideBg, showBg) {
        $(mouseTarget).mouseenter(function () {
            $(hideTxt).stop(true).animate({left: -250}, 300);
            $(showTxt).stop(true).animate({left: 45}, 300);
            $(hideImg).stop(true).animate({left: 320}, 300);
            $(showImg).stop(true).animate({left: 105}, 300);
            $(hideBg).stop(true).animate({opacity: 0}, 300);
            $(showBg).stop(true).animate({opacity: 1}, 300);
            $(".click").show(300);
        });

        $(mouseTarget).mouseleave(function () {
            $(hideTxt).stop(true).animate({left: 45}, 300);
            $(showTxt).stop(true).animate({left: 330}, 300);
            $(hideImg).stop(true).animate({left: 105}, 300);
            $(showImg).stop(true).animate({left: -100}, 300);
            $(hideBg).stop(true).animate({opacity: 1}, 300);
            $(showBg).stop(true).animate({opacity: 0}, 300);
            $(".click").hide();
        });
    }

    CrossChange(".left", ".left .txt1", ".left .txt2", ".left .onshow", ".left .onhide", ".left .onShowBg", ".left .onHideBg");

    CrossChange(".mid", ".mid .txt1", ".mid .txt2", ".mid .onshow", ".mid .onhide", ".mid .onShowBg", ".mid .onHideBg");

    CrossChange(".right", ".right .txt1", ".right .txt2", ".right .onshow", ".right .onhide", ".right .onShowBg", ".right .onHideBg");



    /**
     * 点击显示隐藏的中间轮播图
     * @param target    点击目标
     * @param show      跟随点击显示的图片
     * @param hide1     要隐藏的其他图片
     * @param hide2     要隐藏的其他图片
     * @param addClass  跟随点击显示高亮小点
     * @param removeClass1  跟随点击其他小点
     * @param removeClass2  跟随点击其他小点
     *
     */
    function ShowHideMidBanner(target, show, hide1, hide2, addClass, removeClass1, removeClass2) {
        $(target).click(function () {

            $(".mid-banner").slideDown(300);
            $(show).show();
            $(hide1).hide();
            $(hide2).hide();

            $(addClass).addClass("active");
            $(removeClass1).removeClass("active");
            $(removeClass2).removeClass("active");
        })
    }

    ShowHideMidBanner(".left .click",
        ".mid-banner-area",
        ".mid-banner-sec-area",
        ".mid-banner-third-area",
        ".index1", ".index2", ".index3");

    ShowHideMidBanner(".mid .click",
        ".mid-banner-sec-area",
        ".mid-banner-area",
        ".mid-banner-third-area",
        ".index2", ".index1", ".index3");

    ShowHideMidBanner(".right .click",
        ".mid-banner-third-area",
        ".mid-banner-area",
        ".mid-banner-sec-area",
        ".index3", ".index1", ".index2");

    $(".close").click(function () {

        $(".mid-banner").slideUp(300);
    })

    /**
     * 中间小轮播图点击切换
     * @param target  点击的目标
     * @param addClass 给点击的目标添加class,显示高亮点
     * @param removeClass1  其他点不显示高亮
     * @param removeClass2  其他点不显示高亮
     * @param show      显示的图片
     * @param hide1     隐藏的图片
     * @param hide2     隐藏的图片
     *
     */
    function ClickChangMidBanner(target, addClass, removeClass1, removeClass2, show, hide1, hide2) {
        $(target).click(function () {

            $(addClass).addClass("active");
            $(removeClass1).removeClass("active");
            $(removeClass2).removeClass("active");

            $(show).show();
            $(hide1).hide();
            $(hide2).hide();

        })

    }

    ClickChangMidBanner(".index1", ".index1", ".index2", ".index3", ".mid-banner-area",
        ".mid-banner-third-area", ".mid-banner-sec-area")

    ClickChangMidBanner(".index2", ".index2", ".index1", ".index3", ".mid-banner-sec-area",
        ".mid-banner-third-area", ".mid-banner-area")

    ClickChangMidBanner(".index3", ".index3", ".index2", ".index1", ".mid-banner-third-area",
        ".mid-banner-area", ".mid-banner-sec-area")

    /**
     *  点击切换不同的案例页面
     * @param target   被点击的案例页面导航按钮
     * @param else1    要隐藏的其他案例页面导航按钮
     * @param else2    要隐藏的其他案例页面导航按钮
     * @param else3    要隐藏的其他案例页面导航按钮
     *
     */
    function ChangInfo(target, else1, else2, else3) {
        $(target).click(function () {
            $(target).addClass("active");

            $(else1).removeClass("active");
            $(else2).removeClass("active");
            $(else3).removeClass("active");

        });
    }

    ChangInfo(".exp-nav1", ".exp-nav2", ".exp-nav3", ".exp-nav4");
    ChangInfo(".exp-nav2", ".exp-nav1", ".exp-nav3", ".exp-nav4");
    ChangInfo(".exp-nav3", ".exp-nav2", ".exp-nav1", ".exp-nav4");
    ChangInfo(".exp-nav4", ".exp-nav2", ".exp-nav3", ".exp-nav1");

    //案例部分 实现移入鼠标 显示标题

    for (var i = 1; i < 10; i++) {

        function showInfo(target, show) {
            $(target).mouseenter(function () {
                if ($(show).css("display") == "none") {
                    $(show).slideDown(200);
                }
            });
            $(target).mouseleave(function () {
                $(show).slideUp(200);
            });
        }

        showInfo(".mouseover" + i + "", ".title" + i + "");
    }


    /**
     *点击切换详细展示页 最后的改变高度 设置高度633
     * @param target  点击目标
     * @param show     在显示的产品页
     * @param hide1     隐藏的产品页
     * @param hide2     隐藏的产品页
     * @param hide3     隐藏的产品页
     *
     */
    function ClickShowProducts(target, show, hide1, hide2, hide3) {
        $(target).click(function () {

            $(show).show();
            $(hide1).hide();
            $(hide2).hide();
            $(hide3).hide();

            if (target == ".exp-nav4") {
                $(".expamle").css("height", 633);
            } else {
                $(".expamle").css("height", 823);
            }

        });
    }

    ClickShowProducts(".exp-nav4", ".products4", ".products1", ".products2", ".products3");


    ClickShowProducts(".exp-nav1", ".products", ".products4", ".products2", ".products3");

    ClickShowProducts(".exp-nav2", ".products2", ".products4", ".products", ".products3");

    ClickShowProducts(".exp-nav3", ".products3", ".products1", ".products2", ".products4");

    /**
     *  About 移入移出 实现遮盖
     * @param mouseOnTarget 鼠标移入目标
     * @param mask  要添加的遮罩
     */
    function showHideMask(mouseOnTarget, mask) {
        $(mouseOnTarget).mouseenter(function () {
            $(mask).fadeIn(300);
        });
        $(mask).mouseleave(function () {
            $(mask).fadeOut(300);
        });
    }

    showHideMask(".aboutInfo-left", ".aboutInfo-left-mask");
    showHideMask(".aboutInfo-mid", ".aboutInfo-mid-mask");
    showHideMask(".aboutInfo-right", ".aboutInfo-right-mask");

//    关于我们 点击切换选项卡和相应内容

    function ChangeTabsAndContent(target, removeClass1, removeClass2, removeClass3, show, hide1, hide2, hide3) {
        $(target).click(function () {
            $(target).addClass("active");
            $(removeClass1).removeClass("active");
            $(removeClass2).removeClass("active");
            $(removeClass3).removeClass("active");

            $(show).show();
            $(hide1).hide();
            $(hide2).hide();
            $(hide3).hide();

        })
    }

    ChangeTabsAndContent(".tabs ul li:nth-child(1)",
        ".tabs ul li:nth-child(2)",
        ".tabs ul li:nth-child(3)",
        ".tabs ul li:nth-child(4)",
        ".Infos", ".honor", ".status", ".joinUs"
    );

    ChangeTabsAndContent(".tabs ul li:nth-child(2)",
        ".tabs ul li:nth-child(1)",
        ".tabs ul li:nth-child(3)",
        ".tabs ul li:nth-child(4)",
        ".honor", ".Infos", ".status", ".joinUs"
    );

    ChangeTabsAndContent(".tabs ul li:nth-child(3)",
        ".tabs ul li:nth-child(1)",
        ".tabs ul li:nth-child(2)",
        ".tabs ul li:nth-child(4)",
        ".status", ".Infos", ".honor", ".joinUs"
    );

    ChangeTabsAndContent(".tabs ul li:nth-child(4)",
        ".tabs ul li:nth-child(1)",
        ".tabs ul li:nth-child(2)",
        ".tabs ul li:nth-child(3)",
        ".joinUs", ".Infos", ".honor", ".status"
    );


//    荣誉奖项 列表 实现移入变换背景
    for (var i = 1; i < 6; i++) {
        function ChangHonorListBg(target, subTarget) {
            $(target).mouseenter(function () {
                $(target).css("background", "#f7f7f7")
                $(subTarget).show();
            });
            $(target).mouseleave(function () {
                $(target).css("background", "white")
                $(subTarget).hide();
            });
        }

        ChangHonorListBg(".list" + i + "", ".list" + i + " .eye")
    }

    // var isTop=true;
    // var top=document.documentElement.scrollTop || document.body.scrollTop;

//    根据当前屏幕向上滚动的高度 添加灰度（改变背景图）
    window.onscroll = function () {

        // 根据当前屏幕向上滚动的高度 添加灰度（改变背景图）

        //获取高度的兼容写法
        // var isTop=true;
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        // console.log(top);
        // console.log(parseInt(top/10))
        if (top < 2400) {
            $(".inlineImg").fadeIn(200);
        }
        if (top > 2400) {
            if ($(".inlineImg").css("opacity") == 1) {
                $(".inlineImg").fadeOut(300);
            }
        }

        //高度超过一定数量时显示回到顶部按钮
        if (top > 200) {

            $(".toTop").css("display", "block");


        }
        if (top < 200) {
            $(".toTop").css("display", "none");
        }
    }

  

//回到顶部
    $(".toTop").click(function () {
        if (!play) {
            goToPosition(0)
        }
    });

    //点击导航栏按钮  滚动到页面不同位置

    $(".nav-btn1").click(function () {
        if (!play) {
            goToPosition(0)
        }
    });

    $(".nav-btn2").click(function () {

        if (!play) {
            goToPosition(650)
        }

    });

    $(".nav-btn3").click(function () {

        goToPosition(1600)

    });
    $(".nav-btn4").click(function () {

        if (!play) {
            goToPosition(2420)
        }

    });
    $(".nav-btn5").click(function () {
        if (!play) {
            goToPosition(3450)
        }
    });

    var play = false;

    /**
     * 点击使屏幕滚动到设定的高度
     * @param height   要设置的目标高度
     */
    function goToPosition(height) {

        var newTop = document.documentElement.scrollTop || document.body.scrollTop;
        var id = setInterval(function () {
            play = true;

            if (newTop > height) {
                newTop -= 10;

                $(document).scrollTop(newTop);

            }
            if (newTop < height) {
                newTop += 10;

                $(document).scrollTop(newTop);

            }

        }, 1)

        setTimeout(function () {
            clearInterval(id);
            play = false;
        }, 1630)

    }


//添加地图
    function addMap() {
        var map = new BMap.Map("map");          // 创建地图实例
        // map.centerAndZoom("杭州", 15);

        var point = new BMap.Point(120.19, 30.26);
        map.centerAndZoom(point, 15);
        var opts = {
            position: point,    // 指定文本标注所在的地理位置
            offset: new BMap.Size(30, -30)    //设置文本偏移量
        }

        var label = new BMap.Label("我们在这里", opts);  // 创建文本标注对象
        label.setStyle({
            color: "#fd8200",
            fontSize: "12px",
            height: "20px",
            lineHeight: "20px"
        });
        map.addOverlay(label);
    }

    addMap();


//    list/close切换
    $(".sub-status").click(function () {
       if($(".sub-nav").css("display")=="none"){
           $(".list").css("display","none");
           $(".list-close").css("display","block");
           $(".sub-nav").slideDown(300)
       }else {
           $(".list").css("display","block");
           $(".list-close").css("display","none");
           $(".sub-nav").slideUp(300);
       }
    });


})();