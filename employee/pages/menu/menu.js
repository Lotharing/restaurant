// pages/menu/menu.js
var app = getApp();
//从后台获取的订单信息
var receiveOrder = new Array();
Page({
  data: {
    width          : 0,
    height         : 0,
    topW           : 0,
    topH           : 0,
    centerH        : 0,
    centerW        : 0,
    bottomH        : 0,
    bottomW        : 0,
    paddingSize    : 0,
    nameTextW      : 0,
    numTextW       : 0,
    btnW           : 0,
    blockW         : 0,
    blockH         : 0,
    countW         : 0,
    blockItemH     : 0,

    windowNum:0,
    //当前登陆窗口的所有菜品信息
    foodInfos:[],
    //用于显示在订单队列中的订单(foodNumber,foodName,number,changeNum)
    order:[],
    //后台订单中最早到达的订单
    currentOrder:{},
    //判断后台是否有订单
    isNull:true
  },
  onLoad: function (options) {
    var that = this
      wx.request({
          url: 'http://localhost:8080/getDelivered',
          data: {
              'windowNumber': options.windowNum
          },
          success: function (res) {
              for(var i = 0; i < res.data.length; i++){
                  var info = { 'foodNumber': res.data[i].foodNumber, 'foodName': res.data[i].foodName, 'number': res.data[i].number, 'id': res.data[i].id }
                  receiveOrder.push(info);
                  console.log('local')
              }
              if(res.data.length > 0){
                  that.setData({
                    isNull:false,
                    currentOrder: receiveOrder[0]
                  })
              }
          }
      })
      wx.request({
          url: 'http://localhost:8080/getWaitting',
          data: {
              'windowNumber': options.windowNum
          },
          success: function (res) {
              for (var i = 0; i < res.data.length; i++) {
                //   var j = 0;
                //   if (app.globalData.order.length != 0) {
                    //   for (; j < app.globalData.order.length; j++) {
                    //       if (app.globalData.order[j].foodNumber == res.data[i].foodNumber) {
                    //           app.globalData.order[j].number++;
                    //           break;
                    //       }
                    //   }
                //   }
                //   if(j == app.globalData.order.length || j == 0){
                      app.globalData.order[i] = { 'foodNumber': res.data[i].foodNumber, 'foodName': res.data[i].foodName, 'number': res.data[i].number, 'changeNum': 0, 'id': res.data[i].id }
                //   }
              }
              if (res.data.length > 0) {
                  that.setData({
                      order: app.globalData.order
                  })
              }
          }
      })
    //获取当前窗口菜品信息
    wx.request({
      url: 'http://localhost:8080/getFoodInfos',
      data:{
        'windowNum':options.windowNum
      },
      success:function(res){
        that.setData({
          foodInfos:res.data
        })
        //连接websocket服务器
        that.connectSocket()
      }
    })
    this.setData({
      windowNum:options.windowNum
    })
    //设置窗口组件size
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight,
          topW: res.windowWidth,
          topH: res.windowHeight / 10,
          centerH: res.windowHeight / 10 * 8,
          centerW: res.windowWidth,
          bottomH: res.windowHeight / 10,
          bottomW: res.windowWidth,
          paddingSize:res.windowWidth / 25,
          nameTextW: res.windowWidth / 25 * 10,
          numTextW: res.windowWidth / 25 * 6,
          btnW:res.windowWidth / 25 * 5,
          blockH:res.windowWidth / 25 * 11,
          blockW:res.windowWidth / 25 * 11,
          countW:res.windowWidth / 25 * 11 / 3,
          blockItemH:res.windowWidth / 25 * 11 / 3,
        })
      },
    })
  },

  connectSocket: function () {
    var that = this
    wx.connectSocket({
      url: 'ws://localhost:8080/websocket',
    })
    wx.onSocketOpen(function (res) {
      wx.sendSocketMessage({
        data: '1.'+that.data.windowNum
      })
    })
    wx.onSocketMessage(function (res) {
      var infos = that.data.foodInfos
      var l = infos.length
      for (var j = 0; j < l; j++) {
        if (infos[j].foodNumber == res.data) {
          var foodNumber = infos[j].foodNumber
          var foodName = infos[j].foodName
          var id = infos[j].id
          var number = 1
          var info = { 'foodNumber': foodNumber, 'foodName': foodName, 'number': number, 'id':id}
            var k = 0;
            for (; k < receiveOrder.length; k++){
                if(receiveOrder[k].foodNumber == foodNumber){
                    receiveOrder[k].number++;
                    break;
                }
            }
            if(k == receiveOrder.length){
                receiveOrder.push(info)
            }
          break
        }
      }
        that.setData({
            currentOrder: receiveOrder[0],
            isNull: false
        })
    })
  },

  receive:function(){
    var isHave = false;
    var len = app.globalData.order.length;
    var that = this;
      wx.request({
          url: 'http://localhost:8080/receiveDelivered',
          data: {
              'foodNumber': that.data.currentOrder.foodNumber
          }
      })
    //对已有信息number累加
    console.log(receiveOrder[0])
    for (var i = 0; i < len; i++) {
      if (receiveOrder[0].foodNumber == app.globalData.order[i].foodNumber) {
          app.globalData.order[i].number = app.globalData.order[i].number + receiveOrder[0].number;
        isHave = true;
        break;
      }
    }
    //给新的订单队列添加第一条信息
    if (!isHave) {
      var foodNumber = receiveOrder[0].foodNumber
      var foodName = receiveOrder[0].foodName
      var id = receiveOrder[0].id
      var number = receiveOrder[0].number
      app.globalData.order[len] = { 'foodNumber': foodNumber, 'foodName': foodName, 'number': number, 'changeNum': 0 , 'id':id}
      isHave = false
    }
    receiveOrder.shift()
    this.setData({
      order: app.globalData.order,
    })
    //将最早的order加入通知或清空通知
    if (receiveOrder.length > 0) {
      this.setData({
        currentOrder: receiveOrder[0]
      })
    }else{
      this.setData({
        currentOrder: {}
      })
    }
    //判断通知有无
    if (typeof(this.data.currentOrder.foodNumber) == 'undefined'){
      this.setData({
        isNull:true
      })
    }else{
      this.setData({
        isNull: false
      })
    }
  },

  notice:function(){
    var len = this.data.order.length
    var order = this.data.order
    for(var i = 0; i < len; i++){
      if(order[i].changeNum > 0){
          console.log(order[i].number)
          for (var j = 0; j < order[i].changeNum; j++){
            wx.sendSocketMessage({
                data: '0.' + order[i].foodNumber,
            })
            wx.request({
                url: 'http://localhost:8080/receiveWaiting',
                data: {
                    'foodNumber': order[i].foodNumber
                }
            })
        }
        order[i].number = order[i].number - order[i].changeNum
        order[i].changeNum = 0
      }
    }
    this.setData({
      order:order
    })
  },

  reduce:function(e){
    var index = e.target.dataset.index
    if (app.globalData.order[index].changeNum > 0) {
      app.globalData.order[index].changeNum--
    }
    this.setData({
      order: app.globalData.order
    })
  },

  add:function(e){
    var index = e.target.dataset.index
    if (app.globalData.order[index].changeNum < app.globalData.order[index].number){
      app.globalData.order[index].changeNum++
    }
    this.setData({
      order:app.globalData.order
    })
  },

})