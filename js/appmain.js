/**
 * Created by Administrator on 2016/11/3 0003.
 */

// //  如何实现用户设置的记忆功能，保证在刷新页面的时候启用之前的用户设置
//
// //    跨域请求  闭包  本地存贮
//
// });


(function () {

    alert("进入此页面，建议您缩小浏览器窗口")

    /*  对HTML5的本地存储做封装
     *
     * localstorage是键值对的形式，key容易重叠，覆盖
     *
     *  //localstorage在同一个域名下是共享的，防止他人误操作localstorage，作用才做封装
     // 在key前面加上前缀，这样不会覆盖他人的key，也不会被他人覆盖我们的key
     * */
    var Util = (function () {

        var pre = "html-reader-";
        var GetStorage = function (key) {
            return localStorage.getItem(pre + key);
        };
        var SetStorage = function (key, value) {
            return localStorage.setItem(pre + key, value);
        };

        //封装对数据的解码方法
        var getBSONP=function (url,callback)
        {
            //利用插件提供的方法
            return $.jsonp({
                url:url,
                cache:true,
                //这里的callback不是参数里的，而是服务器返回数据中的函数，整个是当做js片段去执行

                callback:"duokan_fiction_chapter",

                success:function (result) {
                    //对数据解码,出来的是json数据

                    var data=$.base64.decode(result);
                    var json=decodeURIComponent(escape(data));
                    // var json=decodeURIComponent(data);
                    callback(json);

                }
            })
        }
        //把这个方法暴露出来
        return {
            GetStorage: GetStorage,
            SetStorage: SetStorage,
            getBSONP: getBSONP
        }
    })();


    //页面刷新加载时初始化页面，包括对用户设置的保存

        var readerModel;
        var readerContent;
        var RootContainer = $("#fiction_container");
        //    页面初始化时  取本地储存里字体大小  并转为整数
        var font = Util.GetStorage("font-size");
        font = parseInt(font);
        //如果本地储存没有字体大小信息  就设置一个初始的
        if (!font) {
            font = 14;
        }
        RootContainer.css("font-size", font);

        //设置页面刷新的背景颜色
        var BgColor = Util.GetStorage("bgcolor");
        $("body").css("background", BgColor);


        //刷新页面时  如果背景是黑色  显示夜间模式
        if (BgColor == "#0f1410") {
            $(".nav-listR").hide();
            $(".nav-listR2").show();
        } else {
            $(".nav-listR").show();
            $(".nav-listR2").hide();


        //刷新页面时 根据背景色 给相应的圆点加边框

        switch (BgColor) {
            case "#0f1410":
                $(".child-mod2 div:nth-child(7)").children().addClass("active");
                break;
            case "#283548":
                $(".child-mod2 div:nth-child(6)").children().addClass("active");
                break;
            case "#cdefce":
                $(".child-mod2 div:nth-child(5)").children().addClass("active");
                break;
            case "#a4a4a4":
                $(".child-mod2 div:nth-child(4)").children().addClass("active");
                break;
            case "#e9dfc7":
                $(".child-mod2 div:nth-child(3)").children().addClass("active");
                break;
            case "#f7eee5":
                $(".child-mod2 div:nth-child(2)").children().addClass("active");
                break;
        }
    }


    //入口函数
    function main() {
        //todo    整个项目的入口函数
        readerModel=ReaderModel();
        //接收一个参数（被渲染的容器）
        readerContent=ReaderBaseFrame(RootContainer);
        readerModel.initFun(function (data) {
            //callback里传回数据  调用渲染的函数进行渲染
                readerContent(data);
        });

        // readerModel.initFun();
        EventHanlder();

    };
    //调用入口函数
    main();


    //数据层
    function ReaderModel() {
        //Todo 实现数据交互(ajax请求)
        //获取章节信息

        var Chapter_id;
        var totalChapters;
        var initFun=function (callback) {
            //先获得章节信息,在取出第一章的id，
            // 根据id取详细信息的地址，再根据jsop请求拿到数据的内容

            getFictionInfo(function () {
                //传入章节ID,去获得内容
                getChapterContent(Chapter_id,function (data) {
                    //todo  进行数据渲染
                    callback&&callback(data);
                });
            })
        };

        var getFictionInfo=function (callback) {
            $.get("./data/chapter.json",function (data) {
                //todo  获得章节信息后的回调
                Chapter_id=data.chapters[1].chapter_id;
                totalChapters=data.chapters.length;
                callback&&callback(data);


            //    获得章节信息后，根据章节的ID获得相应的章节内容
            },"json")
        }
    //    获得章节内容
        var getChapterContent=function (chapter_id,callback) {
            $.get('data/data'+ chapter_id +'.json',function (data) {
                //    首先判断服务器状态，如果状态的OK的，
                if(data.result==0){//状态是事先约定好的
                    var url=data.jsonp; //真实的是一个jsonp的地址，请求真实的数据
                    Util.getBSONP(url,function (data) {
                            // debugger;
                        callback&&callback(data);//先判断 callback  是不是存在，如果存在就执行，这样写的目的是为了防止报错
                    })
                }
            },"json")
        }
        //实现上下翻页
        var prevPage=function (callback) {
            //把章节ID处理成为10进制整数
            Chapter_id=parseInt(Chapter_id,10);
            //章节ID为0时 不再上翻页
            if(Chapter_id==0){
                $(".alert").show();
                return;
                // $(".alert").show();
            }
            Chapter_id-=1;
            getChapterContent(Chapter_id,callback)
        };

        var nextPage=function (callback) {
            Chapter_id=parseInt(Chapter_id,10);
            //章节ID为0时 不再上翻页
            if(Chapter_id==totalChapters){
                $(".alert").show();
                return;
            }
            Chapter_id+=1;
            getChapterContent(Chapter_id,callback)
        };


        return{
            initFun:initFun,
            prevPage:prevPage,
            nextPage:nextPage
        }


    };


    //    界面初始化
    function ReaderBaseFrame(container) {
        //Todo 渲染基本结构
    //    调用获得的数据     数据解析后加载到DOM节点
        function parseChapterData(jsonData) {
            //此方法在移动端是完全兼容的
            var jsonObj=JSON.parse(jsonData);
            //数据渲染


            var html="<h4>"+jsonObj.t+"</h4>";

        //    文字内容不止一个
            //文字P本身是一个数组
            for(var i=0;i<jsonObj.p.length;i++){
                html +="<p>"+jsonObj.p[i]+"</p>"

            }
            return html;
        }
        //    最后把html放到容器当中
        return function (data) {
            container.html(parseChapterData(data));
        }
    };

    //    控制层
    function EventHanlder() {
        //Todo 交互事件绑定
        //为什么 不用 touch  和 tap
        //安卓4.0，老版的webkit，点击事件有300ms的延时  现在没有
        // 可以在PC上用HTML5的网站，否则要写兼容性判断

        $("#action-mid").click(function () {

            if ($("#top-nav").css("display") == "none") {


                $("#top-nav").show();
                $(".bottom-nav").show();

            } else {
                $("#top-nav").hide();
                $(".bottom-nav").hide();

                $(".nav-pannel-bk").hide();
                $(".nav-pannel").hide();

                $(".nav-listM2").hide();
                $(".nav-listM").show();

            }

        });
        

        //页面滚动时，所有显示项目隐藏
        $(window).scroll(function () {
            $("#top-nav").hide();
            $(".bottom-nav").hide();

            $(".nav-pannel-bk").hide();
            $(".nav-pannel").hide();


            //页面滚动时，字体设置栏  恢复初始状态
            $(".nav-listM2").hide();
            $(".nav-listM").show();
        });


        function TouchChange(touch, target) {

            $(touch).on("click", function () {
                $(touch).hide();
                $(target).show();
            });
        }

        TouchChange(".nav-listM", ".nav-listM2");
        TouchChange(".nav-listM2", ".nav-listM");

        TouchChange(".nav-listR", ".nav-listR2");
        TouchChange(".nav-listR2", ".nav-listR");
//

        //    夜间模式的切换，同时会触发 字体里 背景的设置
        //    等于是这里的切换 触发 另一个切换

        $(".nav-listR").on("click", function () {
            $("body").css("background", "#0f1410")
        });
        $(".nav-listR2").on("click", function () {
            //从夜间模式切换到白天模式，把之前点击存起来背景色取出来

            var BgColor = Util.GetStorage("bgcolor");


            $("body").css("background", BgColor);
            //如果是黑色，则显示夜间模式，点击白天切换到第一个颜色
            if (BgColor == "#0f1410") {
                $("body").css("background", "#f7eee5");


            }

        });

        //    唤起字体面板
        $(".nav-listM").click(function () {

            $(".nav-pannel-bk").show();
            $(".nav-pannel").show();
        });
        $(".nav-listM2").click(function () {
            $(".nav-pannel-bk").hide();
            $(".nav-pannel").hide();
        });

        //    设置背景圆点 点击 添加边框
        function ChangPoint(target, else1, else2, else3, else4, else5) {
            $(target).click(function () {
                $(else1).children().removeClass("active");
                $(else2).children().removeClass("active");
                $(else3).children().removeClass("active");
                $(else4).children().removeClass("active");
                $(else5).children().removeClass("active");

                $(target).children().addClass("active");


                //当最后一个颜色被选中时 显示夜间模式
                if (target == ".child-mod2 div:nth-child(7)") {
                    $(".nav-listR").hide();
                    $(".nav-listR2").show();
                } else {
                    $(".nav-listR").show();
                    $(".nav-listR2").hide();
                }
            });
        }

        //    设置背景颜色
        function SetBgColor(target, color) {
            $(target).click(function () {
                $("body").css("background", color);
                //点击的同时把背景色添加到本地储存
                Util.SetStorage("bgcolor", color);
            });

        }

        SetBgColor(".child-mod2 div:nth-child(2)", "#f7eee5");
        SetBgColor(".child-mod2 div:nth-child(3)", "#e9dfc7");
        SetBgColor(".child-mod2 div:nth-child(4)", "#a4a4a4");
        SetBgColor(".child-mod2 div:nth-child(5)", "#cdefce");
        SetBgColor(".child-mod2 div:nth-child(6)", "#283548");
        SetBgColor(".child-mod2 div:nth-child(7)", "#0f1410");

        ChangPoint(".child-mod2 div:nth-child(2)",
            ".child-mod2 div:nth-child(3)",
            ".child-mod2 div:nth-child(4)",
            ".child-mod2 div:nth-child(5)",
            ".child-mod2 div:nth-child(6)",
            ".child-mod2 div:nth-child(7)");

        ChangPoint(".child-mod2 div:nth-child(3)",
            ".child-mod2 div:nth-child(2)",
            ".child-mod2 div:nth-child(4)",
            ".child-mod2 div:nth-child(5)",
            ".child-mod2 div:nth-child(6)",
            ".child-mod2 div:nth-child(7)");


        ChangPoint(".child-mod2 div:nth-child(4)",
            ".child-mod2 div:nth-child(3)",
            ".child-mod2 div:nth-child(2)",
            ".child-mod2 div:nth-child(5)",
            ".child-mod2 div:nth-child(6)",
            ".child-mod2 div:nth-child(7)");


        ChangPoint(".child-mod2 div:nth-child(5)",
            ".child-mod2 div:nth-child(2)",
            ".child-mod2 div:nth-child(4)",
            ".child-mod2 div:nth-child(3)",
            ".child-mod2 div:nth-child(6)",
            ".child-mod2 div:nth-child(7)");


        ChangPoint(".child-mod2 div:nth-child(6)",
            ".child-mod2 div:nth-child(2)",
            ".child-mod2 div:nth-child(4)",
            ".child-mod2 div:nth-child(5)",
            ".child-mod2 div:nth-child(3)",
            ".child-mod2 div:nth-child(7)");


        ChangPoint(".child-mod2 div:nth-child(7)",
            ".child-mod2 div:nth-child(2)",
            ".child-mod2 div:nth-child(4)",
            ".child-mod2 div:nth-child(5)",
            ".child-mod2 div:nth-child(6)",
            ".child-mod2 div:nth-child(3)");

        //    变换字号 保持记忆
        $("#large-font").click(function () {
            if (font > 20) {
                return;
            }
            font += 1;
            RootContainer.css("font-size", font);
            //调用封装的函数  把字体存到本地储存
            Util.SetStorage("font-size", font);
        });
        $("#small-font").click(function () {
            if (font < 12) {
                return;
            }
            font -= 1;
            RootContainer.css("font-size", font);
            Util.SetStorage("font-size", font);
        });

        
        
    //    实现上下翻页
        $("#prev_button").click(function () {
            // 先获得章节翻页的数据->再进行数据渲染
            readerModel.prevPage(function (data) {
                readerContent(data);
            });
        });
        $("#next_button").click(function () {
            readerModel.nextPage(function (data) {
                readerContent(data);
            });
        });

        $(".close").click(function () {
            $(".alert").hide();
        })
    };//EventHanlder结束





})();