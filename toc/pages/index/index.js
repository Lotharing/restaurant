//首页
var app = getApp()
Page({
    data: {
        //存放所有餐厅窗口信息
        windowInfo              : [{}],
        windowImgs              : [],
        display                 : 'block',
        // 尺寸（所有组件的尺寸）
        windowHeight            : 0,
        adCarouselHeight        : 0,
        marginSize              : 0,
        paddingSize             : 0,
        cardWidth               : 0,
        textWidth               : 0,
        imgWidth                : 0,
        imgHeight               : 0,
        floatingActionBtnWidth  : 0,
        floatingActionBtnHeight : 0,
        actionBarHeight         : 0,
        scrollHeight            : 0,
    },
    onLoad:function(){
        var that = this
        wx.getStorage({
            key: 'infos',
            success: function (res) {
                app.globalData.userName = res.data.name
                app.globalData.userHead = res.data.head
                app.globalData.userId   = res.data.id 
            },
        })
        //获取窗体尺寸，计算相应组件尺寸
        wx.getSystemInfo({
            success: function(res) {
                var windowWidth = res.windowWidth
                that.setData({
                    windowHeight            : res.windowHeight,
                    adCarouselHeight        : windowWidth * 0.6,
                    actionBarHeight         : res.windowHeight / 12,
                    scrollHeight            : res.windowHeight / 12 * 11,
                    marginSize              : windowWidth / 50,
                    cardWidth               : windowWidth,
                    paddingSize             : windowWidth / 25,
                    textWidth               : windowWidth / 25 * 14,
                    imgWidth                : windowWidth / 25 * 7,
                    imgHeight               : windowWidth / 25 * 7,
                    floatingActionBtnHeight : windowWidth / 25 * 4,
                    floatingActionBtnWidth  : windowWidth / 25 * 4,
                })
            },
        })
        //请求餐厅窗口信息
        wx.request({
            url: 'http://localhost:8080/getWindowInfo',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                that.setData({
                    windowInfo:res.data
                })
            }
        })
        wx.request({
            url: 'http://localhost:8080/firstImgs',
            success(res){
              that.setData({
                windowImgs:res.data
              })
            }
        })
        wx.checkSession({
            success(res){
                //连接服务器
                app.globalData.logined = true;
                that.connectSocket()
            },
            fail(){
                wx.login({
                    success(res){
                        if (res.code) {
                            // 发起网络请求
                            wx.request({
                                url: 'http://localhost:8080/login',
                                data: {
                                    code: res.code
                                },
                                success(res) {
                                    app.globalData.userId = res.data,
                                        wx.navigateTo({
                                            url: '../login/login',
                                        })
                                }
                            })
                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }
                    }
                })
            }
        })
        try {
            // 同步接口立即返回值
            app.globalData.shopCar = wx.getStorageSync('shopCar')
        } catch (e) {
            console.log('没有shopCar')
        }
    },

    //页面跳转
    jumpToWindowFoodInfo:function(e){
        wx.navigateTo({
            url: '../windowFoodInfo/windowFoodInfo?windowName=' + e.currentTarget.dataset.name + '&windowIntroduction=' + e.currentTarget.dataset.content + '&windowNumber=' + e.currentTarget.dataset.number + '&windowHeadImgUrl=' + e.currentTarget.dataset.img,
        })
    },

    jumpToShopCar:function(){
        wx.navigateTo({
            url: '../shopCar/shopCar',
        })
    },

    jumpToPersonal: function () {
        wx.navigateTo({
            url: '../personal/personal'
        })
    },

  scrolling:function(e){
    var direction = e.detail.deltaY;
    if(direction >= 0){ //下滑
        this.setData({
          display : 'block',
        })
    }else{ //上滑
        this.setData({
          display: 'none',
        })
    }
  },

    connectSocket: function () {
        wx.connectSocket({
            url: 'ws://localhost:8080/websocket',
        })
        wx.onSocketOpen(function (res) {
            app.globalData.isConnected = true
            wx.sendSocketMessage({
                data: '1.' + app.globalData.userId,
            })
        })
        wx.onSocketMessage(function (res) {
            wx.showToast({
                title: res.data + '等待取餐',
            })
        })
    },

})


