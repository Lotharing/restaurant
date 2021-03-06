var app = getApp();
Page({

    data: {
        shopCar:[],
        needPay:0,

        paddingSize:0,
        topHeight:0,
        imgWidth:0,
        imgHeight:0,
        windowHeight:0,
        textBlockWidth:0,
        textBlockHeight:0,
        numBlockWidth:0,
        numBlockHeight:0,
        bottomHeight:0,
        btnHeight:0,
        btnWidth:0,
        actionBarHeight:0,
        marginSize:0,
    },

    onLoad: function (options) {
        console.log(app.globalData.shopCars)
        var that = this
        wx.getSystemInfo({
            success: function(res) {
                var windowWidth = res.windowWidth
                that.setData({
                    windowHeight:res.windowHeight,
                    actionBarHeight:res.windowHeight / 12,
                    topHeight: res.windowHeight / 8 * 7 - res.windowHeight / 12,
                    bottomHeight:res.windowHeight / 8,
                    paddingSize: windowWidth / 25,
                    marginSize: windowWidth / 50,
                    imgHeight: windowWidth / 5,
                    imgWidth: windowWidth / 5,
                    textBlockWidth: windowWidth / 25 * 8,
                    textBlockHeight: windowWidth / 5,
                    numBlockWidth: windowWidth / 25 * 8,
                    numBlockHeight: windowWidth / 5,
                    btnHeight: res.windowHeight / 8 - (windowWidth / 25 * 2),
                    btnWidth: windowWidth / 4,
                })
            },
        })
        var value = 0
        for(var i = 0; i < app.globalData.shopCars.length; i++){
            value = value + app.globalData.shopCars[i].allPrice
        }
        this.setData({
            shopCar: app.globalData.shopCars,
            needPay:value,
        })
    },

    onHide:function(){
        wx.setStorage({
            key: 'shopCar',
            data: app.globalData.shopCars,
            success: function () {
                console.log('存入本地')
            },
            fail: function () {
                console.log('存入本地发生错误')
            }
        })
    },

    onUnload:function(){
        wx.setStorage({
            key: 'shopCar',
            data: app.globalData.shopCars,
            success: function () {
                console.log('购物车信息存入本地')
            },
            fail: function () {
                console.log('购物车信息存入本地发生错误')
            }
        })
    },

    remove:function(e){
        console.log(app.globalData.shopCars);
        for (var i = 0; i < app.globalData.shopCars.length; i++){
            if (e.currentTarget.dataset.id == app.globalData.shopCars[i].id){
                var newShopCar = []
                for (var k = 0; k < i; k++) {
                    newShopCar[k] = app.globalData.shopCars[k]
                }
                for (var j = i; j < app.globalData.shopCars.length - 1; j++) {
                    newShopCar[j] = app.globalData.shopCars[j + 1]
                }
                app.globalData.shopCars = newShopCar 
                console.log(newShopCar)
                break
            }
        }
        this.setData({
            shopCar: app.globalData.shopCars
        })
    },

    jumpToPersonal:function() {
        wx.navigateTo({
            url: '../personal/personal'
        })
    },

    pay:function(){
        var that = this
        if (app.globalData.shopCars.length == 0){
            return;
        }
        if (app.globalData.logined){
            //获取排队信息
            var list = new Array();
            for (var i = 0; i < app.globalData.shopCars.length; i++){
                list[i] = app.globalData.shopCars[i].id
            }
            var content = '当前排队人数:';
            wx.request({
                url: 'http://localhost:8080/getWaittingQueue',
                data:list,
                method:'POST',
                success:function(res){
                    for (var i = 0; i < res.data.queue.length; i++){
                        content = content + '\n' + app.globalData.shopCars[i].name + ' : ' + res.data.queue[i]
                    }
                    wx.showModal({
                        title: '支付',
                        content: content,
                        success: function (res) {
                            if (res.confirm) {
                                that.sendOrder()
                            }
                        }
                    })  
                }
            })
      }else{
        wx.navigateTo({
          url: '../personal/personal',
        })
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
      }
    },

    sendOrder:function(){
        var that = this
        var date = Date.parse(new Date())
        wx.request({
            url: 'http://localhost:8080/pay',
            method: 'post',
            data: {
                openid: app.globalData.userId,
                name: app.globalData.userName,
                shopCar: app.globalData.shopCars,
                date: date,
            },
            success: function () {
                if (app.globalData.isConnected) {
                    wx.showToast({
                        title: '支付成功',
                    })
                    //   app.globalData.isConnected = false
                    app.globalData.shopCars = []
                    that.setData({
                        shopCar: [],
                        needPay: 0
                    })
                }
            },
        })
    }

})