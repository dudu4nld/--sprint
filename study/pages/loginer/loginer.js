// pages/loginer/loginer.js
var Bmob = require("../../utils/bmob.js");
var common = require("../../utils/common.js");
Bmob.initialize("1f674c017377f6712da239b0f14d574b", "a71fc7ba7cc70f2c21981d4e65038916");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hiddenmodalput: true,
    cname: '',
    sexx: '',
    iname: '',
  },
  

  cancel: function(e) {
    wx.showToast({
      title: '务必输入',
      icon: 'loading'
    })
  },

  cn: function(e) {
    console.log(e.detail.value)
    this.setData({
      cname: e.detail.value
    })
  },

  se: function(e) {
    console.log(e.detail.value)
    this.setData({
      sexx: e.detail.value
    })
  },
  ina: function(e) {
    this.setData({
      iname: e.detail.value
    })
  },

  confirm: function(e) {

    var that = this;
    if (!(that.data.sexx == '男' || that.data.sexx == '女')) {
      wx.showToast({
        title: '性别输入有误',
      })
      return;
    }
    if (!that.data.cname) {
      wx.showToast({
        title: '姓名班级有误',
      })
      return;
    }
    if (that.data.iname.length > 0) {
      var User = Bmob.Object.extend("_User");
      var query = new Bmob.Query(User);
      query.equalTo('nickname', that.data.iname)
      query.find({
        success: function(results) {
          if (results.length == 0) {
            wx.showToast({
              title: '无此邀请人',
              icon: 'loading'
            })
            return;
          }
          var user = Bmob.User.logIn(results[0].get('username'), results[0].get('userData').openid, {
            success: function(users) {
              var score = users.get('score');
              score = score + 2;
              users.set('score', score);
              users.save(null, {
                success: function(user) {
                  wx.showToast({
                    title: '被邀请成功',
                    icon: 'success'
                  })
                  var Invitation = Bmob.Object.extend("invitation");
                  var invitation = new Invitation();
                  invitation.set('invitor', that.data.iname);
                  invitation.set('invited', wx.getStorageSync("my_nick"));
                  invitation.save(null, {
                    success: function(result) {
                      console.log('invitation success');

                    },
                    error: function(result, error) {
                      console.log(result, error, "invitation failure")
                    }
                  })
                },
                error: function(error) {
                  console.log(error)
                }
              });
            }
          });
        }
      })
    }

    this.setData({
      hiddenmodalput: true,
    })
    wx.getStorage({
      key: 'my_username',
      success: function(ress) {
        if (ress.data) {
          var my_username = ress.data;
          wx.getStorage({
            key: 'user_openid',
            success: function(openid) {
              var openid = openid.data;
              var user = Bmob.User.logIn(my_username, openid, {
                success: function(users) {
                  users.set('nickname', that.data.cname);
                  users.set('sex', that.data.sexx)
                  users.save(null, {
                    success: function(user) {
                      wx.setStorageSync('my_nick', that.data.cname);
                      wx.setStorageSync("sex", that.data.sexx);
                    },
                    error: function(error) {
                      console.log(error)
                    }
                  });
                }
              });
            },
            function(error) {
              console.log(error);
            }
          })
        }

      }
    })
    wx.switchTab({
      url: '../punch/punch',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  bindGetUserInfo: function(e) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称

          //调用API从本地缓存中获取数据
          try {
            var value = wx.getStorageSync('user_openid')
            if (value) {
              console.log("value不为空")

              wx.switchTab({
                url: '../punch/punch',
              })
            } else {
              console.log("value为空")
              wx.login({
                success: function(res) {
                  console.log('res', res)
                  if (res.code) {
                    Bmob.User.requestOpenId(res.code, {
                      success: function(userData) {
                        console.log('uD', userData)
                        var userInfo = e.detail.userInfo;
                        console.log(userInfo)
                        var nickName = userInfo.nickName;
                        var avatarUrl = userInfo.avatarUrl;
                        console.log(nickName+"10",userData.openid)
                        Bmob.User.logIn(nickName, userData.openid, {
                          success: function(user) {
                            try {
                              console.log('sex' + user.get('sex'));
                              console.log('score' + user.get('score'));
                              wx.setStorageSync("newsnum", user.get('newsnum'))

                              wx.setStorageSync("sex", user.get('sex'));
                              wx.setStorageSync("score", user.get('score'));
                              wx.setStorageSync('user_openid', user.get("userData").openid)
                              wx.setStorageSync('user_id', user.id);
                              wx.setStorageSync('my_nick', user.get("nickname"))
                              wx.setStorageSync('my_username', user.get("username"))
                              wx.setStorageSync('my_avatar', user.get("userPic"))
                            } catch (e) {}
                            console.log("登录成功y");
                            wx.switchTab({
                              url: '../punch/punch',
                            })
                           

                          },
                          error: function(user, error) {
                            console.log('test', error)
                            if (error.code == "101") {
                              that.setData({
                                hiddenmodalput: false,
                              })
                              var user = new Bmob.User(); //开始注册用户
                              user.set("username", userData.openid);
                              user.set("password", userData.openid); //因为密码必须提供，但是微信直接登录小程序是没有密码的，所以用openId作为唯一密码                   
                              user.set("sex", "男");

                              user.set("score", 0);
                              user.set('newsnum', 0);
                              user.set("nickname", nickName);
                              user.set("userPic", avatarUrl);
                              user.set("userData", userData);
                              user.signUp(null, {
                                success: function(results) {


                                  try { //将返回的3rd_session储存到缓存
                                    wx.setStorageSync('user_openid', results.get("userData").openid)
                                    wx.setStorageSync('user_id', results.id);
                                    wx.setStorageSync('my_username', results.get("username"));
                                    wx.setStorageSync("newsnum", results.get('newsnum'));

                                    wx.setStorageSync("score", 0);
                                    wx.setStorageSync("sex", "男");
                                    wx.setStorageSync('my_nick', results.get("nickname"));
                                    wx.setStorageSync('my_avatar', results.get("userPic"))

                                    console.log("注册成功!");
									

                                  } catch (e) {}
                                },
                                error: function(userData, error) {
                                  console.log(error)
                                }
                              });
                            }
                          }
                        });




                      },

                    });

                  } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                  }
                },


              });
            }
          } catch (e) {
            console.log("登陆失败")
          }
          wx.checkSession({
            success: function() {},
            fail: function() {
              //登录态过期
              wx.login()
            }
          })

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
	console.log('show')
  try{
    var nickname = wx.getStorageSync("my_username")
    var openid = wx.getStorageSync("user_openid")
    console.log(nickname)
    console.log(openid)
    if (nickname && openid) {
      wx.switchTab({
        url: '../punch/punch',
      })
    }
  }
  finally{

  }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})