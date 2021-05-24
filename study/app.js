//app.js
var Bmob=require("utils/bmob.js");
var common=require("utils/common.js");
Bmob.initialize("1f674c017377f6712da239b0f14d574b", "a71fc7ba7cc70f2c21981d4e65038916");
App({
  onLaunch: function () {
   
  },
  onShow:function(){
    
  },
  globalData:{
    
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  },
  onError: function(msg) {
    
  }
})