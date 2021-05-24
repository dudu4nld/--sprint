// pages/shop/shop.js
var app = getApp();
var wxb = require('../../utils/wxb.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '',
    datas: [{ 'activity_id': 1, "shop": "爱奇艺会员7天", "title": "999积分", "end_date": "2021-11-11", "num": 100 }, { 'activity_id': 1, "shop": "可口可乐一瓶", "title": "999积分", "end_date": "2021-11-11", "num": 100 }, { 'activity_id': 1, "shop": "腾讯视频7天", "title": "999积分", "end_date": "2021-11-11", "num": 100 }, { 'activity_id': 1, "shop": "腾讯视频7天", "title": "999积分", "end_date": "2021-11-11", "num": 100 }],
    activity_id: 0,
  },

  /**
   * 获取优惠券
   */
  getCoupon: function (e) {
    wx.showModal({
      title: '积分兑换',
      content: '您是否确定兑换此商品？',
      success (res) {
        if (res.confirm) {
          wx.showToast({
            title: '抱歉，您的积分不够',
            icon: 'none',
            duration: 2000
          })
        } else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wxb.that = this;
    wxb.style();
    wxb.globalData = app.globalData; //正确打开海天应用的方式
    if (!wxb.checkAuthLogin(true)) {
      wxb.login();
    }

    this.getActivity();
  },


  getActivity: function (e) {
    wx.showLoading({
      title: '加载中..',
    });
    wxb.Post('/api/Activity/geTactivity', {
      openid: wxb.getOpenId(),
    }, function (data) {
      wx.hideLoading();
      wxb.that.setData({
        datas: data,
      });
    });
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
    wxb.that = this;
    wxb.style();
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
    return {
      title: '快来图书馆一起学习打卡',
      imageUrl: '../../static/images/logo.png'
    }
  }
})