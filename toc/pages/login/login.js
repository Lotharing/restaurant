// pages/login/login.js
var app = getApp()
Page({
    data: {

    },

    onLoad: function (options) {

    },

    onGotUserInfo:function(infos){
        app.globalData.userName = infos.detail.userInfo.nickName,
        app.globalData.userHead = infos.detail.userInfo.avatarUrl,
        app.globalData.logined = true;
        wx.setStorage({
            key: 'infos',
            data: { 'name': app.globalData.userName, 'head': app.globalData.userHead, 'id': app.globalData.userId},
        }),
        wx.request({
            url: 'http://localhost:8080/addUserInfo',
            data:{
                name: app.globalData.userName,
                head: app.globalData.userHead,
                openid:app.globalData.userId
            },
        })
        wx.redirectTo ({
            url: '../personal/personal',
        })
    }
})