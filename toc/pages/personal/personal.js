// pages/personal/personal.js
var app = getApp()
Page({

    data: {
        imgHeight:0,
        imgWidth:0,
        textHeight:0,
        textWidth:0,
        btnHeight:0,
        btnWidth:0,
        paddingSize:0,
        marginSize:0,

        userHead:'',
        userName:'',
    },

    onLoad: function () {
        var that = this
        wx.getSystemInfo({
            success: function(res) {
                var windowHeight = res.windowHeight
                var windowWidth = res.windowWidth
                that.setData({
                    imgHeight: windowWidth / 5,
                    imgWidth: windowWidth / 5,
                    textHeight: windowWidth / 5,
                    textWidth: windowWidth / 25 * 17,
                    btnHeight: windowWidth / 25 * 5,
                    btnWidth: windowWidth / 25 * 23,
                    paddingSize: windowWidth / 25,
                    marginSize: windowWidth / 25,
                })
            },
        })
        this.setData({
            userName: app.globalData.userName,
            userHead: app.globalData.userHead,
        })
        app.globalData.logined = true;
    },

    // onShow:function(options){
    //   var that = this
    //   wx.checkSession({
    //     success: function (res) {
    //       app.globalData.logined = true;
    //       //图片不可点击
    //       that.setData({
    //         userName: app.globalData.userName,
    //         userHead: app.globalData.userHead,
    //       })

    //     },
    //     fail: function (res) {
    //       app.globalData.logined = false;
    //       that.setData({
    //         userName: app.globalData.userName,
    //         userHead: app.globalData.userHead,
    //       })
    //     }
    //   })
    // },

    login:function(){
        if (!app.globalData.logined){
            var that = this
            wx.login({
                success(res) {
                    if (res.code) {
                        // 发起网络请求
                        wx.request({
                            url: 'http://localhost:8080/login',
                            data: {
                                code: res.code
                            },
                            success(res) {
                                app.globalData.userId = res.data,
                                wx.redirectTo({
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
          
    },

    finishedOrder:function(){
        wx.navigateTo({
            url: '../finishedOrder/finishedOrder',
        })
    },

    waitingOrder:function(){
        wx.navigateTo({
            url: '../waitingOrder/waitingOrder',
        })
    },

    doingOrder: function () {
        wx.navigateTo({
            url: '../doingOrder/doingOrder',
        })
    },

    suggest:function(){
        wx.navigateTo({
            url: '../suggest/suggest',
        })
    }

})