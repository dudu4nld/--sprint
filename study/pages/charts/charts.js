var app = getApp();
var date;
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    rank: [],
  },

  
  tempData: function () {
    var that = this;
    var Punch = Bmob.Object.extend("_User");
    var query = new Bmob.Query(Punch);
    query.descending('score');
    query.limit(100);
    var results = [];
    var s = [],rank=[];
    query.find({
      success: function (results) {
        console.log('user length:', results.length)
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          object.set('score', object.get('score'));
          object.set('rank', i + 1);
          s[i]=object.get('score');
          results[i] = object;
        }
        
        for (var i = 0; i < results.length; i++) {
          rank[i]=i+1;
        }
        var xs = Object.keys(results).map(function(key) {
            return  results[key];

});
        console.log(xs);
        that.setData({
          rank: rank,
          list: xs,
        });
      }
    })

  },
  onLoad: function () {
    this.tempData();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.tempData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function () {
    return {
      title: '快来图书馆一起学习打卡',
      imageUrl: '../../static/images/logo.png'
    }
  },
})

