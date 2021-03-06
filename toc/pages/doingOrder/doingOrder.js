var app = getApp()
Page({
    data: {
        order: [],
        width: 0,
        height: 0,
        imgW: 0,
        imgH: 0,
        dateW: 0,
        dateH: 0,
        paddingSize: 0,
        nameW: 0,
        nameH: 0,
        textW: 0,
        textH: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                var windowWidth = res.windowWidth
                that.setData({
                    width: windowWidth,
                    height: res.windowHeight,
                    imgH: windowWidth / 5,
                    imgW: windowWidth / 5,
                    dateH: windowWidth / 5 / 4,
                    dateW: windowWidth / 5 * 3,
                    paddingSize: windowWidth / 50,
                    nameH: windowWidth / 5 / 4,
                    nameW: windowWidth / 5 * 2,
                    textH: windowWidth / 5 / 4,
                    textW: windowWidth / 5,
                })
            },
        })
        //判断是否登陆
        if (app.globalData.logined) {
            wx.request({
                url: 'http://localhost:8080/getDoingOrder',
                data: {
                    'openid': app.globalData.userId
                },
                success: function (res) {
                    that.setData({
                        order: res.data
                    })
                    console.log(res.data)
                }
            })
        } else {
            wx.navigateTo({
                url: '../personal/personal',
            })
        }
    },

})