//窗口菜品信息页
var app = getApp()
Page({
    data: {
        //窗口食物信息
        foodInfos          : [{}],
        
        currentFoodType    : '',
        currentInfosType   : '',
        currentTypeNum     : 0,
        foodTypeCount      : 0,
        display            : 'block',

        windowName         : '',
        windowIntroduction : '',
        windowHeadImgUrl   : '',
        windowNumber       : 0,
        //用于存放type所对应scroll-view item的高度
        typeHeightInfos    : [],
        background         : '',
        //数量统计
        number             : [],

        //尺寸
        windowHeight       : 0,
        windowImgHeight    : 0,
        windowImgWidth     : 0,
        paddingSize        : 0,
        leftScrollWidth    : 0,
        rightScrollWidth   : 0,
        scrollHeight       : 0,
        cardWidth          : 0,
        textWidth          : 0,
        imgWidth           : 0,
        imgHeight          : 0,
        btnSize            : 0,
        floatingActionBtnWidth: 0,
        floatingActionBtnHeight: 0,
        actionBarHeight         : 0,
    },

    onLoad: function (options) {
        var that = this
        that.setData({
            windowIntroduction: options.windowIntroduction,
            windowName:options.windowName,
            windowHeadImgUrl:options.windowHeadImgUrl,
            windowNumber:options.windowNumber,
        })
        wx.getSystemInfo({
            success: function(res) {
                var windowWidth = res.windowWidth
                that.setData({
                    windowHeight:res.windowHeight,
                    windowImgHeight:windowWidth / 5,
                    windowImgWidth: windowWidth / 5,
                    paddingSize:windowWidth / 25,
                    textWidth: windowWidth / 25 * 10,
                    imgWidth: windowWidth / 5,
                    imgHeight: windowWidth / 5,
                    btnSize:windowWidth / 25 * 2,
                    leftScrollWidth: windowWidth / 25 * 2 + windowWidth / 5,
                    rightScrollWidth: windowWidth - (windowWidth / 25 * 2 + windowWidth / 5),
                    scrollHeight: res.windowHeight / 12 * 11 - (windowWidth / 5 + windowWidth / 25 * 2),
                    floatingActionBtnHeight: windowWidth / 25 * 4,
                    floatingActionBtnWidth: windowWidth / 25 * 4,
                    actionBarHeight: res.windowHeight / 12,
                })
            },
        })
    },

    onShow:function(options){
      var that = this
      wx.request({
        url: 'http://localhost:8080/getWindowFoodInfo?windowNumber=' + that.data.windowNumber,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          var heightInfos = []
          var number = []
          var count = 0
          var length = res.data.length
          for (var i = 0; i < length; i++) {
            heightInfos[i] = res.data[i].selectedFoodInfo.length * 430 + 25
          }
          var isHave = false
          for (var i = 0; i < length; i++) {
            for (var j = 0; j < res.data[i].selectedFoodInfo.length; j++) {
              for (var k = 0; k < app.globalData.shopCars.length; k++) {
                if (res.data[i].selectedFoodInfo[j].id == app.globalData.shopCars[k].id) {
                  number[count] = app.globalData.shopCars[k].num
                  isHave = true
                  break
                }
              }
              if (!isHave) {
                number[count] = 0
              }
              count++
              isHave = false
            }
          }
          that.setData({
            number: number,
            foodInfos: res.data,
            foodTypeCount: res.data.length,
            typeHeightInfos: heightInfos
          })
        }
      })
    },

    switchType:function(e){
        this.setData({
            currentInfosType:'food'+e.currentTarget.dataset.name,
            currentFoodType:'type'+e.currentTarget.dataset.name,
            currentTypeNum: e.currentTarget.dataset.name,
        })
    },

    relationLeft:function(e){
        this.scrolling(e)
        var scrollTop = e.detail.scrollTop
        for(var i = 0; i < this.data.typeHeightInfos.length; i++){
            if((scrollTop - this.data.typeHeightInfos[i]) <= 0){
                this.setData({
                    currentTypeNum: i
                })
                break
            }else{
                scrollTop = scrollTop - this.data.typeHeightInfos[i]
            }
        }
    },

    scrolling: function (e) {
        var direction = e.detail.deltaY;
        if (direction >= 0) { //下滑
            this.setData({
                display: 'block',
            })
        } else { //上滑
            this.setData({
                display: 'none',
            })
        }
    },

    add:function(e){
        var num = this.data.number
        var id = e.currentTarget.dataset.id
        var name = e.currentTarget.dataset.name
        var price = e.currentTarget.dataset.price
        var img = e.currentTarget.dataset.img
        // var windowNum = this.data.windowNum
        var windowNumber = this.data.windowNumber;
        num[e.currentTarget.dataset.no] = num[e.currentTarget.dataset.no] + 1
        this.setData({
            number: num,
        })
        var isHave = false
        for (var i = 0; i < app.globalData.shopCars.length; i++){
            if (app.globalData.shopCars[i].id == id){
                app.globalData.shopCars[i].num = app.globalData.shopCars[i].num + 1
                app.globalData.shopCars[i].allPrice = app.globalData.shopCars[i].allPrice + price
                isHave = true
            }
        }
        if (!isHave){
          app.globalData.shopCars[app.globalData.shopCars.length] = { 'id': id, 'name': name, 'price': price, 'num': 1, 'img': img, 'allPrice': price, 'windowNum': windowNumber}
        }
        console.log(app.globalData.shopCars)
    },

    reduce:function(e){
        var num = this.data.number
        if (num[e.currentTarget.dataset.no] != 0){
            var id = e.currentTarget.dataset.id
            num[e.currentTarget.dataset.no] = num[e.currentTarget.dataset.no] - 1
            this.setData({
                number: num,
            })
            for (var i = 0; i < app.globalData.shopCars.length; i++) {
                if (app.globalData.shopCars[i].id == id) {
                    if (app.globalData.shopCars[i].num > 1){
                        app.globalData.shopCars[i].num = app.globalData.shopCars[i].num - 1
                        app.globalData.shopCars[i].allPrice = app.globalData.shopCars[i].allPrice - app.globalData.shopCars[i].price
                    }else{
                        var newShopCar = []
                        for(var k = 0; k < i; k++){
                            newShopCar[k] = app.globalData.shopCars[k]
                        }
                        for (var j = i; j < app.globalData.shopCars.length - 1; j++){
                            newShopCar[j] = app.globalData.shopCars[j+1]
                        }
                        app.globalData.shopCars = newShopCar 
                    }
                    break;
                }
            }
        }
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
})