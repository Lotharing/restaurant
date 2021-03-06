//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
      width       : 0,
      height      : 0,
      inputWidth  : 0,
      inputHeight : 0,
      btnWidth    : 0,
      btnHeight   : 0,
      id:'',
      pwd:'',
  },
  
  onLoad: function () {
      var that = this
      wx.getSystemInfo({
          success: function(res) {
              that.setData({
                  width : res.windowWidth,
                  height: res.windowHeight,
                  inputHeight:res.windowWidth / 8,
                  inputWidth: res.windowWidth / 5 * 4,
                  btnHeight: res.windowWidth / 8,
                  btnWidth: res.windowWidth / 5 * 4,
              })
          },
      })
  },

  getId:function(e){
    this.setData({
      id:e.detail.value
    })
  },

  getPwd:function(e){
    this.setData({
      pwd: e.detail.value
    })
  },

  login:function(){  
      var that = this
      wx.request({
        url: 'http://localhost:8080/employeeLogin',
        data:{
          id:that.data.id,
          pwd:that.data.pwd
        },
        success:function(res){
          if(res.data == -1){
            wx.showToast({
              title: '账号或密码错误',
              icon: 'none'
            })
          }else{
            wx.redirectTo({
              url: '../menu/menu?windowNum=' + res.data,
            })
          }
        }
      })
  }
})
