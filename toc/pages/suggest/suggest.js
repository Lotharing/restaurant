// pages/suggest/suggest.js
Page({
    data: {
        heigth:0,
        textH:0,
        btnH:0,
        text:'',
        focus:true,
    },

    onLoad: function (options) {
        var that = this
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    heigth:res.windowHeight,
                    textH:res.windowHeight / 10 * 9,
                    btnH:res.windowHeight / 10,
                })
            },
        })
    },

    content:function(e){
        this.setData({
            text:e.detail.value,
        })
    },

    suggest:function(){
        var that = this
        this.setData({
            focus:false
        })
        wx.request({
            url: 'http://localhost:8080/receiveSuggest',
            data:{
                'text':that.data.text
            }
        })
    }

})