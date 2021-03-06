// pages/takeMealCode/takeMealCode.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        foodName: '',
        takeMealCode: 0,
        foodNumber: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // pages/takeMeal/takeMeal.js
        var that = this
        this.setData({
            id: options.id,
            foodName: options.foodName,
            foodNumber: options.foodNumber,
        })
        wx.request({
            url: 'http://localhost:8080/getTakeMealCode?openid=' + options.id + '&foodNumber=' + options.foodNumber,
            success: function (res) {
                that.setData({
                    takeMealCode: res.data
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})